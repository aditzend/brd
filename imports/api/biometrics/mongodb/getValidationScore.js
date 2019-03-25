// PACKAGES
import { HTTP } from "meteor/http";
import { Promise } from "meteor/promise";

export default function(sessionId, transactionId) {
  return new Promise(function(resolve, reject) {
    const uri =
      Meteor.settings.biometrics.url +
      "vkivr_static/rest/verification/score";
    const headers = {
      "Content-Type": "application/json",
      "X-Session-Id": sessionId,
      "X-Transaction-Id": transactionId
    };
    HTTP.get(
      uri,
      {
        headers: headers
      },
      (err, res) => {
        if (err) {
          Meteor.call(
            "logs.insert",
            "ERROR",
            "1220",
            `VALIDATION_SCORE_ERROR`,
            `status : ${err}`,
            "",
            Meteor.settings.biometrics.url,
            Meteor.settings.mitrol.ip_panel
          );
          resolve({
            success: false,
            message: err
          });
        }
        resolve({
          success: true,
          message: res,
          score: res.data.staticVoice
        });
      }
    );
  });
}
