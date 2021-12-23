const fs = require('fs');
const path = require('path');

class Ticket{

    constructor(numero, escritorio){

        this.numero = numero;
        this.escritorio = escritorio;

    }
}

class TicketControl{


    constructor(){
        this.ultimo   = 0;
        this.hoy      = new Date().getDate(); /// 11
        this.tickets  = [];
        this.ultimos4 = [];

        this.init();
    }

    get toJson(){
        return {
            ultimo : this.ultimo,   
            hoy : this.hoy,  
            tickets : this.tickets, 
            ultimos4 : this.ultimos4 

        }
    }

    init(){

        const { hoy, tickets, ultimo, ultimos4 } =require('../db/data.json');

        if(hoy  === this.hoy){
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        }else{
            this.guardarBD();
        }

    }

    guardarBD(){
        const pathbd = path.join( __dirname, '../db/data.json' );
        fs.writeFileSync( pathbd, JSON.stringify( this.toJson ) );
    }

    siguiente (){

        this.ultimo +=1;
        const ticket = new Ticket( this.ultimo, null );
        this.tickets.push( ticket );

        this.guardarBD();

        return 'Ticket' + ticket.numero;

    }

    atenderTicket( escritorio ){
 
        // NO tenemos tickets
        if( this.tickets.length  === 0){
            return null;
        }

        const ticket =  this.tickets.shift();// this.tickets[0];
        
        ticket.escritorio = escritorio;

        this.ultimos4.unshift( ticket );

        if( this.ultimos4.length > 4 ){

            this.ultimos4.splice(-1,1)
        }

        this.guardarBD();
        
        return ticket;
    }

}



module.exports = TicketControl;