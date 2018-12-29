Meteor.publish('agents.all', function() {
    return Agents.find()
})