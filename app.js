require('dotenv').config();
const path = require('path');
 
const express = require('express');
 
const app = express();
const porta = process.env.PORT || 3000;
 
 
app.use(express.static("./app/public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app", "views"));
 
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
 
const router = require("./app/routes/router");
app.use("/", router);
 
 
app.listen(porta, () => {
    console.log(`Servidor on-line \nhttp://localhost:${porta}`);
});
 