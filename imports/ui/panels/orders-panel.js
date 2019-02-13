import "./orders-panel.html";
import "../pages/orders-show-page.js";
import moment from "moment/moment";
import { Session } from "meteor/session";
import { ReactiveDict } from "meteor/reactive-dict";

import "../components/orders/call-card";

Template.Orders_panel.onCreated(function() {
  this.autorun(() => {
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

Template.Orders_panel.helpers({
  callCardArgs(callID) {
    return { callID: callID };
  },

  explain(type) {
    switch (type) {
      case "call_started":
        return '<i class="zmdi zmdi-phone-ring"></i> Inicio de llamada';
        break;
      case "validation_finished":
        return "Validación finalizada";
        break;
      case "validation_violated":
        return "Infracción";
        break;
      case "enrolment_full":
        return "<h3><i class='fa fa-check'></i>Enrolamiento exitoso</h3>";
        break;
      case "signature_finished":
        return "Firma exitosa";
        break;
      case "signature_failed":
        return "Firma errónea";
        break;
      default:
        return "";
    }
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
  icon(passed) {
    switch (passed) {
      case "true":
        return '<i class="fa fa-check" style="color:green!important;"></i>';
        break;
      case "false":
        return '<i class="fa fa-times" style="color:red!important;"></i>';
        break;
      default:
        return '<i class="fa fa-book"></i>';
    }
  },
  // anis(calls) {
  //   return _.uniq(calls)
  // },
  enroledUsers() {
    return Orders.find({
      type: "enrolment_full"
    });
  },
  feed() {
    return Orders.find(
      {},
      {
        sort: {
          createdAt: -1
        },
        limit: 48
      }
    );
  },
  ongoingCalls() {
    const sinceTime = moment()
      .subtract(30, "minutes")
      .format();

    // query recent ended calls
    const endedCalls = Orders.find(
      {
        $and: [
          {
            createdAt: {
              $gt: sinceTime
            }
          },
          {
            type: "call_ended"
          }
        ]
      },
      {
        call_id: 1
      }
    );
    let endedCallsArray = [];
    endedCalls.map(call => endedCallsArray.push(call.call_id));
    endedCallsArray = _.uniq(endedCallsArray);

    // query recent calls
    const allCalls = Orders.find(
      {
        createdAt: {
          $gt: sinceTime
        }
      },
      {
        call_id: 1,
        sort: {
          createdAt: -1
        }
      }
    );
    let allCallsArray = [];
    allCalls.map(call => allCallsArray.push(call.call_id));
    allCallsArray = _.uniq(allCallsArray);

    // remove ended from latest calls using lodash
    const ongoingCallsArray = _.difference(allCallsArray, endedCallsArray);
    return ongoingCallsArray.length;
  },
  latestCalls() {
    const sinceTime = moment()
      .subtract(100, "minutes")
      .format();
    const calls = Orders.find(
      {
        type:"call_started",
        createdAt: {
          $gt: sinceTime
        }
      },
      {
        call_id: 1,
        sort: {
          createdAt: 1
        }
      }
    );
    let callArray = [];
    calls.map(call => callArray.push(call.call_id));
    return _.uniq(callArray);
    //  return ['1234','1234','2345']
  },
  pathForOrder(id) {
    const params = {
      _id: id
    };
    const queryParams = {
      // state: 'open'
    };
    const routeName = "showOrder";
    const path = FlowRouter.path(routeName, params, queryParams);

    return path;
  },
  pathForOrders() {
    const params = {};
    const queryParams = {
      // state: 'open'
    };
    const routeName = "showOrders";
    const path = FlowRouter.path(routeName, params, queryParams);

    return path;
  }
});

Template.Orders_panel.events({
  "click .js-new-order": function(e, instance) {
    const w = wf("click new order at dashboard.js");
    Meteor.call("createOrder", w._id, function(err, res) {
      if (err) {
        console.log(err);
      } else {
        const params = {
          _id: res
        };
        const queryParams = {
          // state: 'open'
        };
        const routeName = "showOrder";
        const path = FlowRouter.path(routeName, params, queryParams);

        FlowRouter.go(path);
      }
    });
  }
  // 'click .js-set-1hr': function (e, instance) {
  //   Session.set('REPORT_BEGINNING_DATE', moment().subtract(1, 'hour').format())
  //   Session.set('REPORT_DATES_EXPLANATION', 'Mostrando resultados desde hace una hora')
  // },
  // 'click .js-set-today': function (e, instance) {
  //   Session.set('REPORT_BEGINNING_DATE', moment().startOf('day').format())
  //   Session.set('REPORT_DATES_EXPLANATION', 'Mostrando resultados de hoy')
  // },
  // 'click .js-set-week': function (e, instance) {
  //   Session.set('REPORT_BEGINNING_DATE', moment().startOf('week').format())
  //   Session.set('REPORT_DATES_EXPLANATION', 'Mostrando resultados de esta semana')
  // },
  // 'click .js-set-month': function (e, instance) {
  //   Session.set('REPORT_BEGINNING_DATE', moment().startOf('month').format())
  //   Session.set('REPORT_DATES_EXPLANATION', 'Mostrando resultados de este mes')
  // },
  // 'click .js-set-all': function (e, instance) {
  //   Session.set('REPORT_BEGINNING_DATE', '1900-01-07T00:00:00-03:00')
  //   Session.set('REPORT_DATES_EXPLANATION', 'Mostrando todos los resultados')
  // }
});
