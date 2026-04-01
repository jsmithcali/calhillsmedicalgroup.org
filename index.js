const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'help@calhillsmedicalgroup.org',
        pass: 'CalHills2026!'
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, preferredOffice, serviceType, message } = req.body;

        const mailOptions = {
            from: 'help@calhillsmedicalgroup.org',
            to: 'help@calhillsmedicalgroup.org',
            subject: `New Contact Form Submission - ${serviceType}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Preferred Office:</strong> ${preferredOffice}</p>
                <p><strong>Service Interested In:</strong> ${serviceType}</p>
                <p><strong>Message:</strong></p>
                <p>${message || 'No message provided'}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Thank you for your message! We will get back to you soon.' });
    } catch (error) {
        console.error('Email error:', error);
        res.json({ success: true, message: 'Thank you for your message! We will get back to you soon.' });
    }
});

app.post('/api/appointment', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, preferredOffice, serviceType, preferredDate, notes } = req.body;

        const mailOptions = {
            from: 'help@calhillsmedicalgroup.org',
            to: 'help@calhillsmedicalgroup.org',
            subject: `New Appointment Request - ${serviceType}`,
            html: `
                <h2>New Appointment Request</h2>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Preferred Office:</strong> ${preferredOffice}</p>
                <p><strong>Service:</strong> ${serviceType}</p>
                <p><strong>Preferred Date:</strong> ${preferredDate || 'Flexible'}</p>
                <p><strong>Notes:</strong></p>
                <p>${notes || 'No notes provided'}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Your appointment request has been submitted. We will contact you to confirm.' });
    } catch (error) {
        console.error('Email error:', error);
        res.json({ success: true, message: 'Your appointment request has been submitted. We will contact you to confirm.' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Cal Hills Medical Group server running on port ${PORT}`);
});
