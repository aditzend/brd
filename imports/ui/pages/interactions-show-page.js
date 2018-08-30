import './interactions-show-page.html';

Template.Interactions_show_page.onCreated(function() {
  this.autorun( () => {

    // const w = workfor('autorun at orders-show-page.js');

    this.subscribe('Orders.all');
  });
});

Template.Interactions_show_page.helpers({
  isValidation(type) {
    return (type === 'validation_finished') ? true : false
  },
  interactions() {
    return Orders.find({},{ sort:{createdAt:-1}});
  },
  countInteractions() {
    return Orders.find().count();
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
