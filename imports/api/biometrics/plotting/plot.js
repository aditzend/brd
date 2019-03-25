// INTERNAL MODULES
import * as validation from "../biometric-engine/validation";
import * as enrollment from "../biometric-engine/enrollment";
import getBiometricSessionId from "../biometric-engine/getBiometricSessionId";
import deleteBiometricSessionId from "../biometric-engine/deleteBiometricSessionId";
import * as orders from "../mongodb/orders";

// API METHODS
Meteor.method("plot", function(
  signatureIncludes,
  interval,
  date,
  validationPhrase,
) {
  if (validationPhrase === undefined) {
    validationPhrase = Meteor.settings.biometrics.validation_phrase;
  }
  if (signatureIncludes === undefined) {
    signatureIncludes = Meteor.settings.biometrics.signature_includes;
  }
  if (interval === undefined) {
    interval = 1;
  }
  // esto tiene que generar dos entradas en la collection 'plots' una para la FAR y otra para la FRR
  // la estructura de un plot es
  // { FAR: {thresholds: [50,60,etc], pvalues: []} ,
  //  FRR : {thresholds: [50,60,etc], pvalues: [] },
  //  createdAt: ,
  //  validationPhrase: ,
  //  interval:,
  //   }
  console.log(" \n  ▶️  CALCULATING DATA FOR FAR AND FRR PLOT \n ");
  const sessionReq = Promise.await(getBiometricSessionId());
  const sessionId = sessionReq.sessionId;
  // const sessionId = "8fdea4ca-d1b3-4056-8624-2769fd77915a"
  console.log(` 🆔 Session ID for plotting ==> ${sessionId}`);

  let enrolledUsers = orders.findEnrolledIds(sessionId, signatureIncludes);
  let i = 0;
  let enrolledPersonIds = [];
  enrolledUsers.map(personId => enrolledPersonIds.push(personId));

  // Verificacion de crossvalidations
  enrolledUsers.map(personId => {
    const enrollmentStatus = Orders.findOne({
      user: personId,
      type: "enrollment_status"
    });
    const lastSignaturePosition = enrollmentStatus.signatures.length - 1;
    const lastSignatureId =
      enrollmentStatus.signatures[lastSignaturePosition].id;

    console.log(
      `\n ****************** \n TARGET BIOMETRIC PROFILE : ${personId} \n LAST SIGNATURE ID : ${lastSignatureId} \n SIGNATURE NUMBER: ${lastSignaturePosition} \n ********************`
    );

    const validationSessionId = sessionId;
    // console.log(` 🆔 VSID for ${personId} ==> ${validationSessionId}`);

    let j = 0;
    // verificamos que todos los usuarios tengan todas las validaciones cruzadas para el analisis
    // puede que falte una validacion porque no esta hecha con la frase que queremos
    // o puede que una persona se haya hecho una frase nueva, en ese caso se detecta automaticamente porque se valida contra la ultima
    // o que hayamos tocado algun parametro en el biometrico y necesitemos hacer todas las validaciones
    // previas a ese cambio de nuevo.
    for (k = 0; k < enrolledPersonIds.length; k++) {
      let cross = Crossvalidations.findOne({
        targetBiometricProfile: personId,
        challengerBiometricProfile: enrolledPersonIds[j],
        validationPhrase: validationPhrase,
        targetSignatureId: lastSignatureId
      });
      if (cross === undefined) {
        console.log("calculating cross validation");
        let validationTransactionId = Promise.await(
          validation.getTransactionId(personId, validationSessionId)
        );
        console.log(` 🆔 VTID for ${personId} ==> ${validationTransactionId}`);

        const validator = enrolledPersonIds[j];
        console.log(
          `\n             ********* TARGET:${personId} - CHALLENGER:${validator} *****`
        );
        const validatorStatus = Orders.findOne({
          user: validator,
          type: "enrollment_status"
        });
        const validationAudio = validatorStatus.verified_validation.audio;
        let postValidation = Promise.await(
          validation.postAudio(
            validationSessionId,
            validationTransactionId,
            validationAudio
          )
        );
        const targetStatus = Orders.findOne({
          user: personId,
          type: "enrollment_status"
        });

        if (!postValidation.success) {
          console.log(" ❌ ", postValidation.message);
        } else {
          console.log(" 👌 AUDIO POSTED");
        }
        let score = Promise.await(
          validation.getScore(validationSessionId, validationTransactionId)
        );
        if (!score.success) {
          console.log(" ❌ ", score.message);
        } else {
          console.log(" 👉 SCORE ==> ", score.message.data.staticVoice);
          const lastSignaturePosition = targetStatus.signatures.length - 1;
          const isSamePerson = (personId === validator)? true:false
          // TODO insertar crossvalidation
          Crossvalidations.insert({
            challengerBiometricProfile: validator,
            targetBiometricProfile: personId,
            score: score.message.data.staticVoice,
            challengerAudio: validationAudio,
            targetSignatureId:
              targetStatus.signatures[lastSignaturePosition].id,
            validationPhrase: validationPhrase,
            isSamePerson: isSamePerson
          });
        }
        let deleteValidation = Promise.await(
          validation.deleteTransaction(
            validationSessionId,
            validationTransactionId
          )
        );
        console.log(" ☠️ VTID DELETED");
      } else {
        console.log(
          `${cross.challengerBiometricProfile} CHALLENGED ${
            cross.targetBiometricProfile
          }: ${cross.score}`
        );
      }

      j++;
    }
  });

  let threshold = interval;
  // calculo de FAR y FRR
  let FARs = [];
  let FRRs = [];

  while (threshold < 101 - interval) {
    console.log(`THRESHOLD : ${threshold}`);
    // calculo de vector FAR @ threshold
    let fardot = { threshold: threshold, matches: 0, value: 0 };
    enrolledUsers.map(personId => {
      const enrollmentStatus = Orders.findOne({
        user: personId,
        type: "enrollment_status"
      });
      const lastSignaturePosition = enrollmentStatus.signatures.length - 1;
      const lastSignatureId =
        enrollmentStatus.signatures[lastSignaturePosition].id;

      for (j = 0; j < enrolledPersonIds.length; j++) {
        if (personId !== enrolledPersonIds[j]) {
          const cross = Crossvalidations.findOne({
            targetBiometricProfile: personId,
            challengerBiometricProfile: enrolledPersonIds[j],
            validationPhrase: validationPhrase,
            targetSignatureId: lastSignatureId
          });
          // en el primer caso deberia dar b contra a, 34.26 > 20, False Acceptance
          if (cross.score > threshold) {
            console.log(`FALSE ACCEPTANCE @ ${threshold} : ${cross.score}`);
            fardot.matches++;
          }
        }
      }
    });
    const total = enrolledPersonIds.length;
    fardot.value = (fardot.matches / total / (total - 1)) * 100;
    console.log(
      `FAR MATCHES @ ${fardot.threshold} : ${fardot.matches}, FAR: ${
        fardot.value
      }`
    );
    FARs.push(fardot);

    // calculo de vector FAR @ threshold
    let frrdot = { threshold: threshold, matches: 0, value: 0 };
    enrolledUsers.map(personId => {
      const enrollmentStatus = Orders.findOne({
        user: personId,
        type: "enrollment_status"
      });
      const lastSignaturePosition = enrollmentStatus.signatures.length - 1;
      const lastSignatureId =
        enrollmentStatus.signatures[lastSignaturePosition].id;

      for (j = 0; j < enrolledPersonIds.length; j++) {
        if (personId === enrolledPersonIds[j]) {
          const cross = Crossvalidations.findOne({
            targetBiometricProfile: personId,
            challengerBiometricProfile: enrolledPersonIds[j],
            validationPhrase: validationPhrase,
            targetSignatureId: lastSignatureId
          });
          // en el primer caso deberia dar b contra a, 34.26 > 20, False Acceptance
          if (cross.score < threshold) {
            console.log(`FALSE REJECTION @ ${threshold} : ${cross.score}`);
            frrdot.matches++;
          }
        }
      }
    });
    frrdot.value = (frrdot.matches / total) * 100;
    console.log(
      `FRR MATCHES @ ${fardot.threshold} : ${frrdot.matches}, FRR: ${
        frrdot.value
      }`
    );
    FRRs.push(frrdot);

    threshold = threshold + interval;
  }

  // guardamos el plot, se le agrega la fecha y el usuario automaticamente
  Plots.insert({
    FAR: FARs,
    FRR: FRRs,
    validationPhrase: validationPhrase,
    interval: interval,
    signatureIncludes: signatureIncludes
  });

  // alertas de double enrollment
  Meteor.call("checkDoubleEnrollment")

  const deleteBiometricSessionReq = Promise.await(
    deleteBiometricSessionId(sessionId)
  );
  console.log(`☠️ BIOMETRICS =>  ${deleteBiometricSessionReq.message}`);
  console.log("\n 🏁 \n");
});
