Orders = new Mongo.Collection('orders');



Orders.before.insert(function(userId, doc) {
    doc.createdAt = moment()
        .format();
    
});


// Orders.insert({
//     "type":"validation_finished",
//     "user":"29984695-V10",
//     "dnis":"1160134585",
//     "channel": 1,
//     "score": 98.04,
//     "passed": true,
//     "callID": "2342343434",    
// })