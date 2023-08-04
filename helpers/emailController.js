var nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const { promisify } = require('util');
const EmailController = {};

// email sender function
EmailController.sendEmail = async function(receiver,subject='PlushyApp Message Info',message='',attachments=[]){
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.email.sender,
            pass: config.email.password    // Contraseña de aplicación en ajustes de Google
        }
    });
    // Definimos el email
    var mailOptions = {
        from: config.email.sender,
        to: receiver,
        subject: subject,
        text: message,
        attachments: []
    };
    for(let i=0; i<attachments.length; i++){
        mailOptions.attachments.push(attachments[i]);
    }
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
            return false;
        } else {
            console.log("Email sent");
            return true;
        }
    });
};

EmailController.sendHTML = async function(receiver,subject='PlushyApp Message Info',html='',attachments=[]){
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.email.sender,
            pass: config.email.password    // Contraseña de aplicación en ajustes de Google
        }
    });
    // Definimos el email
    var mailOptions = {
        from: config.email.sender,
        to: receiver,
        subject: subject,
        html: html,
        attachments: []
    };
    for(let i=0; i<attachments.length; i++){
        mailOptions.attachments.push(attachments[i]);
    }
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
            return false;
        } else {
            console.log("Email sent");
            return true;
        }
    });
};

EmailController.sendErrorEmail = async function(errorObject){
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.email.sender,
            pass: config.email.password    // Contraseña de aplicación en ajustes de Google
        }
    });
    const emailContent = `
    <h1>${errorObject?.name}</h1>
    <p>${errorObject?.message}</p>
    <p>${errorObject?.stack}</p>
    <p>¡Gracias por usar pluslearn!</p>
  `;
    
    // Definimos el email
    var mailOptions = {
        from: config.email.sender,
        to: 'plushyzeus35@gmail.com',
        subject: 'Error app',
        html: emailContent,
        attachments: []
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
            return false;
        } else {
            console.log("Email sent");
            return true;
        }
    });
};

EmailController.sendBirthMail = async function(subject='', birthdays='', extraAttachments=[]){
    const mainAttachments = [{filename: 'Logo.png', path: path.join(__dirname, '../static/img/zeus.png'),cid: 'logo'},{filename: 'Bug.png', path: path.join(__dirname, '../static/img/bug.png'),cid: 'bug'}];
    const attachments = mainAttachments.concat(extraAttachments);
    fs.readFile(path.join(__dirname, '../email/birthday.html'), 'utf-8', function(err,data) {
        if(!err){
            data = data.replace('{{births}}', birthdays);
            EmailController.sendHTML(config.email.receiver,subject , data, attachments);
        }else{
            console.log(err)
        }
    })
}

EmailController.sendTrackingMail = async function(subject='',email=config.email.receiver, readGoals=[], weightGoals=[], extraAttachments=[]){
    const mainAttachments = [{filename: 'Logo.png', path: path.join(__dirname, '../static/img/zeus.png'),cid: 'logo'}];
    fs.readFile(path.join(__dirname, '../email/tracking.html'), 'utf-8', function(err,data) {
        if(!err){
            data = data.replace('{{readText}}', readGoals[0]);
            data = data.replace('{{readGoal}}', readGoals[1]);
            data = data.replace('{{weightText}}', weightGoals[0]);
            data = data.replace('{{weightGoal}}', weightGoals[1]);
            EmailController.sendHTML(email,subject , data, mainAttachments);
        }else{
            console.log(err)
        }
    })
}

module.exports = EmailController;