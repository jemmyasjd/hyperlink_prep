const admin = require('../controllers/admin');
const User = require('../controllers/test');

var customRoute= (app) => {
    // app.get('/v1/user/test', User.test);
    // app.get('/v1/user/list',User.user);
    app.post('/v1/user/login',User.login);
    app.post('/v1/user/signup',User.signup);
    app.post('/v1/user/logout/',User.logout);
    app.post('/v1/user/verify',User.verifyOtp);
    app.post('/v1/user/resend/',User.resendOtp);
    app.post('/v1/user/update/',User.updateUser);
    app.post('/v1/user/forget',User.forgetPassword);
    // app.post('/v1/user/profile/',User.getProfile);
    app.post('/v1/user/change/',User.changePassword);



    app.post('/v1/user/getgoals',User.getGoals);
    app.post('/v1/user/contact',User.insertContact);
    app.post('/v1/user/add',User.insertAdd);
    app.post('/v1/user/notify',User.getNotify);
    app.post('/v1/user/getmenu',User.getMenuDetails);
    app.post('/v1/user/placeorder',User.placeOrder);
    app.post('/v1/user/menu',User.getMenu);
    app.post('/v1/user/appdetails',User.getAppDetails);
    app.post('/v1/user/getorder',User.getOrders);


    app.post('/v1/admin/admindash',admin.getDashboard);
    app.post('/v1/admin/getuser',admin.getUsers);
    app.post('/v1/admin/getmeal',admin.getMeals);
    app.post('/v1/admin/getorder',admin.getOrders);
    app.post('/v1/admin/deleteuser',admin.deleteUser);
    app.post('/v1/admin/blockuser',admin.deactivateUser);
    app.post('/v1/admin/activeuser',admin.activateUser);
    app.post('/v1/admin/addmenu',admin.addMenuItem);
    app.post('/v1/admin/updatemenu',admin.updateMenuItem);
    app.post('/v1/admin/deletemenu',admin.deleteMenuItem);








}

module.exports = customRoute;