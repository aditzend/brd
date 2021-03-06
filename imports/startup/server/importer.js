import { Meteor } from 'meteor/meteor';
import { sqlQuery } from "./query.js";
import { conn } from "./connection.js";

import "./processRow.js";


function parseRows(obj) {
    const promise = new Promise (function (resolve, reject) {
        console.log("parsing rows");
        obj.rows.map(function(row) {
            Meteor.call("processRow", row, obj.owner);
        });
        resolve("all parsed");
    });
    return promise;
};

function importSql() {
    console.log('importSql ');
    conn()
    .then(connection => {
        const conn = connection;
        startCreation({ conn: conn, offset: 360, owner: 'GT' }).then(obj => {
            console.log("startCreation finished", obj);
        });
    });
}

function startCreation(connObj) {
    sqlQuery(connObj)
    .then(parseRows)
    .then(d => {
        if (connObj.offset<360) {
            setTimeout(function() {
                const offset = connObj.offset +1;
                const owner = connObj.owner;
                console.log("OFFSET", offset);
                startCreation({"conn":connObj.conn, "offset":offset, "owner":owner});
            }, 1000);
        }
    })
    .then(data => console.log("\n----------------\n"))
    .catch(error => console.log("ERROR", error));
}

Meteor.methods({
    "importSql": importSql
});