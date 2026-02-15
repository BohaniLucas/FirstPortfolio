const express = require("express");
const {sql, connectToTheDatabase} = require("./db");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

connectToTheDatabase();

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"portFrontEnd")));
app.use(express.json());

//form url "/submit-contacts"

app.get("/" , (request,response) =>{
    response.sendFile(path.join(__dirname,"portFrontEnd", "learnEveryday.html"));
});

app.get("/success" , (request,response)=>{
    response.sendFile(path.join(__dirname,"portFrontEnd","successMessage.html"));
});

app.post("/submit-contacts" , async(request,response) =>{
    const {name,phone,email, message} = request.body;

    try{
        await sql.query`
        INSERT INTO Contacts(Name,Phone,Email,Message)
        VALUES(${name},${phone},${email},${message})
        `;

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:`${process.env.EMAIL_USER}`,
                pass:`${process.env.EMAIL_PASS}`
            }
        });

        const receiver = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user:`${process.env.EMAIL_USER}`,
                pass:`${process.env.EMAIL_PASS}`
            }
        })

        const emailOptions = {
            from: `${process.env.EMAIL_USER}`,
            to:`${process.env.EMAIL_USER}`,
            subject:"Content",
            html:`
                <p><b>Bro.... </b><b>${name}<b> has sent you and email</p>
                <b>Details</b>
                <h3>Phone: ${phone}</h3>
                <h3>Email: ${email}</h3>
                <h3>Message: ${message}</h3>
                `
            };

        const mailOptionsoforReceiver = {
            from: `${process.env.EMAIL_USER}`,
            to:`${email}`,
            subject:`Message sent`,
            html:`<p>Thank you <b>${name}</b> for reaching to my Portfolio, I will make a follow up by making a call or an email, have a blessed day.
                </p>`
        }

        receiver.sendMail(mailOptionsoforReceiver);

        transporter.sendMail(emailOptions);

        response.redirect(`/success?name=${encodeURIComponent(name)}`);
        //response.redirect(`/success?name=${encodeURIComponent(name)}`);
     
    }catch(err){
        response.status(500).send("Error: " + err);
    }
});

const Port = 3000;
app.listen(Port, ()=>{
    console.log(`This app is running on http://localhost:${Port}`);
});