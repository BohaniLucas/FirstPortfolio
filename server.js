const express = require("express");
const {sql, connectToTheDatabase} = require("./db");
const path = require("path");

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
        response.redirect(`/success?name=${encodeURIComponent(name)}`);
    }catch(err){
        response.status(500).send("Error: " + err);
    }
});

const Port = 3000;
app.listen(Port, ()=>{
    console.log(`This app is running on http://localhost:${Port}`);
});