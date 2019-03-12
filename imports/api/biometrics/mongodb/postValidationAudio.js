// PACKAGES
import { HTTP } from "meteor/http";
import { Promise } from "meteor/promise";

export default function(sessionId, transactionId, audioInBase64) {
  return new Promise(function(resolve, reject) {
    const uri =
      Meteor.settings.biometrics.url +
      "vkivr_static/rest/verification/voice/static/file";
    const headers = {
      "Content-Type": "application/json",
      "X-Session-Id": sessionId,
      "X-Transaction-Id": transactionId
    };
    const body = {
      data: audioInBase64,
      gender: 0,
      channel: 0
    };
    HTTP.post(
      uri,
      {
        headers: headers,
        data: body
      },
      (err, res) => {
        if (err) {
          Meteor.call(
            "logs.insert",
            "ERROR",
            "1102",
            `AUDIO_POSTING_FAILED status : ${err}`,
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
          message: res
        });
      }
    );
  });
}
