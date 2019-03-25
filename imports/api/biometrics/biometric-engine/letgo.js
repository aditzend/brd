// INTERNAL MODULES
import * as transactions from "../../orders/transactions";

Meteor.method("letgo", function(req) {
  console.log("********* LETGO ***********");
  const sessionId = transactions.getLiveSessionId(req.call_id);
  let enrollmentStatus = Orders.findOne({
    type: "enrollment_status",
    user: req.user
  });
  // const enrollmentStatus = Promise.await(checkEnrollment(req.user, sessionId));
  // console.log('enrollmentStatus ',enrollmentStatus)
  if (enrollmentStatus.is_full_enroll) {
    Meteor.call("call.closeTransaction", req.call_id,  transactions.getLiveEnrollmentId(req.user, req.call_id) )
    Orders.insert({
      type: "enrollment_full",
      user: req.user,
      call_id: req.call_id
    });
    Meteor.call("plot", Meteor.settings.biometrics.signature_includes, 10)
    return {
      user: req.user,
      person_id: req.person_id,
      letgo: true,
      snr_error: false,
      length_error: false,
      content_error: false,
      enrollment_error: !enrollmentStatus.isFullEnroll
    };
  } else {
    Orders.insert({
      type: "enrollment_error",
      user: req.user,
      call_id: req.call_id
    });
    return {
      user: req.user,
      person_id: req.person_id,
      letgo: false,
      snr_error: false,
      length_error: false,
      content_error: false,
      enrollment_error: true
    };
  }
});
