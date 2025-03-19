const httpStatus = require('http-status-codes')
const connection = require('../config/database');
const code = require('./request-error-code')
const message =require('../languages/en')
const constant = require('../config/constant');
const cryptLib = require('cryptlib');
const lodash = require('lodash')

class Utility {
    generateOtp(){
        // generate otp of 4 digit 
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    response(req,res,message,status_code = httpStatus.OK ){

        // console.log("Incoming Message:", message);

        // Extract message text
        let messageText = message.messages || "operation_failed"; // Default message if missing

        // getMessage(req.lang, { keyword: messageText }, (translated_message) => {
        //     console.log(req.lang,translated_message)
        //     res.status(status_code).send({
        //         code: message.code || status_code, // Use provided code or default status_code
        //         message: translated_message,
        //         data: message.data || {} // Preserve data if available
        //     });
        // });
        let encryptData = this.encrypt(message)
        res.status(status_code);
        res.send(encryptData);
    }

    decryptPlain(data) {
        try {
            if (!data || typeof data !== 'string') {
                console.warn("Invalid input for decryption. Returning empty object.");
                return JSON.stringify({}); // Return an empty object in string format
            }
    
            if (!constant.encryptionKey || !constant.encryptionIV) {
                throw new Error("Encryption key or IV is missing.");
            }
    
            let decryptedData = cryptLib.decrypt(data, constant.encryptionKey, constant.encryptionIV);
            return decryptedData;
        } catch (error) {
            console.error("Decryption Error:", error.message);
            return JSON.stringify({}); // Return an empty object if decryption fails
        }
    }
    

    encrypt(data) {
        // console.log("Encryption Key:", constant.encryptionKey);
        // console.log("Encryption IV:", constant.encryptionIV);
        
        if (!constant.encryptionKey || !constant.encryptionIV) {
            throw new Error("Encryption key or IV is missing.");
        }
        
        let encryptedData = cryptLib.encrypt(JSON.stringify(data), constant.encryptionKey, constant.encryptionIV);
        // console.log("Test Encrypted Body:", encryptedData);  //  Debugging output
        return encryptedData;
    }

    decodeBody(req,res,next) {
        if(!lodash.isEmpty(req.body) && typeof req.body != "undefined"){
            req.body = JSON.parse(this.decryptPlain(req.body).replace((/\0/g, '').replace(/[^\x00-\xFF]/g, "")
        ))
        } else{
            req.body = "";
        }
        next();
    }


    generateToken(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < length; i++) {
            token += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return token;
    }

     generateTrackingNumber() {
        return 'TRK' + Math.floor(100000 + Math.random() * 900000);
    }

     generateOrderNumber() {
        return 'ORD' + Math.floor(100000 + Math.random() * 900000);
    }
    

    getUserInfo(userid,callback){
        const select_query = 'select *,concat(?,profile_image) as profile_image,id as user_id from tbl_user where id = ?'
        const conditions = [constant.profile_image,userid];

        connection.query(select_query,conditions,(err,rows)=>{
            if (err) {
                return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
            }
            if (rows.affectedRows === 0) {
                return callback(null, { 
                    code: code.REQUEST_ERROR, 
                    messages: req.language.operation_failed 
                });
            }
            else{
                callback(null,{code: code.SUCCESS, message : message.success, data: rows[0]})
            }
        })
    }

    editProfile(userid,data,callback){
        const select_query='update tbl_user set ? where id = ?'
        connection.query(select_query,[data,userid],(err,row)=>{
            if (err) {
                return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
            }if (row.affectedRows === 0) {
                return callback(null, { 
                    code: code.REQUEST_ERROR, 
                    messages: req.language.operation_failed 
                });
            }
            else{
                this.getUserInfo(userid,callback);
            }
        })
    }

    haversineDistance = (lat1, lon1, lat2, lon2) => {
        const toRadians = (degree) => (degree * Math.PI) / 180;
        const R = 6371; // Earth's radius in km
    
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    updateDeviceInfo(userid,data, callback){
        // console.log(userid,data)
        connection.query('update tbl_device set ? where user_id = ?',[data,userid],(err,rows)=>{
            // console.log(rows)
            if (err) {
                return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
            }if (rows.affectedRows === 0) {
                return callback(null, { 
                    code: code.REQUEST_ERROR, 
                    messages: req.language.operation_failed 
                });
            }
            else{
                this.getUserInfo(userid,callback);
            }
        })
    }

}

module.exports = new Utility();

u = new Utility();

