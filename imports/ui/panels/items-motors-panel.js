import './cars-panel.html';
import '../components/item/item-search.js';
import '../components/item/item-motor-show.js';


Template.Cars_panel.onCreated(function() {
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
    let w = workfor('items-motors');
    // let itemsSubscription = this.subscribe('cars.all');
    let itemsSubscription = this.subscribe('Items.own', w._id);
    // let motor = Items.findOne("r5xhgepRbYKasZ6SQ");
    // this.data.motor = motor;
  });
  // let motor = {name:'secont test'};
  // let motor = Items.findOne("r5xhgepRbYKasZ6SQ");
  // this.data.motor = motor;
});

//vvvvvvvvvvvvvv ARGS vvvvvvvvvvvvvv
Template.Cars_panel.helpers({
  selectedMotor() {
    const instance = Template.instance();
    return instance.state.get('selectedItemId');
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

    searchItemArgs() {
        const instance = Template.instance();

        return {
            mode: 'product',
            index: ProductsIndex,
            selectedItem(id) {
                instance.state.set('selectedItem', id);
                console.log("STATE>>>>>>>>>>>>>> SELECTED Item ", id);
            },
            itemNotFound(insertedText) {
                instance.state.set('creatingItem', insertedText);
            }
        }
    },

    showItemArgs(selectedItemId) {
        const instance = Template.instance();
        const item = Items.findOne(selectedItemId);
        return {
            item: item,

            onEdit(itemId) {
                instance.state.set('editingItem', itemId);
                console.log('showitemArgs >>>>>>>>>> EDIT ITEM:  ', itemId);
            },
            onDelete(itemId) {
                instance.state.set('deletingItem', itemId);
                console.log(' showitemArgs DELETE item ', itemId);
                swal({
                        title: "Borramos a " + item.name + ' ?',
                        text: "No se puede recuperar esta informacion!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Sí, borrar!",
                        cancelButtonText: "No, cancelar por favor!",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            const deleted = Items.remove(itemId);
                            instance.state.set('selectedItem', false);
                            swal(item.name + " fue eliminada.", "Se borraron los datos", "success");
                        } else {
                            swal("Eliminación cancelada!", item.name + " esta segura :)", "error");
                        }
                    });

            }
        }
    },
    editItemArgs() {
        const instance = Template.instance();
        const item = Items.findOne(instance.state.get('editingItem'));
        console.log('editItemArgs >>>>>>>>> EDIT ITEM :', item);
        return {
            item: item,
            onSavedData(itemId) {
                instance.state.set('editingItem', false);
                instance.state.set('selectedItem', itemId);
                console.log('editItemArgs onSavedData', itemId);

            },
            onCancel() {
                instance.state.set('editingItem', false);

            }

        }
    },

    createItemArgs() {
        const instance = Template.instance();

        return {
            item: {
                name: instance.state.get('creatingItem')
            },
            // person,
            onSavedData(newItem) {
                instance.state.set('creatingItem', false);
                instance.state.set('selectedItem', newItem);

            },
            onCancel() {
                instance.state.set('creatingItem', false);

            }
        }
    },







});
//vvvvvvvvvvvvvv STATE vvvvvvvvvvvvvv
Template.Cars_panel.helpers({
    editingVendorRel() {
        const instance = Template.instance();
        return instance.state.get('editingVendorRel');
    },
    editingItem() {
        const instance = Template.instance();
        return instance.state.get('editingItem');
    },

    selectedItem() {
        const instance = Template.instance();
        return instance.state.get('selectedItem');
    },
    creatingItem() {
        const instance = Template.instance();
        return instance.state.get('creatingItem');
    },
    itemCreated() {
        const instance = Template.instance();
        return instance.state.get('itemCreated');
    },
    creatingItem() {
        const instance = Template.instance();
        return instance.state.get('creatingItem');
    }


});
//vvvvvvvvvvvvvv HELPERS vvvvvvvvvvvvvv
Template.Cars_panel.helpers({

});

Template.Cars_panel.events({
    'click .js-deselect-item': function(e, instance) {
        instance.state.set('selectedItem', false);
    },

    'click .js-item-edit': function(e, instance) {
        instance.state.set('editingItem', true);
    },
    'click .js-contact-create': function(e, instance) {
        instance.state.set('creatingItem', true);
    },
    'click .js-place-create': function(e, instance) {
        instance.state.set('creatingPlace', true);
    },
    'click .js-confirm-deletion': function(e, instance) {
        const relId = instance.state.get('deletingItemRel');
        console.log('delete confirmed ', relId);

    },
    'click .js-cancel-deletion': function(e, instance) {
        instance.data.onEdit(instance.data.relId);
    }
});
