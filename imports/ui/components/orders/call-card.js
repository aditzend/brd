import "./call-card.html";
import moment from "moment/moment";
import { Session } from "meteor/session";
import { ReactiveDict } from "meteor/reactive-dict";

function correctDigits(str) {
  if (str.length < 2) {
    return "0" + str
  } else {
    return str
  }
} 

Template.CallCard.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    timeElapsed: 0
  });
  //   this.state.set('createdAt', moment().toISOString())
  this.autorun(() => {
    this.subscribe("agents.all");
    this.subscribe("Orders.byCallID", this.data.callID);

    const callEnd = Orders.findOne({call_id:this.data.callID, type:'call_ended'})
    callEnd && this.state.set('endedAt', callEnd.createdAt)
    this.state.set('callEnd', callEnd?true:false)
    
    const orderAgent = Orders.findOne({ call_id:this.data.callID,agent: { $exists: true } });
    if (orderAgent) {
      const agentProvidedNumber = orderAgent.agent;
      console.log('agent bio2 : ', agentProvidedNumber)
      const agentDocNumber = agentProvidedNumber.includes("-")?
      agentProvidedNumber.split("-")[2]
      :agentProvidedNumber;
      console.log('agent bio3 : ', agentDocNumber)

      const agent = Agents.findOne({ DocNumber: agentDocNumber });
      this.state.set(
        "agentName",
        '<i class="zmdi zmdi-headset-mic"></i> ' + agentDocNumber
      );
      if (agent) {
           const firstName = agent.FirstName;
      // console.log('agent bio 4 : ', agent.FirstName)

      const lastName = agent.LastName;
      this.state.set(
        "agentName",
        '<i class="zmdi zmdi-headset-mic"></i> ' + firstName + " " + lastName
      );
      }
    }

    const callStart = Orders.findOne({call_id:this.data.callID, type:'call_started'})
    callStart && this.state.set('startedAt', callStart.createdAt)

    this.state.set("ani", `<i class="zmdi zmdi-phone"></i> ${callStart.ani}`);
    this.state.set("source", `<i class="zmdi zmdi-memory"></i> ${callStart.source}`);
    this.state.set("source_version", callStart.source_version);
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
  audioLink(relativePath) {
    return Meteor.settings.public.recordings_path + relativePath
  },
  callEnd() {
      const instance = Template.instance();
    return instance.state.get("callEnd");
  },
  callStartDate() {
      const instance = Template.instance();
      const callStart = moment(instance.state.get("callStart"))
      return `<i class="zmdi zmdi-calendar"></i> ${callStart.format("DD/MM/YYYY")}`
  },
  callStartTime() {
      const instance = Template.instance();
    const callStart = Orders.findOne({call_id:instance.data.callID, type:'call_started'})

      const callStartMoment = moment(callStart.createdAt)
      // const callStartMoment = moment(instance.state.get("callStart"))
      return `<i class="zmdi zmdi-time"></i> ${callStartMoment.format("HH:mm:ss")}`
  },
  call() {
    const instance = Template.instance();
    return instance.data.callID;
  },
  duration() {
      const instance = Template.instance();
    const callStart = moment(instance.state.get("createdAt"));
    const callEnd = moment(instance.state.get("endedAt"));
    const elapsed = moment.duration(callEnd.diff(callStart))
    return {
      min: correctDigits( String(elapsed.minutes()) ),
      seg: correctDigits( String(elapsed.seconds()) )
    }
  },
  delta(eventCreatedAt) {
    const instance = Template.instance();
    const callStart = moment(instance.state.get("createdAt"));
    const eventStart = moment(eventCreatedAt);
    // const diff = 
    return {
      min: correctDigits(String(moment.duration(eventStart.diff(callStart)).minutes())),
      seg: correctDigits(String(moment.duration(eventStart.diff(callStart)).seconds()))
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
