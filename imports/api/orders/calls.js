// PACKAGES
import { Promise } from "meteor/promise";

// INTERNAL MODULES
import getBiometricSessionId from "../biometrics/biometric-engine/getBiometricSessionId";
import deleteBiometricSessionId from "../biometrics/biometric-engine/deleteBiometricSessionId";

Meteor.methods({
  "call.startStatus"(call_id) {
    let sessionId = "NO_SESSION";
    let sessionRequest = Promise.await(getBiometricSessionId());
    if (sessionRequest.success) {
      sessionId = sessionRequest.sessionId;
    } else {
      Meteor.call("logs.insert", "ERROR", "1002", "NO_SESSION", "", "", "");
    }
    Orders.insert({
      type: "call_status",
      session_id: sessionId,
      session_is_alive: true,
      call_id: call_id
    });
    console.log("start status", sessionId);
  },
  "call.endStatus"(call_id) {
    const status = Orders.findOne({ type: "call_status", call_id: call_id });
    if (status.session_is_alive) {
      let sessionDeletion = Promise.await(deleteBiometricSessionId(status.session_id));
      if (sessionDeletion.success) {
        Orders.update(
          { type: "call_status", call_id: call_id },
          { $set: { session_is_alive: false } }
        )
        console.log(sessionDeletion.message);
      }
    }
  }
});
