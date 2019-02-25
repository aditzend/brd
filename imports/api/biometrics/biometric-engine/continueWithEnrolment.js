import * as transactions from "../../orders/transactions";
import postEnrolmentAudio from "../mongodb/postEnrolmentAudio";
import checkEnrolment from "./checkEnrolment";

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
    const enrolmentCheck = Promise.await(checkEnrolment(req.user, sessionId))

    const isFullEnroll = enrolmentCheck.isFullEnroll

    if (isFullEnroll) {
      const pos = enrolmentCheck.data.models[0].samplesCount
      let enrolment_status = Orders.findOne({type:"enrolment_status", user: req.user})
      Orders.update(enrolment_status._id, {$push: {
        files: { path: req.audio, pos:pos, signature_id: enrolmentCheck.data.models[0].id}
      }
      })
      Orders.update(enrolment_status._id, {$set: {
        is_full_enroll: true}
      })
    } else {
      const pos = enrolmentCheck.data.models[0].samplesCount

      let enrolment_status = Orders.findOne({type:"enrolment_status", user: req.user})
      Orders.update(enrolment_status._id, {$push: {
        files: { path: req.audio, pos:pos, signature_id: enrolmentCheck.data.models[0].id}
      }
      })
    }
   

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
