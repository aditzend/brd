import "./counters.html";

Template.Counters.onCreated(function () {
  this.autorun(() => {
    this.subscribe(
      "Logs.byDate",
      Session.get("REPORT_BEGINNING_DATE"),
      Session.get("REPORT_ENDING_DATE")
    );
  });
});

Template.Counters.helpers({
  countInteractions() {
    return Logs.find({ type: "enrollment_full" }).count();
  },
  countAccepted() {
    return Orders.find({
      type: "validation_finished",
      passed: "true",
    }).count();
  },
  countRejected() {
    return Orders.find({
      type: "validation_finished",
      passed: "false",
    }).count();
  },
  countInfracted() {
    return Orders.find({
      type: "validation_violated",
    }).count();
  },
});
