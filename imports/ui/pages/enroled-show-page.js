import './enroled-show-page.html';

Template.Enroled_show_page.onCreated(function() {
  this.autorun( () => {

    // const w = workfor('autorun at orders-show-page.js');

    this.subscribe('Orders.all');
  });
});

Template.Enroled_show_page.helpers({

  enroled() {
    return Orders.find({type:'enrolment_full'},{ sort:{createdAt:-1}});
  },
  countEnroled() {
    return Orders.find({type:'enrolment_full'}).count();
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
