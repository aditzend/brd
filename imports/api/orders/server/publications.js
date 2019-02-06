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
// Meteor.publish('Orders.byDate', function ordersByDate(IsoStartDate, IsoEndDate) {
//     if (this.userId) {
//         return Orders.find({
//             createdAt: {
//                 $lt: IsoEndDate
//             }
//         });
//     } else {
//         this.ready();
//     }

// });

Meteor.publish('Orders.byCallID', function ordersByCallID(callID) {
    if (this.userId) {
        return Orders.find({call_id: callID})
    } else {
        this.ready()
    }
});
Meteor.publish('Orders.byDate', function ordersByDate(IsoStartDate, IsoEndDate) {
    if (this.userId) {
        if (IsoEndDate == null || IsoEndDate == undefined || IsoEndDate == '') {
            return Orders.find({
                    createdAt: {
                        $gt: IsoStartDate
                    }
                });
        } else {
             return Orders.find({
                 $and: [{
                     createdAt: {
                         $gt: IsoStartDate
                     }
                 }, {
                     createdAt: {
                         $lt: IsoEndDate
                     }
                 }]
             })
        }
       
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
            channel: channel
        });
    } else {
        this.ready();
    }

});
Meteor.publish('Orders.own', function ordersOwn(ownerId) {
    if (this.userId) {
        return Orders.find({
            owner: ownerId
        });
    } else {
        this.ready();
    }

});
Meteor.publish('Orders.destiny', function ordersOwn(id) {
    if (this.userId) {
        return Orders.find({
            destiny: id
        });
    } else {
        this.ready();
    }

});