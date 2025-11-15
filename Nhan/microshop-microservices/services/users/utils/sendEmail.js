const nodemailer = require('nodemailer');

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD 
        }
    });


    const mailOptions = {
        from: `E-com <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        html: options.message // Sử dụng HTML để email đẹp hơn
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;