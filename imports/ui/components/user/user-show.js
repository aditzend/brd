// INTERNAL MODULES
import './user-edit'

// TEMPLATES
import './user-show.html'

Template.User_show.onCreated(function () {
    console.log("data en user show ", this.data)
    this.state = new ReactiveDict()
    this.client = new ReactiveDict()
    this.state.setDefault({
        editing: false,
        showingOptionButtons: true,
        expanded: true
    });
    const biometricProfile = FlowRouter.getParam('_id')

    Meteor.call('clients.getData', biometricProfile, (err, res) => {
        err && console.log('❌  ', err)
        this.client.set('data', res)

        console.log('result of clients.getData --> ', res);
    })
    this.autorun(() => {
    this.subscribe('Orders.all');
    });
});

Template.User_show.helpers({
    Client() {
        return Template.instance().client.get('data')
    }
    ,editing() {
        return Template.instance().state.get('editing')
    }
    ,editArgs() {
        let instance = Template.instance()
        return {
            onSavedData() {
                instance.state.set('editing', false)
            }
            ,onCancel() {
                instance.state.set('editing', false)
            }
        }
    }
    ,showingOptionButtons() {
        return Template.instance().state.get('showingOptionButtons')
    }
    ,expanded() {
        return Template.instance().state.get('expanded')
    }
    ,countValidationsAccepted(user) {
    return Orders.find({type:'validation_finished', passed:"true", user:user}).count();
  },
  countValidationsRejected(user) {
    return Orders.find({type:'validation_finished', passed:"false", user:user}).count();
  },
  countInfractions(user) {
    return Orders.find({type:'validation_violated', user:user}).count();
  }
    
});

Template.User_show.events({
    'click .js-show-option-buttons': function (e, instance) {
        instance.state.set('showingOptionButtons', true);
    },
    'click .js-hide-option-buttons': function (e, instance) {
        instance.state.set('showingOptionButtons', false);
    },
    'click .js-expand': function (e, instance) {
        instance.state.set('expanded', true);
    },
    'click .js-compress': function (e, instance) {
        instance.state.set('expanded', false);


    },
    'click .js-delete': function (e, instance) {
        // instance.data.onDelete(instance.data.item._id);
    },
    'click .js-edit': function (e, instance) {
        instance.state.set('editing', true)
        // instance.data.onEdit(instance.data.item._id);

    },
    'click .js-delete-purchase': function (evt, ins) {

        swal({
                title: "Borramos esta venta ?",
                text: "No se puede recuperar esta informacion!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Sí, borrar!",
                cancelButtonText: "No, cancelar por favor!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    Meteor.call('sales.delete', evt.target.id);
                    swal("Venta eliminada.", "Se borraron los datos", "success");
                } else {
                    swal("Eliminación cancelada!", "La venta esta segura :)", "error");
                }
            });
    }
});
