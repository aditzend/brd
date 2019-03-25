import processWithoutASR from "./processWithoutASR";

Meteor.method("enrollment_audio", function(req) {
  console.log("000");
  Meteor.setTimeout(() => {
    if (Meteor.settings.biometrics.use_asr) {
      // enrolWithASR.process(req, sessionId)
      processWithoutASR(req);
    } else {
      processWithoutASR(req);
    }
  }, 1);
  return "enrolling";
});
