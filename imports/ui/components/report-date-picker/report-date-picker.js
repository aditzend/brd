import './report-date-picker.html';

Template.Report_date_picker.onCreated(function () {
    // Session.set('REPORT_BEGINNING_DATE', moment().startOf('day').format())
    // Session.set('REPORT_DATES_EXPLANATION', 'Mostrando resultados de hoy')
    this.state = new ReactiveDict()
    this.state.setDefault({
        showingForm: false
    })
})

Template.Report_date_picker.helpers({
    reportDatesExplanation() {
        return Session.get('REPORT_DATES_EXPLANATION')
    },
    showingForm() {
        const instance = Template.instance()
        return instance.state.get('showingForm')
    }
});

Template.Report_date_picker.events({
    'click .js-set-1hr': function (e, instance) {
        Session.set('REPORT_BEGINNING_DATE', moment().subtract(1, 'hour').format())
        Session.set('REPORT_ENDING_DATE', null)
        Session.set('REPORT_DATES_EXPLANATION', 'Mostrando resultados desde hace una hora')
        instance.state.set('showingForm', false)

    },
    'click .js-set-today': function (e, instance) {
        Session.set('REPORT_BEGINNING_DATE', moment().startOf('day').format())
        Session.set('REPORT_ENDING_DATE', null)
        Session.set('REPORT_DATES_EXPLANATION', 'Mostrando resultados de hoy')
        instance.state.set('showingForm', false)
    },
    'click .js-set-week': function (e, instance) {
        Session.set('REPORT_BEGINNING_DATE', moment().startOf('week').format())
        Session.set('REPORT_ENDING_DATE', null)
        Session.set('REPORT_DATES_EXPLANATION', 'Mostrando resultados de esta semana')
        instance.state.set('showingForm', false)

    },
    'click .js-set-month': function (e, instance) {
        Session.set('REPORT_BEGINNING_DATE', moment().startOf('month').format())
        Session.set('REPORT_ENDING_DATE', null)
        Session.set('REPORT_DATES_EXPLANATION', 'Mostrando resultados de este mes')
        instance.state.set('showingForm', false)

    },
    'click .js-set-all': function (e, instance) {
        Session.set('REPORT_BEGINNING_DATE', '1900-01-07T00:00:00-03:00')
        Session.set('REPORT_ENDING_DATE', null)
        Session.set('REPORT_DATES_EXPLANATION', 'Mostrando todos los resultados')
        instance.state.set('showingForm', false)

    },
    'click .js-show-form': function (e, instance) {
        instance.state.set('showingForm', true)
        Meteor.setTimeout(() => {
            $('#ReportStartDate').val(Session.get('REPORT_BEGINNING_DATE'))
            if (Session.get('REPORT_ENDING_DATE') == null) {
                $('#ReportEndDate').val(moment().format('YYYY-MM-DD'))
            } else {
                $('#ReportEndDate').val(moment(Session.get('REPORT_ENDING_DATE')).format())
            }
            // FORM START
            instance.$('[data-action=set-report-dates]')
                .validate({
                    rules: {
                        ReportStartDate: {
                            date: true,
                            max: moment().subtract(1, 'day').format('YYYY-MM-DD')
                        },
                        ReportEndDate: {
                            date: true,
                            max: moment().format('YYYY-MM-DD')
                        }
                    },
                    messages: {
                        ReportStartDate: {
                            date: 'Seleccionar fecha de inicio',
                            max: "Fecha de ayer como máximo"
                        },
                        ReportEndDate: {
                            date: 'Seleccionar fecha de finalización',
                            max: "Fecha de hoy como máximo"
                        }
                    },
                    showErrors: function (errorMap, errorList) {
                        instance.$("#summary")
                            .html(
                                this.numberOfInvalids() +
                                " errores");
                        this.defaultShowErrors();
                    },
                    submitHandler: function (errorMap, errorList) {
                        const start = $('#ReportStartDate').val()
                        const end = $('#ReportEndDate').val()
                        console.log(start);
                        if (start == undefined || start == '' || start == null) {
                            swal('Error', 'Debe seleccionar una fecha de inicio', 'error')
                        } else {
                            Session.set('REPORT_BEGINNING_DATE', moment(start).format() )
                            Session.set('REPORT_ENDING_DATE', moment(end).hour(23).minutes(59).seconds(59).format() )
                            Session.set('REPORT_DATES_EXPLANATION', `Mostrando resultados desde el ${moment(start).format('D/MM/YY')} hasta el ${moment(end).format('D/MM/YY')}`)
                            instance.state.set('showingForm', false)
                        }

                    }
                });
            // FORM END
        }, 200)
    },
    'click .js-hide-form': function (e, instance) {
        instance.state.set('showingForm', false)
    }
})