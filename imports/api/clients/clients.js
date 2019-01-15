import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';

Clients = new Mongo.Collection('clients');

Clients.before.insert(function (userId, doc) {
    doc.createdAt = moment().format();
    doc.author = Meteor.userId();
});
