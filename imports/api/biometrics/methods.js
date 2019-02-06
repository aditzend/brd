// PACKAGES
import {
    HTTP
} from 'meteor/http'
import {
    Promise
} from 'meteor/promise'

// INTERNAL MODULES
import * as enrolled from './mongodb/orders'
import * as biometricsMiddleware from './middleware'
import './plotting/matrix'
import * as helpers from './biometric-engine/helpers'


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const basePath = Meteor.settings.mitrol.recordings_path
const biometricURL = Meteor.settings.biometrics.url


// inicia una sesion en el motor biometrico    
 let sessionId = Promise.await(helpers.getBiometricSessionId())

function deleteUser(user, sessionId) {
    return new Promise(function (resolve, reject) {
        const uri = biometricURL + "vkivr_static/rest/person/" + user
        const headers = {
            "X-Session-Id": sessionId
        }
        HTTP.call("DELETE", uri, {
            headers: headers
        }, (err, res) => {
            err && resolve({
                success: false,
                message: err
            })
            resolve({
                success: true,
                message: 'deleted'
            })
        })
    })
}

function getEnrolmentTransactionId(user, sessionId) {
    const deletion = Promise.await(deleteUser(user, sessionId))
    console.log(`${user} DELETED ==> ${deletion.message}`)
    return new Promise(function (resolve, reject) {
        const uri = biometricURL + "vkivr_static/rest/registration/person/" + user
        const headers = {
            "X-Session-Id": sessionId
        }
        HTTP.call(
            "GET", uri, {
                headers: headers
            }, (err, res) => {
                err && resolve({
                    success: false,
                    message: 'ERROR GETTING TRANSACTION ID FOR ENROLMENT ==> ' + err
                })
                console.log('ENROLMENT TRANSACTION ID ==> ', res.data.transactionId);
                resolve({
                    success: true,
                    message: 'TRANSACTION ID : ' + res,
                    transactionId: res.data.transactionId
                })
            })
    })
}

//   let createdTransaction = Promise.await(getEnrolmentTransactionId(
//       'V1-DNI-11222333', sessionId
//   ))
// console.log('\n \n \n created tid ', createdTransaction)


function checkEnrolment(user, sessionId) {
    return new Promise(function (resolve, reject) {
        const uri = biometricURL + "vkivr_static/rest/person/" + user
        const headers = {
            "X-Session-Id": sessionId
        }
        HTTP.get(
            uri, {
                headers: headers
            }, (err, res) => {
                if (err) {
                    console.log(`Error checking person ${user} status : ${err}`)
                    resolve({
                        isFullEnroll: false,
                        message: err
                    })
                }
                console.log('USER ENROLED ==> ', user);
                resolve({
                    isFullEnroll: res.data.isFullEnroll,
                    message: user + ' FOUND'
                })
            })

    })
}

function postEnrolmentAudio(sessionId, transactionId, audioInBase64) {
    return new Promise(function (resolve, reject) {
        const uri = biometricURL + "vkivr_static/rest/registration/voice/static/file"
        const headers = {
            "Content-Type": "application/json",
            "X-Session-Id": sessionId,
            "X-Transaction-Id": transactionId
        }
        const body = {
            "data": audioInBase64,
            "gender": 0,
            "channel": 0
        }
        HTTP.post(
            uri, {
                headers: headers,
                data: body
            }, (err, res) => {
                err && resolve({
                    success: false,
                    message: err
                })
                console.log('POSTING ENROLMENT AUDIO ==> ', res);
                resolve({
                    success: true,
                    message: res
                })
            }
        )

    })
}

// let hasOpenTransaction = Orders.findOne({
//     type: "enrolment_transaction",
//     user: 'V1-DNI-50984695'
// })

// console.log('OPEN TRANSACTION? ==> ', hasOpenTransaction);

const processEnrolmentAudio = function (req) {
    const audioInBase64 = Buffer.from(HTTP.get(basePath + req.audio, {
        npmRequestOptions: {
            encoding: null
        }
    }).content).toString('base64')
    console.log("AUDIO RECEIVED ==> ", req.audio);
    // let comparison = Promise.await(biometricsMiddleware.compare(
    //     req.challenge, req.phrase, audioInBase64
    // se lo manda a google para analizar contenido y largo
    // let d = comparison.data
    // console.log("content analysis : ", d);
    if ( // si esta todo ok, envia a enrolar al biometrico
        // d.STATUS === "OK"
        true
        // && !d.CONTENT_ERR
        // && !d.LENGTH_ERR
    ) {

        console.log("BIOMETRIC SESSION ID ==> ", sessionId);
        // tiene transactionId?
        let hasOpenTransaction = Orders.findOne({
            type: "enrolment_transaction",
            user: req.user
        })
        let transactionId
        if (hasOpenTransaction !== undefined) {
            // se esta enrolando o se enrolo
            transactionId = hasOpenTransaction.transaction_id
            Orders.insert({
                user: req.user,
                type: "audio_controlled",
                intent: "Audio de Enrolamiento OK",
                audio: req.audio,
                call_id: req.call_id,
                intent: req.intent,
                // transcription: d.TRANSCRIPTION,
                record_count: req.record_count,
                transaction_id: transactionId
            })
            console.log('user has open transaction', transactionId)
        } else {
            // comienzo de enrolamiento
            console.log('imports/api/biometrics/methods.js LINE 219 ==> CREATING NEW ENROLMENT TRANSACTION');
            let createdTransaction = Promise.await(getEnrolmentTransactionId(
                req.user, sessionId
            ))
            transactionId = createdTransaction.transactionId
            console.log('SESSIONID ==> ', sessionId)
            console.log('USER ==> ', req.user)
            console.log('TRANSACTION ID CREATED ==> ', transactionId)
            Orders.insert({
                type: "enrolment_transaction",
                user: req.user,
                is_full_enroll: false,
                transaction_id: transactionId,
                x_session_id: sessionId,
                call_id: req.call_id
            })
            console.log("transaction id ok, inserted in db: ", transactionId)
        }
        // envia el audio a enrolar
        // console.log('sending audio to VoiceKey');
        console.log('POSTING ENROL AUDIO ... ');

        let enrol = Promise.await(postEnrolmentAudio(sessionId, transactionId, audioInBase64))
        if (enrol.success) {
            // se guarda el evento en el log de eventos y se muestra en tiempo real en el panel
            console.log('AUDIO ACCEPTED BY VOICEKEY ==> ', enrol.message);
            Orders.insert({
                user: req.user,
                type: "signature_finished",
                intent: "Audio de Enrolamiento OK",
                audio: req.audio,
                call_id: req.call_id,
                intent: req.intent,
                // transcription: d.TRANSCRIPTION,
                record_count: req.record_count
            })
            // return enrol 
        } else {
            // guarda en la base que hubo errores 
            console.log('AUDIO REJECTED BY VOICEKEY ==> ', enrol.message);
            Orders.insert({
                user: req.user,
                call_id: req.call_id,
                intent: "ARV",
                // asr_status: d.STATUS,
                // content_err: d.CONTENT_ERR,
                // length_err: d.LENGTH_ERR,
                // transcription: d.TRANSCRIPTION,
                record_count: req.record_count
            })
        }
    } else {
        Orders.insert({
            user: req.user,
            call_id: req.call_id,
            intent: "Errores en el audio de enrolamiento",
            asr_status: d.STATUS,
            content_err: d.CONTENT_ERR,
            length_err: d.LENGTH_ERR,
            transcription: d.TRANSCRIPTION,
            record_count: req.record_count
        })
        console.log('ERROR COMPARING: The audio file does not contain the challenge phrase or is shorter than needed')
        // return 'ERROR COMPARING : The audio file does not contain the challenge phrase or is shorter than needed'
    }
}

Meteor.method("enrolment_audio", function (req) {
    Meteor.setTimeout(() => processEnrolmentAudio(req), 1)
    return 'enrolling'
})

Meteor.method("letgo", function (req) {

    const enrolmentStatus = Promise.await(checkEnrolment(req.user, sessionId))
    // Orders.insert({
    //     type: "enrolment_full"
    //     ,user: req.user
    //     ,call_id: req.call_id
    // })
    /*TODO hacer que los errores provengan de las diferentes respuestas de los audios, 
    tambien tener en cuenta que en el IVR CE V4.0.1 las ultimas tres frases son diferentes, y tenemos que 
    hacer referencia a la frase correcta para pedir grabarla de nuevo. Es un problema complejo.*/
    return {
        user: req.user,
        person_id: req.person_id,
        letgo: enrolmentStatus.isFullEnroll,
        snr_error: false,
        length_error: false,
        content_error: false,
        enrolment_error: !enrolmentStatus.isFullEnroll
    }
})







