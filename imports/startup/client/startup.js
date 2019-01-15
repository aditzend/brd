import {
    Meteor
} from 'meteor/meteor';


function waitUserData() {
    if (Meteor.user()) {
        console.log('COMPANY READY', Meteor.user().company);
        Session.set('company', Meteor.user().company);
        Meteor.clearInterval(userInterval);

    } else {
        console.log('RETRYING');
    }
}

function kill(id) {
    Meteor.setTimeout(() => Meteor.clearInterval(id), 901);
}


function startAll() {
    $('body')
        .addClass('fixed-sidebar');
    $('body').addClass('fixed-navbar');
    $('body')
        .addClass('fixed-small-header');
    Session.set('job', 0);
    TAPi18n.setLanguage('es')
        .done(function () {})
        .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
        });
}

Meteor.startup(function () {
    startAll();
    Session.set('REPORT_BEGINNING_DATE', moment('1900-01-01').format())
    Session.set('REPORT_ENDING_DATE', null)
    Session.set('REPORT_DATES_EXPLANATION', 'Mostrando todos los resultados')
});