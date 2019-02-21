// PACKAGES
import { HTTP } from "meteor/http";
import { Promise } from "meteor/promise";

export default function(sessionId, transactionId, audioInBase64) {
  return new Promise(function(resolve, reject) {
    const uri =
      Meteor.settings.biometrics.url + "vkivr_static/rest/registration/voice/static/file";
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
  Meteor.call("logs.insert", "ERROR", "1102", `AUDIO_POSTING_FAILED : ${user} status : ${err}`, "", Meteor.settings.biometrics.url, Meteor.settings.mitrol.ip_panel);
  resolve({
            success: false,
            message: err
          });
        }
        
           Meteor.call(
        "logs.insert",
        "INFO",
        "3052",
        "POSTING_ENROLMENT_AUDIO",
        "",
        "",
        Meteor.settings.biometrics.url,
        Meteor.settings.mitrol.ip_panel
      );
        // console.log("POSTING_ENROLMENT_AUDIO ==> ", res);
        resolve({
          success: true,
          message: res
        });
      }
    );
  });
}