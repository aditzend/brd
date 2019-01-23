import Papa from 'papaparse'
import XLSX from 'xlsx'
import path from 'path'

let fs = require('fs');
let Client = require('ftp');
let base = path.resolve('.');

// console.log('BASE PATH :', base);
let c = new Client();
const connectionProperties = {
    host: Meteor.settings.ftp.host,
    user: Meteor.settings.ftp.user,
    password: Meteor.settings.ftp.password
};





Meteor.methods({
    'excel'() {
        const data = [
            ['a', 'b', 'c'],
            [1, 2, 3]
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'hojitaa');
       
        XLSX.writeFile(wb, 'reporte.xlsb')
        console.log('excel file ready')
    },
    'createExcelReport'() {
        c.on('ready', Meteor.bindEnvironment(() => {

            // const orders = Orders.find({type:'validation_finished'});
            // const orders = {
            //     order: {
            //         type: 'val',
            //         id:1
            //     },
            //     order: {
            //         type: 'val',
            //         id:2
            //     }
            // }
            let arr = [];
            orders.map((o) => arr.push([
                o.type,
                o.user,
                o.ani,
                o.score,
                o.passed,
                o.callID,
                o.audio,
                o.createdAt,
            ]));
            let data = [
                 [
                    'Tipo',
                    'DNI',
                    'Tel',
                    'Score',
                    'Resultado',
                    'ID Llamada',
                    'Audio',
                    'Fecha y Hora',
                ],arr,arr,arr]
        

            //crea el archivo en el path
       

            //escribe el xlsb
            const ws = XLSX.utils.json_to_sheet(orders);
            wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'RESULTADOS MITROL BIOMETRICS')
             XLSX.writeFile(wb, 'reporte_mitrol_biometrics.xlsb')
             console.log('excel file ready')


        }));
        c.connect(connectionProperties);
    },
    'createExcelReport2'() {
        c.on('ready', Meteor.bindEnvironment(() => {

            const orders = Orders.find({type:'validation_finished'});
            let arr = [];
            orders.map((o) => arr.push([
                o.type,
                o.user,
                o.ani,
                o.score,
                o.passed,
                o.callID,
                o.audio,
                o.createdAt,
            ]));
            let data = [
                 [
                    'Tipo',
                    'DNI',
                    'Tel',
                    'Score',
                    'Resultado',
                    'ID Llamada',
                    'Audio',
                    'Fecha y Hora',
                ],arr,arr,arr]
        

            //crea el archivo en el path
       

            //escribe el xlsb
            const ws = XLSX.utils.aoa_to_sheet(data);
            wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'RESULTADOS MITROL BIOMETRICS')
             XLSX.writeFile(wb, 'reporte_mitrol_biometrics.xlsb')
             console.log('excel file ready')


        }));
        c.connect(connectionProperties);
    },
});






