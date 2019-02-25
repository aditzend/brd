
import * as transactions from "../../orders/transactions";
import getEnrolmentId from "./getEnrolmentId";
import postEnrolmentAudio from "../mongodb/postEnrolmentAudio";
import checkEnrolment from "./checkEnrolment";

export default function(audioInBase64,req) {
    console.log("first enrolment audio")
    let transactionId = ""
    const sessionId = transactions.getLiveSessionId(req.call_id)

    // comienzo de enrolamiento
    Meteor.call(
      "logs.insert",
      "INFO",
      "3012",
      "REQUESTED_ENROLMENT_TRANSACTION",
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
      `OBTAINED_ENROLMENT_TRANSACTION`,
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
      "enrolment"
    );
    // console.log("transaction id ok, inserted in db: ", transactionId);
  
  // envia el audio a enrolar
  // console.log('sending audio to VoiceKey');
//   console.log("POSTING ENROL AUDIO ... ");
//   console.log("80");

  let enrol = Promise.await(
    postEnrolmentAudio(sessionId, transactionId, audioInBase64)
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
      let enrolment_status = Orders.findOne({type:"enrolment_status", user: req.user})
      if (enrolment_status) {
        Orders.update(enrolment_status._id, {$set: {enrolment_error: true} })
      } else {

        const enrolmentCheck = Promise.await(checkEnrolment(req.user, sessionId))
        const pos = enrolmentCheck.data.models[0].samplesCount
        Orders.insert({
          user: req.user,
          type: "enrolment_status",
          enrolment_error: false,
          snr_error: false,
          length_error: false,
          content_error: false,
          is_full_enroll: false,
          files : [{path: req.audio, pos: pos, signature_id: enrolmentCheck.data.models[0].id}],
          signatures : [{
            call_id: req.call_id,
            id: enrolmentCheck.data.models[0].id,
            status: 'INACTIVE',
            type: enrolmentCheck.data.models[0].type
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