// PACKAGES
import {
    HTTP
} from 'meteor/http'
import {
    Promise
} from 'meteor/promise'


// EXPORT MODULES
export default function(user, sessionId) {
    return new Promise(function (resolve, reject) {
        // const uri = Meteor.settings.biometrics.url + "vksession/rest/session"
        const uri = Meteor.settings.biometrics.url + "vkivr_static/rest/verification/person/" + user
        const headers = {
            "Content-Type": "application/json",
            "X-Session-Id": sessionId
        }
        HTTP.get(
            uri, {
                headers: headers
            }, (err, res) => {
                if (err) {
                    Meteor.call("logs.insert","ERROR","1210","VALIDATION_TRANSACTION_ERROR", "","",Meteor.settings.biometrics.url,Meteor.settings.mitrol.ip_panel)
                    resolve({success:false, message: err})
                }
                console.log('getbiometric validation id', res)
                console.log('getbiometric validation id', res.data)
                console.log('getbiometric validation id', res.data.transactionId)
                resolve({success:true, message: 'transactionId ok', transactionId: res.data.transactionId})
            }
        )
    })
}