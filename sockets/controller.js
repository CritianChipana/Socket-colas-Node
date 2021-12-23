const TicketControl = require("../models/ticket-control");


const ticketControl = new TicketControl();

const socketController = (socket) => {
    

    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);

    // tickets-pendientes - ticke 
    // Emitir el numero de tickes que hay en la cola

    socket.emit( 'tickets-pendientes', ticketControl.tickets.length )



    socket.on('siguiente-ticket', ( payload, callback ) => {
        
      const siguiente =ticketControl.siguiente();
      callback( siguiente );
      
      //? TODO: nOTIFICAR QUE HAY UN NUEVO TICKET QUE ASIGNAR
      
      socket.broadcast.emit( 'siguiente-ticket-server', ticketControl.tickets.length )
    });

    socket.on( 'atender-ticket', ( { escritorio }, callback )=>{

      if( !escritorio ){
        return callback({
          ok: false,
          msg :"Es el escritorio es obligatorio"
        });
      }


      const ticket = ticketControl.atenderTicket( escritorio );

      //todo:  Notoficar en los cambios de los ultimos 4

      socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
      socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length )
      socket.emit( 'tickets-pendientes', ticketControl.tickets.length )

      if( !ticket ){
        callback({
          ok: false,
          msg :"ya no hay tickets pendientes"
        });

      }else{
        callback({
          ok: true,
          ticket
        });
      }


    } )

}



module.exports = {
    socketController
}

