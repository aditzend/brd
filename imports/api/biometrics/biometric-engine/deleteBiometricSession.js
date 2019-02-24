// PACKAGES
import {
    HTTP
} from 'meteor/http'
import {
    Promise
} from 'meteor/promise'


// EXPORT MODULES
export default function(sessionId) {
    return new Promise(function (resolve, reject) {
        // const uri = Meteor.settings.biometrics.url + "vksession/rest/session"
        const uri = Meteor.settings.biometrics.url + "vkivr_static/rest/session"
        const headers = {
            "Content-Type": "application/json",
            "X-Session-Id": sessionId
        }
        const body = {
            username: Meteor.settings.biometrics.username
            ,password: Meteor.settings.biometrics.password
            ,domain_id: Meteor.settings.biometrics.domain_id
            ,domainId: Meteor.settings.biometrics.domainId
            ,device_info: Meteor.settings.biometrics.device_info
        }
        HTTP.call("DELETE",
            uri, {
                headers: headers,
                data: body
            }, (err, res) => {
                if (err) {
                    resolve({success:false, message: err})
                }
                resolve({success:true, message: 'session closed'})
            }
        )
    })
}