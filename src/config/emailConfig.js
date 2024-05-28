import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true, // true pour le port 465, false pour les autres ports
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to,
        subject,
        text,
        html,
    };

    return transporter.sendMail(mailOptions);
};

export default sendEmail;
