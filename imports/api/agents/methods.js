import {
    check
} from 'meteor/check';

const sql = require('mssql')
const mssqlConfig = Meteor.settings.mssqlConfig
    

// const insertClearance = function ( ShortName, LongName ) {
//     return new Promise ( function (resolve, reject) {
//         sql.close()
//         sql.connect(mssqlConfig).then( pool => {
//             return pool.request()
//                 .input('ShortName', sql.VarChar(6), ShortName)
//                 .input('LongName', sql.VarChar(60), LongName)
//                 .query('EXEC AddClearance @ShortName, @LongName')
//         }).then(result => resolve(result))
//         .catch(err => console.log(err))
//     })
// }

// console.log('bef');
// const lookupAgent = function( DocNumber) {
//     return new Promise ( (resolve, reject) => {
//         sql.close()
//         const query = `EXEC LookupAgent3 @DocNumber`
//         sql.connect(mssqlConfig).then(pool => {
//             return pool.request().input('DocNumber', sql.VarChar(12), DocNumber).query(query)
//             .then( result => resolve(result.recordset[0].AgentID))
//             .catch(err => {
//                 console.log('problems with the query', err)
//                 resolve({ success: false, message: err.originalError.info.message })
//             })
//         })
//     })
// }



const createAgent = function(DocNumber, DocType_ShortName, FirstName, LastName, FourDigitPin ,Notes) {
    return new Promise ( (resolve, reject) => {
        sql.close()
        const query = `EXEC CreateAgent
            @DocNumber
            ,@DocType_ShortName
            ,@FirstName
            ,@LastName
            ,@FourDigitPin
            ,@Notes
        `
        sql.connect(mssqlConfig).then(pool => {
                return pool.request()
                    .input('DocNumber', sql.VarChar(12), DocNumber)
                    .input('DocType_ShortName', sql.VarChar(10), DocType_ShortName)
                    .input('FirstName', sql.VarChar(50), FirstName)
                    .input('LastName', sql.VarChar(50), LastName)
                    .input('FourDigitPin', sql.VarChar(255), FourDigitPin)
                    .input('Notes', Notes)
                    .query(query)
            }).then(result => resolve({success: true, message: result}))
            .catch(err => {
                console.log('ERROR CREATING AGENT ==>', err)
                resolve({success: false, message: err.originalError.info.message})
            })
        // sql.on('error', err => console.log(err) )
    })
    
} 

const grantClearance = function(AgentID, Clearance_ShortName) {
    return new Promise ( (resolve, reject) => {
        sql.close()
        const query = `EXEC GrantClearance @AgentID, @Clearance_ShortName`
        sql.connect(mssqlConfig).then(pool => {
            return pool.request().input('AgentID', sql.Int,AgentID).input('Clearance_ShortName', sql.VarChar(6), Clearance_ShortName).query(query)
        }).then(result => resolve({success: true, message: result}))
        .catch(err => {
            console.log('problems granting clearance', err)
            resolve({sucess: false, message: err.originalError.info.message})
        })
    })
}
const removeClearance = function(DocNumber, Clearance_ShortName) {
    return new Promise ( (resolve, reject) => {
        sql.close()
        const query = `EXEC RemoveClearance @DocNumber, @Clearance_ShortName`
        sql.connect(mssqlConfig).then(pool => {
            return pool.request().input('DocNumber', sql.VarChar(12), DocNumber).input('Clearance_ShortName', sql.VarChar(6), Clearance_ShortName).query(query)
        }).then(result => resolve({success: true, message: result}))
        .catch(err => {
            console.log('problems removing clearance', err)
            resolve({sucess: false, message: err.originalError.info.message})
        })
    })
}

const deleteAgent = function(DocNumber) {
    return new Promise( (resolve,reject) => {
        sql.close()
        const query = `EXEC DeleteAgent @DocNumber`
        sql.connect(mssqlConfig).then(pool => {
            return pool.request().input('DocNumber', sql.VarChar(12), DocNumber).query(query)
        }).then(result => resolve({success: true, message: result}))
        .catch(err => {
            console.log('problems deleting Agent', err)
            resolve({success: false, message: err.originalError.info.message})
        })
    })
}

const updateAgent = function(AgentID, DocNumber, FirstName, LastName, FourDigitPin, Notes) {
    return new Promise ( (resolve, reject) => {
        sql.close()
        const query = `EXEC UpdateAgent 
                        @AgentID
                        ,@DocNumber
                        ,@FirstName
                        ,@LastName
                        ,@FourDigitPin
                        ,@Notes
                        `
        sql.connect(mssqlConfig).then(pool => {
            return pool.request()
            .input('AgentID', sql.Int, AgentID)
            .input('DocNumber', sql.VarChar(12), DocNumber)
            .input('FirstName', sql.VarChar(50), FirstName)
            .input('LastName', sql.VarChar(50), LastName)
            .input('FourDigitPin', sql.VarChar(255), FourDigitPin)
            .input('Notes', sql.Text, Notes)
            .query(query)
        }).then(result => resolve({success: true, message: result}))
        .catch(err => {
            console.log('ERROR UPDATING AGENT ==> ', err)
            resolve({success: false, message: err.originalError.info.message});
        })
    })
}


// console.log('-------',insertAgent("Agent") );
// console.log('------- createFN1', Promise.await( createFN1('123234123', 'DNI', 'Alex9', 'Ditzend', 'Test de Panel') ) );

    

const showAgents = async () => {
    try {
        await sql.connect('mssql://mituser:mitcall@193.168.43.254/NSSA_BIOMETRICS_PILOT')
        const result = await sql.query`select * from Agent`
        console.dir(result)
    }
    catch (err) {
        console.log('error mssql', err)
    }
}


Meteor.methods({
    'maka' (str) {
        check(str, String)
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized')
        }
        console.log("MAKA METHOD ---> ");
        return str
    }
    ,'agents.insert' (data) {
        check(data,Object)
        if (!Meteor.userId()) {
        console.log('1 -agents.insert NOT LOGGED IN...');

            throw new Meteor.Error('not-authorized')
        }
        let sqlAgentInsert = Promise.await(createAgent(
            data.DocNumber
            ,data.DocType_ShortName
            ,data.FirstName
            ,data.LastName
            , 'e7df7cd2ca07f4f1ab415d457a6e1c13'
            ,'Panel'
        ))
        console.log('2 -  agents.insert...');

        const AgentID = sqlAgentInsert.message.recordset && sqlAgentInsert.message.recordset[0].AgentID
        console.log('✅  AGENT CREATED IN SQL SERVER ==> AgentID = ', AgentID);
        console.log('3 -  agents.insert...');

        if (sqlAgentInsert.success) {
        console.log('4 -  agents.insert...');

            if (data.isN1) {
                let n1 = Promise.await(grantClearance(AgentID, 'FN1'))
                console.log('agent is FN1', n1);
            }
            if (data.isN2) {
                let n2 = Promise.await(grantClearance(AgentID, 'FN2'))
                console.log('agent is FN2', n2);
            }
        console.log('5 -  agents.insert...');

             let newAgentId = Agents.insert({
                 AgentID: AgentID,
                 DocNumber: data.DocNumber,
                 DocType_ShortName: data.DocType_ShortName,
                 FirstName: data.FirstName,
                 LastName: data.LastName,
                 BiometricProfile: data.BiometricProfile,
                 FourDigitPin: data.FourDigitPin,
                 IsBlocked: data.IsBlocked,
                 Notes: data.Notes,
                 isN1: data.isN1,
                 isN2: data.isN2,
                 Phone: data.Phone,
                 Email: data.Email
             })
        console.log('6 -  agents.insert...');

        console.log('✅  AGENT INSERTED IN Agents COLLECTION ==> agent._id = ', newAgentId);
             return newAgentId
        } else {
        console.log('7 -  agents.insert...');

            return 'SQL ERROR'
        }
       
    }
    ,'agents.delete' (id) {
        check(id, String)
        if (!Meteor.userId()) {
            throw new Meteor.Error('not authorized')
        }
        let Agent = Agents.findOne(id)
        let sqlAgentDelete = Promise.await(deleteAgent(Agent.DocNumber))
        if (sqlAgentDelete.success) {
            Agents.remove(id)
            return true
        } else {
            return false
        }
    }
    ,'agents.update' (data) {
         check(data, Object)
         if (!Meteor.userId()) {
             throw new Meteor.Error('not authorized')
         }
         let Agent = Agents.findOne(data._id)
         let sqlAgentUpdate = Promise.await(
             updateAgent(
                 Agent.AgentID
                 ,data.DocNumber
                 ,data.FirstName
                 ,data.LastName
                 ,'e7df7cd2ca07f4f1ab415d457a6e1c13'
                 ,data.Notes))
         console.log('AGENT SUCCESSFULLY UPDATED IN MSSQL ==> ', sqlAgentUpdate);
          if (sqlAgentUpdate.success) {
               if (!data.isN1) {
                   let n1 = Promise.await(removeClearance(Agent.DocNumber, 'FN1'))
                   console.log('AGENT HAS BEEN REVOKED CLEARANCE FN1 ==> ', n1);
               } else {
                   let n1 = Promise.await(grantClearance(Agent.AgentID, 'FN1'))
                   console.log('AGENT HAS BEEN GRANTED CLEARANCE FN1 ==> ', n1);
               }
               if (!data.isN2) {
                   let n2 = Promise.await(removeClearance(Agent.DocNumber, 'FN2'))
                   console.log('AGENT HAS BEEN REVOKED CLEARANCE FN2 ==> ', n2);
               } else {
                        let n2 = Promise.await(grantClearance(Agent.AgentID, 'FN2'))
                        console.log('AGENT HAS BEEN GRANTED CLEARANCE FN2 ==> ', n2);
               }
                Agents.update({
                    _id: data._id
                }, {
                    $set: {
                        DocNumber: data.DocNumber,
                        Email: data.Email,
                        FirstName: data.FirstName,
                        LastName: data.LastName,
                        Phone: data.Phone,
                        isN2: data.isN2,
                        isN1: data.isN1,
                        FourDigitPin: data.FourDigitPin
                    }
                });
              return true
          } else {
              return false
          }
    }
})