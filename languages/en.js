var messages = {
    server_started: "Application has started successfully",
    header_key_missing: "Unauthorized access of api, api key is missing in header envelope please check your request",
    header_key_value_incorrect: "Unauthorized access of api, api key not provided",
    header_authorization_key: "Unauthorized access of api, header authorization is missing in header envelope please check your request", 
    header_authorization_format_error: "Incorrect format for the authorization token. Please check your request",
    header_authorization_type_error: "Incorrect authorization type. Please check your request",
    header_authorization_token_error: "Unauthorized access of api, Invalid authorization token please check your request",
    header_app_role: "Unauthorized access of api, The app parameter is missing please check you header envelope",
    operation_failed: "Whoops! Something went wrong, please try again later",
    no_data_found: "No data found",
    data_found: "Data found",
    missing_param: "A parameter is missing, please check request", 
    invalid_param: "Invalid parameter, please check request",
    account_is_deactivated: "Whoops! Your account has been suspended. Please contact our Support team to find out why",
    account_is_deleted: "Whoops! Your account has been deleted. Please contact our Support team to find out why",
    invalid_access_token: "Invalid access token",
    email_is_already_registered: "We already have that email registered! Please try again with another", 
    phone_is_already_registered: "We already have that phone number registered! Please try again with another", 
    user_signup_successfully: "Welcome! You have successfully registered", 
    login_success: "Login Success!",
    not_approved: "Unfortunately, your account has not been approved. Please contact us to find out why",
    login_invalid_credential: "Invalid credentials", 
    social_account_is_not_registered: "You have not registered a social account here",
    logout_success: "You have logged out successfully",
    incorrect_email_format: "Oops, looks like that email isn't valid",
    user_not_found: "User not found or no changes made",
    email_mobile: "Please provide either email or mobile number" ,
    forgotpassword_email_not_registered: "We don't seem to have an account with that Phone/email", 
    forgotpassword_email_sent: "A reset password link has been sent to your registered email, please follow instructions from there",
    otp_verified_successfully: "OTP has been verified successfully",
    incorrect_otp: "This is incorrect code or username, please check again", 
    otp_has_sent_successfully: "A code has been successfully sent to your phone number/email, please verify",
    otp_msg: "Tasty Mou! verification PIN. Never share your code with anyone. Your code is (field)", 
    phone_is_not_verified: "Your mobile number has not yet been verified", 
    header_app_role_2: "Unauthorized access of api, The app parameter is missing please check you header envelope",
    old_password_does_not_match: "Sorry! You've entered an incorrect password, please try again",
    old_and_new_password_does_not_match: "Don't use the same password! For security reasons, please use a different password to your old one", 
    password_change: "Your password has been changed successfully",
    password_required : "Password is required",
    old_password_required : "Old password is required",
    please_subscribe : "Please subscribe to continue",
    password_change_social: "Cannot change password of social account", 
    invalid_order_date : "Invalid order date",
    setsubscription_success: "Subscription set successfully",
    enter_otp: "Please enter OTP",
    same_type_required : "Order item type should be same",
    times_up : "Cannot place order, time is up",
    incorrect_otp: "This is incorrect code or user email, please check again",
    data_added: "Data added successfully",
    notification_remove: "Notification removed successfully",
    success: "Success",
    unsuccess: "Unsuccess",
    gender_incomplete : "Please insert gender details",
    dob_incomplete : "Please insert dob details",
    weight_incomplete : "Please insert weight details",
    target_incomplete : "Please insert target weight details",
    height_incomplete : "Please insert height details",
    level_incomplete : "Please insert level details",
    goal_incomplete : "Please insert goal details",
    profile_edit: "Your profile has been updated successfully",
    address_incomplete: "Please insert address, latitude and longitude details",
    out_of_service: "We don't provide service in this area",
    complete_signup: "Please complete signup steps",
    not_verified_2: "Your mobile number/email has not yet been verified", 
    add_post_successfully: "Post added successfully",
    add_comment_successfully: "Comment added successfully",
    unfollow: "Unfollow user successfully",
    follow: "Follow user successfully",
    interest : "please insert your interest",
    remove: "Removed successfully",
    "required": "The :attr field is required",
    "email": "Please enter valid sattr",
    "rest_keywords_required_message": "Please enter sattr",
    "rest_keywords_unique_email_error": "Hey {username} ! This email is already being used.",
    "rest_keywords_something_went_wrong": "Something went wrong",
    "rest_keywords_success": "Success",
    "not_verified": "Hem your mobile number/email has not yet been verified",
    "login_invalid_credential": "Invalid credentials",
    "login_success": "Login Success!",
    "header_key_value_incorrect": "Unauthorized access of api, please provide the api key",
    "header_key_wrong" : "Unauthorized access of api, api key is wrong",
    "header_authorization_token_error": "Unauthorized access of api, Invalid authorization token please check you request",
    "no_data_found": "No data found",
    "data_found": "Data found"
};

module.exports = messages;
