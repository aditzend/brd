//client
import { Meteor } from 'meteor/meteor';

//api declarations
import '../../api/accounting/accounts/accounts.js';
import '../../api/actions/actions.js';
import '../../api/actions/methods.js';
import '../../api/accounting/general-ledger/general-ledger.js';
import '../../api/accounting/current-accounts/current-account-items.js';
import '../../api/cars/cars.js';
import '../../api/agents/agents.js';
import '../../api/companies/companies.js';
import '../../api/counters/counters.js';
import '../../api/controlling/profit-centers/profit-centers.js';
import '../../api/controlling/cost-centers/cost-centers.js';
import '../../api/delivery-notes/delivery-notes.js';
import '../../api/emails/emails.js';
import '../../api/emails/methods.js';
import '../../api/families/families.js';
import '../../api/generics/generics.js';
import '../../api/items/items.js';
import '../../api/invoices/invoices.js';
import '../../api/logs/logs.js';
import '../../api/orders/details/details.js';
import '../../api/orders/orders.js';
import '../../api/payment-methods/payment-methods.js';
import '../../api/persons/persons.js';
import '../../api/payments/payments.js';
import '../../api/places/places.js';
import '../../api/rels/rels.js';
import '../../api/sales/sales.js';
import '../../api/sales/methods.js';
import '../../api/transfers/transfers-of-ownership/transfers-of-ownership.js';
import '../../api/transfers/transfers-of-ownership/details/details.js';


//api methods van arriba ahora
import '../../api/rels/methods.js';
import '../../api/invoices/methods.js';
import '../../api/hospitals/methods.js';
import '../../api/accounting/general-ledger/methods.js';
import '../../api/emails/methods.js';
import '../../api/persons/methods.js';
import '../../api/payments/methods.js';
import '../../api/counters/methods.js';
import '../../api/orders/methods.js';
import '../../api/delivery-notes/methods.js';
import '../../api/orders/details/methods.js';
import '../../api/companies/methods.js';


import '../../api/accounting/current-accounts/methods.js';

import './useraccounts-configuration.js';
import './routes.js';
//import './googlemaps.js';
import './easysearch.js';
import './global-functions.js';
import './global-helpers.js';
// import { log } from 'util';


// Meteor.call('getMeteorUser', (err, res) => {
//     console.log('probando metodo');
//     console.log(res);
// });

function waitUserData() {
    if (Meteor.user()){
        console.log('COMPANY READY', Meteor.user().company);
        Session.set('company', Meteor.user().company);
        Meteor.clearInterval(userInterval);
        
    } else {
        console.log('RETRYING');
    }
}

function kill(id) {
    Meteor.setTimeout(()=> Meteor.clearInterval(id), 901);
}


function startAll() {
    // let userInterval = Meteor.setInterval(() => {
    //     if (!Session.get('company')) {
    //         console.log('RETRYING');
          

    //     } else {

    //         console.log('COMPANY READY', Meteor.user().company);
    //         Session.set('company', Meteor.user().company);
    //         Meteor.clearInterval(userInterval);
    //     }
       
    // }
    //     , 300);



    // if (!Meteor.user()) {
    //     Session.set('company', 'grupogt');
    //     Meteor.setTimeout(() => console.log('waiting'), 500);
    // } else {
    //     Session.set('company', Meteor.user().company);
        
    //     console.log('USER DATA LOADED', Session.get('company'));
    // }
    $('body')
        .addClass('fixed-sidebar');
    $('body').addClass('fixed-navbar');
    $('body')
        .addClass('fixed-small-header');
    Session.set('job', 0);
    TAPi18n.setLanguage('es')
        .done(function () { })
        .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
        });
}

Meteor.startup(function() {
    startAll();
    /*$('body').addClass('fixed-navbar');*/
  





    // const workerRel = Rels.findOne({
    //     type: 'worker'
    // });
    //
    // Meteor.setTimeout(function() {
    //     Session.set('workfor', workerRel.destiny);
    //     Session.set('workerRelId', workerRel._id);

    //     console.log("work rel  set to : ", Session.get('workerRelId'));
    //
    //     console.log(workerRel);
    //
    // }, 10000);



});
