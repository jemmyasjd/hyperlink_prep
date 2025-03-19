const { default: localizify } = require('localizify');
const { t } = require('localizify');
const en = require('../languages/en');
const ar = require('../languages/ar');
const Validator = require('Validator');
const connection = require('../config/database');
const common = require('../utilities/common');

var middleware = {

    bypassMethods: ["login", "signup","verify","resend","about"],

    checkValidationRules: function (req, res, request, rules, message, keywords) {
        const v = Validator.make(request, rules, message, keywords);
        if (v.fails()) {
            const errors = v.getErrors();
            console.log(errors);

            var error = "";
            for (var key in errors) {
                error = errors[key][0];
                break;
            }

            response_data = {
                code: "0",
                message: error,
            };
            response_data = common.encrypt(response_data)
            res.status(200).send(response_data);
            return false;
        } else {
            return true;
        }
    },

    send_response: function (req, res, code, message, data) {
        console.log(req.lang);

        this.getMessage(req.lang, message, function (translated_message) {
            console.log(translated_message);

            response_data = {
                code: code,
                message: translated_message,
                data: data
            };

            res.status(200).send(response_data);
        });
    },

    getMessage: function (language, message, callback) {
        localizify
            .add('en', en)
            .add('ar', ar)
            .setLocale(language);
        console.log(message);

        let translatedMessage = t(message.keyword);

        if (message.content) {
            Object.keys(message.content).forEach(key => {
                translatedMessage = translatedMessage.replace(`{ ${key} }`, message.content[key]);
            });
        }

        callback(translatedMessage);
    },

    extractHeaderLanguage(req, res, callback) {
        var headerLang = (req.headers['accept-language'] !== undefined && req.headers['accept-language'] !== "")
            ? req.headers['accept-language']
            : 'en';

        req.lang = headerLang;
        req.language = (headerLang === 'en') ? en : ar;

        localizify.add('en', en).add('ar', ar).setLocale(req.lang);

        callback();
    },

    validateApiKey: function (req, res, callback) {
        try {
            let apiKey = req.headers['api-key']?.trim();
    
            if (!apiKey || apiKey.length < 24) {
                console.log("API Key is missing.");
                return res.status(401).json({ code: '0', message: req.language.header_key_value_incorrect });
            }
    
            console.log("Received Encrypted API Key:", apiKey);
            let decryptedApiKey = common.decryptPlain(apiKey);
            console.log("Decrypted API Key:", decryptedApiKey);
    
            if (!decryptedApiKey || decryptedApiKey !== process.env.API_KEY) {
                console.log("API Key mismatch.");
                return res.status(401).json({ code: '0', message: req.language.header_key_wrong });
            }

            // for simple 


            // if(apiKey !== process.env.API_KEY) {
            //     console.log("API Key mismatch.");
            //     return res.status(401).json({ code: '0', message: req.language.header_key_value_incorrect });
            // }
    
            console.log("API Key is valid.");
            callback();
        } catch (error) {
            console.error("Error in validateApiKey:", error);
            return res.status(500).json({ code: '0', message: "Internal Server Error" });
        }
    },
    
    

    validateHeaderToken: function (req, res, callback) {

        var headertoken = (req.headers['token'] != undefined && req.headers['token'] != "") ? req.headers['token'] : '';

        var path_data = req.path.split("/");
        // console.log(path_data);
        if (middleware.bypassMethods.indexOf(path_data[3]) === -1) {
            if (headertoken != "") {

                try {
                    
                    if (headertoken != "") {

                        connection.query("SELECT * FROM tbl_device d join tbl_user u on u.id = d.user_id WHERE d.token = ? and u.is_active=1 and u.is_deleted=0", [headertoken], function (error, result) {
                            // console.log(result)
                            if (!error && result.length > 0) {
                                req.user_id = result[0].user_id;
                                callback();
                            } else {
                                response_data = {
                                    code: '0',
                                    message: req.language.header_authorization_token_error
                                }
                                // middleware.encryption(response_data, function (response) {
                                    res.status(401);
                                    res.send(response_data);
                                // });
                            }
                        });
                    } else {
                        response_data = {
                            code: '0',
                            message: req.language.header_authorization_token_error
                        }
                        // middleware.encryption(response_data, function (response) {
                            res.status(401);
                            res.send(response_data);
                        // });
                    }

                } catch (error) {
                    response_data = {
                        code: '0',
                        message: req.language.header_authorization_token_error
                    }
                    // middleware.encryption(response_data, function (response) {
                        res.status(401);
                        res.send(response_data);
                    // });
                }

            } else {

                response_data = {
                    code: '0',
                    message: req.language.header_authorization_token_error
                }
                // middleware.encryption(response_data, function (response) {
                    res.status(401);
                    res.send(response_data);
                // });
            }
        } else {
            callback();
        }
    },

    // validateHeaderToken: function (req, res, callback) {
    //     console.log("Header Token Validation Middleware Triggered");
    
    //     var headertoken = req.headers['token']?.trim() || '';
    //     var pathData = req.path.split("/");
    
    //     console.log("Received Encrypted Header Token:", headertoken);
    
    //     if (middleware.bypassMethods.includes(pathData[3])) {
    //         console.log("Bypassing token validation for:", pathData[3]);
    //         return callback();
    //     }
    
    //     if (!headertoken || headertoken.length < 24) {
    //         console.log("Missing or empty Header Token.");
    //         return res.status(401).json({ code: '0', message: req.language.header_authorization_token_error });
    //     }
    
    //     try {
    //         let decryptedToken = common.decryptPlain(headertoken);
    //         console.log("Decrypted Header Token:", decryptedToken);
    
    //         connection.query(
    //             "SELECT * FROM tbl_device d JOIN tbl_user u ON u.id = d.user_id WHERE d.token = ? AND u.is_active=1 AND u.is_deleted=0",
    //             [decryptedToken],
    //             function (error, result) {
    //                 if (error) {
    //                     console.error("Database Error:", error);
    //                     return res.status(500).json({ code: '0', message: "Internal Server Error" });
    //                 }
    
    //                 if (result.length === 0) {
    //                     console.log("Invalid token provided.");
    //                     return res.status(401).json({ code: '0', message: req.language.header_authorization_token_error });
    //                 }
    
    //                 req.user_id = result[0].user_id;
    //                 console.log("Token is valid. User ID:", req.user_id);
    //                 callback();
    //             }
    //         );
    //     } catch (error) {
    //         console.error("Decryption Error in validateHeaderToken:", error.message);
    //         return res.status(500).json({ code: '0', message: "Internal Server Error" });
    //     }
    // },
    

};

module.exports = middleware;
