import { Meteor } from "meteor/meteor";

Meteor.publish("Logs.all", function logsAll() {
  if (this.userId) {
    return Logs.find();
  } else {
    this.ready();
  }
});

Meteor.publish("Logs.byDate", function logsByDate(IsoStartDate, IsoEndDate) {
  if (this.userId) {
    if (IsoEndDate == null || IsoEndDate == undefined || IsoEndDate == "") {
  
      return Logs.find(
        {
          createdAt: {
            $gt: IsoStartDate
          }
        }
      )
    } else {
      return Logs.find(
        {
          $and: [
            {
              createdAt: {
                $gt: IsoStartDate
              }
            },
            {
              createdAt: {
                $lt: IsoEndDate
              }
            }
          ]
        }
      );
    }
  } else {
    this.ready();
  }
});
