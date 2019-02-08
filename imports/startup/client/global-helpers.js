Template.registerHelper("explain", function(type) {
  switch (type) {
      case "call_started":
        return '<i class="zmdi zmdi-phone-ring text-info"></i> Inicio de llamada';
        break;
      case "call_ended":
        return '<i class="zmdi zmdi-phone-end text-info"></i> Fin de llamada';
        break;
      case "validation_finished":
        return "<i class='zmdi zmdi-gps-dot text-info'></i> Validación finalizada";
        break;
      case "validation_violated":
        return "<i class='zmdi zmdi-alert-triangle text-danger'></i> Infracción";
        break;
      case "enrolment_full":
        return "<i class='zmdi zmdi-check text-success'></i> Enrolamiento exitoso";
        break;
      case "enrolment_error":
        return "<i class='zmdi zmdi-alert-polygon text-warning'></i> Error en el enrolamiento";
        break;
      case "enrolment_finished":
        return "<i class='zmdi zmdi-account-add text-success'></i> Enrolamiento exitoso";
        break;
      case "signature_finished":
        return "Firma exitosa";
        break;
      case "signature_failed":
        return "Firma errónea";
        break;
      default:
        return type;
    }
})
Template.registerHelper("pathFor", function(routeName,params,queryParams){
  const path = FlowRouter.path(routeName, params, queryParams);
  return path;
});

Template.registerHelper('nameGetter', function(id) {
  let c = Companies.findOne(id);
  return c.name;
});
Template.registerHelper("pathForUser", function(id) {
  const params = {
          _id: id
      };
      const queryParams = {
          // state: 'open'
      };
      const routeName = 'showUser';
      const path = FlowRouter.path(routeName, params, queryParams);

      return path;
})
Template.registerHelper("formatDate", function(D, M, Y) {
  return moment([Y, M, D]).format('DD / MM / YYYY');
});
Template.registerHelper("clean", function(userV) {
  return userV.split("-")[2]
});

Template.registerHelper("appName", function() {
  return "<img src='/logos/logo-mitrol.png'/>"
});
Template.registerHelper("logoMitrol", function() {
  return "<img height='90px' src='/logos/logo-mitrol.png'/>"
});
Template.registerHelper("logo", function() {
  const company = workfor('logo helper at global-helpers');
  // return (company)? company.logo : false;
  return 'logos/logothesa.png';
});
Template.registerHelper("timeFromCreation", function(createdAt) {
  return moment(createdAt).fromNow();
});
Template.registerHelper("age", function(createdAt) {
  return moment(createdAt).fromNow(true);
});
Template.registerHelper("sex", function(letter) {
  return letter == "M" ? "<i class='fa fa-male'></i>" : "<i class='fa fa-female'></i>"
});
Template.registerHelper("timeFromOrderCreation", function(createdAt) {
  return moment(createdAt).format('D.MMMYYYY HH:mm:ss')
});

Template.registerHelper("timeForPayment", function(createdAt,plusDays,minusDays) {
  return moment(createdAt).add(plusDays, 'days').subtract(minusDays, 'days').fromNow();
});

Template.registerHelper("formatAsNumber", function(number) {
  return numeral(number).format('0,0');

});


Template.registerHelper("deleting", function() {
  return Session.get('deleting');
});

Template.registerHelper("editing", function() {
  return Session.get('editing');
});

Template.registerHelper("editingId", function(id) {
  return (Session.get('editing') === id) ? true : false;
});

Template.registerHelper("thisId", function() {
  return this._id;
});
Template.registerHelper("relTypeTranslate", function(relType) {
  switch (relType) {
    case 'SUPL':
      return 'CLIENTE';
      break;
    case 'CONT':
      return 'CONTACTO';
      break;
    case 'CUST':
      return 'PROVEEDOR';
    default:
      return '';
      break;
  }

});

Template.registerHelper("getRelType", function() {
  return FlowRouter.getQueryParam('relType');
});

Template.registerHelper("relTypeLink", function(relType) {
  switch (relType) {
    case 'SUPL':
      return 'show-customer';
      break;
    case 'CONT':
      return 'show-contact';
      break;
    default:
      return '';
      break;
  }

});

Template.registerHelper("placeTypeOptions", function() {
  return [{
    label: 'la oficina principal',
    value: 1
  }, {
    label: 'el deposito donde reciben mercaderia',
    value: 2
  }, {
    label: 'donde se retiran pagos',
    value: 3
  }, ];
});
Template.registerHelper("classPlaceTypeOption", function(val) {
  switch (val) {
    case '1':
      return 'fa fa-building';
      break;
    case '2':
      return 'fa fa-cubes';
      break;
    case '3':
      return 'fa fa-credit-card';
      break;
    default:
      return 'fa fa-home';
      break;
  }
});

Template.registerHelper("convertPlaceTypeOption", function(val) {
  switch (val) {
    case '100':
      return "OFICINA PRINCIPAL";
      break;
    case '110':
      return "SUCURSAL";
      break;
    case '200':
      return "LUGAR DE ENTREGA";
      break;
    case '300':
      return "LUGAR DE PAGO";
      break;
    default:
      return "ESPACIO";
      break;
  }
});
Template.registerHelper("countryOptions", function() {
  return [{
    label: 'Argentina',
    value: 'AR'
  }, {
    label: 'Brasil',
    value: 'BR'
  }, {
    label: 'Uruguay',
    value: 'UY'
  }, {
    label: 'Paraguay',
    value: 'PY'
  }, {
    label: 'Chile',
    value: 'CL'
  }, {
    label: 'Bolivia',
    value: 'BO'
  }, {
    label: 'Ecuador',
    value: 'EC'
  }, {
    label: 'Perú',
    value: 'PE'
  }, {
    label: 'Colombia',
    value: 'CO'
  }, {
    label: 'Venezuela',
    value: 'VE'
  }, {
    label: 'Méjico',
    value: 'MX'
  }];

});


Template.registerHelper("getGender", function(isMale) {
  return (isMale === "1") ? true : false;
});

Template.registerHelper("formatInternational", function(phone) {
  const country = Phoneformat.countryForE164Number(phone) || 'AR';
  return Phoneformat.formatInternational(country, phone);
});
Template.registerHelper("phoneCountry", function(phone) {
  return Phoneformat.countryForE164Number(phone) || 'AR';

});

Template.registerHelper("not", function(argument) {
  return !argument;
});
