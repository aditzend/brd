// PACKAGES
import {
    HTTP
} from 'meteor/http'


const basePath = Meteor.settings.public.recordings_path;
const biometricURL = Meteor.settings.biometrics.url;


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

  console.log("20");

  let comparison = Promise.await(
    biometricsMiddleware.compare(req.challenge, req.phrase, audioInBase64)
  );
  console.log("30");

  let d = comparison.data;
  console.log("content analysis : ", d);
  // Meteor.call("logs.insert","INFO","3050","CONTENT_ANALYSIS",`${JSON.parse(d)}`, req.call_id,"BIOMETRICS_MIDDLEWARE",Meteor.settings.mitrol.ip_panel)
  console.log("31");
    if (d.STATUS === "OK") { console.log("32")}
    if (!d.CONTENT_ERR) { console.log("33")}
    if (!d.LENGTH_ERR) { console.log("34")}
  if (
    // si esta todo ok, envia a enrolar al biometrico
    d.STATUS === "OK" &&
    // true
    !d.CONTENT_ERR &&
    !d.LENGTH_ERR
  ) {
    console.log("50");
    // tiene transactionId?
    let hasOpenTransaction = Orders.findOne({
      type: "enrollment_transaction",
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
        "REQUESTED_ENROLLMENT_TRANSACTION",
        `Transaction ID: ` + transactionId,
        req.call_id,
        Meteor.settings.biometrics.url,
        Meteor.settings.mitrol.ip_panel
      );

      let createdTransaction = Promise.await(
        getEnrollmentTransactionId(req.user, sessionId)
      );
      transactionId = createdTransaction.transactionId;
      console.log("SESSIONID ==> ", sessionId);
      console.log("USER ==> ", req.user);
      console.log("TRANSACTION ID CREATED ==> ", transactionId);
      Meteor.call(
        "logs.insert",
        "INFO",
        "3013",
        `OBTAINED_ENROLLMENT_TRANSACTION`,
        `SessionId:${sessionId}, User:${
          req.user
        }, TransactionId:${transactionId}`,
        req.call_id,
        Meteor.settings.biometrics.url,
        Meteor.settings.mitrol.ip_panel
      );
      Orders.insert({
        type: "enrollment_transaction",
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
      postEnrollmentAudio(sessionId, transactionId, audioInBase64)
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
        type: "audio_sample_posted",
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
  } else {
    console.log("110");

    Meteor.call(
      "logs.insert",
      "ERROR",
      "1004",
      `ASR_ERROR message:Errores en el audio de enrolamiento asr_status: ${
        d.STATUS
      }
            content_err: ${d.CONTENT_ERR}
            length_err: ${d.LENGTH_ERR}
            transcription: ${d.TRANSCRIPTION}
            record_count: ${req.record_count}`,
      req.call_id,
      Meteor.settings.biometrics.url,
      Meteor.settings.mitrol.ip_panel
    );

    Orders.insert({
      user: req.user,
      call_id: req.call_id,
      intent: "Errores en el audio de enrolamiento",
      asr_status: d.STATUS,
      content_err: d.CONTENT_ERR,
      length_err: d.LENGTH_ERR,
      transcription: d.TRANSCRIPTION,
      record_count: req.record_count
    });
    console.log(
      "ERROR COMPARING: The audio file does not contain the challenge phrase or is shorter than needed"
    );
    // return 'ERROR COMPARING : The audio file does not contain the challenge phrase or is shorter than needed'
  }
};