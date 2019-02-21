import './user-edit.html'

Template.User_edit.onCreated(function () {
    console.log("data en user edit ", this.data);
    this.client = new ReactiveDict()
    this.settings = new ReactiveDict()
    const biometricProfile = FlowRouter.getParam('_id')
    Meteor.call('clients.getData', biometricProfile, (err, res) => {
        err && console.log('❌  ', err)
        this.client.set('data', res)
        console.log('result --> ', res);
    })
    this.autorun(() => {
        this.subscribe("Orders.all")
    });
});
Template.User_edit.onRendered(function () {
    const instance = Template.instance();
    console.log('settings ==> ', instance.settings.get('minimum_retirement_age'));
    const user = instance.client;
    Meteor.call('clients.getMinimumRetirementAge', (err, res) => {
        err && console.log(err)
        console.log(res);
        this.settings.set('minimum_retirement_age', res)
        instance.$('[data-action=user-edit-form]')
            .validate({
                rules: {
                    DocNumber: {
                        required: true
                    },
                    FirstName: {
                        required: true,
                    },
                    LastName: {
                        required: true,
                    },
                    DateOfBirth: {
                        date: true,
                        max: moment().subtract(instance.settings.get('minimum_retirement_age'), 'years').format('YYYY-MM-DD')
                    },
                    PhoneNumber: {
                        digits: true,
                        minlength: 8,
                        maxlength: 16
                    },

                },
                messages: {
                    DocNumber: {
                        required: 'Falta completar el documento',
                    },
                    FirstName: {
                        required: 'Falta completar el nombre',
                    },
                    LastName: {
                        required: 'Falta completar el apellido',
                    },
                    PhoneNumber: {
                        digits: 'Sólo números por favor',
                        minlength: 'Mínimo 8 números',
                        maxlength: 'Máximo 16 números'
                    },
                    DateOfBirth: {
                        max: 'Esta persona es demasiado joven'
                    }
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
                    let BiometricProfile = FlowRouter.getParam("_id")
                    let DocNumber = instance.$('#DocNumber').val().toUpperCase();
                    let FirstName = instance.$('#FirstName').val().toUpperCase();
                    let LastName = instance.$('#LastName').val().toUpperCase();
                    let PhoneNumber = instance.$('#PhoneNumber').val().toUpperCase();
                    let DateOfBirth = instance.$('#DateOfBirth').val()
                    let Sex = instance.$('#Sex').val()
                    let Notes = instance.$('#Notes').val().toUpperCase();
                    let EnroledWithOwnPhone = instance.$('#EnroledWithOwnPhone').is(':checked')
                    let IsBlocked = instance.$('#IsBlocked').is(':checked')
                    console.log("UPDATING...");
                    // const data = {
                    //     DocNumber: DocNumber,
                    //     FirstName: FirstName,
                    //     LastName: LastName,
                    //     PhoneNumber: PhoneNumber,
                    //     DateOfBirth: DateOfBirth,
                    //     Sex: Sex,
                    //     Notes: Notes,
                    //     EnroledWithOwnPhone: EnroledWithOwnPhone,
                    //     IsBlocked: IsBlocked
                    // }
                    const data = {
                        BiometricProfile: BiometricProfile,
                        DocNumber: DocNumber,
                        FirstName: FirstName,
                        LastName: LastName,
                        PhoneNumber: PhoneNumber,
                        DateOfBirth: DateOfBirth,
                        Sex: Sex,
                        Notes: Notes,
                        EnroledWithOwnPhone: EnroledWithOwnPhone ? 1 : 0,
                        IsBlocked: IsBlocked ? 1 : 0
                    }
                    console.log('CAPTURED DATA ==> ', data);
                    Meteor.call('clients.update', data, (err, res) => {
                        if (err) {
                            instance.data.onCancel()
                            swal("Error en SQL Server", err, "error")
                        }
                        if (!res.success) {
                            instance.data.onCancel()
                            swal("Error en SQL Server", res.message, "error")
                        }
                        instance.data.onSavedData();
                        // location.reload()

                        // swal(`${FirstName} ${LastName} `, `Datos guardados`, "success")
                    })

                }
                //submit
            });
    })

});

Template.User_edit.helpers({
    Client() {
        return Template.instance().client.get('data')
    },
    checkIfMale(Sex) {
        return Sex === 'M' ? 'selected' : ''
    },
    checkIfFemale(Sex) {
        return Sex === 'F' ? 'selected' : ''
    },
    checkIfEnroledWithOwnPhone(EnroledWithOwnPhone) {
        return EnroledWithOwnPhone ? 'checked' : ''
    }
});

Template.User_edit.events({
    'click .js-cancel': function (e, instance) {
        instance.data.onCancel();
        swal({
            title: 'Cancelado',
            text: 'Los cambios no se guardaron',
            type: 'warning'
        });
    },
    // 'click .js-edit-user': function(e,instance) {
    //     e.preventDefault();
    // },
    'submit form': function (e, instance) {
        e.preventDefault();
        console.log('helper updating');
    }

});