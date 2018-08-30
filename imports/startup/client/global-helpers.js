
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
  return userV.split("-")[0]
});

Template.registerHelper("appname", function() {
  return "<img src='/logos/logo-mitrol.png'/>"
});
Template.registerHelper("logo", function() {
  const company = workfor('logo helper at global-helpers');
  // return (company)? company.logo : false;
  return 'logos/logothesa.png';
});
Template.registerHelper("timeFromCreation", function(createdAt) {
  return moment(createdAt).fromNow();
});
Template.registerHelper("timeFromOrderCreation", function(createdAt) {
  return moment(createdAt).format('dd hh:mm:ss a')
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
