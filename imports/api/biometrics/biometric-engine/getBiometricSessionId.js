// PACKAGES
import {
    HTTP
} from 'meteor/http'
import {
    Promise
} from 'meteor/promise'


// EXPORT MODULES
export default function() {
    return new Promise(function (resolve, reject) {
        // const uri = Meteor.settings.biometrics.url + "vksession/rest/session"
        const uri = Meteor.settings.biometrics.url + "vkivr_static/rest/session"
        const headers = {
            "Content-Type": "application/json"
        }
        const body = {
            username: Meteor.settings.biometrics.username
            ,password: Meteor.settings.biometrics.password
            ,domain_id: Meteor.settings.biometrics.domain_id
            ,domainId: Meteor.settings.biometrics.domainId
            ,device_info: Meteor.settings.biometrics.device_info
        }
        HTTP.post(
            uri, {
                headers: headers,
                data: body
            }, (err, res) => {
                if (err) {
                    Meteor.call("logs.insert","ERROR","1002","NO_SESSION", "","","")
                    resolve({success:false, message: err})
                }
                    Meteor.call("logs.insert","INFO","3010","SESSION_OK", "","","")
                resolve({success:true, message: 'session ok', sessionId: res.data.sessionId})
            }
        )
    })
}