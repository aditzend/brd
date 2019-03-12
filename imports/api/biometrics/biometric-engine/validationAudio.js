import * as transactions from "../../orders/transactions";
import getEnrolmentId from "./getEnrolmentId";
import getBiometricValidationId from "./getBiometricValidationId";
import deleteValidationSession from "./deleteValidationSession";
import postValidationAudio from "../mongodb/postValidationAudio";
import getValidationScore from "../mongodb/getValidationScore";
import checkEnrollment from "./checkEnrollment";

export default function(audioInBase64, req) {
  console.log("validation audio");
  const sessionId = transactions.getLiveSessionId(req.call_id);
  const validationTransactionReq = Promise.await(
    getBiometricValidationId(req.user, sessionId)
  );
  const transactionId = validationTransactionReq.transactionId;
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
  );

  Meteor.call(
    "logs.insert",
    "INFO",
    "3070",
    `OBTAINED_VALIDATION_TRANSACTION`,
    `sessionId:${sessionId}, user:${req.user}, transactionId:${transactionId}`,
    req.call_id,
    Meteor.settings.biometrics.url,
    Meteor.settings.mitrol.ip_panel
  );

  // INSERT VALIDATION TRANSACTIONID IN CALL_STATUS
  Meteor.call(
    "call.createTransaction",
    req.call_id,
    req.user,
    transactionId,
    "validation"
  );

  let validation = Promise.await(
    postValidationAudio(sessionId, transactionId, audioInBase64)
  );
  if (validation.success) {
    // se guarda el evento en el log de eventos y se muestra en tiempo real en el panel
    // console.log("AUDIO ACCEPTED BY VOICEKEY ==> ", enrol.message);
    Meteor.call(
      "logs.insert",
      "INFO",
      "3014",
      `AUDIO_ACCEPTED`,
      `VERIFIED VALIDATION `,
      req.call_id,
      Meteor.settings.biometrics.url,
      Meteor.settings.mitrol.ip_panel
    );
    // console.log("90");

    // Orders.insert({
    //   user: req.user,
    //   type: "audio_sample_posted",
    //   intent: "Audio de Validacion OK",
    //   audio: req.audio,
    //   call_id: req.call_id,
    //   intent: req.intent,
    //     transcription: d.TRANSCRIPTION ? d.TRANSCRIPTION : "NO_TRANSCRIPTION",
    //   record_count: req.record_count,
    //   transaction_id: transactionId
    // });

    const scoreReq = Promise.await(
      getValidationScore(sessionId, transactionId)
    );
    const score = scoreReq.score;
    console.log("==> VERIFIED VALIDATION SCORE : ", scoreReq.message)
    console.log("==> VERIFIED VALIDATION SCORE : ", score)

    Orders.insert({
      user: req.user,
      type: "verified_validation",
      intent: "Audio de Validacion OK",
      audio: req.audio,
      call_id: req.call_id,
      // score: score
      // transcription: d.TRANSCRIPTION ? d.TRANSCRIPTION : "NO_TRANSCRIPTION",
    });
    const enrollmentCheck = Promise.await(checkEnrollment(req.user, sessionId));

    let enrollmentStatus = Orders.findOne({
      type: "enrollment_status",
      user: req.user
    });
    Orders.update(enrollmentStatus._id, {
      $push: {
        files: {
          path: req.audio,
          target_signature_id: enrollmentCheck.data.models[0].id,
          score: score,
          type: "verified_validation_attempt"
        }
      }
    });
      const deletion = Promise.await(
        deleteValidationSession(sessionId, transactionId)
      )
        console.log("********* CLOSING TRANSACTION *******  ")
        Meteor.call("call.closeTransaction", req.call_id, transactionId);
        Orders.update(enrollmentStatus._id, {
          $set: {
            is_full_enroll: true,
            verified_validation: {
              call_id: req.call_id,
              target_signature_id: enrollmentCheck.data.models[0].id,
              // score: score,
              audio: req.audio,
              threshold:
                Meteor.settings.biometrics.verified_validation_threshold
            }
          }
        })
    // if (score > Meteor.settings.biometrics.verified_validation_threshold) {
    //   const deletion = Promise.await(
    //     deleteValidationSession(sessionId, transactionId)
    //   )
    //   if (deletion.success) {
    //     console.log("********* CLOSING TRANSACTION *******  ")
    //     Meteor.call("call.closeTransaction", req.call_id, transactionId);
    //     Orders.update(enrollmentStatus._id, {
    //       $set: {
    //         is_full_enroll: true,
    //         verified_validation: {
    //           call_id: req.call_id,
    //           target_signature_id: enrollmentCheck.data.models[0].id,
    //           score: score,
    //           audio: req.audio,
    //           threshold:
    //             Meteor.settings.biometrics.verified_validation_threshold
    //         }
    //       }
    //     })
    //   } else {
    //     console.log(' !!!!! no se pudo borrar el id de validacion')
    //   }
    // }
}}
