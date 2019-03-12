const sql = require('mssql')
const mssqlConfig = Meteor.settings.mssqlConfig

Meteor.methods({
    'logs.insert'(label, code, explanation, notes, callID, sender, receiver) {
        const senderIP = sender?sender:''
        const receiverIP = receiver?receiver:''

        // Inserting to MongoDB
        Logs.insert({
            label:label
            ,code:code
            ,explanation:explanation
            ,notes:notes
            ,callID:callID
            ,senderIP:senderIP 
            ,receiverIP:receiverIP
        })
        // Inserting to sql server
        sql.close()
        const query = `exec CreateLog
            @Label
            ,@Code
            ,@Explanation
            ,@Notes
            ,@CallID
            ,@SenderIP
            ,@ReceiverIP`
        sql.connect(mssqlConfig).then(pool => {
            return pool.request()
                .input('Label', sql.VarChar(12), label)
                .input('Code', sql.SmallInt, code)
                .input('Explanation', sql.VarChar(40), explanation)
                .input('Notes', sql.Text, notes)
                .input('CallID', sql.VarChar(127), callID)
                .input('SenderIP', sql.VarChar(30), senderIP)
                .input('ReceiverIP', sql.VarChar(30), receiverIP)
                .query(query)
        }).then(result => console.log('==> Log'))
        .catch(err => console.log('ERROR LOGING TO SQL SERVER', err))
    }
})