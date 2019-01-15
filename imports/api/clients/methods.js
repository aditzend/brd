import {
    check
} from 'meteor/check'

const sql = require('mssql')
const mssqlConfig = Meteor.settings.mssqlConfig

const selectClient = function (BiometricProfile) {
    return new Promise((resolve, reject) => {
        sql.close()
        const query = `EXEC GetClient @BiometricProfile`
        sql.connect(mssqlConfig).then(pool => {
                return pool.request()
                    .input('BiometricProfile', sql.VarChar(20), BiometricProfile)
                    .query(query)
            }).then(result => resolve({
                success: true,
                message: result
            }))
            .catch(err => {
                console.log('ERROR SELECTING CLIENT ==> ', err)
                resolve({
                    success: false,
                    message: err.originalError.info.message
                })
            })
    })
}

const getPhoneNumber = function (BiometricProfile) {
    return new Promise((resolve, reject) => {
        sql.close()
        const query = `EXEC GetClientPhoneNumber @BiometricProfile`
        sql.connect(mssqlConfig).then(pool => {
                return pool.request()
                    .input('BiometricProfile', sql.VarChar(20), BiometricProfile)
                    .query(query)
            }).then(result => {
                let phone
                if (!result.recordset[0]) { phone = '0'}
                else {
                    phone = result.recordset[0].PhoneNumber
                }
                resolve({
                    success: true,
                    message: phone
                })
            })
            .catch(err => {
                console.log('ERROR GETTING PHONE ==> ', err)
                resolve({
                    success: false,
                    message: '0'
                })
            })
    })
}

const updateClient = function (data) {
    return new Promise((resolve, reject) => {
        sql.close()
        const query = `EXEC UpdateClient
                             @BiometricProfile
                             ,@DocNumber
                             ,@FirstName
                             ,@LastName
                             ,@Notes
                             ,@EnroledWithOwnPhone
                             ,@IsBlocked
                             ,@PhoneNumber
                             ,@Sex
                             ,@DateOfBirth`

        sql.connect(mssqlConfig).then(pool => {
                return pool.request()
                    .input('BiometricProfile', sql.VarChar(20), data.BiometricProfile)
                    .input('DocNumber', sql.VarChar(12), data.DocNumber)
                    .input('FirstName', sql.VarChar(40), data.FirstName)
                    .input('LastName', sql.VarChar(40), data.LastName)
                    .input('Notes', sql.Text, data.Notes)
                    .input('EnroledWithOwnPhone', sql.Bit, data.EnroledWithOwnPhone)
                    .input('IsBlocked', sql.Bit, data.IsBlocked)
                    .input('PhoneNumber', sql.VarChar(30), data.PhoneNumber)
                    .input('Sex', sql.Char(1), data.Sex)
                    .input('DateOfBirth', sql.Date, data.DateOfBirth)
                    .query(query)
            }).then(result => resolve({
                success: true,
                message: result
            }))
            .catch(err => {
                console.log(' ❌ ERROR UPDATING CLIENT ==> ', err)
                resolve({
                    success: false,
                    message: err.originalError.info.message
                })
            })
    })
}



Meteor.methods({
    'clients.getData'(BiometricProfile) {
        let data = Promise.await(selectClient(BiometricProfile))
        if (!data.success) {
            console.log(`❌ ERROR GETTING CLIENT DATA FROM SQL SERVER FOR 👱: ${BiometricProfile}  ==> `, data.message);
            return null
        }
        console.log(`✅  SQL DATA OF 👱: ${BiometricProfile}  ==>  `, data.message.recordset[0]);
        return data.message.recordset[0]
    },
    'clients.getMinimumRetirementAge'() {
        return Meteor.settings.client.minimum_retirement_age
    },
    'clients.update'(data) {
        check(data, Object)
        return Promise.await(updateClient(data))
    },
    'clients.getPhoneNumber'(BiometricProfile) {
        check(BiometricProfile, String)
        return Promise.await(getPhoneNumber(BiometricProfile))
    }
})