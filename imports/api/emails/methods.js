// import { Email } from 'meteor/email';
// import { Mailgun } from 'meteor/risul:mailgun';



Meteor.methods({
    sendEmail: function() {
        console.log("sending email")
        const mailjet = require("node-mailjet")
            .connect(Meteor.settings.mailjet.public, Meteor.settings.mailjet.private)
        // const body = EmailGenerator.generateHtml("billing", emailData);
    }
})
