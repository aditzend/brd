import './validated-show-page.html';

Template.Validated_show_page.onCreated(function() {
  this.autorun( () => {

    // const w = workfor('autorun at orders-show-page.js');

    this.subscribe('Orders.all');
  });
});

Template.Validated_show_page.helpers({

  validated() {
    return Orders.find({type:'validation_finished',passed:'true'},{ sort:{createdAt:-1}});
  },
  countValidated() {
    return Orders.find({type:'validation_finished',passed:'true'}).count();
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
