// PACKAGES
const moment = require("moment");

// INTERNAL MODULES
import "/imports/ui/components/report-date-picker/report-date-picker.js";

// TEMPLATES
import "./enroled-show-page.html";

Template.Enroled_show_page.onCreated(function() {
  this.autorun(() => {
    this.subscribe(
      "Orders.byDate",
      Session.get("REPORT_BEGINNING_DATE"),
      Session.get("REPORT_ENDING_DATE")
    );
  });
});

Template.Enroled_show_page.helpers({
  enroled() {
    return Orders.find(
      {
        type: "enrolment_full"
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    );
  },
  countEnroled() {
    return Orders.find({
      type: "enrolment_full"
    }).count();
  },
  pathForUser(id) {
    const params = {
      _id: id
    };
    const queryParams = {
      // state: 'open'
    };
    const routeName = "showUser";
    const path = FlowRouter.path(routeName, params, queryParams);
    return path;
  }
});

Template.Enroled_show_page.events({
  "click .js-download-csv": function(e, instance) {
    const start = Session.get("REPORT_BEGINNING_DATE");
    const end = Session.get("REPORT_ENDING_DATE") || moment().format();
    const orders = Orders.find({
      $and: [
        {
          type: "enrolment_full"
        },
        {
          createdAt: {
            $gte: start,
            $lt: end
          }
        }
      ]
    });
    let count = orders.count();
    let arr = [];
    orders.map(order => {
      arr.push([order.user, order.call_id, order.createdAt]);
    });
    // orders.map((order) => {
    //   Meteor.call('clients.getPhoneNumber', order.user, function (err, res) {
    //     err && console.log(err)
    //     arr.push([
    //       order.user, res.message, order.call_id, order.createdAt
    //     ])
    //   })
    // })
    swal("Preparando archivo", `Demora estimada : ${count * 10}ms `, "info");

    Meteor.setTimeout(() => {
      let csv = Papa.unparse({
        fields: ["PERFIL_BIOMETRICO", "ID_INTERACCION", "FECHA_HORA_CREACION"],
        // fields: [
        //   'PERFIL_BIOMETRICO', 'TELEFONO', 'ID_INTERACCION', 'FECHA_HORA_CREACION'
        // ],
        data: arr
      });

      const blob = new Blob([csv], {
        type: "text/plain;charset=utf-8;"
      });
      saveAs(blob, "NSSA_BIOMETRIA_PILOTO_CLIENTES_ENROLADOS_FILTRADOS.csv");
    }, count * 10);
  },
  "click .js-download-audios-csv": function(e, instance) {
    const start = Session.get("REPORT_BEGINNING_DATE");
    const end = Session.get("REPORT_ENDING_DATE") || moment().format();
    const orders = Orders.find({
      $and: [
        {
          audio: {
            $exists: true
          }
        },
        {
          createdAt: {
            $gte: start,
            $lt: end
          }
        }
      ]
    });
    let count = orders.count();
    let arr = [];
    orders.map(order => {
      arr.push([
        order.user,
        order.intent,
        order.type,
        order.audio,
        order.call_id,
        order.createdAt
      ]);
    });
    swal("Preparando archivo", `Demora estimada : ${count * 10}ms `, "info");
    Meteor.setTimeout(() => {
      let csv = Papa.unparse({
        fields: [
          "PERFIL_BIOMETRICO",
          "INTENCION",
          "TIPO",
          "AUDIO",
          "ID_INTERACCION",
          "FECHA_HORA_CREACION"
        ],
        data: arr
      });

      const blob = new Blob([csv], {
        type: "text/plain;charset=utf-8;"
      });
      saveAs(blob, "NSSA_BIOMETRIA_PILOTO_AUDIOS_POR_FECHA.csv");
    }, count * 10);
  }
});
