Orders = new Mongo.Collection('orders');



Orders.before.insert(function (userId, doc) {
    if (doc.type === "call_started") {
        console.log("call started -> ", doc.call_id)
        Meteor.call("call.startStatus", doc.call_id)
    }
    if (doc.type === "call_ended") {
        console.log("call ended -> ", doc.call_id)
        Meteor.call("call.endStatus", doc.call_id)
    }
    // Translation of incoming params
    const reason = doc.reason ? `Reason:${doc.reason} ` : ''
    const intent = doc.intent ? `Intent:${doc.intent} ` : ''

    const user = doc.user ? `BiometricProfile:${doc.user}  ` : ''
    const ani = doc.ani ? `ANI:${doc.ani} ` : '' 
    const audio = doc.audio ? `Audio:${doc.audio} ` : ''
    const userDoc = doc.doc_number ? `Client:${doc.doc_number}  ` : '' // could be an FN1 Agent also

    const agentSimple = doc.agent ? `Agent:${doc.agent} ` : ''
    const agentDocNumber = doc.agent_doc_number ? `Agent:${doc.agent_doc_number}  ` : ''
    const agent = (agentSimple == '') ? agentDocNumber : ''

    const source_version = doc.source_version ? `-${doc.source_version}` : ''
    const source = doc.source ? `Source:${doc.source}${source_version} ` : ''

    const explanation = doc.type.toUpperCase() + ' ' + reason + intent
    const notes = `${userDoc}${user}${ani}${audio}${agent}${source}`

    const callID = doc.call_id ? doc.call_id : 'NO_CALL'


    // Read from settings file
    const clientIP = Meteor.settings.mitrol.ip_mite1x
    const serverIP = Meteor.settings.mitrol.ip_panel


    switch (doc.type) {
        case 'call_started':
            Meteor.call('logs.insert', 'INFO', 3001, explanation, notes, callID, clientIP, serverIP)
            break;
        case 'call_ended':
            Meteor.call('logs.insert', 'INFO', 3002, explanation, notes, callID, clientIP, serverIP)
            break;
        case 'login_success':
            Meteor.call('logs.insert', 'INFO', 3003, explanation, notes, callID, clientIP, serverIP)
            break;
        case 'reenrolment':
            Meteor.call('logs.insert', 'INFO', 3004, explanation, notes, callID, clientIP, serverIP)
            break;
        case 'audio_sample_posted':
            Meteor.call('logs.insert', 'INFO', 3005, explanation, notes, callID, clientIP, serverIP)
            break;
        case 'enrolment_full':
            Meteor.call('logs.insert', 'INFO', 3006, explanation, notes, callID, clientIP, serverIP)
            break;
        case 'agent_blocked':
            Meteor.call('logs.insert', 'WARNING', 2001, explanation, notes, callID, clientIP, serverIP)
            break;
        case 'biometric_engine_down':
            Meteor.call('logs.insert', 'ERROR', 1001, explanation, notes, callID, clientIP, serverIP)
            break;
        case 'enrolment_error':
            Meteor.call('logs.insert', 'ERROR', 1100, explanation, notes, callID, clientIP, serverIP)
            break;
        case 'login_error':
            Meteor.call('logs.insert', 'ERROR', 1200, explanation, notes, callID, clientIP, serverIP)
            break;
        case 'name_audio':
            Meteor.call('logs.insert', 'INFO', 3007, explanation, notes, callID, clientIP, serverIP)
            break;
        default:
            Meteor.call('logs.insert', 'INFO', 3999, explanation, notes, callID, clientIP, serverIP)
            console.log('UNEXPECTED LOG ATTEMPT')
    }

    doc.senderIP = Meteor.settings.mitrol.ip_mite1x?Meteor.settings.mitrol.ip_mite1x:''
    doc.receiverIP = Meteor.settings.mitrol.ip_panel?Meteor.settings.mitrol.ip_panel:''
    doc.createdAt = moment()
        .format();
});


// Orders.insert({
//     "type":"validation_finished",
//     "user":"29984695-V10",
//     "dnis":"1160134585",
//     "channel": 1,
//     "score": 98.04,
//     "passed": true,
//     "callID": "2342343434",    
// })