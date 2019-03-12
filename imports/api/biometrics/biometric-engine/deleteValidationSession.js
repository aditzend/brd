// PACKAGES
import {
    HTTP
} from 'meteor/http'
import {
    Promise
} from 'meteor/promise'


// EXPORT MODULES
export default function(sessionId, transactionId) {
    return new Promise(function (resolve, reject) {
        const uri = Meteor.settings.biometrics.url + "vkivr_static/rest/verification"
        const headers = {
            "Content-Type": "application/json",
            "X-Session-Id": sessionId,
            "X-Transaction-Id": transactionId
        }
        HTTP.call("DELETE",
            uri, {
                headers: headers
            }, (err, res) => {
                if (err) {
                    resolve({success:false, message: err})
                }
                resolve({success:true, message: 'session closed'})
            }
        )
    })
}