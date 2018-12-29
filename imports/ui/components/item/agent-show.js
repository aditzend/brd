import './agent-show.html';
import './agent-edit.js';

Template.Agent_show.onCreated(function() {
    console.log("data en agent show ", this.data);
    this.state = new ReactiveDict();
    this.state.setDefault({
        showingOptionButtons: false,
        expanded: false
    });
    this.autorun(() => {
        this.subscribe("agents.all")
    });
});

Template.Agent_show.helpers({
    agent() {
        return Template.instance().data.agent;
    },
});

Template.Agent_show.events({
    'click .js-show-option-buttons': function(e, instance) {
        // instance.state.set('showingOptionButtons', true);
    },
    'click .js-hide-option-buttons': function(e, instance) {
        // instance.state.set('showingOptionButtons', false);
    },
    'click .js-expand': function(e, instance) {
        // instance.state.set('expanded', true);
    },
    'click .js-compress': function(e, instance) {
        // instance.state.set('expanded', false);


    },
    'click .js-delete': function(e, instance) {
        // instance.data.onDelete(instance.data.item._id);
    },
    'click .js-edit': function(e, instance) {
        // instance.data.onEdit(instance.data.item._id);

    },
    'click .js-delete-purchase':function(evt,ins) {

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
