
const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')
const auth = require('../../middleware/auth');
const {upload} = require('../../middleware/videohandler');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);


// 1) CRD video  (done)
// 2) category wise video  (done)
// 3) preference video (done)
// 4) search video     
// 5) my uploaded video (done)
// 6) my subscribed video (done)
// 7) watch history 
// 8) video of a channel



//creats a new video
router.post('/' , auth, upload.single("file"), async (req, res) => {
        thumbnnailPath =  "user_"+req.user._id + '_' + Date.now() + '.png'
        const proc = new ffmpeg({ source: req.file.path, nolog: true })
        .takeScreenshots({ filename : thumbnnailPath , timemarks: [ '00:00:01.000' ], size: '280x168'}, 'thumbnails/', function(err, filenames) {
        console.log(filenames);
    });

    con.query(`INSERT INTO video(name, description, video_url, _pid, up_data,like_count, dis_count, comment_count, view_count, thumbnail) 
    VALUES('${req.body.name}', '${req.body.description}', '${req.file.path.split('/')[1]}', '${req.user._id}', '${new Date().toISOString().slice(0, 10).replace('T', ' ')}',0,0,0,0 ,'${thumbnnailPath}')`,
        (error, result, fields)=>{
            req.body.category.split(',').forEach(element => {
                con.query(`INSERT INTO video_category VALUES(${result.insertId}, ${element});\n`
                , (error, result, fields) => {
                })
            });
        }
    )
    res.status(200).send({ path : req.file.path.split('/')[1]})
});



//reads a specific video
router.get('/video/:id', auth,  (req, res)=>{
    con.query(`SELECT v._id, v._pid, comment_count, description, image_url, dis_count , like_count,thumbnail
    ,name ,up_data, username,view_count, video_url
    FROM video v, profile p  WHERE v._id=${req.params.id} and p._id=v._pid `, (err, result, field )=>{
        con.query(`SELECT * from video_like where _pid=${req.user._id} and _vid=${req.params.id}`,(error, ress, field)=>{
             if(ress.length > 0){
                result[0].isLiked = true;
                result[0].isDisliked = false;
                console.log(result[0])
                res.status(200).send(result[0])
    
            }
            else{
                result[0].isLiked = false;
                con.query(`SELECT * from video_dislike where _pid=${req.user._id} and _vid=${req.params.id}`,(err, ress, field)=>{
                    if(ress.length > 0)
                        result[0].isDisliked = true;
                    else 
                        result[0].isDisliked = false;
                    console.log(result[0])
                    res.status(200).send(result[0])
        
                        
                })
                
            }
        })        

    })
})



//deletes a specific video of req user
router.delete('/:id', auth, (req, res)=>{
    con.query(`DELETE FROM video WHERE _id=${req.params.id} and _pid=${req.user._id}`, (error, result, field)=>{
        if(error)  console.log(error)
        res.status(200).send({ message : "deleted succesfully id : " + req.params.id })
    })
})




// gets the list of videos from subscribed channels
router.get('/subscribed',auth, (req, res)=>{
    con.query(`SELECT v._id , v.name , v.thumbnail,  v.view_count, v.up_data , p.username , p.image_url  FROM video v , subscription s, profile p  WHERE  s._sid = ${req.user._id} and s._pid = v._pid and s._pid=p._id 
        `, (error, result, field)=>{
        if(error) return res.status(400).send(error)
        res.status(200).send(result);
    })
})







// my uploads 
router.get('/myvideos', auth, (req, res)=>{
    con.query(`SELECT v._id, v.name , v.thumbnail , v.view_count, v.up_data , p.username , p.image_url, v.thumbnail  FROM video v , profile p WHERE v._pid = ${req.user._id} and p._id = v._pid ;`, (error, result, field)=>{
        if(error) return res.send(error)
        res.status(200).send(result);
    });

})



router.get('/random', (req, res)=>{
    con.query(`SELECT v._id , v.name , v.thumbnail,  v.view_count, v.up_data , p.username , p.image_url  from video v, profile p where p._id = v._pid limit 30`, (error, result, field)=>{
        if(error) return res.send(error)
        res.status(200).send(result);
    });

})




// returns the list of videos from given category
router.get('/category/:id',auth,  function (req, res) {
    con.query(`
    select distinct v._id , v.thumbnail, v.name , v.view_count, v.up_data , p.username , p.image_url  from video v, profile p, video_category vc where v._id = vc._vid and p._id = v._pid and vc._cid in (${req.params.id});
    `,(error , result, fields)=>{  
        if(error) console.log(error);
        res.status(200).send(result);
    })
})


// preference
router.get('/prefered',auth,  function (req, res) {
    con.query(`
    select distinct v._id , v.name , v.thumbnail, v.view_count, v.up_data , p.username , p.image_url  from video v, video_category vc, profile p where v._id = vc._vid  and v._pid=p._id  and vc._cid in (select _cid from preference where _pid=${req.user._id});
    `,(error , result, fields )=>{
        console.log(error);
        res.status(200).send(result);
    })
})



// videos of a specific channel
router.get('/channel/:id', (req, res)=>{
    con.query(`SELECT v._id , v.name, v.thumbnail , v.view_count, v.up_data , p.username , p.image_url  from video v, profile p where p._id = v._pid and v._pid=${req.params.id}`, (error, result, field)=>{
        if(error) return res.send(error)
        res.status(200).send(result);
    });

})


//get history of a user
router.get('/history', auth ,(req, res)=>{
    con.query(`SELECT  v._id , v.name, v.thumbnail , v.view_count, v.up_data , p.username , p.image_url  from video v, profile p , view vw where p._id = v._pid and vw._pid=${req.user._id} and vw._vid=v._id limit 10`, (err, result, fields)=>{
        if(err) console.log(err)
        res.status(200).send(result)
    })
})



router.get('/search/:keyword', auth ,(req, res)=>{
    let data = req.params.keyword.split(' ').map((e)=> "name like '%"+e+"%'").join(' OR ')
    console.log(data)
    con.query(`SELECT v._id , v.name ,v.thumbnail, v.view_count, v.up_data , p.username , p.image_url  from video v, profile p  where v._pid=p._id and  (${data}) limit 20`, (err, result, fields)=>{
       console.log(result)
       console.log(err)
        res.send(result);
    })
});



// recommend similar 

router.get('/recommend/:id' , async (req, res)=>{
   con.query(`SELECT v._pid  from video v, profile p  where v._pid=p._id and v._id=${req.params.id}`, (err, currentVideoProfile)=>{
        con.query(`SELECT _cid from video_category where _vid=${req.params.id}`, (err, categories)=>{
            qt = ""
             categories.forEach(category => {
                qt += category._cid 
            })
            qt = qt.split("").join(",")
            console.log(qt)
            
            con.query(`SELECT  DISTINCT v._id , v.name ,v.thumbnail, v.view_count, v.up_data , p.username , p.image_url  from video v, profile p, video_category vc where v._pid=p._id  and vc._cid in (${qt}) limit 5`, (err, categoryVideos)=>{
                con.query(`SELECT v._id , v.name ,v.thumbnail, v.view_count, v.up_data , p.username , p.image_url  from video v, profile p, video_category vc where v._pid=p._id  and v._pid=${currentVideoProfile[0]._pid} limit 5`, (err, profileVideos)=>{
                    result = profileVideos.concat(categoryVideos)
                    res.status(200).send(result)
                })
            })
        }) 
   })
   
})

module.exports = router;