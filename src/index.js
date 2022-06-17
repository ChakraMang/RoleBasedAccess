const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const route = require("./routes/route.js")

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://Chakrapani:Chakku1234@cluster1.ruhey.mongodb.net/Chakrapani").then(() => console.log("Database connected"))
.catch( err => console.log(err));

app.use('/',route);

app.listen(3000, () => console.log("Express app running on port 3000"));