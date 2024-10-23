const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { Twilio } = require('twilio');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;  
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSid, authToken);

// WhatsApp endpoint
app.post('/send-whatsapp', async (req, res) => {
    const { message, email } = req.body;

    if (!message || !email) {
        return res.status(400).send({ error: 'Message and email are required' });
    }

    const whatsappMessage = `Message: ${message}\nEmail: ${email}`;
    const recipientPhoneNumber = 'whatsapp:+918959305284';  // Replace with your phone number

    try {
        const twilioMessage = await client.messages.create({
            from: 'whatsapp:+14155238886',  // Twilio sandbox WhatsApp number or verified number
            to: recipientPhoneNumber,
            body: whatsappMessage,
        });
        console.log('Message sent:', twilioMessage.sid);
        res.status(200).send({ success: 'Message sent via WhatsApp!' });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        res.status(500).send({ error: 'Failed to send the message' });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database'
})
.then(() => {
    console.log('Database Connection is ready...');
})
.catch((err) => {
    console.error('Database connection error:', err);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
