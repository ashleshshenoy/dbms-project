



var query = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));


function view(){
    fetch(`http://localhost:8000/view/${query.id}`,{
    method : "GET",
    headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(function (a) {
        console.log('done') // call the json method on the response to get JSON
    })
  
}

view()



function fetchVideo(){
    fetch(`http://localhost:8000/video/video/${query.id}`,{
        method : "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        }).then(function (a) {
            return a.json(); // call the json method on the response to get JSON
        })
        .then(function (json) {
        renderVideo(json)
    })
}
fetchVideo()


const likeCount = document.querySelector('.like-count')
const dislikeCount = document.querySelector('.dislike-count')
const  channelName = document.querySelector('.channel-name');
const videoTitle = document.querySelector('.video-title');
const channelIcon =  document.querySelector('.channel-icon');
const videoDescription = document.querySelector('.channel-desc')
const likebtn = document.querySelector('.like-btn');
const dislikeBtn = document.querySelector('.dislike-btn');
const shareBtn = document.querySelector('.share-btn');
const subscribeBtn = document.querySelector('.subscribe-btn');
const viewCount = document.querySelector('.video-view');
const videoDate = document.querySelector(".video-date")
const commentSection = document.querySelector('.comment-section');
const suggestionContainer = document.querySelector(".suggestion-container");






subscribeBtn.onclick = function(e){

    if(subscribeBtn.id == 'subscribed'){
        fetch(`http://localhost:8000/subscription/subscribe/${subscribeBtn.getAttribute('_id')}`,{
            method : "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
                }
            }).then(function (a) {
                subscribeBtn.id = ""
                tempAlert("unsubscribed to this channel", 1000)

            })
    
    }
    else {
        
        fetch(`http://localhost:8000/subscription/subscribe/${subscribeBtn.getAttribute('_id')}`,{
        method : "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        }).then(function (a) {
            subscribeBtn.id = "subscribed"
            tempAlert("subscribed to this channel", 1000)
        })

    }

    
    

    
}


shareBtn.onclick = function(e){
    navigator.clipboard.writeText(window.location.href
        );

    // Alert the copied text
    tempAlert("video link copied to clipboard", 2000)
    

  
}





async function renderVideo(data)  {
    console.log(data)
    likebtn.setAttribute('_id', data._id)
    subscribeBtn.setAttribute('_id', data._pid)
    video.src = "http://localhost:8000/" + data.video_url
    likeCount.innerHTML = data.like_count + " " + likeCount.innerHTML
    dislikeCount.innerHTML = data.dis_count + " " + dislikeCount.innerHTML
    channelName.innerHTML = data.username
    videoTitle.innerHTML = data.name;
    channelIcon.src = "http://localhost:8000/" + data.image_url
    videoDescription.innerHTML =data.description
    videoDate.innerHTML = dhm( new Date().getTime() -  new Date(data.up_data).getTime())
    viewCount.innerHTML = data.view_count + ((parseInt(data.view_count) > 1)? " views": " view")
    if(data.isLiked) likebtn.id = ('liked')
    if(data.isDisliked) dislikeBtn.id = ('disliked')
    fetch(`http://localhost:8000/subscription/is/${data._pid}`, {
        method: 'GET'
    }).then((e)=>{
        return e.json()
    }).then((res)=>{
        if(res.isSubscribed) subscribeBtn.id = 'subscribed'

    })

  


    likebtn.onclick = ()=>{
        if(likebtn.id == 'liked'){
            fetch(`http://localhost:8000/like/${data._id}`, {
                method: 'DELETE'
            }).then((e)=>{
                likebtn.id = "";
                likeCount.innerHTML = parseInt(likeCount.innerHTML.split(" ")[0]) - 1 + " " + likeCount.innerHTML.split(" ")[1]
            })

        }
        else{
            if(dislikeBtn.id == "disliked"){
                dislikeBtn.id = "";
                dislikeCount.innerHTML = parseInt(dislikeCount.innerHTML.split(" ")[0]) - 1 + " " + dislikeCount.innerHTML.split(" ")[1]
            }
            fetch(`http://localhost:8000/like/${data._id}`, {
                method: 'GET'
            }).then((e)=>{
                likebtn.id = "liked";
                likeCount.innerHTML = parseInt(likeCount.innerHTML.split(" ")[0]) + 1 + " " + likeCount.innerHTML.split(" ")[1]    
            })
            
        }
        
        
    }    

    dislikeBtn.onclick = ()=>{
        if(dislikeBtn.id == "disliked"){
            fetch(`http://localhost:8000/dislike/${data._id}`, {
                method: 'DELETE'
            }).then((e)=>{
                dislikeBtn.id=""
                dislikeCount.innerHTML = parseInt(dislikeCount.innerHTML.split(" ")[0]) - 1 + " " + dislikeCount.innerHTML.split(" ")[1]
            })   


        }else{
            if(likebtn.id == "liked"){
                likebtn.id = "";
                likeCount.innerHTML = parseInt(likeCount.innerHTML.split(" ")[0]) - 1 + " " + likeCount.innerHTML.split(" ")[1]
            }
            fetch(`http://localhost:8000/dislike/${data._id}`, {
                method: 'GET'
            }).then((e)=>{
                dislikeBtn.id = "disliked";
                dislikeCount.innerHTML = parseInt(dislikeCount.innerHTML.split(" ")[0]) + 1 + " " + dislikeCount.innerHTML.split(" ")[1]
            })        
        }
    }
    fetchComments(data._id)

}



function fetchComments(id){
    fetch(`http://localhost:8000/comment/${id}`,{
        method: "GET",

    }).then((res)=>{return res.json()}).then((res)=>{
        console.log(res)
        renderComments(res)
    })
}


function renderComments(comments){

    

    commentSection.innerHTML = ""
    const commentInputContainer = document.createElement("div");
    commentInputContainer.classList = "comment-input-container"
    const commentInput = document.createElement("input");
    const commentIcon = document.createElement("img");
    fetch('http://localhost:8000/profile',{method : "GET"}).then(function (a) {return a.json();}).then(function (json) {          commentIcon.src = "http://localhost:8000/" + json.image_url
})
    commentIcon.classList = "comment-icon";
    
    commentInput.type = "text";
    commentInput.name = "comment-input";
    commentInput.id = "comment-input";
    commentInput.placeholder = "add a comment";
    const sendBtn  = document.createElement("button")
    sendBtn.classList = "post-icon";
    const sendBtnIcon = document.createElement("i")
    sendBtnIcon.classList = "bi bi-send-plus"

    sendBtn.appendChild(sendBtnIcon)

    commentInputContainer.appendChild(commentIcon)
    commentInputContainer.appendChild(commentInput)
    commentInputContainer.appendChild(sendBtn)

    commentSection.appendChild(commentInputContainer)
    const commentBtn = document.querySelector('.post-icon')
    const commentField = document.querySelector('#comment-input');
    commentBtn.onclick = ()=>{
        console.log(
            "clicked"
        )
        if(commentField.value.length >  0 )
        fetch("http://localhost:8000/comment/", 
            {
                method : "POST",
                body: JSON.stringify({
                    _vid : query.id,
                    comment : commentField.value
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }
        
        ).then((res)=>{
            res.json()
        }).then((res)=>{
            commentField.value = "";
            fetchComments(query.id)
        })
    }


    comments.forEach(comment => {
        const commentContainer = document.createElement('div');
        commentContainer.classList = "comment-container";
        
        const commentUserContainer = document.createElement('div');
        commentUserContainer.classList = "comment-user-container";
        const commentUserImg = document.createElement('img');
        commentUserImg.src =  "http://localhost:8000/"+  comment.image_url;
        commentUserImg.classList = "comment-user-img";
        const commentUsername = document.createElement('p');
        commentUsername.innerHTML = comment.username;
        commentUsername.classList = "comment-username"

        commentUserContainer.appendChild(commentUserImg)
        commentUserContainer.appendChild(commentUsername)

        const commentText =   document.createElement("p");
        commentText.innerHTML = comment.comment;
        commentText.classList ="comment";

        commentContainer.append(commentUserContainer, commentText)
        commentSection.append(commentContainer)
    });
}



{/* 

<div class="comment-container">
<div class="comment-user-container">
  <img src="" alt="" class="comment-user-img">
  <p class="comment-username">Ashlesh shenoy</p>
</div>
<p class="comment">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam assumenda eaque harum, laudantium distinctio mollitia enim tempore veniam. Iste minima adipisci aut quae eius impedit aliquam nesciunt, est eaque rerum.</p>
</div> */}



function tempAlert(msg,duration){
     var el = document.createElement("div");
     el.setAttribute("style","position:fixed;top:70%; min-width: 200px; padding: 20px; font-size: 16px; min-height:20px; left:40%;background-color:grey;color: white; border-radius: 2rem");
     el.innerHTML = msg;
     setTimeout(function(){
      el.parentNode.removeChild(el);
     },duration);
     document.body.appendChild(el);
}


fetch(`http://localhost:8000/video/recommend/${query.id}`).then((res)=>{
    return res.json()
}).then((res)=>{
    renderRecommendationVideoTiles(res)
})





function renderRecommendationVideoTiles(videos){



    suggestionContainer.innerHTML = ""
    videos.forEach(video => {
      //video container
      const videoContainer = document.createElement("div");
      videoContainer.classList ="recommendation-video-container"
  
      const thumbnail = document.createElement("img");
      thumbnail.src = "http://localhost:8000/" + video.thumbnail;
      thumbnail.classList = "recommendation-video-thumbnail"
      
  
      const metaContainer = document.createElement("div");
      metaContainer.classList = "recommendation-video-meta-container"
  
      const channelImage = document.createElement("img");
      channelImage.src = "http://localhost:8000/" + video.image_url;
      channelImage.classList = "recommendation-video-channel-img"
    
      
      const videoMetaData = document.createElement("div");
      videoMetaData.classList = "recommendation-video-meta";
      
      const videoTitle = document.createElement("h6");
      videoTitle.className  = "recommendation-video-title";
      videoTitle.innerHTML = (video.name.length > 55)? video.name.slice(0,55)+ "..." : video.name;
      const viewCount = document.createElement("span");
      viewCount.className = "recommendation-view-count" ;
      viewCount.innerHTML = video.view_count + " views &nbsp; 	•  &nbsp;" +  video.up_data;
      
      const channelName = document.createElement("span");
      channelName.className = "recommendation-video-channel"
      channelName.innerHTML = video.username;
  
  
  
      videoMetaData.appendChild(videoTitle);
      videoMetaData.appendChild(channelName);
      videoMetaData.appendChild(viewCount);
  
      metaContainer.appendChild(channelImage);
      metaContainer.appendChild(videoMetaData);
      
      videoContainer.appendChild(thumbnail)
      videoContainer.appendChild(metaContainer);
      

      const link = document.createElement("a");
      link.href = `http://localhost:8000/views/video.html?id=${video._id}`;
      link.appendChild(videoContainer)  
      suggestionContainer.appendChild(link)

    });
  } 
  


 





function dhm (ms) {
    const days = Math.floor(ms / (24*60*60*1000));
    if(days > 0) return  days + " days ago" 
    else return "Today" 
}
