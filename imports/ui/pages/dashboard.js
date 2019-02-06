//  INTERNAL MODULES
import '/imports/ui/panels/logs-panel.js';
import '/imports/ui/panels/orders-panel.js';
import '/imports/ui/panels/agents-panel.js';
import '/imports/ui/panels/counters.js';
import '/imports/ui/components/report-date-picker/report-date-picker.js';

// TEMPLATES
import './dashboard.html';


// TODO Verify if some of these are needed
// import '/imports/ui/components/rel/rel-customer-edit.js';
// import '/imports/ui/panels/customers-panel.js';
// import '/imports/ui/panels/items-panel.js';
// import '/imports/ui/components/person/person-create.js';
// import '/imports/ui/components/person/person-create.js';
// import "/imports/ui/panels/families-panel.js";



Template.Dashboard.onCreated(function() {
    this.autorun(() => {
        // let tooSubscription = this.subscribe('transfers_of_ownership.test');
        // let toodSubscription = this.subscribe('transfer_of_ownership_details.test');

        // this.subscribe('userData'),
        //     this.subscribe('persons.own'),
    });
});

Template.Dashboard.helpers({
  wwffHelper() {
    // let w = wwff();
    // return wwff();
  },

    isCompanyAdmin() {

        return true;
        // return (Meteor.user().admins === undefined) ? false : true;
    },
    modules() {
      // return ['Hospitals_panel','Payments_panel']
      return Meteor.user().modules;
    },



    pathForShowTreasury() {
        const params = {};
        const queryParams = {
            // state: 'open'
        };
        const routeName = 'showTreasury';
        const path = FlowRouter.path(routeName, params, queryParams);

        return path;
    },
    workingFor() {
      if (Meteor.user()){
        return wf('workingFor Helper @dashboard.js');
      }else{
        console.log('cannot call wf from workingFor Helper @dashboard.js');
      }
    }
});

Template.Dashboard.events({
  'click .js-send-email'() {
    // Meteor.call('sendEmail', 'pross888@gmail.com', 'gt@serabey.com', 'hola', 'listo')
  }


});
