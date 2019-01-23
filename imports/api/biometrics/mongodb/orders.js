// INTERNAL MODULES
import * as enrollment from '../biometric-engine/enrollment'

export function findEnrolledIds(sessionId) {
   let enrolled = Orders.find({type:'signature_finished'},{user:1})
   let arr = []
    enrolled.map((e) => {
        if (e.user && e.user.includes("V1-") && enrollment.isFullEnroll(e.user, sessionId)) {
            arr.push(e.user)
        }
    })
    let uArr = _.unique(arr)
    return uArr
}