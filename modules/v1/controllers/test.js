// const UserModel = require('../../v1/models/User-model');
const UserModel = require('../../v1/models/User-model')  
const common = require('../../../utilities/common');
const messages = require('../../../languages/en');
const code = require('../../../utilities/request-error-code')
const middleware = require('../../../middlewares/validators')
const rule = require('../../../utilities/validationrules')
const { t } = require('localizify');
const constant = require('../../../config/constant');
const connection = require('../../../config/database');

class User {
    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Test function to validate email uniqueness and respond accordingly
     */
    test(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;
    
        var rule = {
            email: 'required|email|unique:users,email',
        };
    
        var message = {
            'email.unique': req.language.rest_keywords_unique_email_error
        };
    
        var keywords = {
            rest_keywords_unique_email_error: t('rest_keywords_unique_email_error'),
        };
    
        if (request.username) {
            keywords.rest_keywords_unique_email_error = 
                keywords.rest_keywords_unique_email_error.replace("{username}", request.username);
        }
    
        // Ensure message uses updated keywords
        message['email.unique'] = keywords.rest_keywords_unique_email_error;
    
        console.log("Final Error Message:", message['email.unique']);
    
        if (middleware.checkValidationRules(req, res, request, rule, message, keywords)) {
            var m = {
                code: code.SUCCESS,
                message: req.language.success,
                data: "Test completed"
            };
            common.response(req, res, m, 400);
        }
    }
    
    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to get user details
     */
    user(req, res) {
        UserModel.getUser((err, m) => {
            common.response(req, res, m);  
        });   
    }

    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to handle user login
     */
    login(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;
    
        var message = {
            required: req.language.required,
        };
        let new_rule;
        if(req.body.login_type=='simple'){
            new_rule = rule.login_simple
        }
        else{
            new_rule = rule.login_social
        }
    
        if (middleware.checkValidationRules(req, res, request, new_rule, message)) {
            UserModel.login(req, (err, m) => {
                if (err) {
                    m = {
                        code: code.REQUEST_ERROR,
                        message: req.language.operation_failed,
                        data: err
                    };
                    return common.response(req, res, m);
                }
                common.response(req, res, m);
            });
        }
    }
    
    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to handle user logout
     */
    logout(req, res) {
        var request = req.params;
    
        var message = {
            required: req.language.required,
        };
    
        if (middleware.checkValidationRules(req, res, request, rule.logout, message)) {
            UserModel.logout(req, (err, m) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    return common.response(req, res, m);
                }
            });
        }
    }
    
    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to handle user signup
     */
    signup(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;
    
        var message = {
            required: req.language.required,
        };

        let new_rule;
        if(req.body.login_type=='simple'){
            new_rule = rule.signup_simple
        }
        else{
            new_rule = rule.signup_social
        }
    
        if (middleware.checkValidationRules(req, res, request, new_rule, message)) {
            UserModel.signup(req, (err, m) => {
                if (err) {
                    m = {
                        code: code.REQUEST_ERROR,
                        message: req.language.operation_failed,
                        data: err
                    };
                    return common.response(req, res, m);
                }
                common.response(req, res, m);
            });
        }
    }
    
    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to verify OTP
     */
    verifyOtp(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;
    
        var message = {
            required: req.language.required,
        };
    
        if (middleware.checkValidationRules(req, res, request, rule.verifyOtp, message)) {
            UserModel.verifyOtp(req, (err, m) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, m);
                }
            });
        }
    }
    
    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to resend OTP
     */
    resendOtp(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;
    
        var message = {
            required: req.language.required,
        };
    
        if (middleware.checkValidationRules(req, res, request, rule.resendOtp, message))  {
            UserModel.sendOtp(req, (err, m) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, m);
                }
            });
        }
    }
    
    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to update user details
     */
    updateUser(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;
    
        var message = {
            required: req.language.required,
        };

        const userId = req.user_id; // User ID from request body
    
        if (!userId ) {
            return callback(null,{ 
                code: code.REQUEST_ERROR, 
                messages: req.language.missing_param
            });
        }
    

        connection.query('SELECT * FROM tbl_user u WHERE u.id = ? and u.is_active=1 and u.is_deleted=0', [userId], function (error, results) {
            if (error) {
                return common.response(req, res, error.sqlMessage);
            } else if (results.length === 0) {
                return common.response(req, res, {code : code.REQUEST_ERROR, message : req.language.user_not_found});
            } else {
                let check = results[0].first_time;
                // console.log(check)
                if(check==1){
                    const steps = results[0].steps;
                    // console.log(steps)
                    switch (steps) {

                        case 'none':
                            // if (!req.body.address) {
                                return common.response(req, res, {
                                    code: code.REQUEST_ERROR,
                                    message: req.language.not_verified_2
                                });
                            // }
                            break;
                        case 'verify':
                            if (!req.body.address || !req.body.latitude || !req.body.longitude) {
                                return common.response(req, res, {
                                    code: code.REQUEST_ERROR,
                                    message: req.language.address_incomplete
                                });
                            }
                            break;

                        case 'address':
                            if (!req.body.goalid) {
                                return common.response(req, res, {
                                    code: code.REQUEST_ERROR,
                                    message: req.language.goal_incomplete
                                });
                            }
                            break;

                        case 'goal':
                            if (!req.body.gender) {
                                return common.response(req, res, {
                                    code: code.REQUEST_ERROR,
                                    message: req.language.gender_incomplete
                                });
                            }
                            break;

                        case 'gender':
                            if (!req.body.dob) {
                                return common.response(req, res, {
                                    code: code.REQUEST_ERROR,
                                    message: req.language.dob_incomplete
                                });
                            }
                            break;

                        case 'dob':
                            if (!req.body.weight) {
                                return common.response(req, res, {
                                    code: code.REQUEST_ERROR,
                                    message: req.language.weight_incomplete
                                });
                            }
                            break;

                        case 'weight':
                            if (!req.body.target_weight) {
                                return common.response(req, res, {
                                    code: code.REQUEST_ERROR,
                                    message: req.language.target_incomplete
                                });
                            }
                            break;
                        case 'target':
                        if (!req.body.height) {
                            return common.response(req, res, {
                                code: code.REQUEST_ERROR,
                                message: req.language.height_incomplete
                            });
                        }
                        break;

                        case 'height':
                            if (!req.body.level) {
                                return common.response(req, res, {
                                    code: code.REQUEST_ERROR,
                                    message: req.language.level_incomplete
                                });
                            }
                            break;

                        default:
                    }
                    if (middleware.checkValidationRules(req, res, request, rule.updateUser2, message)) {
                        UserModel.update_data(req, (err, m) => {
                            if (err) {
                                return common.response(req, res, err);
                            } else {
                                common.response(req, res, m);
                            }
                        });
                    }
                }
                else{
                    if (middleware.checkValidationRules(req, res, request, rule.updateUser, message)) {
                        UserModel.update_data(req, (err, m) => {
                            if (err) {
                                return common.response(req, res, err);
                            } else {
                                common.response(req, res, m);
                            }
                        });
                    }
                }
            }
        }); 
    }
    
    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to change user password
     */
    changePassword(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;
    
        var message = {
            required: req.language.required,
        };
    
        if (middleware.checkValidationRules(req, res, request, rule.changePassword, message)) {
            UserModel.changePass(req, (err, m) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, m);
                }
            });
        }
    }
    
    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to handle forget password
     */
    forgetPassword(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;
    
        var message = {
            required: req.language.required,
        };
    
        if (middleware.checkValidationRules(req, res, request, rule.forgetPassword, message)) {
            UserModel.forgetPass(req, (err, m) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, m);
                }
            });
        }
    }    


    // -----------------------

    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to get active and non-deleted goals
     */

    getGoals(req, res) {
        // var UserModel = require('../../v1/models/User-model');
        var request = req.body;
        console.log("req", request)
        if(req.body !== undefined || req.body !== null || isEmpty(req.body)){
        request = common.decryptPlain(request);
        request = JSON.parse(request);
        req.body = request;
        }

        var message = {
            required: req.language.required,
        };

        if (middleware.checkValidationRules(req, res, request, rule.getGoals, message)) {
            // console.log(UserModel)
            UserModel.getGoals(req, (err, result) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, result);
                }
            });
        }
    }

    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to get active and non-deleted orders along with order items and address details
     */

    getOrders(req, res) {
        var request = req.body;
        request = common.decryptPlain(request);
        request = JSON.parse(request);
        req.body = request;


        var message = {
            required: req.language.required,
        };

        if (middleware.checkValidationRules(req, res, request, rule.getOrders, message)) {
            UserModel.getOrders(req, (err, result) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, result);
                }
            });
        }
    }


    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to insert contact details
     */
    insertContact(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;

        var message = {
            required: req.language.required,
        };

        if (middleware.checkValidationRules(req, res, request, rule.insertContact, message)) {
            UserModel.insertContact(req, (err, result) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, result);
                }
            });
        }
    }

    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to insert support details
     */

    insertSupport(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;
    
        var message = {
            required: req.language.required,
        };
    
        if (middleware.checkValidationRules(req, res, request, rule.insertSupport, message)) {
            UserModel.insertSupport(req, (err, result) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, result);
                }
            });
        }
    }


    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to insert address details
     */

    insertAdd(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;

        var message = {
            required: req.language.required,
        };

        if (middleware.checkValidationRules(req, res, request, rule.insertAdd, message)) {
            UserModel.insertAdd(req, (err, result) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, result);
                }
            });
        }
    }

     /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to get notifications
     */
     getNotify(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;
    
        var message = {
            required: req.language.required,
        };
    
        if (middleware.checkValidationRules(req, res, request, rule.getNotify, message)) {
            UserModel.getNotify(req, (err, m) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, m);
                }
            });
        }
    }

    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to get app details
     */
    getAppDetails(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;

        var message = {
            required: req.language.required,
        };

        if (middleware.checkValidationRules(req, res, request, rule.getAppDetails, message)) {
            UserModel.getAppDetails(req, (err, m) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, m);
                }
            });
        }
    }


    /**
     * @param {req} Object Incoming request object
     * @param {res} Object Response object
     * 
     * @description Function to get menu details
     */
    getMenuDetails(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;

        var message = {
            required: req.language.required,
        };

        if (middleware.checkValidationRules(req, res, request, rule.getMenuDetails, message)) {
            UserModel.getMenuDetails(req, (err, menuData) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, menuData);
                }
            });
        }
    }

    placeOrder(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;
    
        var message = {
            required: req.language.required,
        };
    
        if (middleware.checkValidationRules(req, res, request, rule.placeOrder, message)) {
            UserModel.placeOrder(req, (err, result) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, result);
                }
            });
        }
    }

    getMenu(req, res) {
        var request = req.body;
        // request = common.decryptPlain(request);
        // request = JSON.parse(request);
        // req.body = request;
    
        var message = {
            required: req.language.required,
        };
    
        if (middleware.checkValidationRules(req, res, request, rule.getUserMenu, message)) {
            UserModel.getMenu(req, (err, result) => {
                if (err) {
                    return common.response(req, res, err);
                } else {
                    common.response(req, res, result);
                }
            });
        }
    }
}

module.exports = new User();