import './infractors-show-page.html';

Template.Infractors_show_page.onCreated(function() {
  this.autorun( () => {

    // const w = workfor('autorun at orders-show-page.js');

    this.subscribe('Orders.all');
  });
});

Template.Infractors_show_page.helpers({

  infractors() {
    return Orders.find({type:'validation_violated'},{ sort:{createdAt:-1}});
  },
  countInfractors() {
    return Orders.find({type:'validation_violated'}).count();
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
