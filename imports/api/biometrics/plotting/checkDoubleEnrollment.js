// INTERNAL MODULES
import * as validation from "../biometric-engine/validation";
import * as enrollment from "../biometric-engine/enrollment";
import getBiometricSessionId from "../biometric-engine/getBiometricSessionId";
import deleteBiometricSessionId from "../biometric-engine/deleteBiometricSessionId";
import * as orders from "../mongodb/orders";

// API METHODS
Meteor.method("checkDoubleEnrollment", function() {
  const suspects = Crossvalidations.find({
    score: { $gt: Meteor.settings.biometrics.verified_validation_threshold },
    isSamePerson: false
  })

  suspects.map(suspect => {
    const challengerStatus = Orders.findOne({
      type:"enrollment_status",
      user: suspect.challengerBiometricProfile
    })

    const lastChallengerSignaturePosition = challengerStatus.signatures.length - 1;


    const targetStatus = Orders.findOne({
      type:"enrollment_status",
      user: suspect.targetBiometricProfile
    })

    const lastTargetSignaturePosition = targetStatus.signatures.length - 1;



    if ( challengerStatus.signatures[lastChallengerSignaturePosition].createdAt > targetStatus.signatures[lastTargetSignaturePosition].createdAt) {
    console.log(`\n SUSPECT FOUND \n CHALLENGER: ${suspect.challengerBiometricProfile} \n TARGET: ${suspect.targetBiometricProfile} \n SCORE: ${suspect.score} \n`)
    Orders.insert({
      type: "suspect",
      challengerBiometricProfile: suspect.challengerBiometricProfile,
      targetBiometricProfile: suspect.targetBiometricProfile,
      score: suspect.score
    })
    }
  })
});
