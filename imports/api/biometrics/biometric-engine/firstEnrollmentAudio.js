
import * as transactions from "../../orders/transactions";
import getEnrolmentId from "./getEnrolmentId";
import postEnrollmentAudio from "../mongodb/postEnrollmentAudio";
import checkEnrolment from "./checkEnrollment";

export default function(audioInBase64,req) {
    console.log("first enrollment audio")
    let transactionId = ""
    const sessionId = transactions.getLiveSessionId(req.call_id)

    // comienzo de enrolamiento
    Meteor.call(
      "logs.insert",
      "INFO",
      "3012",
      "REQUESTED_ENROLLMENT_TRANSACTION",
      req.call_id,
      Meteor.settings.biometrics.url,
      Meteor.settings.mitrol.ip_panel
    )

    let createdTransaction = Promise.await(getEnrolmentId(req.user, sessionId));
    transactionId = createdTransaction.transactionId;
    console.log("SESSIONID ==> ", sessionId);
    console.log("USER ==> ", req.user);
    console.log("TRANSACTION ID CREATED ==> ", transactionId);
    Meteor.call(
      "logs.insert",
      "INFO",
      "3013",
      `OBTAINED_ENROLLMENT_TRANSACTION`,
      `sessionId:${sessionId}, user:${
        req.user
      }, transactionId:${transactionId}`,
      req.call_id,
      Meteor.settings.biometrics.url,
      Meteor.settings.mitrol.ip_panel
    );
    Meteor.call(
      "call.createTransaction",
      req.call_id,
      req.user,
      transactionId,
      "enrollment"
    );
    // console.log("transaction id ok, inserted in db: ", transactionId);
  
  // envia el audio a enrolar
  // console.log('sending audio to VoiceKey');
//   console.log("POSTING ENROL AUDIO ... ");
//   console.log("80");

  let enrol = Promise.await(
    postEnrollmentAudio(sessionId, transactionId, audioInBase64)
  );
  if (enrol.success) {
    // se guarda el evento en el log de eventos y se muestra en tiempo real en el panel
    // console.log("AUDIO ACCEPTED BY VOICEKEY ==> ", enrol.message);
    Meteor.call(
      "logs.insert",
      "INFO",
      "3014",
      `AUDIO_ACCEPTED`,
      `StatusCode:${enrol.message.statusCode}`,
      req.call_id,
      Meteor.settings.biometrics.url,
      Meteor.settings.mitrol.ip_panel
    );
    // console.log("90");
      let enrollment_status = Orders.findOne({type:"enrollment_status", user: req.user})
      if (enrollment_status) {
        Orders.update(enrollment_status._id, {$set: {enrollment_error: true} })
      } else {

        const enrollmentCheck = Promise.await(checkEnrolment(req.user, sessionId))
        const pos = enrollmentCheck.data.models[0].samplesCount
        Orders.insert({
          user: req.user,
          type: "enrollment_status",
          enrollment_error: false,
          snr_error: false,
          length_error: false,
          content_error: false,
          is_full_enroll: false,
          files : [{path: req.audio, pos: pos, signature_id: enrollmentCheck.data.models[0].id}],
          signatures : [{
            call_id: req.call_id,
            id: enrollmentCheck.data.models[0].id,
            status: 'INACTIVE',
            type: enrollmentCheck.data.models[0].type
          }]
        })
      }
  

    Orders.insert({
      user: req.user,
      type: "audio_sample_posted",
      intent: "Audio de Enrolamiento OK",
      audio: req.audio,
      call_id: req.call_id,
      //   transcription: d.TRANSCRIPTION ? d.TRANSCRIPTION : "NO_TRANSCRIPTION",
      record_count: req.record_count,
      transaction_id: transactionId
    });
}
}