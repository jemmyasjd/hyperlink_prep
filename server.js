const express = require('express')
require('dotenv').config();
const app_routing = require('./modules/app-routing');
const cron = require('node-cron');
const { updateOrderStatus, updateSubscriptionStatus } = require('./modules/v1/models/User-model');
const path = require('path');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
// app.use(express.text());
app.use(express.urlencoded({ extended: false }));

app.use('/',require('./middlewares/validators').extractHeaderLanguage);
app.use('/',require('./middlewares/validators').validateApiKey);
app.use('/',require('./middlewares/validators').validateHeaderToken); 

app.use('/',require('./utilities/common').decodeBody);   

app_routing.v1(app);

cron.schedule('* * * * *', async () => {
    console.log("Running updateOrderDetails every minute...");
    try {
        await updateOrderStatus();
        console.log("updateOrderDetails executed successfully.");
    } catch (error) {
        console.error("Error executing updateOrde33rDetails:", error);
    }
});

cron.schedule('0 0 * * *', async () => {
    console.log("Running updateSubscriptionStatus at midnight...");
    try {
        await updateSubscriptionStatus();
        console.log("updateSubscriptionStatus executed successfully.");
    } catch (error) {
        console.error("Error executing updateSubscriptionStatus:", error);
    }
});



app.listen(port,()=>{
    console.log("Server running on port :",port);
})