// PACKAGES
import {
    HTTP
} from 'meteor/http'

const basePath = Meteor.settings.mitrol.recordings_path;
const biometricURL = Meteor.settings.biometrics.url;

import * as transaction from "./transaction"


// EXPORT MODULES
export function process(req, sessionId) {
  console.log("10");
  const audioInBase64 = Buffer.from(
    HTTP.get(basePath + req.audio, {
      npmRequestOptions: {
        encoding: null
      }
    }).content
  ).toString("base64");
  console.log("AUDIO RECEIVED ==> ", req.audio);
    // tiene transactionId?
    let hasOpenTransaction = Orders.findOne({
      type: "enrolment_transaction",
      user: req.user
    });
    let transactionId;
    if (hasOpenTransaction !== undefined) {
      console.log("60");

      // se esta enrolando o se enrolo
      transactionId = hasOpenTransaction.transaction_id;
      Orders.insert({
        user: req.user,
        type: "audio_controlled",
        intent: "Audio de Enrolamiento OK",
        audio: req.audio,
        call_id: req.call_id,
        intent: req.intent,
        transcription: d.TRANSCRIPTION ? d.TRANSCRIPTION : "NO_TRANSCRIPTION",
        record_count: req.record_count,
        transaction_id: transactionId
      });
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
    } else {
      console.log("70");

      // comienzo de enrolamiento
       Meteor.call(
        "logs.insert",
        "INFO",
        "3012",
        "REQUESTED_ENROLMENT_TRANSACTION",
        `Transaction ID: ` + transactionId,
        req.call_id,
        Meteor.settings.biometrics.url,
        Meteor.settings.mitrol.ip_panel
      );

      let createdTransaction = Promise.await(
        transaction.getEnrolmentId(req.user, sessionId)
      );
      transactionId = createdTransaction.transactionId;
      console.log("SESSIONID ==> ", sessionId);
      console.log("USER ==> ", req.user);
      console.log("TRANSACTION ID CREATED ==> ", transactionId);
      Meteor.call(
        "logs.insert",
        "INFO",
        "3013",
        `OBTAINED_ENROLMENT_TRANSACTION  sessionId:${sessionId}, user:${
          req.user
        }, transactionId:${transactionId}`,
        req.call_id,
        Meteor.settings.biometrics.url,
        Meteor.settings.mitrol.ip_panel
      );
      Orders.insert({
        type: "enrolment_transaction",
        user: req.user,
        is_full_enroll: false,
        transaction_id: transactionId,
        x_session_id: sessionId,
        call_id: req.call_id
      });
      console.log("transaction id ok, inserted in db: ", transactionId);
    }
    // envia el audio a enrolar
    // console.log('sending audio to VoiceKey');
    console.log("POSTING ENROL AUDIO ... ");
    console.log("80");

    let enrol = Promise.await(
      postEnrolmentAudio(sessionId, transactionId, audioInBase64)
    );
    if (enrol.success) {
      // se guarda el evento en el log de eventos y se muestra en tiempo real en el panel
      console.log("AUDIO ACCEPTED BY VOICEKEY ==> ", enrol.message);
      Meteor.call(
        "logs.insert",
        "INFO",
        "3014",
        `AUDIO_ACCEPTED`,
        `Message:${JSON.parse(enrol.message)}`,
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
        transcription: d.TRANSCRIPTION ? d.TRANSCRIPTION : "NO_TRANSCRIPTION",
        record_count: req.record_count
      });
      // return enrol
    } else {
      console.log("100");

      // guarda en la base que hubo errores
      console.log("AUDIO REJECTED BY VOICEKEY ==> ", enrol.message);
      Meteor.call(
        "logs.insert",
        "ERROR",
        "1003",
        `AUDIO_REJECTED message:${enrol.message}`,
        req.call_id,
        Meteor.settings.biometrics.url,
        Meteor.settings.mitrol.ip_panel
      );

      Orders.insert({
        user: req.user,
        call_id: req.call_id,
        intent: "audio_reject_by_vk",
        asr_status: d.STATUS ? d.STATUS : "NOT_USING_ASR",
        content_err: d.content_err ? d.content_err : "",
        length_err: d.length_err ? d.length_err : "",
        transcription: d.TRANSCRIPTION ? d.TRANSCRIPTION : "",
        record_count: req.record_count
      });
    }
};