const express = require('express');
const app = express();
const {sql , con } = require('./db/db')



app.use(express.json());
app.use('/auth', require("./routes/auth"))



const PORT = 8000 || process.env.PORT;
app.listen(PORT,()=>{console.log("server listening on port localhost:" + PORT)})