const connection = require('../../../config/database');
// const messages = require('../../../languages/en');
const code = require('../../../utilities/request-error-code')
const common = require('../../../utilities/common')
const constant = require('../../../config/constant')
const md5 = require('md5');
const messages = require('../../../languages/en');
const moment = require('moment');
const { DateTime } = require("luxon");

class userModel{
   
    //login the user 

    // login(req, callback) {
    //     let select_query = "";
    //     let conditions = [];
    //     const data = {};
    
    //     if (!req.body.login_type || req.body.login_type === undefined) {
    //         return callback({code: code.REQUEST_ERROR, messages: req.language.missing_param}, null);
    //     }

    //     if (req.body.loginid !== undefined) {
    //         data.loginid = req.body.loginid;
    //     }
    
    //     if (req.body.password !== undefined) {
    //         data.password = req.body.password;
    //         data.password = md5(data.password);
    //     }
    
    //     // if (!data.loginid || !data.password) {
    //     //     return callback("Please insert the email/mobile and password", null);
    //     // }
    
    //     // console.log(data);
    
    //     if (req.body.login_type === 'simple') {
    //         select_query = `SELECT *, id AS user_id, CONCAT(?, profile_image) 
    //                         FROM tbl_user 
    //                         WHERE (email = ? OR mobile = ?) 
    //                         AND password = ?`;
    //         conditions = [constant.profile_image, data.loginid, data.loginid, data.password];
    //     } else {
    //         select_query = `SELECT *, id AS user_id, CONCAT(?, profile_image) 
    //                         FROM tbl_user 
    //                         WHERE social_id = ? 
    //                         AND login_type = ? and email=?
    //                         AND is_deleted = 0`;
    //         conditions = [constant.profile_image, data.email, req.body.social_id, req.body.login_type,req.body.email];
    //     }
    
    //     connection.query(select_query, conditions, (err, row) => {
    //         // console.log(select_query)
    //         if (err) {
    //             return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
    //         } else if (row.length === 0) {
    //             return callback(null, { code: code.NO_DATA_FOUND, messages: req.language.login_invalid_credential });
    //         } else {
    //             let details = row[0];
    //             if(details.steps !== 'none' ){
    //                 if (details.is_active === 0 && details.is_deleted === 0) {
    //                     return callback(null, { code: code.INACTIVE_ACCOUNT, messages: req.language.account_is_deactivated });
    //                 } else if (details.is_active === 0 && details.is_deleted === 1) {
    //                     return callback(null, { code: code.INACTIVE_ACCOUNT, messages: req.language.account_is_deleted });
    //                 } else {
    //                     let deviceData = {
    //                         device_token: req.body.device_token,
    //                         device_type: req.body.device_type,
    //                         os_version: req.body.os_version,
    //                         app_version: req.body.app_version,
    //                         token: common.generateToken(40)
    //                     };
        
    //                     if (Object.values(deviceData).some(value => value === undefined)) {
    //                         return callback(null, { code: code.REQUEST_ERROR, messages: req.language.missing_param });
    //                     } else {
    //                         // console.log(details.id);
    //                         connection.query('update tbl_device set ? where user_id = ?',[deviceData,details.id],(err,rows)=>{
    //                             // console.log(rows)
    //                             if (err) {
    //                                 return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
    //                             }else if(rows.affectedRows===0){
    //                                return callback(null,{code : code.REQUEST_ERROR,message: message.unsuccess})
    //                             }
    //                             else{
    //                                 if(details.steps === 'verify'){
    //                                     return callback(null,{code: code.NOT_APPROVED , messages : req.language.profile_info})
    //                                 }
    //                                 else{
    //                                     if(details.steps === 'info'){
    //                                         return callback(null,{code: code.NOT_APPROVED , messages : req.language.interest}) 
    //                                     }
    //                                     else{
    //                                         // common.getUserInfo(details.id,callback);
    //                                     }
    //                                 }
    //                             }
    //                         })
    //                         // common.updateDeviceInfo(details.id, deviceData, callback);

    //                     }
    //                 }
    //             }
    //             else{
    //                 callback(null, {code : code.OTP_NOT_VERIFIED, messages: req.language.not_verified_2})
    //             }
    //         }
    //     });
    // }

    /**
     * @param {Object} req Incoming request object
     * @param {function} callback Callback function to revert back to the call environment
     * 
     * @description This function is used to login the user
     */

    login(req, callback) {
        let select_query = "";
        let conditions = [];
        const data = {};
    
        if (!req.body.login_type || req.body.login_type === undefined) {
            return callback({ code: code.REQUEST_ERROR, messages: req.language.missing_param }, null);
        }
    
        if (req.body.loginid !== undefined) {
            data.loginid = req.body.loginid;
        }
    
        if (req.body.password !== undefined) {
            data.password = md5(req.body.password);
        }
    
        if (req.body.login_type === 'simple') {
            select_query = `SELECT *, id AS user_id, CONCAT(?, profile_image) AS IMG
                            FROM tbl_user 
                            WHERE (email = ? OR mobile = ?) 
                            AND password = ?`;
            conditions = [constant.profile_image, data.loginid, data.loginid, data.password];
        } else {
            select_query = `SELECT *, id AS user_id, CONCAT(?, profile_image) as img
                            FROM tbl_user 
                            WHERE social_id = ? 
                            AND login_type = ? AND email=?
                            AND is_deleted = 0`;
            conditions = [constant.profile_image, req.body.social_id, req.body.login_type, req.body.email];
        }
    
        connection.query(select_query, conditions, (err, rows) => {
            if (err) {
                return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
            }
            if (rows.length === 0) {
                return callback(null, { code: code.NO_DATA_FOUND, messages: req.language.login_invalid_credential });
            }
    
            let userDetails = rows[0];
    
            // Checking user status
            if (userDetails.is_active === 0 && userDetails.is_deleted === 0) {
                return callback(null, { code: code.INACTIVE_ACCOUNT, messages: req.language.account_is_deactivated });
            }
            if (userDetails.is_active === 0 && userDetails.is_deleted === 1) {
                return callback(null, { code: code.INACTIVE_ACCOUNT, messages: req.language.account_is_deleted });
            }


            let deviceData = {
                device_token: req.body.device_token,
                device_type: req.body.device_type,
                os_version: req.body.os_version,
                app_version: req.body.app_version,
                token: common.generateToken(40)
            };
    
            if (Object.values(deviceData).some(value => value === undefined)) {
                return callback(null, { code: code.REQUEST_ERROR, messages: req.language.missing_param });
            }
    
            // Update device info before fetching user info
            connection.query('UPDATE tbl_device SET ? WHERE user_id = ?', [deviceData, userDetails.id], (err, updateResult) => {
                if (err) {
                    return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
                }
                if (updateResult.affectedRows === 0) {
                    return callback(null, { code: code.REQUEST_ERROR, message: req.language.operation_failed });
                }
                else{

                    if (req.body.latitude && req.body.longitude) {
                        let locationData = {
                            latitude: req.body.latitude,
                            longitude: req.body.longitude
                        };
        
                        connection.query('UPDATE tbl_user SET ? WHERE id = ?', [locationData, userDetails.id], (err, locationUpdate) => {
                            if (err) {
                                return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
                            }
                        });
                    }

                    rows[0].token = deviceData.token;
                    if (userDetails.steps === 'verify') {
                        return callback(null, { code: code.NOT_APPROVED, messages: req.language.address_incomplete , data : {token : deviceData.token}});
                    }
                    if (userDetails.steps === 'address') {
                        return callback(null, { code: code.NOT_APPROVED, messages: req.language.goal_incomplete, data : {token : deviceData.token} });
                    }
                    if (userDetails.steps === 'goal') {
                        return callback(null, { code: code.NOT_APPROVED, messages: req.language.gender_incomplete, data : {token : deviceData.token} });
                    }
                    if (userDetails.steps === 'gender') {
                        return callback(null, { code: code.NOT_APPROVED, messages: req.language.dob_incomplete, data : {token : deviceData.token} });
                    }
                    if (userDetails.steps === 'dob') {
                        return callback(null, { code: code.NOT_APPROVED, messages: req.language.weight_incomplete, data : {token : deviceData.token} });
                    }
                    if (userDetails.steps === 'weight') {
                        return callback(null, { code: code.NOT_APPROVED, messages: req.language.target_incomplete, data : {token : deviceData.token} });
                    }
                    if (userDetails.steps === 'target') {
                        return callback(null, { code: code.NOT_APPROVED, messages: req.language.height_incomplete, data : {token : deviceData.token} });
                    }
                    if (userDetails.steps === 'height') {
                        return callback(null, { code: code.NOT_APPROVED, messages: req.language.level_incomplete, data : {token : deviceData.token} });
                    }
                    if (userDetails.steps === 'none') {
                        return callback(null, { code: code.OTP_NOT_VERIFIED, messages: req.language.not_verified_2,data : {token : deviceData.token} });
                    }
                    return callback(null, { code: code.SUCCESS, messages: req.language.login_success, data: rows[0] })
                }
            });
            
        });
    }
    
    
    /**
     * @param {Object} req Incoming request object
     * @param {function} callback Callback function to revert back to the call environment
     * 
     * @description This function is used to sign up the user
     */

    signup(req, callback) {
        let data = {};
        let select_query = "INSERT INTO tbl_user SET ?";
    
        if (req.body.login_type !== 'simple') {
            data = {
                social_id: req.body.social_id,
                login_type: req.body.login_type,
                email : req.body.email
            };
        } else {
            data = {
                mobile: req.body.mobile,
                email: req.body.email,
            };
            if (req.body.password !== undefined && req.body.password !== '') {
                data.password = md5(req.body.password);
            }
        }
        
        if (Object.values(data).some(value => value === undefined)) {
            return callback(null,{ code: code.REQUEST_ERROR, messages: req.language.missing_param });
        }

        connection.query('select * from tbl_user where email=?',[data.email],(err,row)=>{
            if (err) {
                return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
            }
            if (row.length > 0) {
                return callback(null, {code: code.REQUEST_ERROR, messages: req.language.email_is_already_registered});
            }
            else{
        
            connection.query(select_query, data, (err, row) => {
                if (err) {
                    return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
                } else if (row.affectedRows == 0) {
                    return callback("User not inserted", { code: code.NOT_REGISTERED, messages: req.language.not_approved });
                } else {
                    let device_data = {
                        device_token: req.body.device_token,
                        device_type: req.body.device_type,
                        os_version: req.body.os_version,
                        app_version: req.body.app_version,
                        token: common.generateToken(40),
                        user_id: row.insertId
                    };
        
                    if (Object.values(device_data).some(value => value === undefined)) {
                        return callback(null,{ code: code.REQUEST_ERROR, messages: req.language.missing_param });
                    } else {
                        connection.query('INSERT INTO tbl_device SET ?', [device_data], (err, row) => {
                            if (err) {
                                return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
                            } else if (row.affectedRows == 0) {
                                return callback(null,{ code: code.NOT_REGISTERED, messages: req.language.operation_failed });
                            } else {
                                // Return user data immediately after inserting into tbl_device (No OTP verification)

                                if (req.body.latitude && req.body.longitude) {
                                    let locationData = {
                                        latitude: req.body.latitude,
                                        longitude: req.body.longitude
                                    };
                    
                                    connection.query('UPDATE tbl_user SET ? WHERE id = ?', [locationData, device_data.user_id], (err, locationUpdate) => {
                                        if (err) {
                                            return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
                                        }
                                    });
                                }
                                const responseData = {
                                    id: device_data.user_id,
                                    token: device_data.token
                                };
                                callback(null, {code:code.SUCCESS,messages : req.language.complete_signup, data: responseData });
                            }
                        });
                    }
                }
            });
            }})
    }

    /**
     * @param {Object} req Incoming request object
     * @param {function} callback Callback function to revert back to the call environment
     * 
     * @description This function is used to send OTP
     */

    sendOtp(req, callback) {
        const { email, mobile } = req.body;
    
        if ((!email || email.trim() === "") && (!mobile || mobile.trim() === "")) {
            return callback(null, { 
                code: code.REQUEST_ERROR, 
                messages: req.language.email_mobile
            });
        }
    
        const otp = common.generateOtp();
        console.log("Generated OTP:", otp);
    
        // Check if an entry exists for this email or mobile number
        const checkQuery = 'SELECT id FROM tbl_verify WHERE email = ? OR number = ?';

        connection.query('select * from tbl_user where email = ? or mobile = ?',[email,mobile],(err,row)=>{
            console.log(row)
            if (err) {
                return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
            }
            if (row.length === 0) {
                return callback(null, { 
                    code: code.OPERATION_FAILED, 
                    messages: req.language.user_not_found 
                });
            }
            else{
                connection.query(checkQuery, [email, mobile], (err, rows) => {
                    if (err) {
                        return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
                    }
            
                    if (rows.length > 0) {
                        // If an entry exists, update OTP
                        const updateQuery = 'UPDATE tbl_verify SET otp = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ? OR number = ?';
                        connection.query(updateQuery, [otp, email, mobile], (err, result) => {
                            if (err) {
                                return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
                            }
                            if (result.affectedRows === 0) {
                                console.warn("OTP not updated for email/mobile:", email || mobile);
                                return callback(null, { 
                                    code: code.OTP_NOT_UPDATED, 
                                    messages: req.language.operation_failed 
                                });
                            }
            
                            console.log("OTP successfully updated for email/mobile:", email || mobile);
                            return callback(null, {code:code.SUCCESS, messages:messages.success, data: { otp } });
                        });
                    } else {
                        // If no entry exists, insert a new record
                        const insertQuery = 'INSERT INTO tbl_verify (email, number, otp) VALUES (?, ?, ?)';
                        connection.query(insertQuery, [email || null, mobile || null, otp], (err, result) => {
                            if (err) {
                                return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
                            }
                            if (result.affectedRows === 0) {
                                return callback(null, { 
                                    code: code.OTP_NOT_INSERTED, 
                                    messages: req.language.operation_failed 
                                });
                            }
            
                            console.log("OTP successfully inserted for email/mobile:", email || mobile);
                            return callback(null, {code:code.SUCCESS, messages:messages.success, data: { otp } });
                        });
                    }
                });
            }     
        })
    }
    
    /**
     * @param {Object} req Incoming request object
     * @param {function} callback Callback function to revert back to the call environment
     * 
     * @description This function is used to verify OTP
     */
    
    verifyOtp(req, callback) {
        const { email, mobile, otp } = req.body;
    
        if ((!email || email.trim() === "") && (!mobile || mobile.trim() === "")) {
            return callback(null, { 
                code: code.REQUEST_ERROR, 
                messages: req.language.email_mobile 
            });
        }
    
        if (!otp || otp.trim() === "") {
            return callback(null, { 
                code: code.REQUEST_ERROR, 
                messages: req.language.enter_otp 
            });
        }
    
        let selectQuery = "";
        let queryParams = [];
    
        if (email) {
            selectQuery = 'SELECT * FROM tbl_verify WHERE email = ? AND otp = ?';
            queryParams = [email, otp];
        } else if (mobile) {
            selectQuery = 'SELECT * FROM tbl_verify WHERE number = ? AND otp = ?';
            queryParams = [mobile, otp];
        }
    
        connection.query(selectQuery, queryParams, (err, rows) => {
            if (err) {
                return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
            }
    
            if (rows.length === 0) {
                return callback(null, { 
                    code: code.OTP_NOT_VERIFIED, 
                    messages: req.language.incorrect_otp 
                });
            }
    
            const userIdentifier = email || mobile;
            let checkStepQuery = "";
            let checkStepParams = [];
    
            if (email) {
                checkStepQuery = 'SELECT steps FROM tbl_user WHERE email = ? AND is_active = 1 AND is_deleted = 0';
                checkStepParams = [email];
            } else if (mobile) {
                checkStepQuery = 'SELECT steps FROM tbl_user WHERE mobile = ? AND is_active = 1 AND is_deleted = 0';
                checkStepParams = [mobile];
            }
    
            connection.query(checkStepQuery, checkStepParams, (err, userRows) => {
                if (err) {
                    return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
                }
    
                if (userRows.length === 0) {
                    return callback(null, { 
                        code: code.REQUEST_ERROR, 
                        messages: req.language.user_not_found 
                    });
                }
    
                if (userRows[0].steps !== "none") {
                    // If already verified, return success without updating
                    return callback(null, { 
                        code: code.SUCCESS, 
                        messages: req.language.otp_verified_successfully 
                    });
                }
    
                let updateQuery = "";
                let updateParams = [];
    
                if (email) {
                    updateQuery = 'UPDATE tbl_user SET steps = "verify" WHERE email = ? AND is_active = 1 AND is_deleted = 0';
                    updateParams = [email];
                } else if (mobile) {
                    updateQuery = 'UPDATE tbl_user SET steps = "verify" WHERE mobile = ? AND is_active = 1 AND is_deleted = 0';
                    updateParams = [mobile];
                }
    
                connection.query(updateQuery, updateParams, (err, result) => {
                    if (err) {
                        return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
                    }
    
                    return callback(null, { 
                        code: code.SUCCESS, 
                        messages: req.language.otp_verified_successfully 
                    });
                });
            });
        });
    }
    

    // resendOtp(req, callback) {
    //     const { email, mobile } = req.body;
    
    //     if ((!email || email.trim() === "") && (!mobile || mobile.trim() === "")) {
    //         return callback("Email or Mobile number is required", { 
    //             code: code.REQUEST_ERROR, 
    //             messages: "Please provide either email or mobile number" 
    //         });
    //     }
    
    //     const otp = common.generateOtp();
    //     console.log("Generated OTP:", otp);
    
    //     let updateQuery = "";
    //     let queryParams = [];
    
    //     if (email) {
    //         updateQuery = 'UPDATE tbl_verify SET otp = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?';
    //         queryParams = [otp, email];
    //     } else if (mobile) {
    //         updateQuery = 'UPDATE tbl_verify SET otp = ?, updated_at = CURRENT_TIMESTAMP WHERE number = ?';
    //         queryParams = [otp, mobile];
    //     }
    
    //     connection.query(updateQuery, queryParams, (err, result) => {
    //         if (err) {
    //             console.error("MySQL Error:", err.sqlMessage);
    //             return callback(err.sqlMessage, null);
    //         }
    //         if (result.affectedRows === 0) {
    //             console.warn("No rows updated for email/mobile:", email || mobile);
    //             return callback(null,{ 
    //                 code: code.OTP_NOT_VERIFIED, 
    //                 messages: req.language.operation_failed 
    //             });
    //         }
    
    //         console.log("OTP successfully updated for email/mobile:", email || mobile);
    //         return callback(null, { data: { otp } });
    //     });
    // }
    
    /**
     * @param {Object} req Incoming request object
     * @param {function} callback Callback function to revert back to the call environment
     * 
     * @description This function is used to update user details
     */

    update_data(req, callback) {

        const allowedFields = [
            "name", "email", "profile_image", "id", "country_code", "mobile",
            "address", "bio", "dob", "gender", "login_type", "social_id", 
            "latitude", "longitude", "goalid", "weight", "target_weight", 
            "height", "level", "is_verified", "is_subscribed"
        ];

        const userid = req.user_id;
        let data = {};
        console.log(userid);

        if (!userid ) {
            return callback(null,{ 
                code: code.REQUEST_ERROR, 
                messages: req.language.missing_param
            });
        }
    
        Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key) && req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== '') {
            data[key] = key === "password" ? md5(req.body[key]) : req.body[key]; 
        }
        });

        console.log(data);
        
        if (Object.keys(data).length === 0) {
            return callback(null,{ error: "No valid fields to update" ,code:code.NO_DATA_FOUND, messages:req.language.missing_param});
        }

        connection.query('select * from tbl_user where id = ? and is_active=1 and is_deleted=0',[userid],(err,row)=>{
            if(err){
                return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
            }
            if (row.length === 0) {
                return callback(null, { 
                    code: code.REQUEST_ERROR, 
                    messages: req.language.operation_failed 
                });
            }
            else{
                if(row[0].steps === 'verify' && data.address !== undefined && data.latitude !== undefined && data.longitude !== undefined){
                    data.steps = 'address';
                    const km = common.haversineDistance(constant.latitude,constant.longitude,data.latitude,data.longitude);
                    console.log(km);
                    if(km > 100) {
                        return callback(null, { 
                            code: code.REQUEST_ERROR, 
                            messages: req.language.out_of_service
                        });
                    }
                    else{
                        connection.query('insert into tbl_address (address,user_id,latitude,longitude) values(?,?,?,?)',[data.address,userid,data.latitude,data.longitude],(err,rows)=>{
                            if (err) {
                                return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
                            }
                            if (rows.affectedRows === 0) {
                                return callback(null, { 
                                    code: code.REQUEST_ERROR, 
                                    messages: req.language.operation_failed 
                                });
                            }
                        })
                        console.log("done")
                    }
                }
                if(row[0].steps === 'address' && data.goalid !== undefined){
                    data.steps = 'goal';
                }
                if(row[0].steps === 'goal' && data.gender !== undefined){
                    data.steps = 'gender';
                }
                if(row[0].steps === 'gender' && data.dob !== undefined){
                    data.steps = 'dob';
                }
                if(row[0].steps === 'dob' && data.weight !== undefined){
                    data.steps = 'weight';
                }
                if(row[0].steps === 'weight' && data.target_weight !== undefined){
                    data.steps = 'target';
                }
                if(row[0].steps === 'target' && data.height !== undefined){
                    data.steps = 'height';
                }
                if(row[0].steps === 'height' && data.level !== undefined){
                    data.steps = 'level';
                }
                if(row[0].steps === 'level'){
                    data.first_time = 0;
                }
                common.editProfile(userid, data, callback);
            }
        })

    }

    /**
     * @param {Object} req Incoming request object
     * @param {function} callback Callback function to revert back to the call environment
     * 
     * @description This function is used to logout the user
     */

    logout(req,callback){
        const id = req.user_id;
                let data = {
                    device_token: null,
                    device_type: null,
                    device_name : null,
                    device_model : null,
                    os_version: null,
                    app_version: null,
                    token: null
                }
                common.updateDeviceInfo(id, data, callback);
    }

    /**
     * @param {Object} req Incoming request object
     * @param {function} callback Callback function to revert back to the call environment
     * 
     * @description This function is used to handle forget password
     */

    forgetPass(req, callback) {
        let is_email = req.body.email;
        let field = "email";
    
        if (!is_email) {
            field = "mobile";
            is_email = req.body.mobile;
        }
    
        if ((!is_email || is_email.trim() === "")) {
            return callback(null,{ 
                code: code.REQUEST_ERROR, 
                messages: req.language.email_mobile
            } );
        }
        // console.log(field, is_email);
    
        let password = req.body.password;
    
        if (!password) {
            return callback(null, {code: code.REQUEST_ERROR, messages: req.language.password_required});
        }
    
        // Correct query syntax
        let query = `SELECT * FROM tbl_user WHERE ${field} = ? AND is_active = 1 AND is_deleted = 0`;
        connection.query(query, [is_email], (err, row) => {
            // console.log(row);
            if (err) {
                return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
            }
            if (row.length === 0) {
                return callback(null, { 
                    code: code.REQUEST_ERROR, 
                    messages: req.language.user_not_found 
                });
            }
            // Validate old password
            if (md5(password) === row[0].password) {
                return callback(null,{code : code.OPERATION_FAILED, messages: req.language.old_and_new_password_does_not_match});
            }
    
            // Correct update query
            let updateQuery = `UPDATE tbl_user SET password = ? WHERE ${field} = ? AND is_active = 1 AND is_deleted = 0`;
            connection.query(updateQuery, [md5(password), is_email], (err, result) => {
                if (err) {
                    return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
                }
                if (result.affectedRows === 0) {
                    return callback(null, { 
                        code: code.REQUEST_ERROR, 
                        messages: req.language.user_not_found 
                    });
                }
    
                common.getUserInfo(row[0].id, callback);
            });
        });
    }
    
    /**
     * @param {Object} req Incoming request object
     * @param {function} callback Callback function to revert back to the call environment
     * 
     * @description This function is used to change user password
     */

    changePass(req,callback){
        let userid = req.user_id;
        console.log(userid);
        let password = req.body.password;
        let oldpass = req.body.oldpass;

        if (!userid ) {
            return callback(null,{ 
                code: code.REQUEST_ERROR, 
                messages: req.language.missing_param
            });
        }

        if(password == null || password ==undefined || password == '' ){
           return callback(null,{code: code.REQUEST_ERROR, messages: req.language.password_required});
        }
        else if (oldpass == null || oldpass ==undefined || oldpass == ''){
            return callback(null,{code: code.REQUEST_ERROR, messages: req.language.old_password_required})
        }
        else{
            connection.query('select * from tbl_user where id=? and is_active=1 and is_deleted=0',[userid],(err,row)=>{
                if (err) {
                    return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
                }
                if (row.affectedRows === 0) {
                    return callback(null, { 
                        code: code.REQUEST_ERROR, 
                        messages: req.language.user_not_found 
                    });
                }
                else{
                    if(md5(oldpass) !== row[0].password){
                        return callback(null,{code: code.REQUEST_ERROR, messages: req.language.old_password_does_not_match});
                    }
                    else{
                        if(md5(oldpass) == md5(password)){
                            return callback(null,{code: code.REQUEST_ERROR, messages:req.language.old_and_new_password_does_not_match})
                        }
                       connection.query('update tbl_user set password = ? where id=? and is_active=1 and is_deleted=0',[md5(password),userid],(err,rows)=>{
                        if (err) {
                            return callback({code: code.OPERATION_FAILED, messages : err.sqlMessage}, null);
                        }
                        if (rows.affectedRows === 0) {
                            return callback(null, { 
                                code: code.REQUEST_ERROR, 
                                messages: req.language.user_not_found 
                            });
                        }
                            else{
                                common.getUserInfo(userid,callback)
                            }
                       })
                    }
                }
            })
        }
    }


    // -------------------

    /**
     * @param {Object} req Incoming request object
     * @param {function} callback Callback function to revert back to the call environment
     * 
     * @description This function is used to get goals
     */

    getGoals(req, callback) {
        let query = `SELECT * FROM tbl_goals g WHERE g.is_active = 1 AND g.is_deleted = 0;`;

        connection.query(query, (err, rows) => {
            if (err) {
                return callback({ 
                    code: code.OPERATION_FAILED, 
                    messages: err.sqlMessage 
                }, null);
            }
            if (rows.length === 0) {
                return callback(null, { 
                    code: code.REQUEST_ERROR, 
                    messages: req.language.no_data_found, 
                    data: [] 
                });
            }
            return callback(null, { 
                code: code.SUCCESS, 
                messages: req.language.success, 
                data: rows 
            });
        });
    }

    /**
     * @param {req} Object Incoming request object
     * @param {callback} Function Callback function
     * 
     * @description Function to insert info if someone whats to contact us
     */
    insertContact(req, callback) {
        const { first_name, last_name, email, subject, description } = req.body;

        // Check if any required field is missing
        if ([first_name, last_name, email, subject, description].some(value => value === undefined || value === '')) {
            return callback(null, { 
                code: code.REQUEST_ERROR, 
                messages: req.language.missing_param 
            });
        }

        let query = `INSERT INTO tbl_contact (first_name, last_name, email, subject, description) VALUES (?, ?, ?, ?, ?);`;
        let queryParams = [first_name, last_name, email, subject, description];

        connection.query(query, queryParams, (err, result) => {
            if (err) {
                return callback({ 
                    code: code.OPERATION_FAILED, 
                    messages: err.sqlMessage 
                }, null);
            }
            else if (result.affectedRows ===0)
            {
                return callback(null, { 
                    code: code.REQUEST_ERROR, 
                    messages: req.language.operation_failed 
                });
            }

            return callback(null, { 
                code: code.SUCCESS, 
                messages: req.language.success, 
                data: { insertedId: result.insertId } 
            });
        });
    }

    /**
     * @param {req} Object Incoming request object
     * @param {callback} Function Callback function
     * 
     * @description Function to insert the query for the support
     */

    insertSupport(req, callback) {
        const { name, mobile, email, description } = req.body;
    
        // Check if required fields are missing
        if ([name, mobile, email, description].some(value => value === undefined || value === '')) {
            return callback(null, { 
                code: code.REQUEST_ERROR, 
                messages: req.language.missing_param 
            });
        }
    
        let query = `INSERT INTO tbl_support (name, mobile, email, description) VALUES (?, ?, ?, ?);`;
        let queryParams = [name, mobile, email, description];
    
        connection.query(query, queryParams, (err, result) => {
            if (err) {
                return callback({ 
                    code: code.OPERATION_FAILED, 
                    messages: err.sqlMessage 
                }, null);
            }
    
            else if (result.affectedRows ===0)
            {
                return callback(null, { 
                    code: code.REQUEST_ERROR, 
                    messages: req.language.operation_failed 
                });
            }

            return callback(null, { 
                code: code.SUCCESS, 
                messages: req.language.success, 
                data: { insertedId: result.insertId } 
            });
        });
    }

    /**
     * @param {req} Object Incoming request object
     * @param {callback} Function Callback function
     * 
     * @description Function to insert the address details
     */

    insertAdd(req, callback) {
        const { area, house_no, block, road, delivery_info, latitude, longitude, type } = req.body;
        const user_id = req.user_id;
    
        // Check if required fields are missing
        if ([user_id, type,area,house_no,latitude,longitude].some(value => value === undefined || value === '')) {
            return callback(null, { 
                code: code.REQUEST_ERROR, 
                messages: req.language.missing_param 
            });
        }
    
        // Ensure `type` is either 'home' or 'office'
        if (!['home', 'office'].includes(type)) {
            return callback(null, {
                code: code.REQUEST_ERROR,
                messages: req.language.invalid_param
            });
        }

        const km = common.haversineDistance(constant.latitude,constant.longitude,req.body.latitude,req.body.longitude);
        console.log(km);
        if(km > 100) {
            return callback(null, { 
                code: code.REQUEST_ERROR, 
                messages: req.language.out_of_service
            });
        }
        
    
        let query = `
            INSERT INTO tbl_address (area, house_no, block, road, delivery_info, user_id, latitude, longitude, type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        let queryParams = [area, house_no, block, road, delivery_info, user_id, latitude, longitude, type];
    
        connection.query(query, queryParams, (err, result) => {
            if (err) {
                return callback({ 
                    code: code.OPERATION_FAILED, 
                    messages: err.sqlMessage 
                }, null);
            }

            else if (result.affectedRows ===0)
            {
                return callback(null, { 
                    code: code.REQUEST_ERROR, 
                    messages: req.language.operation_failed 
                });
            }
    
            return callback(null, { 
                code: code.SUCCESS, 
                messages: req.language.success, 
                data: { insertedId: result.insertId ,address: req.body} 
            });
        });
        // console.log("doen");
    }

    /**
     * @param {req} Object Incoming request object
     * @param {callback} Function Callback function
     * 
     * @description Function to get the notification 
     */

    getNotify(req, callback) {
        const userId = req.user_id; // User ID from request body
    
        if (!userId ) {
            return callback(null,{ 
                code: code.REQUEST_ERROR, 
                messages: req.language.missing_param
            });
        }
    
        let query = `SELECT *, concat(?,icon) as icon FROM tbl_notification n WHERE n.user_id = ? and n.is_active=1 and n.is_deleted=0;`;
        let queryParams = [constant.notification_icon,userId];
    
        connection.query(query, queryParams, (err, rows) => {
            if (err) {
                return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
            }
            if (rows.length === 0) {
                return callback(null, { 
                    code: code.NO_DATA_FOUND, 
                    messages: req.language.no_data_found, 
                    data: [] 
                });
            }
            return callback(null, { 
                code: code.SUCCESS, 
                messages: req.language.success, 
                data: rows 
            });
        });
    }

    /**
     * @param {req} Object Incoming request object
     * @param {callback} Function Callback function
     * 
     * @description Function to get active app details
     */
    getAppDetails(req, callback) {
        let query = `SELECT * FROM tbl_app_details a WHERE a.is_active=1 AND a.is_deleted=0;`;

        connection.query(query, (err, rows) => {
            if (err) {
                return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
            }
            if (rows.length === 0) {
                return callback(null, { 
                    code: code.NO_DATA_FOUND, 
                    messages: req.language.no_data_found, 
                    data: [] 
                });
            }
            return callback(null, { 
                code: code.SUCCESS, 
                messages: req.language.success, 
                data: rows 
            });
        });
    }

    // getAppDetails = (req, res, page) => {
    //     let query = `SELECT * FROM tbl_app_details WHERE is_active=1 AND is_deleted=0 LIMIT 1;`;
    
    //     connection.query(query, (err, rows) => {
    //         if (err || rows.length === 0) {
    //             return res.render('error', { message: "No data found!" });
    //         }
    //         res.render(page, { data: rows[0] });
    //     });
    // };

    /**
     * @param {Object} req Incoming request object
     * @param {function} callback Callback function to revert back to the call environment
     * 
     * @description This function is used to get menu details
     */

    getMenuDetails(req, callback) {
        const menuId = req.body.menuId;

        if (!menuId || menuId.trim() === "") {
            return callback(null, { 
                code: code.REQUEST_ERROR, 
                messages: req.language.missing_param 
            });
        }

        let menuQuery = `SELECT *, concat(?, img) as img FROM tbl_menu 
                        WHERE id = ?;`;
        let menuParams = [constant.menu_image, menuId];

        connection.query(menuQuery, menuParams, (err, menuRows) => {
            if (err) {
                return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
            }
            if (menuRows.length === 0) {
                return callback(null, { code: code.NO_DATA_FOUND, messages: req.language.no_data_found, data: [] });
            }

            let menuDetails = menuRows[0];

            return callback(null, { code: code.SUCCESS, messages: req.language.success, data: menuDetails });
        });
    }

    // async placeOrder(req, callback) {
    //     try {
    //         const { add_id, menu_items, week_no, order_date, note } = req.body;
    //         const user_id = req.user_id || 1;
    
    //         if ([user_id, add_id, menu_items, week_no, order_date].some(value => value === undefined || value === '')) {
    //             return callback(null, {
    //                 code: code.REQUEST_ERROR,
    //                 messages: req.language.missing_param
    //             });
    //         }
    
    //         // Use connection.promise().query() instead of connection.query()
    //         const [user] = await connection.promise().query("SELECT is_subscribed FROM tbl_user WHERE id = ?", [user_id]);
            
    //         if (!user.length || user[0].is_subscribed !== 1) {
    //             return callback(null, {
    //                 code: code.REQUEST_ERROR,
    //                 messages: req.language.please_subscribe
    //             });
    //         }
    
    //         const currentDate = new Date();
    //         const orderDate = new Date(order_date);
    //         if (isNaN(orderDate.getTime())) { // Check if the date is invalid
    //             return callback(null, {
    //                 code: code.REQUEST_ERROR,
    //                 messages: "Invalid date format provided"
    //             });
    //         }
    //         const mysqlDate = orderDate.toISOString().slice(0, 19).replace('T', ' ');
    //         if (orderDate < currentDate) {
    //             return callback(null, {
    //                 code: code.REQUEST_ERROR,
    //                 messages: req.language.invalid_order_date
    //             });
    //         }
    
    //         const [menuItems] = await connection.promise().query("SELECT id, day_time FROM tbl_menu WHERE id IN (?)", [menu_items]);
    //         const uniqueTypes = new Set(menuItems.map(item => item.day_time));
    
    //         if (uniqueTypes.size > 1) {
    //             return callback(null, {
    //                 code: code.REQUEST_ERROR,
    //                 messages: req.language.same_type_required
    //             });
    //         }
    
    //         const mealType = menuItems[0].day_time;
    //         const orderHour = orderDate.getHours();
    //         if ((mealType === 'Breakfast' && orderHour < 12) ||
    //             (mealType === 'Lunch' && orderHour >= 15) ||
    //             (mealType === 'Dinner' && orderHour < 24)) {
    //             return callback(null, {
    //                 code: code.REQUEST_ERROR,
    //                 messages: req.language.times_up
    //             });
    //         }
    
    //         const orderQuery = `INSERT INTO tbl_order (user_id, o_status, o_date, week_no, note, address, track_no, o_no) 
    //                             VALUES (?, 'confirmed', ?, ?, ?, ?, ?, ?)`;
    //         const trackNo = common.generateTrackingNumber();
    //         const orderNo = common.generateOrderNumber();

    //         // console.log(trackNo);
            
    //         const [orderResult] = await connection.promise().query(orderQuery, [user_id, order_date, week_no, note, add_id, trackNo, orderNo]);
    
    //         if (orderResult.affectedRows === 0) {
    //             return callback(null, {
    //                 code: code.REQUEST_ERROR,
    //                 messages: req.language.operation_failed
    //             });
    //         }
    
    //         const orderId = orderResult.insertId;
    
    //         const itemsData = menuItems.map(item => [orderId, item.id, 1, JSON.stringify(item)]);
    //         const orderItemsQuery = "INSERT INTO tbl_order_items (order_id, p_id, quantity, p_details) VALUES ?";
            
    //         await connection.promise().query(orderItemsQuery, [itemsData]);
    
    //         return callback(null, {
    //             code: code.SUCCESS,
    //             messages: req.language.success,
    //             data: { orderId }
    //         });
    //     } catch (err) {
    //         return callback({
    //             code: code.OPERATION_FAILED,
    //             messages: err.sqlMessage
    //         }, null);
    //     }
    // }
    
    async placeOrder(req, callback) {
        try {
            const { add_id, menu_items, week_no, order_date, note } = req.body;
            const user_id = req.user_id || 1;
    
            if ([user_id, add_id, menu_items, week_no, order_date].some(value => value === undefined || value === '')) {
                return callback(null, {
                    code: code.REQUEST_ERROR,
                    messages: req.language.missing_param
                });
            }
    
            // Use connection.promise().query() instead of connection.query()
            const [user] = await connection.promise().query("SELECT is_subscribed FROM tbl_user WHERE id = ?", [user_id]);
            
            if (!user.length || user[0].is_subscribed !== 1) {
                return callback(null, {
                    code: code.REQUEST_ERROR,
                    messages: req.language.please_subscribe
                });
            }
    
            const currentDate = new Date();
            const orderDate = new Date(order_date);
            if (isNaN(orderDate.getTime())) { // Check if the date is invalid
                return callback(null, {
                    code: code.REQUEST_ERROR,
                    messages: "Invalid date format provided"
                });
            }
            const mysqlDate = orderDate.toISOString().slice(0, 19).replace('T', ' ');
            if (orderDate < currentDate) {
                return callback(null, {
                    code: code.REQUEST_ERROR,
                    messages: req.language.invalid_order_date
                });
            }

            const [expiry] = await connection.promise().query('select * from tbl_user_subscription where user_id = ? and is_active=1 and is_deleted=0',[user_id]); 
    
            // console.log(expiry);
            if(expiry.length > 0){
                const expiry_date = new Date(expiry[0].expires_on);
                if(orderDate > expiry_date){
                    return callback(null, {
                        code: code.REQUEST_ERROR,
                        messages: req.language.please_subscribe
                    });
                }
            }

            const [menuItems] = await connection.promise().query("SELECT * FROM tbl_menu WHERE id IN (?)", [menu_items]);
            const uniqueTypes = new Set(menuItems.map(item => item.day_time));
    
            if (uniqueTypes.size > 1) {
                return callback(null, {
                    code: code.REQUEST_ERROR,
                    messages: req.language.same_type_required
                });
            }
    
            const mealType = menuItems[0].day_time;
            const orderHour = orderDate.getHours();
            if ((mealType === 'Breakfast' && orderHour < 7) ||
                (mealType === 'Lunch' && orderHour < 11) ||
                (mealType === 'Dinner' && orderHour < 19)) {
                return callback(null, {
                    code: code.REQUEST_ERROR,
                    messages: req.language.times_up
                });
            }

            let del_time;

            if(mealType === 'Breakfast'){
                del_time = '08:00:00';
            }
            else if(mealType === 'Lunch'){
                del_time = '12:00:00';
            }
            else if(mealType === 'Dinner'){
                del_time = '20:00:00';
            }

    
            const orderQuery = `INSERT INTO tbl_order (user_id, o_status, o_date,delivery_time, week_no, note, address, track_no, o_no) 
                                VALUES (?, 'confirmed', ?,?, ?, ?, ?, ?, ?)`;
            const trackNo = common.generateTrackingNumber();
            const orderNo = common.generateOrderNumber();
    
            // console.log(trackNo);
            
            const [orderResult] = await connection.promise().query(orderQuery, [user_id, mysqlDate,del_time, week_no, note, add_id, trackNo, orderNo]);
    
            if (orderResult.affectedRows === 0) {
                return callback(null, {
                    code: code.REQUEST_ERROR,
                    messages: req.language.operation_failed
                });
            }
    
            const orderId = orderResult.insertId;
    
            const itemsData = menuItems.map(item => [orderId, item.id, 1, JSON.stringify(item)]);
            const orderItemsQuery = "INSERT INTO tbl_order_items (order_id, p_id, quantity, p_details) VALUES ?";

            const [orderDetails] = await connection.promise().query('select * from tbl_order where id = ?',[orderId]);
             
            const [orderitem] = await connection.promise().query(orderItemsQuery, [itemsData]);
            const [orderItemDetails] = await connection.promise().query('select * from tbl_order_items where order_id = ?',[orderId]);
            const [address] = await connection.promise().query('select * from tbl_address where id = ?',[add_id]);

            const notificationMessage = `Your order #${orderNo} is now confirmed.`;
            await connection.promise().query(
                "INSERT INTO tbl_notification (user_id, title, message, icon, notification_type, is_read, is_active, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    user_id,
                    "Order Status Update",
                    notificationMessage,
                    "order_icon.png",
                    "info",
                    0, // Unread
                    1, // Active
                    0  // Not deleted
                ]
            );
    
            return callback(null, {
                code: code.SUCCESS,
                messages: req.language.success,
                data: { orderId, orderDetails, orderItemDetails, address }
            });
        } catch (err) {
            return callback({
                code: code.OPERATION_FAILED,
                messages: err.sqlMessage
            }, null);
        }
    }
    
     getMenu(req, callback) {
        if (!req.user_id || isNaN(req.user_id)) {
            return callback(null, { code: code.REQUEST_ERROR, messages: req.language.missing_param });
        }
    
        req.body.limit = req.body.limit && !isNaN(req.body.limit) ? parseInt(req.body.limit) : constant.limit;
        req.body.offset = req.body.offset && !isNaN(req.body.offset) ? parseInt(req.body.offset) : constant.offset;
    
        let userQuery = `SELECT * FROM tbl_user u WHERE u.is_active=1 AND u.is_deleted=0 AND u.id=?`;
        let menuQuery = `SELECT * FROM tbl_menu m WHERE m.is_active=1 AND m.is_deleted=0 and day_time=? LIMIT ? OFFSET ? `;
    
        connection.query(userQuery, [req.user_id], (err, userRows) => {
            if (err) {
                return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
            }
            if (userRows.length === 0) {
                return callback(null, { code: code.NO_DATA_FOUND, messages: req.language.no_data_found, data: {} });
            }
    
            connection.query(menuQuery, [req.body.day_time,req.body.limit, req.body.offset], (err, menuRows) => {
                if (err) {
                    return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
                }
                
                connection.query('select * from tbl_address a where a.user_id = ? and a.is_active=1 and a.is_deleted=0',[req.user_id],(err,add)=>{
                    if (err) {
                        return callback({ code: code.OPERATION_FAILED, messages: err.sqlMessage }, null);
                    }
                    return callback(null, {
                    code: code.SUCCESS,
                    messages: req.language.success,
                    data: {
                        user: userRows[0],
                        menu: menuRows,
                        address : add
                    }
                });
                });
            });
        });
    }
    

    // async getOrders(req, callback) {
    //     try {
    //         const { week_no } = req.body;
    //         const user_id = req.user_id;
    
    //         if ([user_id, week_no].some(value => value === undefined || value === '')) {
    //             return callback(null, {
    //                 code: code.REQUEST_ERROR,
    //                 messages: req.language.missing_param
    //             });
    //         }
    
    //         // Fetch orders based on user_id and week_no
    //         const orderQuery = `SELECT * FROM tbl_order WHERE user_id = ? AND week_no = ? AND is_active = 1 AND is_deleted = 0;`;
    //         const [orders] = await connection.promise().query(orderQuery, [user_id, week_no]);
    
    //         if (orders.length === 0) {
    //             return callback(null, {
    //                 code: code.REQUEST_ERROR,
    //                 messages: req.language.no_data_found,
    //                 data: []
    //             });
    //         }
    
    //         // Fetch order items and addresses for each order
    //         for (let order of orders) {
    //             // Fetch order items for the order
    //             const orderItemsQuery = `SELECT * FROM tbl_order_items WHERE order_id = ? and is_active=1 and is_deleted=0;`;
    //             const [orderItems] = await connection.promise().query(orderItemsQuery, [order.id]);
    //             order.orderItems = orderItems;
    
    //             // Fetch address details for the order
    //             const addressQuery = `SELECT * FROM tbl_address WHERE id = ? and is_active=1 and is_deleted=0;`;
    //             const [address] = await connection.promise().query(addressQuery, [order.address]);
    //             order.addressDetails = address.length > 0 ? address[0] : null;
    //         }
    
    //         return callback(null, {
    //             code: code.SUCCESS,
    //             messages: req.language.success,
    //             data: orders
    //         });
    
    //     } catch (err) {
    //         return callback({
    //             code: code.OPERATION_FAILED,
    //             messages: err.sqlMessage
    //         }, null);
    //     }
    // }
    

    async getOrders(req, callback) {
        try {
            const { week_no } = req.body;
            const user_id = req.user_id;
    
            if ([user_id, week_no].some(value => value === undefined || value === '')) {
                return callback(null, {
                    code: code.REQUEST_ERROR,
                    messages: req.language.missing_param
                });
            }
    
            // Fetch orders based on user_id and week_no
            const orderQuery = `SELECT * FROM tbl_order WHERE user_id = ? AND week_no = ? AND is_active = 1 AND is_deleted = 0;`;
            const [orders] = await connection.promise().query(orderQuery, [user_id, week_no]);
    
            if (orders.length === 0) {
                return callback(null, {
                    code: code.REQUEST_ERROR,
                    messages: req.language.no_data_found,
                    data: []
                });
            }
    
            // Process each order to add day details
            for (let order of orders) {
                // Convert the o_date field from DATETIME format
                const orderDate = moment(order.o_date); // Parsing o_date
    
                // Extract day of the week and corresponding number
                const dayOfWeek = orderDate.format('ddd'); // Full day name (Monday, Tuesday, etc.)
                const dayNumber = orderDate.isoWeekday(); // Monday = 1, Sunday = 7
    
                // Fetch order items for the order
                const orderItemsQuery = `SELECT * FROM tbl_order_items WHERE order_id = ? AND is_active = 1 AND is_deleted = 0;`;
                const [orderItems] = await connection.promise().query(orderItemsQuery, [order.id]);
                order.orderItems = orderItems;
    
                // Fetch address details for the order
                const addressQuery = `SELECT * FROM tbl_address WHERE id = ? AND is_active = 1 AND is_deleted = 0;`;
                const [address] = await connection.promise().query(addressQuery, [order.address]);
                order.addressDetails = address.length > 0 ? address[0] : null;
    
                // Add day details to the order
                order.dayOfWeek = dayOfWeek;
                order.dayNumber = dayNumber;
            }
    
            return callback(null, {
                code: code.SUCCESS,
                messages: req.language.success,
                data: orders
            });
    
        } catch (err) {
            return callback({
                code: code.OPERATION_FAILED,
                messages: err.sqlMessage
            }, null);
        }
    }
    
    
    async updateOrderStatus() {
        try {
            // Get current date and time in IST
            const nowIST = DateTime.now().setZone("Asia/Kolkata");
    
            // Format date in YYYY-MM-DD
            const currentISTDate = nowIST.toFormat("yyyy-MM-dd");
    
            const [orders] = await connection.promise().query(
                "SELECT * FROM tbl_order WHERE DATE(o_date) = ? AND o_status NOT IN ('completed')", 
                [currentISTDate]
            );
    
            console.log("IST Current Time:", nowIST.toISO());
            console.log("Orders to process:", orders.length);
    
            for (const order of orders) {
                const [addressData] = await connection.promise().query(
                    "SELECT latitude, longitude FROM tbl_address WHERE id = ?", 
                    [order.address]
                );
    
                if (!addressData.length) continue;
                const { latitude, longitude } = addressData[0];
    
                console.log("from the user", latitude, longitude);
                console.log("from the constant", constant.latitude, constant.longitude);
    
                // Calculate distance (km) using Haversine formula
                const distance = common.haversineDistance(
                    constant.latitude, constant.longitude, latitude, longitude
                );
    
                console.log("distance in km", distance);
                const deliveryTimeInMinutes = (distance / 35) * 60;
                console.log("delivery time in minutes", deliveryTimeInMinutes);
    
                let mealType;
                if (order.delivery_time === '08:00:00') mealType = 'Breakfast';
                else if (order.delivery_time === '12:00:00') mealType = 'Lunch';
                else if (order.delivery_time === '20:00:00') mealType = 'Dinner';
                else continue;
    
                const [hours, minutes, seconds] = order.delivery_time.split(":").map(Number);
                const deliveryTime = nowIST.set({ hour: hours, minute: minutes, second: seconds });

                const outForDeliveryTime = deliveryTime.minus({ minutes: deliveryTimeInMinutes });
                const inPreparationTime = outForDeliveryTime.minus({ minutes: 45 });
    
                console.log("IST Delivery Time:", deliveryTime.toISO());
                console.log("IST Out for Delivery Time:", outForDeliveryTime.toISO());
                console.log("IST In Preparation Time:", inPreparationTime.toISO());
    
                let newStatus = order.o_status;
    
                if (nowIST >= deliveryTime) {
                    newStatus = 'completed';
                } else if (nowIST >= outForDeliveryTime) {
                    newStatus = 'out_of_delivery';
                } else if (nowIST >= inPreparationTime) {
                    newStatus = 'in_preparation';
                }

                if (newStatus !== order.o_status) {
                    await connection.promise().query(
                        "UPDATE tbl_order SET o_status = ? WHERE id = ?", 
                        [newStatus, order.id]
                    );
    
                    console.log(`Order ${order.o_no} status updated to ${newStatus}`);
    
                    // Insert notification
                    const notificationMessage = `Your order #${order.o_no} is now ${newStatus.replace('_', ' ')}.`;
                    await connection.promise().query(
                        "INSERT INTO tbl_notification (user_id, title, message, icon, notification_type, is_read, is_active, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        [
                            order.user_id, 
                            "Order Status Update", 
                            notificationMessage, 
                            "order_icon.png", 
                            "info", 
                            0, // Unread
                            1, // Active
                            0  // Not deleted
                        ]
                    );
                }
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    }


    
    // async updateSubscriptionStatus() {
    //     try {
    //         const nowIST = DateTime.now().setZone("Asia/Kolkata").toFormat("yyyy-MM-dd");

    //         // Get users with active subscriptions
    //         const [activeSubscriptions] = await connection.promise().query(
    //             "SELECT user_id, expires_on FROM tbl_user_subscription WHERE is_active=1"
    //         );

    //         console.log("Active subscriptions found:", activeSubscriptions.length);

    //         for (const subscription of activeSubscriptions) {
    //             const { user_id, expires_on } = subscription;

    //             // Check if subscription has expired
    //             if (expires_on <= nowIST) {
    //                 // Update user subscription status
    //                 await connection.promise().query(
    //                     "UPDATE tbl_user SET is_subscribed = 0 WHERE id = ?", 
    //                     [user_id]
    //                 );

    //                 await connection.promise().query('update tbl_user_subscription set is_active=0 where user_id = ? and is_active=1 and is_deleted=0',[user_id]);

    //                 console.log(`User ${user_id} subscription expired on ${expires_on}`);

    //                 // Insert notification
    //                 const notificationMessage = `Your subscription has been expired . Please renew to continue your services.`;

    //                 await connection.promise().query(
    //                     "INSERT INTO tbl_notification (user_id, title, message, icon, notification_type, is_read) VALUES (?, ?, ?, ?, ?, ?)",
    //                     [
    //                         user_id, 
    //                         "Subscription Expired", 
    //                         notificationMessage, 
    //                         "subscription_icon.png", 
    //                         "alert", 
    //                         0 // Unread
    //                     ]
    //                 );

    //                 console.log(`Notification sent to user ${user_id}`);
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error updating subscription status:", error);
    //     }
    // }

    async updateSubscriptionStatus() {
        try {
            const nowIST = DateTime.now().setZone("Asia/Kolkata").startOf('day').toJSDate();
    
            const [activeSubscriptions] = await connection.promise().query(
                "SELECT user_id, expires_on FROM tbl_user_subscription WHERE is_active = 1"
            );
    
            for (const subscription of activeSubscriptions) {
                const { user_id, expires_on } = subscription;
                const expiresDate = new Date(expires_on);
    
                if (expiresDate < nowIST) {
                    await connection.promise().query(
                        "UPDATE tbl_user SET is_subscribed = 0 WHERE id = ?", 
                        [user_id]
                    );
    
                    await connection.promise().query(
                        "UPDATE tbl_user_subscription SET is_active = 0 WHERE user_id = ? AND is_active = 1 AND is_deleted = 0",
                        [user_id]
                    );
    
                    const notificationMessage = `Your subscription has expired. Please renew to continue your services.`;
    
                    await connection.promise().query(
                        "INSERT INTO tbl_notification (user_id, title, message, icon, notification_type, is_read) VALUES (?, ?, ?, ?, ?, ?)",
                        [
                            user_id, 
                            "Subscription Expired", 
                            notificationMessage, 
                            "subscription_icon.png", 
                            "alert", 
                            0
                        ]
                    );
                }
            }
        } catch (error) {
            console.error("Error updating subscription status:", error);
        }
    }
    
}

// // module.exports = user.getGoals;

module.exports = new userModel();

// const userModelInstance = new userModel();
// module.exports = userModelInstance;