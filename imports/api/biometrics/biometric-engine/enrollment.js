// PACKAGES
import { HTTP } from "meteor/http";

// INTERNAL MODULES
// import * as helpers from "./helpers";

// INTERNAL HELPERS
function getEnrollStatus(personId, sessionId) {
  return new Promise(function(resolve, reject) {
    const uri =
      Meteor.settings.biometrics.url + "vkivr_static/rest/person/" + personId;
    const headers = {
      "Content-Type": "application/json",
      "X-Session-Id": sessionId
    };
    HTTP.get(
      uri,
      {
        headers: headers
      },
      (err, res) => {
        err && reject(err);
        resolve(res.data.isFullEnroll);
      }
    );
  });
}

// EXPORT MODULES
export function isFullEnroll(personId, sessionId) {
  let enrollStatus = Promise.await(getEnrollStatus(personId, sessionId));
  return enrollStatus;
}
