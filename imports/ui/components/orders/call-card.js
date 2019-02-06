import "./call-card.html";
import moment from "moment/moment";
import { Session } from "meteor/session";
import { ReactiveDict } from "meteor/reactive-dict";

Template.CallCard.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    timeElapsed: 0
  });
  //   this.state.set('createdAt', moment().toISOString())
  this.autorun(() => {
    this.subscribe("agents.all");
    this.subscribe("Orders.byCallID", this.data.callID);

    const callEnd = Orders.findOne({ call_id:this.data.callID,type: 'call_ended' })
    callEnd && this.state.set('endedAt', callEnd.createdAt)
    this.state.set('callEnd', callEnd?true:false)
    
    const orderAgent = Orders.findOne({ call_id:this.data.callID,agent: { $exists: true } });
    if (orderAgent) {
      const agentBiometricProfile = orderAgent.agent;
      console.log('agent bio2 : ', agentBiometricProfile)
      const agentDocNumber = agentBiometricProfile.split("-")[2];
      console.log('agent bio3 : ', agentDocNumber)

      const agent = Agents.findOne({ DocNumber: agentDocNumber });
      this.state.set(
        "agentName",
        '<i class="zmdi zmdi-headset-mic"></i> ' + agentDocNumber
      );
      if (agent) {
           const firstName = agent.FirstName;
      console.log('agent bio 4 : ', agent.FirstName)

      const lastName = agent.LastName;
      this.state.set(
        "agentName",
        '<i class="zmdi zmdi-headset-mic"></i> ' + firstName + " " + lastName
      );
      }
    }

    this.state.set("ani", '<i class="zmdi zmdi-phone"></i> +5491160134585');
    this.state.set("source", '<i class="zmdi zmdi-memory"></i> IVR CE');
    this.state.set("source_version", "V 4");
    Meteor.setInterval(() => {
      let createdAt = this.state.get("createdAt");
      this.state.set("timeElapsed", moment().diff(createdAt, "minutes"));
    }, 60 * 1000);
    FlowRouter.watchPathChange();
    // console.log("report START --> ", Session.get("REPORT_BEGINNING_DATE"));
    // console.log("report end --> ", Session.get("REPORT_ENDING_DATE"));
    this.subscribe(
      "Orders.byDate",
      Session.get("REPORT_BEGINNING_DATE"),
      Session.get("REPORT_ENDING_DATE")
    );
  });
});

Template.CallCard.onRendered(function() {
  const instance = Template.instance();
  instance.state.set(
    "createdAt",
    Orders.findOne({ call_id: instance.data.callID, type: "call_started" })
      .createdAt
  );
  const createdAt = instance.state.get("createdAt");
  this.state.set("timeElapsed", moment().diff(createdAt, "minutes"));
});

Template.CallCard.helpers({
  agentName() {
    const instance = Template.instance();
    return instance.state.get("agentName");
  },
  ani() {
    const instance = Template.instance();
    return instance.state.get("ani");
  },
  callEnd() {
      const instance = Template.instance();
    return instance.state.get("callEnd");
  },
  call() {
    const instance = Template.instance();
    return instance.data.callID;
  },
  duration() {
      const instance = Template.instance();
    const callStart = moment(instance.state.get("createdAt"));
    const callEnd = moment(instance.state.get("endedAt"));
    return {
      min: moment.duration(callEnd.diff(callStart)).minutes(),
      seg: moment.duration(callEnd.diff(callStart)).seconds()
    }
  },
  explain(type) {
    switch (type) {
      case "call_started":
        return '<i class="zmdi zmdi-phone-ring text-info"></i> Inicio de llamada';
        break;
      case "call_ended":
        return '<i class="zmdi zmdi-phone-end text-info"></i> Fin de llamada';
        break;
      case "validation_finished":
        return "<i class='zmdi zmdi-gps-dot text-info'></i> Validación finalizada";
        break;
      case "validation_violated":
        return "<i class='zmdi zmdi-alert-triangle text-danger'></i> Infracción";
        break;
      case "enrolment_full":
        return "<i class='zmdi zmdi-check text-success'></i>Enrolamiento exitoso";
        break;
      case "enrolment_error":
        return "<i class='zmdi zmdi-alert-polygon text-warning'></i> Error en el enrolamiento";
        break;
      case "signature_finished":
        return "Firma exitosa";
        break;
      case "signature_failed":
        return "Firma errónea";
        break;
      default:
        return type;
    }
  },
  delta(eventCreatedAt) {
    const instance = Template.instance();
    const callStart = moment(instance.state.get("createdAt"));
    const eventStart = moment(eventCreatedAt);
    return {
      min: moment.duration(eventStart.diff(callStart)).minutes(),
      seg: moment.duration(eventStart.diff(callStart)).seconds()
    };
  },
  feedByCallID(callID) {
    return Orders.find(
      {
        call_id: callID
      },
      {
        sort: {
          createdAt: -1
        }
      }
    );
  },
  timeElapsed(callID) {
    let instance = Template.instance();
    let callStartEvent = Orders.find({ call_id: callID, type: "call_started" });
    return instance.state.get("timeElapsed");
    // return moment().diff(callStartEvent.createdAt, 'seconds')
  },
  lastIntent(callID) {
    let callEvents = Orders.find({ call_id: callID });
    let arr = [];
    callEvents.map(event => {
      event.intent && arr.push(event.intent);
    });
    return _.last(arr);
  },
  source() {
    const instance = Template.instance();
    return instance.state.get("source");
  },
  source_version() {
    const instance = Template.instance();
    return instance.state.get("source_version");
  }
});
