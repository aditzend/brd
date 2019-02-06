import "./logs-panel.html";

import { Session } from "meteor/session";

Template.Logs_panel.onCreated(function() {
  this.autorun(() => {
    FlowRouter.watchPathChange();
    this.subscribe(
      "Logs.byDate",
      Session.get("REPORT_BEGINNING_DATE"),
      Session.get("REPORT_ENDING_DATE")
    );
  });
});

Template.Logs_panel.helpers({
  logs() {
    return Logs.find({},{sort:{createdAt:-1}});
  },
  labelClass(label) {
    switch (label) {
      case "ERROR":
        return "label-danger";
        break;
      case "WARNING":
        return "label-warning";
        break;
      default:
        return "label-info";
    }
  }
});
