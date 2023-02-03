const express = require('express');
const app = express();
const path = require('path');
const config = require('config');
require('dotenv').config()
const cookieParser = require("cookie-parser");
const { con } = require('./db/db');





if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR : jwtPrivateKey not specified');
    process.exit(1);
}

const public = path.join(__dirname, '../public')
app.use(cookieParser());
app.use(express.static(public))
app.use(express.static(path.join(__dirname, '../images')));
app.use(express.static(path.join(__dirname, '../videos')));
app.use(express.static(path.join(__dirname, '../thumbnails')));

app.use(express.json());




app.use('/auth', require("./routes/auth"))
app.use("/profile", require("./routes/profile"))
app.use("/category", require("./routes/category"))
app.use("/subscription", require("./routes/subscription"))
app.use("/video", require("./routes/video"))
app.use("/view", require("./routes/view"))
app.use("/like", require("./routes/like"))
app.use("/dislike", require("./routes/dislike"))

app.use("/comment", require("./routes/comment"))

app.get('/', (req, res)=>{
    res.sendFile(path.join(public, 'views/index.html'));
})

app.get('/agg', (req, res)=>{
    ress = {}
    con.query('select count(*) as video_count from video', (err,result)=>{
        ress.videoCount = result[0].video_count;
    con.query('select count(*) as profile_count from profile', (err,result)=>{
        ress.profileCount = result[0].profile_count;
    con.query('select count(*) as view_count from profile', (err,result)=>{
            ress.viewCount = result[0].view_count;
    con.query('select count(*) as like_count from video_like', (err,result)=>{
            ress.likeCount = result[0].like_count;
    con.query('select count(*) as comment_count from comment', (err,result)=>{
            ress.commentCount = result[0].comment_count;
            res.status(200).send(ress);
        })        
    })
    })
    })
    })
})

app.post('/form', (req, res)=>{
    console.log(req.body)
    res.send(req.body)   
})

const PORT = 8000 || process.env.PORT;
app.listen(PORT,()=>{console.log("server listening on port localhost:" + PORT)})



