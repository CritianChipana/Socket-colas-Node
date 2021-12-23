
//Referencias

const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divalerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes')

const searchParams = new URLSearchParams( window.location.search);


if( !searchParams.has('escritorio') ){
    window.location = 'index.html';
    throw new Error( "El escritorio es obligatorio" );
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerHTML = escritorio;
divalerta.style.display = 'none';


const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true;

});

socket.on('ultimo-ticket', (ultimoTicket)=>{
    // lblNuevoTicket.innerHTML = "Ticket " + ultimoTicket;

})

socket.on( 'tickets-pendientes' , ( ticketsPendiente)=>{

    lblPendientes.innerHTML = ticketsPendiente;
    // console.log( ticketsPendiente );

})

socket.on('siguiente-ticket-server',( n )=>{
    
    //? COMANDAS PARA EMITIR UN SONIDO
    const audio = new Audio('./audio/new-ticket.mp3');
    audio.play();
    lblPendientes.innerHTML = n;

});


btnAtender.addEventListener( 'click', () => {


    socket.emit( 'atender-ticket', { escritorio },( {ok, ticket , msg} )=>{

        if( !ok ){
            
            lblTicket.innerHTML ="Nadie ";
            return divalerta.style.display = '';

        }

        lblTicket.innerHTML ="Ticket " + ticket.numero;

    } )
});
