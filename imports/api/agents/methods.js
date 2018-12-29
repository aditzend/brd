import {
    check
} from 'meteor/check';

Meteor.methods({
    'agents.insert' (data) {
        check(data,Object)
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized')
        }
        Agents.insert({
            DocNumber : data.DocNumber
            ,DocType: data.DocType
            ,FirstName : data.FirstName
            ,LastName: data.LastName
            ,BiometricProfile: data.BiometricProfile
            ,FourDigitPin: data.FourDigitPin
            ,IsBlocked: data.IsBlocked
            ,Notes: data.Notes
            ,Clearance: data.Clearance
        })
        console.log('agent inserted!')
    }
})