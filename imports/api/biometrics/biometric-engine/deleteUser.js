// PACKAGES
import { HTTP } from "meteor/http";
import { Promise } from "meteor/promise";


export default function(user, sessionId) {
  return new Promise(function(resolve, reject) {
    const uri = Meteor.settings.biometrics.url + "vkivr_static/rest/person/" + user;
    const headers = {
      "X-Session-Id": sessionId
    };
    HTTP.call(
      "DELETE",
      uri,
      {
        headers: headers
      },
      (err, res) => {
        err &&
          resolve({
            success: false,
            message: err
          });
        resolve({
          success: true,
          message: "deleted"
        });
      }
    );
  });
}