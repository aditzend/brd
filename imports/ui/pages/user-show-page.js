// INTERNAL MODULES
import '../components/user/user-edit'
import '../components/user/user-show'

// TEMPLATES
import './user-show-page.html';

Template.User_show_page.onCreated(function() {
  this.autorun( () => {

    // const w = workfor('autorun at orders-show-page.js');

    this.subscribe('Orders.all');
  });
});



Template.User_show_page.helpers({
  isChecked(id) {
    return Orders.findOne({_id: id}).isCorrect
  },
  user() {
    return FlowRouter.getParam('_id')
  },
  countValidationAttempts(user) {
    return Orders.find({type:'validation_finished', user:user}).count();
  },
  validationAttempts(user) {
    return Orders.find({type:'validation_finished', user:user},{sort:{createdAt: -1}})
  },
  countValidationsAccepted(user) {
    return Orders.find({type:'validation_finished', passed:"true", user:user}).count();
  },
  validationsAccepted(user) {
    return Orders.find({type:'validation_finished', passed:"true", user:user},{sort:{createdAt: -1}})
  },
  countValidationsRejected(user) {
    return Orders.find({type:'validation_finished', passed:"false", user:user}).count();
  },
  validationsRejected(user) {
    return Orders.find({type:'validation_finished', passed:"false", user:user},{sort:{createdAt: -1}})
  },
  countSignatureAttempts(user) {
    return Orders.find({type:'signature_failed', user:user}).count();
  },
  signatureAttempts(user) {
    return Orders.find({type:'signature_failed', user:user},{sort:{createdAt: -1}})
  },
  countInfractions(user) {
    return Orders.find({type:'validation_violated', user:user}).count();
  },
  infractions(user) {
    return Orders.find({type:'validation_violated', user:user},{sort:{createdAt: -1}})
  },

});

Template.User_show_page.events({
  'click .js-edit-user': (e, instance) => {
    console.log('open form to edit');
  }
  ,'click .change-correctness': (evt, instance) => {
    console.log(`Value: ${evt.target.checked} OrderID : ${evt.target.id}`)
    Meteor.call('changeCorrectness', evt.target.id, evt.target.checked)
  },
  'click .js-copy-audio': (e, i) => {
    console.log(e.target.id)
    swal({
      title: "Audio Data",
      text: `Archivo de audio:   ${e.target.dataset.file}`,
      type: "info",
      showCancelButton: false,
      confirmButtonColor: "green",
      confirmButtonText: "OK",
      closeOnConfirm: true,
    });
  },
  'click .js-show-time': (e, i) => console.log(moment(e.target.id).add(3, 'hours').format('[DIA: ] dddd [HORA: ] h:mm:ss a'))
})
