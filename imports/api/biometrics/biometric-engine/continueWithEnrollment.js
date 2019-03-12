import * as transactions from "../../orders/transactions";
import postenrollmentAudio from "../mongodb/postEnrollmentAudio";
import checkEnrollment from "./checkEnrollment";
import createEnrollmentAudio from "../../audios/createEnrollmentAudio"

export default function(audioInBase64, req) {
  let sessionId = transactions.getLiveSessionId(req.call_id)
  let transactionId = transactions.getLiveEnrollmentId(req.user, req.call_id);


  if (transactionId === null) {
    console.log("-----------------------ERROR, NO TRANSACTION");
  } else {
    console.log("hasopen transaction 🐨", transactionId);
  }

  // Orders.insert({
  //   user: req.user,
  //   type: "audio_controlled",
  //   intent: "Audio de enrolamiento OK",
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
  console.log("POSTING enroll AUDIO ... ");
  console.log("80");

  let enroll = Promise.await(
    postenrollmentAudio(sessionId, transactionId, audioInBase64)
  )
  if (enroll.success) {
    // se guarda el evento en el log de eventos y se muestra en tiempo real en el panel
    console.log("AUDIO ACCEPTED BY VOICEKEY ==> ", enroll.message);
    Meteor.call(
      "logs.insert",
      "INFO",
      "3014",
      `AUDIO_ACCEPTED`,
      `StatusCode:${enroll.message.statusCode}`,
      req.call_id,
      Meteor.settings.biometrics.url,
      Meteor.settings.mitrol.ip_panel
    );
    const enrollmentCheck = Promise.await(checkEnrollment(req.user, sessionId))

    const isFullenroll = enrollmentCheck.isFullenroll

    if (isFullenroll) {
      const pos = enrollmentCheck.data.models[0].samplesCount
      let enrollment_status = Orders.findOne({type:"enrollment_status", user: req.user})
      Orders.update(enrollment_status._id, {$push: {
        files: { path: req.audio, pos:pos, signature_id: enrollmentCheck.data.models[0].id}
      }
      })
      // no quiero darle letgo hasta que me deje el audio de verificacion.
      // Orders.update(enrollment_status._id, {$set: {
      //   is_full_enroll: true}
      // })
    } else {
      const pos = enrollmentCheck.data.models[0].samplesCount

      let enrollment_status = Orders.findOne({type:"enrollment_status", user: req.user})
      Orders.update(enrollment_status._id, {$push: {
        files: { path: req.audio, pos:pos, signature_id: enrollmentCheck.data.models[0].id}
      }
      })
    }
   
    // TODO guardar aca en tabla audios de SQL sin el score y con el campo recalculate = false
    let audio = Promise.await(createEnrollmentAudio(req.call_id,req.audio,'enrollment',req.record_count,req.user,req.phrase,req.challenge,req.ani,req.source,req.source_version,'transcriptionj','111',0,req.agent,0,0,0,0,0))
    console.log(`Success creating audio =>>${audio.success} Message =>> ${audio.message}`)
    Orders.insert({
      user: req.user,
      type: "audio_sample_posted",
      intent: "Audio de enrollamiento OK",
      audio: req.audio,
      call_id: req.call_id,
      intent: req.intent,
      //   transcription: d.TRANSCRIPTION ? d.TRANSCRIPTION : "NO_TRANSCRIPTION",
      record_count: req.record_count,
      transaction_id: transactionId
    });
  }
}
