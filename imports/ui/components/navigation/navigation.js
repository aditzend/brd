import {
    TAPi18n
} from 'meteor/tap:i18n';

import './navigation.html';

Template.navigation.onCreated(function() {
    this.state = new ReactiveDict();
    this.autorun(() => {
        this.subscribe('userData'),
            this.subscribe('persons.own')
    });
});

Template.navigation.onRendered(function() {
    // Initialize metsiMenu plugin to sidebar menu
    $('#side-menu')
        .metisMenu();
});

Template.navigation.helpers({
    user() {
        return Meteor.user();
    },

    companyName(companyId) {
        const company = Companies.findOne(companyId);
        if (company) {
            return company.name;
        } else {
            return '-'
        }
    },

    userEmail() {
        const instance = Template.instance();
        if (instance.subscriptionsReady()) {
            return Meteor.user()
                .emails[0].address;
        }
    },
    relatedPerson() {
        const instance = Template.instance();
        if (instance.subscriptionsReady() && Meteor.user()
            .relatedPerson) {
            let name = Meteor.user()
                .name;
            return (name) ?
                name :
                '';
            // return 'subscriptionsReady';

        } else {
            return ""
        }
    }


});

Template.navigation.events({
    'click .js-ddd': function() {
        BlazeLayout.render('App_body', {
            main: 'Treasury_show_page'
        });
    },
    'click .js-create-report': () => Meteor.call('createCSVReport'),
    'click .js-create-sale': function() {
        FlowRouter.go('createSale');
    },

    // Colapse menu in mobile mode after click on element
    'click #side-menu a:not([href$="\\#"])': function() {
        if ($(window)
            .width() < 769) {
            $("body")
                .toggleClass("show-sidebar");
        }
    },
    'click [data-action=logout]': function() {
        Meteor.logout();
        FlowRouter.go('login');
    },
    'click .js-show-jobs': function(e, instance) {
      console.log('show jobs baby');
    },
    'click .js-workfor': function(e, instance) {
      console.log(e.target.id);
        Session.set('job', e.target.id);



    },
    'click .js-reset': function(e, instance) {
            Accounts.sendResetPasswordEmail(Meteor.userId);
        }
        /*  'click [data-action=loginWithFacebook]': function() {
      Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'email']
      }, function(err) {
        if (err)
          console.log("ERROR LOGGING WITH FACEBOOK : ") + err.reason;
      });
}*/

});
