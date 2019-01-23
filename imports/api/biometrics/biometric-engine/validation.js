// PACKAGES
import {
    HTTP
} from 'meteor/http'
import {
    Promise
} from 'meteor/promise'

// EXPORT MODULES
export function getTransactionId(personId, validationSessionId) {
    return new Promise(function (resolve, reject) {
        const headers = {
            "Content-Type": "application/json",
            "X-Session-Id": validationSessionId
        }
        // const uri = 'https://192.168.43.28/vkivr_static/rest/verification/person/V1-DNI-40143528'
        const uri = Meteor.settings.biometrics.url + 'vkivr_static/rest/verification/person/' + personId
        HTTP.get(uri, {
                headers: headers
            },
            (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    // console.log('GETTING VTID RESPONSE ==> ', res);
                    resolve(
                        res.data.transactionId
                    )
                }

            })
    })
}
export function postAudio(validationSessionId, validationTransactionId, audioRelativePath) {
    return new Promise(function (resolve, reject) {
        // TODO buscar el audio correcto en la base
        const audioAbsolutePath = Meteor.settings.mitrol.recordings_path + 'DNI-29984695-190103162544437_MIT_10118-A2.wav'
        const audioInBase64 = Buffer.from(HTTP.get(audioAbsolutePath, {
            npmRequestOptions: {
                encoding: null
            }
        }).content).toString('base64')
        const headers = {
            "Content-Type": "application/json",
            "X-Session-Id": validationSessionId,
            "X-Transaction-Id": validationTransactionId
        }
        const bodyData = {
            data: audioInBase64,
            gender: 0,
            channel: 0
        }
        // const uri = 'https://192.168.43.28/vkivr_static/rest/verification/voice/static/file'
        const uri = Meteor.settings.biometrics.url + 'vkivr_static/rest/verification/voice/static/file'
        HTTP.post(uri, {
                headers: headers,
                data: bodyData
            }

            , (err, res) => {
                err && resolve({
                    success: false,
                    message: err
                })
                resolve({
                    success: true,
                    message: res
                })
            })
    })
}
export function getScore(validationSessionId, validationTransactionId) {
    return new Promise(function (resolve, reject) {
        const uri = Meteor.settings.biometrics.url + 'vkivr_static/rest/verification/score'
        const headers = {
            "Content-Type": "application/json",
            "X-Session-Id": validationSessionId,
            "X-Transaction-Id": validationTransactionId
        }
        HTTP.get(uri, {
                headers: headers
            },
            (err, res) => {
                if (err) {
                    resolve({
                        success: false,
                        message: err
                    })
                } else {
                    resolve({
                        success: true,
                        message: res
                    })
                }

            })
    })
}
export function deleteTransaction(validationSessionId, validationTransactionId) {
    return new Promise(function (resolve, reject) {
        const headers = {
            "Content-Type": "application/json",
            "X-Session-Id": validationSessionId,
            "X-Transaction-Id": validationTransactionId
        }
        HTTP.call('DELETE', Meteor.settings.biometrics.url + 'vkivr_static/rest/verification/', {
            headers: headers
        }, (err, res) => {
            err && reject({
                success: false,
                message: err
            })
            resolve(
                res
            )
        })
    })
}

