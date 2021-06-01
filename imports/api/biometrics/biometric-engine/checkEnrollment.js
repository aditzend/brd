// PACKAGES
import { HTTP } from "meteor/http";
import { Promise } from "meteor/promise";

export default function(user, sessionId) {
  return new Promise(function(resolve, reject) {
    const uri =
      Meteor.settings.biometrics.urls.person + user;
    const headers = {
      "X-Session-Id": sessionId
    };
    HTTP.get(
      uri,
      {
        headers: headers
      },
      (err, res) => {
        if (err) {
          // Meteor.call("logs.insert", "WARNING", "1101", `PERSON_NOT_FOUND`, `User: ${user} Status : ${err}`, Meteor.settings.biometrics.url, Meteor.settings.mitrol.ip_panel);
            // console.log(`Error checking person ${user} status : ${err}`);
          resolve({
            isFullEnroll: false,
            message: err
          });
        }
        //    Meteor.call(
        //   "logs.insert",
        //   "INFO",
        //   "3051",
        //   "USER_ENROLED",
        //   "User: " + user,
        //   "",
        //   Meteor.settings.biometrics.url,
        //   Meteor.settings.mitrol.ip_panel
        // );
        // console.log("USER_ENROLED ==> ", user);
        resolve({
          isFullEnroll: res.data.isFullEnroll,
          data: res.data,
          message: user + " FOUND"
        });
      }
    );
  });
}
