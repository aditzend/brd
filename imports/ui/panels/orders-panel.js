import './orders-panel.html';
import '../pages/orders-show-page.js';
import moment from 'moment/moment';

Template.Orders_panel.onCreated(function() {
  this.autorun( () => {
        FlowRouter.watchPathChange();

    if(Meteor.user()){
      const w = wf('orders-panel.js');
      this.subscribe('Orders.test');
    }else{
      console.log('cannot call wf from orders-panel.js');
    }
  });
});

Template.Orders_panel.helpers({

  explain(type) {
    switch (type) {
      case 'validation_finished':
        return 'Validación finalizada'
        break
      case 'validation_violated':
        return 'Infracción'
        break
      case 'enrolment_full':
        return 'Enrolamiento exitoso'
        break
      case 'signature_finished':
        return 'Firma exitosa'
        break
      case 'signature_failed':
        return 'Firma errónea'
        break
      default:
        return ''
    }
  },
  icon(passed) {
    switch (passed) {
      case "true":
        return '<i class="fa fa-check" style="color:green!important;"></i>'
        break
      case "false":
        return  '<i class="fa fa-times" style="color:red!important;"></i>'
        break
      default:
        return '<i class="fa fa-book"></i>'
    }
  },
  countEnroled() {
    return Orders.find({type: 'enrolment_full'}).count()
  },
  countAccepted() {
    return Orders.find({type: 'validation_finished', passed: "true"}).count()
  },
  countRejected() {
    return Orders.find({type: 'validation_finished', passed: "false"}).count()
  },
  countInfracted() {
    return Orders.find({type: 'validation_violated'}).count()
  },
  anis(calls){
    return _.uniq(calls)
  },
   enroledUsers() {
       return Orders.find({type:'enrolment_full'})
     },
     feed() {
       return Orders.find({
         
       }, {
         sort: {
           createdAt: -1
         },
         limit:48
       });
     }
     ,ongoingCalls() {
        const sinceTime = moment().subtract(30, "minutes").format()

        // query recent ended calls
        const endedCalls = Orders.find({
          $and: [
            {createdAt: {$gt: sinceTime }}
            ,{ type: "call_ended"}
          ]
          
          }, {
          call_id: 1
        })
         let endedCallsArray = []
         endedCalls.map(call => endedCallsArray.push(call.call_id))
         endedCallsArray = _.uniq(endedCallsArray)

        // query recent calls
        const allCalls = Orders.find({
          createdAt: {
            $gt: sinceTime
            }
          }, {
          call_id: 1
        })
        let allCallsArray = []
        allCalls.map(call => allCallsArray.push(call.call_id))
        allCallsArray = _.uniq(allCallsArray)

        // remove ended from latest calls using lodash
        const ongoingCallsArray =  _.difference(allCallsArray, endedCallsArray)
        return ongoingCallsArray.length
     }
     ,latestCalls() {

        const sinceTime = moment().subtract(10, "minutes").format()
        const calls = Orders.find(
         {
           createdAt: {
             $gt: sinceTime
           }
          }
         ,{ 
           call_id : 1
          }
       )
       let callArray = []
       calls.map( call => callArray.push(call.call_id))
       return _.uniq(callArray)
      //  return ['1234','1234','2345']
     }
     ,feedByCallID(callID) {
        return Orders.find(
          { call_id: callID}
          ,{ sort: { createdAt: -1 }})
     }
     ,channel3() {
       return Orders.find({
         channel: 3
       }, {
         sort: {
           createdAt: -1
         }
       });
     },
     channel4() {
       return Orders.find({
         channel: 4
       }, {
         sort: {
           createdAt: -1
         }
       });
     },

  pathForOrder(id) {

      const params = {
          _id: id
      };
      const queryParams = {
          // state: 'open'
      };
      const routeName = 'showOrder';
      const path = FlowRouter.path(routeName, params, queryParams);

      return path;
  },
  pathForOrders() {

      const params = {

      };
      const queryParams = {
          // state: 'open'
      };
      const routeName = 'showOrders';
      const path = FlowRouter.path(routeName, params, queryParams);

      return path;
  },
});

Template.Orders_panel.events({
  'click .js-new-order': function(e,instance) {
        const w = wf('click new order at dashboard.js');
        Meteor.call('createOrder', w._id, function(err,res){
          if (err) {
            console.log(err);
          } else {
            const params = {
                _id: res
            };
            const queryParams = {
                // state: 'open'
            };
            const routeName = 'showOrder';
            const path = FlowRouter.path(routeName, params, queryParams);

            FlowRouter.go(path);
          }
        });
  },
  'click .js-show-order': function(e, instance) {

  }
})
