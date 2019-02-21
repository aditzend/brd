// INTERNAL MODULES
import * as helpers from "./helpers";
import checkEnrolment from "./checkEnrolment";

Meteor.method("letgo", function(req) {
  let sessionId = "NO_SESSION";
  let sessionRequest = Promise.await(helpers.getBiometricSessionId());
  if (sessionRequest.success) {
    sessionId = sessionRequest.sessionId;
  } else {
    Meteor.call("logs.insert", "ERROR", "1002", "NO_SESSION", "", "", "");
  }
  const enrolmentStatus = Promise.await(checkEnrolment(req.user, sessionId));
  if (enrolmentStatus.isFullEnroll) {
    Orders.insert({
      type: "enrolment_full",
      user: req.user,
      call_id: req.call_id
    });
  }

  return {
    user: req.user,
    person_id: req.person_id,
    letgo: enrolmentStatus.isFullEnroll,
    snr_error: false,
    length_error: false,
    content_error: false,
    enrolment_error: !enrolmentStatus.isFullEnroll
  };
});
