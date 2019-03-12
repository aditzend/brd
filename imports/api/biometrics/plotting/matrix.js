// INTERNAL MODULES
import * as validation from "../biometric-engine/validation";
import * as enrollment from "../biometric-engine/enrollment";
import getBiometricSessionId from "../biometric-engine/getBiometricSessionId";
import deleteBiometricSessionId from "../biometric-engine/deleteBiometricSessionId";
import * as orders from "../mongodb/orders";

// API METHODS
Meteor.method("matrix", function() {
  console.log(" \n  ▶️  MATRIX \n ");
  const sessionReq = Promise.await(getBiometricSessionId());
  const sessionId = sessionReq.sessionId;
  // const sessionId = "8fdea4ca-d1b3-4056-8624-2769fd77915a"
  console.log(` 🆔 Session ID for matrix plotting ==> ${sessionId}`);

  let enrolledUsers = orders.findEnrolledIds(sessionId);
  let i = 0;
  let enrolledPersonIds = [];
  enrolledUsers.map(personId => enrolledPersonIds.push(personId));
  enrolledUsers.map(personId => {
    console.log(`\n ******************${personId}********************`);
    const validationSessionId = sessionId;
    // console.log(` 🆔 VSID for ${personId} ==> ${validationSessionId}`);

    let j = 0;
    for (k = 0; k < enrolledPersonIds.length; k++) {
      let validationTransactionId = Promise.await(
        validation.getTransactionId(personId, validationSessionId)
      );
      console.log(` 🆔 VTID for ${personId} ==> ${validationTransactionId}`);

      const validator = enrolledPersonIds[j];
      console.log(
        `\n             ********* TARGET:${personId} - VALIDATOR:${validator} *****`
      );
      const status = Orders.findOne({
        user: validator,
        type: "enrollment_status"
      });
      const validationAudio = status.verified_validation.audio;
      let postValidation = Promise.await(
        validation.postAudio(
          validationSessionId,
          validationTransactionId,
          validationAudio
        )
      );
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
      }
      let deleteValidation = Promise.await(
        validation.deleteTransaction(
          validationSessionId,
          validationTransactionId
        )
      );
      console.log(" ☠️ VTID DELETED");

      j++;
    }
  });
  const deleteBiometricSessionReq = Promise.await(
    deleteBiometricSessionId(sessionId)
  );
  console.log(`☠️ BIOMETRICS =>  ${deleteBiometricSessionReq.message}`);
  console.log("\n 🏁 \n");
});
