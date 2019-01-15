//server


import './email.js';
import './excel.js';
import './register-api.js';
// import './connection.js';
// import './importer.js';

// EmailGenerator = {};
// 
// EmailGenerator.addTemplates = function(templates) {
//     templates.forEach(function(template) {
//         SSR.compileTemplate(template.name, Assets.getText(template.path));
//     });
// }
// 
// EmailGenerator.generateHtml = function(templateName, data) {
//     var html = null;
//     try {
//         html = SSR.render(templateName, data);
//     } catch (err) {
//         console.log("meteor-template-email: Unable to generate html, err:", err);
//     }
//     return html;
// }



Meteor.startup(function() {
    // new LoggerFile(LoggerInstance, {path: '/var/log/meteor'})
    // Meteor.call("importSql");
    // process.env.MAIL_URL = Meteor.settings.smtp;
    // process.env.ixDbPass = Meteor.settings.ixDbPass;
    // const sauserid = Meteor.settings.serabey_sauserid;
    // console.log("sauserid", sauserid);

    // 
    // var templates = [];
    // templates.push({
    //     name: "emailTemplate",
    //     path: "email-template.html"
    // }, {
    //     name: "billing",
    //     path: "billing.html"
    // });

    // Meteor.users.update({
    //     //  _id: 'BumHS86dXhoAgH7io'
    //     _id: Meteor.settings.serabey_sauserid
    // 
    // 
    // }, {
    //     $set: {
    //         isSuperAdmin: true
    //     }
    // });

    // 
    // EmailGenerator.addTemplates(templates);
    // 
    // var smtp = {
    //     username: Meteor.settings.mailgun_login,
    //     password: Meteor.settings.mailgun_password,
    //     server: Meteor.settings.mailgun_hostname,
    //     port: 25
    // };
    // 
    // process.env.MAIL_URL = "smtp://" + encodeURIComponent(smtp.username) +
    //     ":" +
    //     encodeURIComponent(smtp.password) + "@" + encodeURIComponent(smtp.server) +
    //     ":" + smtp.port;

    //process.env.MAIL_URL = "smtp://pross888@gmail.com:Lkjpoi098---M@smtp.mailgun.org:25";


});
