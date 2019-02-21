
export function getEnrolmentId(user, sessionId) {
  const deletion = Promise.await(deleteUser(user, sessionId));
  console.log(`${user} DELETED ==> ${deletion.message}`);
  return new Promise(function(resolve, reject) {
    const uri = biometricURL + "vkivr_static/rest/registration/person/" + user;
    const headers = {
      "X-Session-Id": sessionId
    };
    HTTP.call(
      "GET",
      uri,
      {
        headers: headers
      },
      (err, res) => {
        err &&
          resolve({
            success: false,
            message: "ERROR GETTING TRANSACTION ID FOR ENROLMENT ==> " + err
          });
        console.log("ENROLMENT TRANSACTION ID ==> ", res.data.transactionId);
        resolve({
          success: true,
          message: "TRANSACTION ID : " + res,
          transactionId: res.data.transactionId
        });
      }
    );
  });
}