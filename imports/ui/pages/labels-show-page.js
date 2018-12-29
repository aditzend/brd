import './labels-show-page.html';
import '../components/item/agent-decs.js';
import './sticker15.html';

Template.Labels_show_page.onCreated(function(){
  this.state = new ReactiveDict();
  this.state.setDefault({
      // company: false,
      //switchingCompany: false,
      // showCompanyDetails: false,
      // paymentDays: false,
      // fin: false,
      // finType: false,
      //  selectedProduct: false,
      // orderId: false,
      sellingItemName: false,
      sellingItemDesc: false,
      sellingItemId: false,
      // grandTotal: false,
      // dateDefined: false,
      // uploadingFile: false,
      // addingOrderDetail:false,
  });
  this.autorun(() => {
    let w = workfor('labels-show-page.js');
    let itemsSubscription = this.subscribe('items.test');
    // let motor = Items.findOne("r5xhgepRbYKasZ6SQ");
    // this.data.motor = motor;
  });
  // let motor = {name:'secont test'};
  // let motor = Items.findOne("r5xhgepRbYKasZ6SQ");
  // this.data.motor = motor;
});

Template.Labels_show_page.helpers({

  motorArgs() {
    const motorId = FlowRouter.getParam("_id");
    const motor = Items.findOne(
      motorId
    );
    return  {
      motor: motor
    };
  },
  sellingItemName() {
      const instance = Template.instance();
      return instance.state.get('sellingItemName');
  },
  productArgs() {
      const instance = Template.instance();
      return {
        mode:'product',
          selectedItemId(id) {
              instance.state.set('sellingItemId', id);
              const motor = Items.findOne(id);
              instance.data.motor = motor;
              console.log("MOTOR", instance.data.motor.name);

              // console.log("product", id);
          },
          selectedItemName(name) {
              instance.state.set("sellingItemName", name);
              console.log("labeling :", instance.state.get('sellingItemName'));

          },
          selectedItemDesc(desc) {
              instance.state.set("sellingItemDesc", desc);
              // console.log("selling :", instance.state.get('sellingItemName'));
          },
          selectedItemProfitCenter(pcId) {
              instance.state.set("sellingItemProfitCenter", pcId);
          }
      }
  },
  motorSelected() {
    const instance = Template.instance();
    return instance.data.motor;
  },
  // productPrimaryDesc() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.productPrimaryDesc
  // },
  // productSecondaryDesc() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.productSecondaryDesc
  // },
  //
  // model() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.name;
  // },
  // diameter() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.diameter;
  // },
  // voltage() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.voltage;
  // },
  // frecuency() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.frecuency;
  // },
  // amperage() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.amperage;
  // },
  // power() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.power;
  // },
  // rpm() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.rpm;
  // },
  // maxTime() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.maxTime;
  // },
  // IPclass() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.IPclass;
  // },
  // iClass() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.iClass;
  // },
  // torque() {
  //   const instance = Template.instance();
  //
  //   return instance.data.motor.torque;
  // },
  company() {
    return 'Motores Tubulares S.R.L.';
  },
  address() {
    return 'El Rodeo 1360, El Palomar, Bs. As.';
  },
  web() {
    return 'thesa.com.ar'
  }

});

Template.Labels_show_page.events({
'click .js-print-stickers': function(e,instance) {
  e.preventDefault();

  if ($(window)
      .width() < 769) {
      $("body")
          .toggleClass("show-sidebar");
  } else {
      $("body")
          .toggleClass("hide-sidebar");
  }
  window.print();

}

});
