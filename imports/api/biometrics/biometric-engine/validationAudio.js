
import * as transactions from "../../orders/transactions";
import getEnrolmentId from "./getEnrolmentId";
import postEnrolmentAudio from "../mongodb/postEnrolmentAudio";


export default function(audioInBase64,req) {
    console.log("validation audio")
    let transactionId = ""
    const sessionId = transactions.getLiveSessionId(req.call_id)

    // comienzo de enrolamiento
    Meteor.call(
      "logs.insert",
      "INFO",
      "3060",
      "VALIDATION_AUDIO",
      `Audio: ${req.audio} User: ${req.user}`,
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

    Orders.insert({
      user: req.user,
      type: "audio_sample_posted",
      intent: "Audio de Enrolamiento OK",
      audio: req.audio,
      call_id: req.call_id,
      intent: req.intent,
      //   transcription: d.TRANSCRIPTION ? d.TRANSCRIPTION : "NO_TRANSCRIPTION",
      record_count: req.record_count,
      transaction_id: transactionId
    });
}
}