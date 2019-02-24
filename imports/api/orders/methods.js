import './calls'
import './transactions'

Meteor.methods({
    audioLink(relativePath){
        return relativePath
        // return Meteor.settings.mitrol.relative_path + relativePath
    },
  changeCorrectness(orderId, value) {
    Orders.update({_id: orderId},{$set:{isCorrect:value}})
  },
  removeDetail(orderId,orderDetailId) {
    console.log("order", orderId);
    //console.log("index", orderDetailId);
    Orders.update({_id: orderId},{$pull: {
      soldProducts: {
        orderDetail: orderDetailId
      }
    }});
  },
  propagateOrderDetailToOrder(args) {
    Orders.update({_id: args.order },{$push:{soldProducts: {
      orderDetail: args.orderDetail,
       item: args.item,
       itemName: args.itemName,
      itemDesc: args.itemDesc,
      expectedDate: args.expectedDate,
    amount: args.amount,
      price: args.price,
      discount: args.discount,
       taxes: args.taxes
    }}});
  },

  addDeliveryItemToOrder(orderId,deliveryId,itemId,amount,packaging,invoiced) {
    Orders.update({_id:orderId,'soldProducts.item':itemId},
      {
        $push:{
          'soldProducts.$.deliveries':{
            
              amount:amount,
              deliveryId: deliveryId,
              packaging: packaging,
              invoiced: invoiced,
              author: this.userId,
              createdAt: moment().format()
          }
        }
      
        
      });
  }
  
});

