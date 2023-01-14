const express = require('express');
const app = express();
const path = require('path');
const config = require('config');
require('dotenv').config()
const cookieParser = require("cookie-parser");





if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR : jwtPrivateKey not specified');
    process.exit(1);
}

const public = path.join(__dirname, '../public')
app.use(cookieParser());
app.use(express.static(public))
app.use(express.static(path.join(__dirname, '../images')));
app.use(express.static(path.join(__dirname, '../videos')));
app.use(express.json());




app.use('/auth', require("./routes/auth"))
app.use("/profile", require("./routes/profile"))
app.use("/category", require("./routes/category"))
app.use("/subscription", require("./routes/subscription"))
app.use("/video", require("./routes/video"))
app.use("/view", require("./routes/view"))




app.get('/', (req, res)=>{
    res.sendFile(path.join(public, 'views/index.html'));
})

app.post('/form', (req, res)=>{
    console.log(req.body)
    res.send(req.body)   
})

const PORT = 8000 || process.env.PORT;
app.listen(PORT,()=>{console.log("server listening on port localhost:" + PORT)})



