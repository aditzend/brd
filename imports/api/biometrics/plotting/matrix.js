// INTERNAL MODULES
import * as validation from '../biometric-engine/validation'
import * as enrollment from '../biometric-engine/enrollment'
import * as helpers from '../biometric-engine/helpers'
import * as orders from '../mongodb/orders'

// API METHODS
Meteor.method("matrix", function () {
    console.log(' \n  ▶️ \n ');
    const sessionReq = Promise.await(helpers.getBiometricSessionId())
    const sessionId = "8fdea4ca-d1b3-4056-8624-2769fd77915a"
    console.log(` 🆔 SID for matrix plotting ==> ${sessionId}`);



    let enrolledUsers = orders.findEnrolledIds(sessionId)
    let i = 0
    enrolledUsers.map((personId) => {
        console.log(`\n ******************${personId}********************`)
        const validationSessionId = sessionId
        // console.log(` 🆔 VSID for ${personId} ==> ${validationSessionId}`);
        let validationTransactionId = Promise.await(validation.getTransactionId(personId, validationSessionId))
        console.log(` 🆔 VTID for ${personId} ==> ${validationTransactionId}`);
        let postValidation = Promise.await(validation.postAudio(validationSessionId, validationTransactionId, ''))

        if (!postValidation.success) {
            console.log(' ❌ ', postValidation.message)
        } else {
            console.log(' 👌 AUDIO POSTED');
        }

        let score = Promise.await(validation.getScore(validationSessionId, validationTransactionId))
        if (!score.success) {
            console.log(' ❌ ', score.message)
        } else {
            console.log(' 👉 SCORE ==> ', score.message.data.staticVoice);
        }
        let deleteValidation = Promise.await(validation.deleteTransaction(validationSessionId, validationTransactionId))
        console.log(' ☠️ VTID DELETED');
    })
    console.log('\n 🏁 \n');

})