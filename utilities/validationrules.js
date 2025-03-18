const { email } = require("../languages/en");

const rules = {
    login_simple: {
        login_type: "required|string|in:simple,facebook,google,apple",
        loginid: "required",
        password: "required|string",
        device_token: "required|string",
        device_type: "required|string",
        os_version: "required|string",
        latitude: "required|string",
        longitude: "required|string",
        app_version: "required|string"
    },
    login_social: {
        login_type: "required|string|in:simple,facebook,google,apple",
        email : "required|email",
        social_id: "required|string",
        device_token: "required|string",
        device_type: "required|string",
        os_version: "required|string",
        latitude: "required|string",
        longitude: "required|string",
        app_version: "required|string"
    },
    signup_simple: {
        login_type: "required|string|in:simple,facebook,google,apple",
        mobile: "required|numeric",
        email: "required|email",
        password: "required|string|min:6",
        device_token: "required|string",
        device_type: "required|string",
        latitude: "required|string",
        longitude: "required|string",
        os_version: "required|string",
        app_version: "required|string"
    },
    signup_social: {
        login_type: "required|string|in:simple,facebook,google,apple",
        social_id: "required|string",
        login_type: "required|string",
        device_token: "required|string",
        device_type: "required|string",
        latitude: "required|string",
        longitude: "required|string",
        os_version: "required|string",
        app_version: "required|string"
    },
    verifyOtp: {
        email: "nullable|email",
        mobile: "nullable|numeric",
        otp: "required|digits:4",
        "email,mobile": "required_without_all:email,mobile",
    },
    resendOtp: {
        number: "required|numeric|max:16"
    },
    updateUser: {
        name: "required|string|max:255",
        address: "nullable|string",
        email: "required|email|max:255",
        password: "nullable|string|min:6",
        profile_image: "nullable|string|max:255",
        bio: "nullable|string",
        country_code: "required|string|max:255",
        mobile: "required|string|max:16",
        dob: "nullable|date",
        gender: "nullable|in:Male,Female",
        login_type: "nullable|string|in:simple,facebook,google,apple",
        social_id: "nullable|string|max:255",
        goalid: "nullable|integer",
        weight: "nullable|integer",
        target_weight: "nullable|integer",
        height: "nullable|integer",
        level: "nullable|string|in:Rookie,Beginner,Intermediate,Advance,TrueBeast",
        latitude: "nullable|string|max:32",
        longitude: "nullable|string|max:32",
    },
    updateUser2: {
        name: "nullable|string|max:255",
        address: "nullable|string",
        email: "nullable|email|max:255",
        password: "nullable|string|min:6",
        profile_image: "nullable|string|max:255",
        bio: "nullable|string",
        country_code: "nullable|string|max:255",
        mobile: "nullable|string|max:16",
        dob: "nullable|date",
        gender: "nullable|in:Male,Female",
        login_type: "nullable|string|in:simple,facebook,google,apple",
        social_id: "nullable|string|max:255",
        goalid: "nullable|integer",
        weight: "nullable|integer",
        target_weight: "nullable|integer",
        height: "nullable|integer",
        level: "nullable|string|in:Rookie,Beginner,Intermediate,Advance,TrueBeast",
        latitude: "nullable|string|max:32",
        longitude: "nullable|string|max:32",
    },

    
    changePassword: {
        password: "required|min:6",
        oldpass: "required|min:6"
    },
    forgetPassword: {
        email: "required|email"
    },

    // ---


    insertContact: {
        first_name: "required|string",
        last_name: "required|string",
        email: "required|string|email",
        subject: "required|string",
        description: "required|string"
    },
    insertSupport: {
        name: "required|string",
        mobile: "required|string|max:16",
        email: "required|string|email",
        description: "required|string"
    },
    insertAdd: {
        area: "required|string|max:256",
        house_no: "required|integer",
        block: "nullable|string|max:124",
        road: "required|string|max:256",
        delivery_info: "nullable|string",
        latitude: "required|string|max:32",
        longitude: "required|string|max:32",
        type: "required|string|in:home,office"
    },
    getMenuDetails: {
        menuId: "required|integer"
    },
    getUserMenu: {
        day_time: "required|string|in:Breakfast,Lunch,Dinner"
    },
    placeOrder: {
        add_id: "required|integer",
        menu_items: "required|array|min:1",
        week_no: "required|integer|max:5",
        order_date: "required|date",
        note: "nullable|string|max:500"
    },
    getOrders : {
        week_no: "required|integer|max:5",
    },
    
    

    // -------------------------------

    getVoucherDetails: {
        merchantId: "required|numeric",
        voucherId: "required|numeric",
    },

    getFav: {
        
        type: "required|in:M,V"
    },

    getCategory: {
        limit: "nullable|numeric",
        offset: "nullable|numeric"
    },
    getFeatured: {
        
        limit: "nullable|numeric",
        offset: "nullable|numeric"
    },
    

    getTrendy: {
        
        limit: "nullable|numeric",
        offset: "nullable|numeric"
    },

    getNear: {
        
        limit: "nullable|numeric",
        offset: "nullable|numeric"
    },
    getSearch: {
        keyword: "required|string"
    },
    getMerchants: {
        
        is_featured: "required|numeric|in:0,1",
        is_trend: "required|numeric|in:0,1",
        is_near: "required|numeric|in:0,1",
        limit: "nullable|numeric",
        offset: "nullable|numeric"
    },
    getFilters : {
            sort: "nullable|string|in:top_rated,nearby,featured",
            categories: "nullable|array",
            "categories.*": "nullable|numeric",
            limit: "nullable|numeric",
            offset: "nullable|numeric"
    },
    getMerchantDetails: {
        
        merchant_id: "required|numeric",
        case: "nullable|string|in:voucher,branches,review,gallery"
    },

    insertUserInterests:{
            interest_ids: "required|array|min:1"
    }
    
    
    
    
    
    
    
    
    
};

module.exports = rules;
