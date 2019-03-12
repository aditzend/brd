// PACKAGES
import { HTTP } from "meteor/http";
import { Promise } from "meteor/promise";

// INTERNAL MODULES
import checkEnrolment from "./checkEnrollment";
import * as transactions from "../../orders/transactions";
import firstEnrolmentAudio from "./firstEnrollmentAudio";
import continueWithEnrolment from "./continueWithEnrollment";
import validationAudio from "./validationAudio";

export default function(req) {
  console.log("10");
  // PREPARATION
  const audioInBase64 = Buffer.from(
    HTTP.get(Meteor.settings.public.recordings_path + req.audio, {
      npmRequestOptions: {
        encoding: null
      }
    }).content
  ).toString("base64");
  console.log("AUDIO RECEIVED ==> ", req.audio);
  // session
  let sessionId = transactions.getLiveSessionId(req.call_id);
  console.log("sessionid desde process ", sessionId);
  // esta enrolado?
  const check = Promise.await(checkEnrolment(req.user, sessionId));
  console.log("usuario enrolado? ", check.isFullEnroll);
  // tiene transactionId?
  const hasOpenTransaction = transactions.userHasLiveEnrolment(
    req.user,
    req.call_id
  );
  console.log("hasopen transaction", hasOpenTransaction);

  if (!check.isFullEnroll && !hasOpenTransaction) {
    console.log("60");
    // se esta enrolando o se enrolo
    firstEnrolmentAudio(audioInBase64, req);
  } else if (!check.isFullEnroll && hasOpenTransaction) {
    console.log("70");
    continueWithEnrolment(audioInBase64, req);
    // return enrol
  } else if (check.isFullEnroll && hasOpenTransaction) {
    console.log("==> ENTER VALIDATION AUDIO")
    validationAudio(audioInBase64, req);
  } else {
    console.log("100");
    Orders.insert({
      type: "audio_reject_by_vk",
      user: req.user,
      call_id: req.call_id,
      // asr_status: d.STATUS ? d.STATUS : "NOT_USING_ASR",
      // content_err: d.content_err ? d.content_err : "",
      // length_err: d.length_err ? d.length_err : "",
      // transcription: d.TRANSCRIPTION ? d.TRANSCRIPTION : "",
      record_count: req.record_count
    });
  }
}
