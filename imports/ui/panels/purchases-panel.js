import './purchases-panel.html';
import '../pages/orders-show-page.js';

Template.Orders_panel.onCreated(function() {
  this.autorun( () => {
    if(Meteor.user()){
      const w = wf('orders-panel.js');
      console.log('wf._id is', w._id);
      this.subscribe('Orders.destiny',w._id);
    }else{
      console.log('cannot call wf from orders-panel.js');
    }
  });
});

Template.Orders_panel.helpers({

  orders() {
    return Orders.find({},{limit: 6, sort:{createdAt:-1}});
  },
 
  pathForOrder(id) {

      const params = {
          _id: id
      };
      const queryParams = {
          // state: 'open'
      };
      const routeName = 'showOrder';
      const path = FlowRouter.path(routeName, params, queryParams);

      return path;
  },
  pathForOrders() {

      const params = {

      };
      const queryParams = {
          // state: 'open'
      };
      const routeName = 'showOrders';
      const path = FlowRouter.path(routeName, params, queryParams);

      return path;
  },
});

Template.Orders_panel.events({
  'click .js-new-order': function(e,instance) {
        const w = wf('click new order at dashboard.js');
        Meteor.call('createOrder', w._id, function(err,res){
          if (err) {
            console.log(err);
          } else {
            const params = {
                _id: res
            };
            const queryParams = {
                // state: 'open'
            };
            const routeName = 'showOrder';
            const path = FlowRouter.path(routeName, params, queryParams);

            FlowRouter.go(path);
          }
        });
  },
  'click .js-show-order': function(e, instance) {

  }
})
