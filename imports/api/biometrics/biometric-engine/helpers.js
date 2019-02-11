// PACKAGES
import {
    HTTP
} from 'meteor/http'
import {
    Promise
} from 'meteor/promise'


// EXPORT MODULES
export function getBiometricSessionId() {
    return new Promise(function (resolve, reject) {
        const uri = Meteor.settings.biometrics.url + "vkivr_static/rest/session"
        const headers = {
            "Content-Type": "application/json"
        }
        const body = {
            username: Meteor.settings.biometrics.username,
            password: Meteor.settings.biometrics.password,
            domainId: Meteor.settings.biometrics.domainId,
            device_info: Meteor.settings.biometrics.device_info
        }
        HTTP.post(
            uri, {
                headers: headers,
                data: body
            }, (err, res) => {
                err && resolve({success:false, message: err})
                resolve({success:false, message: 'session ok', sessionId: res.data.sessionId})
            }
        )
    })
}