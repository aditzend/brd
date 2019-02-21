// PACKAGES
import { HTTP } from "meteor/http";
import { Promise } from "meteor/promise";

export default function(user, sessionId) {
  return new Promise(function(resolve, reject) {
    const uri =
      Meteor.settings.biometrics.url + "vkivr_static/rest/person/" + user;
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
          // Meteor.call("logs.insert", "ERROR", "1101", `ERROR_CHECKING_PERSON : ${user} status : ${err}`, "", Meteor.settings.biometrics.url, Meteor.settings.mitrol.ip_panel);
          //   console.log(`Error checking person ${user} status : ${err}`);
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
          message: user + " FOUND"
        });
      }
    );
  });
}
