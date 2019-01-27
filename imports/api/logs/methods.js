const sql = require('mssql')
const mssqlConfig = Meteor.settings.mssqlConfig

Meteor.methods({
    'logs.insert'(label, code, explanation, notes, callID, clientIP, serverIP) {
        // Inserting to MongoDB
        Logs.insert({
            label:label
            ,code:code
            ,explanation:explanation
            ,notes:notes
            ,callID:callID
            ,clientIP:clientIP
            ,serverIP:serverIP
        })
        // Inserting to sql server
        sql.close()
        const query = `exec CreateLog
            @Label
            ,@Code
            ,@Explanation
            ,@Notes
            ,@CallID
            ,@ClientIP
            ,@ServerIP`
        sql.connect(mssqlConfig).then(pool => {
            return pool.request()
                .input('Label', sql.VarChar(12), label)
                .input('Code', sql.SmallInt, code)
                .input('Explanation', sql.VarChar(40), explanation)
                .input('Notes', sql.Text, notes)
                .input('CallID', sql.VarChar(127), callID)
                .input('ClientIP', sql.VarChar(30), clientIP)
                .input('ServerIP', sql.VarChar(30), serverIP)
                .query(query)
        }).then(result => console.log('event logged to Log Table', result))
        .catch(err => console.log('ERROR LOGGIN TO SQL SERVER', err))
    }
})