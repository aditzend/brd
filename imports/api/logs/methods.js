const sql = require("mssql");
const mssqlConfig = Meteor.settings.mssqlConfig;

Meteor.methods({
  "logs.insert"(data) {
    // Inserting to MongoDB
    Logs.insert(data);
  },
});
