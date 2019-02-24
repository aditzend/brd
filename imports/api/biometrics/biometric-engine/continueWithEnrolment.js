import * as transactions from "../../orders/transactions";
import postEnrolmentAudio from "../mongodb/postEnrolmentAudio";

export default function(audioInBase64, req) {
  let sessionId = transactions.getLiveSessionId(req.call_id)
  let transactionId = transactions.getLiveEnrolmentId(req.user, req.call_id);


  if (transactionId === null) {
    console.log("-----------------------ERROR, NO TRANSACTION");
  } else {
    console.log("hasopen transaction 🐨", transactionId);
  }

  // Orders.insert({
  //   user: req.user,
  //   type: "audio_controlled",
  //   intent: "Audio de Enrolamiento OK",
  //   audio: req.audio,
  //   call_id: req.call_id,
  //   intent: req.intent,
  //   //   transcription: d.TRANSCRIPTION ? d.TRANSCRIPTION : "NO_TRANSCRIPTION",
  //   record_count: req.record_count,
  //   transaction_id: transactionId
  // });
  Meteor.call(
    "logs.insert",
    "INFO",
    "3011",
    "OPEN_TRANSACTION_FOUND",
    `Transaction ID: ${transactionId}`,
    req.call_id,
    Meteor.settings.biometrics.url,
    Meteor.settings.mitrol.ip_panel
  );
  // envia el audio a enrolar
  // console.log('sending audio to VoiceKey');
  console.log("POSTING ENROL AUDIO ... ");
  console.log("80");

  let enrol = Promise.await(
    postEnrolmentAudio(sessionId, transactionId, audioInBase64)
  )
  if (enrol.success) {
    // se guarda el evento en el log de eventos y se muestra en tiempo real en el panel
    console.log("AUDIO ACCEPTED BY VOICEKEY ==> ", enrol.message);
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
    console.log("90");

    Orders.insert({
      user: req.user,
      type: "signature_finished",
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
