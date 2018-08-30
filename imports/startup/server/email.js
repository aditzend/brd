import Papa from 'papaparse';
import moment from 'moment/moment';


import path from 'path';
let fs = require('fs');
let Client = require('ftp');
let base = path.resolve('.');

console.log('BASE PATH :', base);
let c = new Client();
const connectionProperties = {
    host: Meteor.settings.ftp.host,
    user: Meteor.settings.ftp.user,
    password: Meteor.settings.ftp.password
};





Meteor.methods({
    'createCSVReport'() {
        c.on('ready', Meteor.bindEnvironment(() => {

            const orders = Orders.find({type:'validation_finished'},{$sort:{createdAt:-1}});
            let arr = [];
            orders.map((o) => {
                let matrix = ""
                if (o.passed == "true") {
                    if (o.isCorrect) {
                        matrix = "VERDADERO POSITIVO"
                    } else {
                        matrix = "FALSO POSITIVO"
                    }
                } else {
                    if (o.isCorrect) {
                        matrix = "VERDADERO NEGATIVO"
                    } else {
                        matrix = "FALSO NEGATIVO"
                    }
                }
                arr.push([
                    o.type,
                    o.user.split("-")[0],
                    String(o.ani),
                    o.score,
                    matrix,
                    o.callID,
                    o.audio,
                    o.createdAt.split("T")[0],
                    moment(o.createdAt).format("h:mm:ss a")
                ])
            })
            let csv = Papa.unparse({
                fields: [
                    'Tipo',
                    'DNI',
                    'Tel',
                    'Score',
                    'Resultado',
                    'ID Llamada',
                    'Audio',
                    'Date',
                    'Time'
                ],
                data: arr
            });
            let localFile = base + '/reporte.csv';
            fs.writeFile(localFile, csv, (err) => {
                if (err) throw err;
            });
        
            let destinyFile = 'no-tocar.csv';

            c.put(localFile, destinyFile, function (err) {
                if (err) throw err;
                console.log('csv uploaded');
                c.end();
            });
        }));
        c.connect(connectionProperties);
    },
    'updateEmailFile'() {
        c.on('ready', Meteor.bindEnvironment(() => {

            const emails = Cars.find();
            let arr = [];
            emails.map((car) => arr.push([car.carOwner.givenName, car.carOwner.email]));
            let csv = Papa.unparse({
                fields: ['Nombre', 'Email'],
                data: arr
            });
            let localFile = base + '/gts.csv';
            fs.writeFile(localFile, csv, (err) => {
                if (err) throw err;
            });
            let destinyFile = 'local-mails-gtsystem.csv';

            c.put(localFile, destinyFile, function (err) {
                if (err) throw err;
                console.log('csv uploaded');
                c.end();
            });
        }));
        c.connect(connectionProperties);
    },
    'updateLubritodoSalesFile' () {
        console.log('updating lubritodo sales file')
        c.on('ready', Meteor.bindEnvironment(() => {

            const sales = Sales.find({owner: "Gomatodo"});
            let arr = [];
            sales.map((sale) => arr.push([sale._id,
                                        sale.car.id,
                                         sale.family.id,
                                        sale.family.name,
                                        sale.dueDate,
                                        sale.createdAt,
                                        sale.owner,
                                        sale.status,
                                        sale.author
                                        ]));
            let csv = Papa.unparse({
                fields: ['_id',
                         'car.id',
                          'family.id', 
                          'family.name', 
                          'dueDate',
                           'createdAt', 
                           'owner',
                            'status',
                         'author'],
                data: arr
            });
            let localFile = base + '/localLubritodoSales.csv';
            fs.writeFile(localFile, csv, (err) => {
                if (err) throw err;
            });
            let destinyFile = 'local-sales-lubritodo-gtsystem.csv';

            c.put(localFile, destinyFile, function (err) {
                if (err) throw err;
                console.log('csv uploaded');
                c.end();
            });
        }));
        c.connect(connectionProperties);
    }

});






