const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(cors)

const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            user: "smtp",
            pass: "ltetglgjdfovvlog",
        },
        });

app.post('/send-email', (req, res) => {

    const {to, html, subject, text} = req

  const mailOptions = {
    from: 's.thanveer7755@gmail.com',
    to : to,
    subject : subject,
    text : text,
    html : html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: 'Error sending email', error });
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send({ message: 'Email sent successfully!', info });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});