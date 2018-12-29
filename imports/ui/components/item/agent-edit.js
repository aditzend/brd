import './agent-edit.html';

Template.Agent_edit.onCreated(function () {
    console.log("data en agent edit ", this.data);
      this.autorun(() => {
          this.subscribe("agents.all")
      });
});

Template.Agent_edit.onRendered(function () {
    //cargar react form
    const instance = Template.instance();
    const agent = instance.data.agent;
    console.log('on rendered EDIT ITEM >>>>>>', agent);
    instance.$('#DocNumber')
        .val(agent.DocNumber);
    instance.$('[data-action=agent-edit-form]')
        .validate({
            rules: {
                DocNumber: {
                    required: true
                }
                ,Email: {
                    required: true,
                    email: true
                }
                ,FirstName: {
                    required: true,
                }
                ,LastName: {
                    required: true,
                }
                ,birthdate: {
                    date: true
                }
                ,Phone: {
                    digits: true,
                    minlength: 8,
                    maxlength: 16
                }
            },
            messages: {
                Email: {
                    required: 'Falta completar email!'
                    ,email: 'Este no es un email válido!'
                }
                ,DocNumber: {
                    required: 'Falta completar el documento',
                }
                ,FirstName: {
                    required: 'Falta completar el nombre',
                }
                ,LastName: {
                    required: 'Falta completar el apellido',
                }
                ,Phone: {
                    digits: 'Sólo números por favor',
                    minlength: 'minimo 8 numeros',
                    maxlength: 'maximo 16 numeros'
                },
            },
            showErrors: function (errorMap, errorList) {
                console.log('form has errors')
                instance.$("#summary")
                    .html("El formulario tiene errores (" +
                        this.numberOfInvalids() +
                        "), ver detalles en rojo.");
                this.defaultShowErrors();
            },
            submitHandler: function (errorMap, errorList) {
                console.log('form submited')
                // const w = workfor('item-motor-edit.js');
                let DocNumber = instance.$('#DocNumber').val().toUpperCase();
                let FirstName = instance.$('#FirstName').val().toUpperCase();
                let LastName = instance.$('#LastName').val().toUpperCase();
                let Email = instance.$('#Email').val();
                let Phone = instance.$('#Phone').val().toUpperCase();
                let isN1 = instance.$('#isN1').is(':checked')
                let isN2 = instance.$('#isN2').is(':checked')
                if (agent._id == undefined) {
                    console.log("INSERTING...");
                    const newAgentId = Agents.insert({
                         DocNumber: DocNumber
                         , Email: Email
                         , FirstName: FirstName
                         , LastName: LastName
                         , Phone: Phone
                         ,isN2:isN2
                         ,isN1:isN1
                    });
                    instance.data.onSavedData(newAgentId);
                    swal({
                        title: DocNumber + ' creado!',
                        type: "success"
                    });
                } else {
                    console.log("UPDATING...");
                    Agents.update({
                        _id: agent._id
                    }, {
                        $set: {
                            DocNumber:DocNumber
                            ,Email:Email
                            ,FirstName:FirstName
                            ,LastName:LastName
                            ,Phone:Phone
                            , isN2: isN2
                            , isN1: isN1
                        }
                    });
                    instance.data.onSavedData(agent._id);
                    swal({
                        title: FirstName + ' ' + LastName + ' : Ingreso Correcto',
                        type: "success"
                    });
                }
                //insert or edit if
            }
            //submit
        });
});

Template.Agent_edit.helpers({
    calandra() {
        return {FirstName:"Silvina"};
    }
    ,foo() {
        return Template.instance().data.foo
    }
    ,agent() {
        return Template.instance().data.agent
    }
    ,checkIfN1() {
        return Template.instance().data.agent.isN1?"checked":""
    }
    , checkIfN2() {
        return Template.instance().data.agent.isN2 ? "checked" : ""
    }
});

Template.Agent_edit.events({


    'click .js-cancel': function (e, instance) {
        this.onCancel(true);
        swal({
            title: 'Cancelado',
            text: 'Los cambios no se guardaron',
            type: 'warning'
        });
    },

    'submit form': function (e, instance) {
        e.preventDefault();

    }

});
