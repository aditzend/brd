import { HTTP } from 'meteor/http'

export function compare(challenge, phrase, audioInBase64) {
    return new Promise(function (resolve, reject) {
        HTTP.post(
            "https://biometrics-middleware.appspot.com/compare/", {
                headers: {
                    "Content-Type": "application/json"
                },
                data: {
                    challenge: challenge,
                    phrase: phrase,
                    data: audioInBase64
                }
            }, (err, res) => {
                err && reject(err)
                resolve(res)
            }
        )
    })
}
