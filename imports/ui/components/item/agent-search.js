// import {Index, MinimongoEngine } from 'meteor/easy:search'
import './agent-search.html'

Template.Agent_search.onCreated(function() {
    // Meteor.call("agents.insert", {DocNumber:"13668992", FirstName:"Silvia"})
  this.autorun(() => {
    let itemsSubscription = this.subscribe('agents.all');
  });

});
Template.Agent_search.helpers({
    agentSearchIndexAttributes: function() {
        return {
            'id': 'search-input',
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': " Sin puntos",
            'style': "text-transform:uppercase"
        };
    },
    agentSearchIndex: function() {
        // const instance = Template.instance();
        return AgentsIndex;
    },
    insertedText: function() {
        const instance = Template.instance();
        const index = instance.data.index;
        let dict = index.getComponentDict();
        return dict.get('searchDefinition')
            .toUpperCase();
    }
    ,agents: function() {
        return Agents.find()
    }
});

Template.Agent_search.events({
    // 'keyup #DocNumberInput': function(event) {
    //     console.log(event.target.value);
    // }
    // 'submit #search-agent': function(event, instance) {
    //     event.preventDefault()
    //     instance.data.searchedDoc(event.target.docnumber.value)
    //     console.log(event.target.docnumber.value);
    // }
    'click .js-search-result-item': function(e, instance) {
        e.preventDefault()
        //console.log("id elegido ", );
        instance.data.selectedItem(e.target.id);

    },
    'click .js-create-item': function(e, instance) {
        const index = instance.data.index;
        console.log(index);
        let dict = index.getComponentDict();
        console.log(dict);
        let insertedText = dict.get('searchDefinition')
            .toUpperCase();
            instance.data.itemNotFound(insertedText);

    }
});
