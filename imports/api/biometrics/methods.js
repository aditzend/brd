import { EJSON } from 'meteor/ejson'
import { HTTP } from 'meteor/http'
const base64 = require('file-base64')
import { Promise } from 'meteor/promise'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const token = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlWDg0NjJzOHNTTGRROEpNSDk0TnJGTjZ2bHpyRk1Xb1EtOHYtQVpncllFIn0.eyJqdGkiOiI5ZGQ1NDM0ZS1hODBlLTQ1OTItOTdlOC0wNTRmNDBiNTc5ZDkiLCJleHAiOjE1NDUyNDEwMDEsIm5iZiI6MCwiaWF0IjoxNTQ1MjM3NDAxLCJpc3MiOiJodHRwczovL25zc2Etc2VjdXJlLXNzby11YXQubmFjaW9uc2VydmljaW9zLmNvbS5hci9hdXRoL3JlYWxtcy9uc3NhLWZ1c2UiLCJhdWQiOiJmdXNlLXdlYi1zZXJ2aWNlcyIsInN1YiI6Ijg5ZjhjZTgzLWVhNDYtNGFmNy05MTdhLWEzM2YzNGMyNmJkMiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImZ1c2Utd2ViLXNlcnZpY2VzIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiNzYyMDAwYjAtYzJhYy00ZTYzLTkwMzUtNTEyZDczMTE2ZTFlIiwiYWNyIjoiMSIsImNsaWVudF9zZXNzaW9uIjoiODkzMzlhMmQtNzUxMC00ODIyLWJmMGQtZjNmNmE4NWU0MTQ5IiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIlJPTEVfTk9NRU5DTEFET1JfSURFTlRJREFEX1NFQ19DT05TVUxUQV9QT1JfRE9DVU1FTlRPIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50Iiwidmlldy1wcm9maWxlIl19fSwibmFtZSI6IiIsInByZWZlcnJlZF91c2VybmFtZSI6Im1pdHJvbGJpbyJ9.NhxV8Nfga6Cckdgdshb41_Ojma5tsQjTuUcVvB_c6Ba3mDCv28ouKE_A6yzXt7KPtv_UQaydz-TCvzC8C3l3uOe6QI2M-WzA0dNU3pi8aZWglMY8erdhUBHEbBhJymhHbwFzaftZA9JK1FGhO-5bOeliVXAi5qbixRdpJ5TiGnUJvp5bMwBJc7Us7rp-XvCQvwA2EAvfKCVEtNe5HRd2lQ6VEyGWGxbPQeF3Qn7jxNcb2BTab5WSQ-14Id84ny3jFtdRFi06teYC-lAGTi2B_5i5-_JStn6umglWW9ahs9-7EJWNQDrfupmWioEmE2lcqFoZiE-xxgmwud2PCd6vFQ"
const sessionId= '0c8a5095-2eb3-4722-9394-a768ef415a00'
const basePath = Meteor.settings.mitrol.recordings_path
const biometricURL = Meteor.settings.biometrics.url

console.log("pass bio", Meteor.settings.biometrics.username);
// '/Users/alexander/Projects/mitrol/biometrics/audios/realtime-dashboard-testing/too-noisy-level1.wav'

function wav2b64 (filePath) {
    return new Promise(function (resolve,reject) {
        base64.encode(filePath, function (err, res) {
            if (err) {
                reject(err)
                // throw new Meteor.Error('BASE 64 ERROR', err)
                // console.log(err);
            }
            resolve(res)
        })
    })
}

function compare(challenge, phrase, audioInBase64) {
    return new Promise(function (resolve,reject) {
        HTTP.post(
            "https://biometrics-middleware.appspot.com/compare/"
            ,{
                headers: {
                    "Content-Type": "application/json"
                }
                ,data: {
                    challenge: challenge
                    ,phrase: phrase
                    ,data: audioInBase64
                }
            }
            ,(err, res) => {
                err && reject(err)
                resolve(res)
            }
        )
    })
}

function getBiometricSessionId(username, password,domainId,device_info) {
    return new Promise(function (resolve, reject) {
        const uri = biometricURL + "/vkivr_static/rest/session"
        const headers = {"Content-Type": "application/json"}
        const body = {
            username: username
            ,password: password
            ,domainId: domainId
            ,device_info: device_info
         }
        HTTP.post(
            uri
            ,{ headers: headers, data: body }
            ,(err, res) => { 
                err && reject(err)
                resolve(res.data.sessionId)
            }
        )
    })
}

function getEnrolmentTransactionId(user, sessionId) {
    return new Promise(function(resolve, reject) {
        const uri = biometricURL + "/vkivr_static/rest/registration/person/" + user
        const headers = {"X-Session-Id":sessionId}
        HTTP.call(
            "GET"
            ,uri
            , {
                headers: headers
            }
            ,(err,res) => {
                err && reject(err)
                resolve(res.data.transactionId)
            })
    })
}

function postEnrolmentAudio(sessionId, transactionId, audioInBase64) {
    return new Promise(function(resolve, reject) {
        const uri = biometricURL + "/vkivr_static/rest/registration/voice/static/file"
        const headers = {
            "Content-Type": "application/json"
            ,"X-Session-Id":sessionId
            ,"X-Transaction-Id":transactionId
        }
        const body = {
            "data": audioInBase64
            ,"gender":0
            ,"channel":0
        }
        HTTP.post(
            uri
            ,{
                headers:headers
                ,data:body
            }
            ,(err,res) => {
                err && reject(false)
                resolve(true)
            }
        )

    })
}



Meteor.method("enrolment_audio", function(req) {
    // se transforma el audio a base 64
    let audioInBase64 = Promise.await(wav2b64(basePath + 'alex1.wav'))
    // se lo manda a google para analizar contenido y largo
    let comparison = Promise.await(compare(
        "fono"
        ,"si me llaman por telefono yo firmo con mi voz"
        ,audioInBase64
        ))
    let d = comparison.data    
    // si esta todo ok, envia a enrolar al biometrico
    if (
        d.STATUS === "OK"
        && !d.CONTENT_ERR
        && !d.LENGTH_ERR
    ) {
        // inicia una sesion en el motor biometrico    
        let sessionId = Promise.await(getBiometricSessionId(
            Meteor.settings.biometrics.username
            ,Meteor.settings.biometrics.password
            ,Meteor.settings.biometrics.domainId
            ,Meteor.settings.biometrics.device_info
        ))
        console.log("session id ok : ", sessionId);
        // tiene transactionId?
        let hasOpenTransaction = Orders.findOne({
            type:"enrolment_transaction"
            ,user: req.user
        })
        let transactionId

        if (hasOpenTransaction !== undefined) {
            // se esta enrolando o se enrolo
            transactionId = hasOpenTransaction.transaction_id
            console.log('user has open transaction', hasOpenTransaction.transaction_id)
        } else {
            // comienzo de enrolamiento
            transactionId = Promise.await(getEnrolmentTransactionId(
                req.user
                ,sessionId
            ))
            Orders.insert({
                type:"enrolment_transaction"
                ,user:req.user 
                ,is_full_enroll:false
                ,transaction_id: transactionId
                ,samples: 1
            })
            console.log("transaction id ok, inserted in db: ",transactionId)

        }

        

        // envia el audio a enrolar
        let enrol = Promise.await(postEnrolmentAudio(sessionId, transactionId, audioInBase64))
        
        if (enrol) {
            // se guarda el evento en el log de eventos y se muestra en tiempo real en el panel
            Orders.insert({
                user: req.user
                ,type: "signature_finished"
                ,audio: req.audio
                ,call_id: req.call_id
                ,intent: req.intent
                ,transcription: d.TRANSCRIPTION
                ,record_count: req.record_count
                })
        // return enrol 
        } else {
            // guarda en la base que hubo errores 
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
        } 
    } 
    // return 'enrolling'
    // console.log(comparison);
})

Meteor.method("letgo", function(req) {
    return {
        user: req.user
        ,person_id: req.person_id
        ,letgo: true
        ,snr_error:false
        ,length_error:false
        ,content_error:false
        ,enrolment_error:false
    }
})




// Meteor.methods({
//     bioCreateSession() {
//         this.unblock()
//         try {
//             const headers = {
//                 "Content-Type": "application/json;charset=UTF-8"
//             }
//             const result = HTTP.post('https://192.168.43.28/vkivr_static/rest/session', {
//                     data: {
//                         "username": "admin"
//                         ,"password": "QL0AFWMIX8NRZTKeof9cXsvbvu8="
//                         ,"domainId": "201"
//                     }
//                     ,headers: headers
//                 })
//             console.log('result:', result)
//             return result
//         } catch (err) {
//             console.log('ERROR CALLING BIOMETRIC ENGINE')
//             return err
//         }
      
//     }
    // ,convert() {
    //     base64.encode()
    // }
    // ,enrolment_audio() {
    //     this.unblock()
    //     try {
    //         const headers = {
    //             "Content-Type": "application/json;charset=UTF-8"
    //         }

    //     }
    // }
//     ,glover() {
//         this.unblock()
//         try {
//             const result = HTTP.post('http://jsonplaceholder.typicode.com/posts', {
//                 data: {
//                     "title": "Title of our new post",
//                     "body": "Body of our new post",
//                     "userId": 1337
//                 }
//             })
//             console.log(result.data.id)
//         }
//         catch (err) {
//             console.log(err)
//         }
      
//     }
//     ,renaper() {
//         const headers = {
//             "Content-Type": "application/json"
//             ,"Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlWDg0NjJzOHNTTGRROEpNSDk0TnJGTjZ2bHpyRk1Xb1EtOHYtQVpncllFIn0.eyJqdGkiOiI5ZGQ1NDM0ZS1hODBlLTQ1OTItOTdlOC0wNTRmNDBiNTc5ZDkiLCJleHAiOjE1NDUyNDEwMDEsIm5iZiI6MCwiaWF0IjoxNTQ1MjM3NDAxLCJpc3MiOiJodHRwczovL25zc2Etc2VjdXJlLXNzby11YXQubmFjaW9uc2VydmljaW9zLmNvbS5hci9hdXRoL3JlYWxtcy9uc3NhLWZ1c2UiLCJhdWQiOiJmdXNlLXdlYi1zZXJ2aWNlcyIsInN1YiI6Ijg5ZjhjZTgzLWVhNDYtNGFmNy05MTdhLWEzM2YzNGMyNmJkMiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImZ1c2Utd2ViLXNlcnZpY2VzIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiNzYyMDAwYjAtYzJhYy00ZTYzLTkwMzUtNTEyZDczMTE2ZTFlIiwiYWNyIjoiMSIsImNsaWVudF9zZXNzaW9uIjoiODkzMzlhMmQtNzUxMC00ODIyLWJmMGQtZjNmNmE4NWU0MTQ5IiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIlJPTEVfTk9NRU5DTEFET1JfSURFTlRJREFEX1NFQ19DT05TVUxUQV9QT1JfRE9DVU1FTlRPIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50Iiwidmlldy1wcm9maWxlIl19fSwibmFtZSI6IiIsInByZWZlcnJlZF91c2VybmFtZSI6Im1pdHJvbGJpbyJ9.NhxV8Nfga6Cckdgdshb41_Ojma5tsQjTuUcVvB_c6Ba3mDCv28ouKE_A6yzXt7KPtv_UQaydz-TCvzC8C3l3uOe6QI2M-WzA0dNU3pi8aZWglMY8erdhUBHEbBhJymhHbwFzaftZA9JK1FGhO-5bOeliVXAi5qbixRdpJ5TiGnUJvp5bMwBJc7Us7rp-XvCQvwA2EAvfKCVEtNe5HRd2lQ6VEyGWGxbPQeF3Qn7jxNcb2BTab5WSQ-14Id84ny3jFtdRFi06teYC-lAGTi2B_5i5-_JStn6umglWW9ahs9-7EJWNQDrfupmWioEmE2lcqFoZiE-xxgmwud2PCd6vFQ"
//         }
//         const result = HTTP.post('https://wsuat.pim.com.ar/nomenclador-identidad-sec-rs/consultaPorDocumento/'
//             ,{ 
//                 data: {
//                     "nroDocumento": "29984695"
//                     ,"sexo": "M"
//                     ,"invokerApp": "mitrolbio"
//                 }
//                 ,headers: headers
//         })
//         console.log(result)
//     }
//     ,letgo(body) {
//         return {
//             letgo:true
//             ,content_error:false
//             ,length_error:false
//             ,signature_error:false
//         }
//     }
//     ,enrolment_audio(body){
//         return body.path
//     }
// })






