const nodemailer = require('nodemailer')

class MailService {
    constructor() {
        this.transpoeter = nodemailer.createTransport({
            service: 'gmail',
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: true,
            },
        })
    }

    async sendActivationEmail(email, link) {
        await this.transpoeter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Account Activation for JWT Auth project',
            html: `
                <div>
                    <h1>For activation click on following link</h1>
                    <a href="${link}">${link}</a>
                </div>
            `,
        })
    }
}

module.exports = new MailService()
