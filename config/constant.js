
var baseurl = "http://localhost:3000/api/v1"                                                                                                   
const encryptLib = require('cryptlib');

var constant = {
    app_name: "prep it",

    encryptionKey: encryptLib.getHashSha256("xza548sa3vcr641b5ng5nhy9mlo64r6k", 32),
    // encryptionKey : "xza548sa3vcr641b5ng5nhy9mlo64r6k",
    encryptionIV: "5ng5nhy9mlo64r6k",
    // byPassApi: ['forgot Password', 'resendOTP', 'login', 'check_unique', 'signup', 'verify0TP', 'setPassword'],
    base_url : "http://localhost:3000/api",
    profile_image: baseurl + "profile_image/",
    merchant_image: baseurl + "merchant_image/",
    voucher_img: baseurl + "voucher_img/",
    merchant_bg_image: baseurl + "bg_img/",
    category: baseurl + "category_image/",
    menu_image: baseurl + "menu_image/",
    post_image : baseurl  + "post_image/",
    notification_icon : baseurl + "notification_icon/",
    limit : 3,
    offset : 0,
    latitude : 23.07841152296819, 
    longitude : 72.66249219947392
};

module.exports = constant;