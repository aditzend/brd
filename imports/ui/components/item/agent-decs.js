
import './agent-decs.html';
import './agent-search.js';
import './agent-show.js';
import './agent-edit.js';


Template.Agent_DECS.onCreated(function() {
    this.autorun(() => {
    //   const w = workfor('item motor decs.js');
        // this.subscribe('items.own', w._id);
        this.subscribe('cars.all');
    });

    this.state = new ReactiveDict();
    this.state.setDefault({
        selectedItem: false,
        creatingItem: false,
        editingItem: false,
        itemCreated: false,
        creatingItem: false,
        editingItem: false,
        deletingItem: false,

    });
});

//vvvvvvvvvvvvvv ARGS vvvvvvvvvvvvvv
Template.Agent_DECS.helpers({
    passdata(s) {
        const agent = Agents.findOne(s);

        return {
            foo:"bar"
            ,agent:agent
        }
    }
    ,searchAgentArgs() {
        const instance = Template.instance();

        return {
            //mode: 'product',
            mode: instance.data.mode,
            index: AgentsIndex,
            selectedItem(id) {
                instance.state.set('selectedItem', id);
                console.log("STATE>>>>>>>>>>>>>> SELECTED Item ", id);
            },
            itemNotFound(insertedText) {
                instance.state.set('creatingItem', insertedText);
                console.log("creatingItem", insertedText);

            }
        }
    },
    // showthis() {
    //     return {
    //         foo: 'bar'
    //     }
    // },
    showAgentArgs(selectedItemId) {
        const instance = Template.instance();
        const agent = Agents.findOne(selectedItemId);
        instance.data.selectedItemName(agent.DocNumber);
        // instance.data.selectedItemDesc(item.desc);

        // instance.data.selectedItemProfitCenter(item.profitCenter);

        instance.data.selectedItemId(selectedItemId);

        return {
            agent: agent
            ,foo:"bar"
            ,onEdit(itemId) {
                instance.state.set('editingItem', itemId);
                // console.log('EDIT CONTACT REL ', relId);
            }
            ,onDelete(itemId) {
                instance.state.set('deletingItem', itemId);
                // console.log('DELETE CONTACT REL ', relId);
                swal({
                        title: "Borramos a " + car.plate + ' ?',
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
                            const deleted = Cars.remove(itemId);
                            instance.state.set('selectedItem', false);
                            swal(car.plate + " fue eliminado.", "Se borraron los datos", "success");
                        } else {
                            swal("Eliminación cancelada!", car.plate + " esta segura :)", "error");
                        }
                    });

            }
        }
    }
    ,createAgentArgs() {
        const instance = Template.instance();
        console.log("item name", instance.state.get('creatingItem'));

        return {
            agent: {
                DocNumber: instance.state.get('creatingItem')
            },
            onSavedData(newItem) {
                instance.state.set('creatingItem', false);
                instance.state.set('selectedItem', newItem);

            },
            onCancel() {
                instance.state.set('creatingItem', false);

            }
        }
    }
    ,editAgentArgs(agentId) {
        const instance = Template.instance();
        const agent = Agents.findOne(agentId);
        return {
            agent: agent
            ,onSavedData() {
                // console.log('rel created contact', relId);
                instance.state.set('editingItem', false);
                instance.state.set('creatingItem', false);

            }
            ,onCancel() {
                // console.log('cancel');
                instance.state.set('editingItem', false);
                instance.state.set('creatingItem', false);

            }
        }
    },

});
//vvvvvvvvvvvvvv STATE vvvvvvvvvvvvvv
Template.Agent_DECS.helpers({
  
    editingItem() {
        const instance = Template.instance();
        return instance.state.get('editingItem');
    },

    selectedItem() {
        const instance = Template.instance();
        const item = instance.state.get('selectedItem');
        return item;
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
    },
 
 
});
//vvvvvvvvvvvvvv HELPERS vvvvvvvvvvvvvv
Template.Agent_DECS.helpers({
    rel(item) {
        const rel = Rels.findOne({
            type: 'vendor',
            origin: item,
            destiny: HARDCODE_OWNER
        });
        return rel;
    },
    contactRels(item) {
        const rels = Rels.find({
            type: 'contact',
            // origin: item,
            destiny: item
        });
        return rels;
    },
    placeRels(item) {
        const rels = Rels.find({
            type: 'place',
            // origin: item,
            destiny: item
        });
        return rels;
    }
});

Template.Agent_DECS.events({
    'click .js-deselect-item': function(e, instance) {
        instance.state.set('selectedItem', false);
    },
    'click .js-rel-vendor-edit': function(e, instance) {
        instance.state.set('editingVendorRel', true);
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
    },
    'click .js-delete': function(e, instance) {
        console.log("delete ", e.target.id);
        swal({
            title: "CONFIRMAR ELIMINACIÓN",
            text: "No se puede recuperar esta información!",
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

                    // const deleted = Agents.remove(e.target.id);
                    // TODO determinar el DocNumber
                    const deleted = Meteor.call('agents.delete', e.target.id)
                    console.log('deleted', deleted);


                    swal("ELIMINACIÓN CONFIRMADA", "El registro ya no está disponible", "success");
                } else {
                    swal("ELIMINACIÓN CANCELADA", "El registro sigue disponible", "error");
                }
            });
    },
    'click .js-edit': function(e, instance) {
        console.log("edit ", e.target.id);
        instance.state.set('editingItem', true);
        console.log("editingItem", instance.state);
    }
});
