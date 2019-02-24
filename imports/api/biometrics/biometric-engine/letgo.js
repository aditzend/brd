// INTERNAL MODULES
import checkEnrolment from "./checkEnrolment";
import * as transactions from "../../orders/transactions";

Meteor.method("letgo", function(req) {
  console.log("********* LETGO ***********")
  const sessionId = transactions.getLiveSessionId(req.call_id)

  const enrolmentStatus = Promise.await(checkEnrolment(req.user, sessionId));
  console.log('enrolmentStatus ',enrolmentStatus)
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
