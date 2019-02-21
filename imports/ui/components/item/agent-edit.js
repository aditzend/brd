import './agent-edit.html';

Template.Agent_edit.onCreated(function () {
    console.log("data en agent edit ", this.data);
    this.autorun(() => {
        this.subscribe("agents.all")
    });
});

Template.Agent_edit.onRendered(function () {
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
                },
                Email: {
                    required: true,
                    email: true
                },
                FirstName: {
                    required: true,
                },
                LastName: {
                    required: true,
                },
                birthdate: {
                    date: true
                },
                Phone: {
                    digits: true,
                    minlength: 8,
                    maxlength: 16
                },
                FourDigitPin: {
                    digits: true,
                    minlength: 4,
                    maxlength: 4
                },
                FourDigitPinConfirmation: {
                    equalTo: "#FourDigitPin"
                }
            },
            messages: {
                Email: {
                    required: 'Falta completar email!',
                    email: 'Este no es un email válido!'
                },
                DocNumber: {
                    required: 'Falta completar el documento',
                },
                FirstName: {
                    required: 'Falta completar el nombre',
                },
                LastName: {
                    required: 'Falta completar el apellido',
                },
                Phone: {
                    digits: 'Sólo números por favor',
                    minlength: 'Mínimo 8 números',
                    maxlength: 'Máximo 4 números'
                },
                FourDigitPin: {
                    minlength: 'Mínimo 4 números',
                    maxlength: 'Máximo 4 números',
                    digits: 'Sólo números por favor'
                },
                FourDigitPinConfirmation: {
                    equalTo: 'Los PINs no coinciden'
                }
            },
            showErrors: function (errorMap, errorList) {
                console.log('form has errors')
                instance.$("#agent-edit-summary")
                    .html("El formulario tiene errores (" +
                        this.numberOfInvalids() +
                        ")");
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
                let IsBlocked = instance.$('#IsBlocked').is(':checked')?1:0
                let FourDigitPin = instance.$('#FourDigitPin').val()
                if (agent._id == undefined) {
                    console.log("INSERTING...");
                    const data = {
                        DocType_ShortName: 'DNI',
                        DocNumber: DocNumber,
                        FirstName: FirstName,
                        LastName: LastName,
                        FourDigitPin: FourDigitPin,
                        isN1: isN1,
                        isN2: isN2,
                        Phone: Phone,
                        Email: Email,
                        IsBlocked: IsBlocked
                    }
                    let newAgentId
                    Meteor.call('agents.insert', data, (err, res) => {
                        if (err) {
                            swal('Error DB', 'Contacte a un administrador', 'error')
                        } else {
                            newAgentId = res
                            instance.data.onSavedData(newAgentId);
                            swal({
                                title: DocNumber + ' creado!',
                                type: "success"
                            });
                        }

                    })

                } else {
                    console.log("UPDATING...");
                    const data = {
                        _id: agent._id,
                        DocNumber: DocNumber,
                        Email: Email,
                        FirstName: FirstName,
                        LastName: LastName,
                        Phone: Phone,
                        isN2: isN2,
                        isN1: isN1,
                        FourDigitPin: FourDigitPin,
                        IsBlocked: IsBlocked
                    }
                    Meteor.call('agents.update', data)
                    instance.data.onSavedData(agent._id);
                    swal({
                        title: FirstName + ' ' + LastName + ' : DATOS GUARDADOS',
                        type: "success"
                    });
                }
                //insert or edit if
            }
            //submit
        });
});

Template.Agent_edit.helpers({
    agent() {
        return Template.instance().data.agent
    },
    checkIfN1() {
        return Template.instance().data.agent.isN1 ? "checked" : ""
    },
    checkIfN2() {
        return Template.instance().data.agent.isN2 ? "checked" : ""
    },
    checkIfIsBlocked(IsBlocked) {
        if(IsBlocked === 1 ) {
            return "checked"
        } else {
            return ""
        }
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
    'click js-save':function(e,instance) {
        e.preventDefault()
    },
    'submit form': function (e, instance) {
        e.preventDefault();

    }

});