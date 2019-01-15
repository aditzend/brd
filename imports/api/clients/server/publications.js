Meteor.publish('clients.all', function() {
    return Clients.find()
})

