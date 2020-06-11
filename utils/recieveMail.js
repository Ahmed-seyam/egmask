const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class EmailRecieve {
  constructor(user) {
    this.from = user.email;
    this.firstName = user.name.split(" ")[0];
    this.to = `ahmedseyam722001@gmail.com`;
    this.message = user.message;
    // this.pass = user.pass;
  }

  sendTransport() {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: `ahmedseyam722001@gmail.com`,
        pass: "ahmed159357"
      }
    });
  }

  async recieveEmail(template, subject) {
    // Send The Actual Email
    // 1) render the html form email based on the pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        message: this.message,
        subject,
        email: this.from
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
    console.log(this, "............................");
    // 3) Create A Transport And Send email
    await this.sendTransport().sendMail(mailOptions);
  }

  async contactMail() {
    await this.recieveEmail("contactMail", "Recieved Message");
  }
};
