Logs = new Mongo.Collection("logs");

Logs.before.insert(function(userId, doc) {
  doc.createdAt = moment().toISOString();
});
