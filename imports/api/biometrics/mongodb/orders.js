// INTERNAL MODULES
import * as enrollment from '../biometric-engine/enrollment'

export function findEnrolledIds(sessionId, signatureIncludes) {
   let enrolled = Orders.find({type:'audio_sample_posted'},{user:1})
   let arr = []
    enrolled.map((e) => {
        if (e.user && e.user.includes(signatureIncludes) && enrollment.isFullEnroll(e.user, sessionId)) {
            arr.push(e.user)
        }
    })
    let uArr = _.unique(arr)
    return uArr
}