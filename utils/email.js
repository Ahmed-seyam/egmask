const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `eslam_seyam`;
  }

  sendTransport() {
    if (process.env.NODE_ENV === "production") {
      // send grid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    // Send The Actual Email
    // 1) render the html form email based on the pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );
    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText.fromString(html)
    };
    console.log(this);
    // 3) Create A Transport And Send email
    await this.sendTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "welcome to the natours family 👲");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token { valid for only 10 minutes }"
    );
  }

  async contactMail() {
    await this.send("contactMail", "Recieved Message");
  }
};
