import './rejected-show-page.html';

Template.Rejected_show_page.onCreated(function() {
  this.autorun( () => {

    // const w = workfor('autorun at orders-show-page.js');

    this.subscribe('Orders.all');
  });
});

Template.Rejected_show_page.helpers({

  rejected() {
    return Orders.find({type:'validation_finished',passed:'false'},{ sort:{createdAt:-1}});
  },
  countRejected() {
    return Orders.find({type:'validation_finished',passed:'false'}).count();
  },
  pathForUser(id) {

      const params = {
          _id: id
      };
      const queryParams = {
          // state: 'open'
      };
      const routeName = 'showUser';
      const path = FlowRouter.path(routeName, params, queryParams);

      return path;
  }
});
