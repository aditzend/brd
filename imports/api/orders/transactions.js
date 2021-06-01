// PACKAGES
import { Promise } from "meteor/promise";

// INTERNAL MODULES

export function userHasLiveEnrolment(user, call_id) {
  const status = Orders.findOne({
    type: "call_status",
    call_id: call_id
  });
  let transactionId = _.result(_.find(status.transactions, function(transaction) {
    return transaction.is_alive === true && transaction.type === 'enrollment' && transaction.user === user
  }), 'id')
  if (transactionId) {
    console.log(`ENROLLMENT TRANSACTION ID --> ${transactionId}`)
    return true
  } else {
    return false
  }
}

export function getLiveSessionId(call_id) {
  const status = Orders.findOne({ type: "call_status", call_id: call_id });
 
  if (status.session_is_alive) {
    return status.session_id;
  } else {
    return null;
  }
}

export function getLiveEnrollmentId(user, call_id) {
  const status = Orders.findOne({
    type: "call_status",
    call_id: call_id
  });
     let transactionId = _.result(_.find(status.transactions, function(transaction) {
    return transaction.is_alive === true && transaction.type === 'enrollment' && transaction.user === user
  }), 'id')
  if (transactionId) {
    return transactionId;
  } else {
    return null
  }
}

Meteor.methods({
  "call.createTransaction"(call_id, user, transactionId, transactionType) {
    const status = Orders.findOne({ type: "call_status", call_id: call_id });
    if (status) {
      const transaction = Orders.findOne({
        type: "call_status",
        call_id: call_id,
        'transactions.id': transactionId 
      });
      if (transaction) {
        return {
          success: false,
          message: "transaction is already added, use call.updateTransaction"
        };
      } else {
        console.log("****** updating call_status  🐅🐅🐅")
        Orders.update(
          { type: "call_status", call_id: call_id },
          {
            $push: {
              transactions: {
                user: user,
                id: transactionId,
                type: transactionType,
                is_alive: true
              }
            }
          }
        );
      }
    } else {
      return { success: false, message: "no status" };
    }
  },
  "call.closeTransaction"(call_id, transactionId) {
    const status = Orders.findOne({ type: "call_status", call_id: call_id });
    if (status) {
      Orders.update(
        {
          type: "call_status",
          call_id: call_id,
          "transactions.id": transactionId
        },
        {
          $set: {
            "transactions.$.is_alive": false
          }
        }
      );
    } else {
      return { success: false, message: "no status" };
    }
  }
});
