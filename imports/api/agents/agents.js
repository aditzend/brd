import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';

Agents = new Mongo.Collection('agents');

Agents.before.insert(function (userId, doc) {
    doc.createdAt = moment().format();
    doc.author = Meteor.userId();
});
