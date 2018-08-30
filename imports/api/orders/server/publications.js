import {
    Meteor
}
from 'meteor/meteor';

Meteor.publish('Orders.test', function ordersTest() {
    if (this.userId) {
        return Orders.find();
    } else {
        this.ready();
    }

});

Meteor.publish('Orders.all', function ordersAll() {
        return Orders.find();
});
Meteor.publish('Orders.byChannel', function ordersByChannel(channel) {
    if (this.userId) {
        return Orders.find({
            channel:channel
        });
    } else {
        this.ready();
    }

});
Meteor.publish('Orders.own', function ordersOwn(ownerId) {
    if (this.userId) {
        return Orders.find({
          owner:ownerId
        });
    } else {
        this.ready();
    }

});
Meteor.publish('Orders.destiny', function ordersOwn(id) {
    if (this.userId) {
        return Orders.find({
          destiny:id
        });
    } else {
        this.ready();
    }

});
