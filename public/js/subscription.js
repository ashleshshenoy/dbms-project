let main = document.querySelector('section')












fetch('http://localhost:8000/subscription/',{
  method : "GET",
  headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then(function (a) {
    return a.json(); // call the json method on the response to get JSON
})
.then(function (json) {
  renderSubscribedChannels(json);
})



function loadVideoDefaultTiles(){
  fetch('http://localhost:8000/video/subscribed/',{
  method : "GET",
  headers: {
      "Content-type": "application/json; charset=UTF-8"
      }
    }).then(function (a) {
      return a.json(); // call the json method on the response to get JSON
  })
  .then(function (json) {
    renderVideoTiles(json);
  })

}


loadVideoDefaultTiles()

const defaultButton = document.getElementsByClassName("default-container")[0]
defaultButton.onclick  =  ()=>{
 loadVideoDefaultTiles()
}





function renderSubscribedChannels(channels){
  channels.forEach( channel => {
    const subscriptionBar = document.getElementsByClassName("subscribed-bar")[0]
    const channelContainer = document.createElement("div");
    channelContainer.classList = "channel-container";
    channelContainer.setAttribute("_id", channel._pid)

    const channelLogo = document.createElement("img");
    channelLogo.classList = "channel-logo";
    channelLogo.src = "http://localhost:8000/" + channel.image_url;


    const channelTitle = document.createElement("p")
    channelTitle.innerHTML = channel.username;
    channelTitle.classList = "channel-title";

    channelContainer.appendChild(channelLogo);
    channelContainer.appendChild(channelTitle);
    
    subscriptionBar.appendChild(channelContainer);

    channelContainer.onclick = ()=>{
      
      

      fetch('http://localhost:8000/video/channel/'+ channelContainer.getAttribute('_id'),{
        method : "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }).then(function (a) {
          return a.json(); // call the json method on the response to get JSON
        })
        .then(function (json) {
          renderVideoTiles(json)
        })
     } 
  });
  
}






function renderVideoTiles(videos){
  main.innerHTML = ""

  videos.forEach(video => {
    //video container
    const videoContainer = document.createElement("div");
    videoContainer.classList ="video-container"

    const thumbnail = document.createElement("video");
    thumbnail.src = "http://localhost:8000/user_2_1673198740654.mp4";
    thumbnail.classList = "video-thumbnail"
    

    const metaContainer = document.createElement("div");
    metaContainer.classList = "video-meta-container"

    const channelImage = document.createElement("img");
    channelImage.src = "http://localhost:8000/images/s.png";
    channelImage.classList = "video-channel-img"
  
    
    const videoMetaData = document.createElement("div");
    videoMetaData.classList = "video-meta";
    
    const videoTitle = document.createElement("h6");
    videoTitle.className  = "video-title";
    videoTitle.innerHTML = (video.name.length > 55)? video.name.slice(0,55)+ "..." : video.name;
    const viewCount = document.createElement("span");
    viewCount.className = "view-count" ;
    viewCount.innerHTML = video.view_count + " views &nbsp; 	•  &nbsp;" +  video.up_data;
    
    const channelName = document.createElement("span");
    channelName.className = "video-channel"
    channelName.innerHTML = video.username;



    videoMetaData.appendChild(videoTitle);
    videoMetaData.appendChild(channelName);
    videoMetaData.appendChild(viewCount);

    metaContainer.appendChild(channelImage);
    metaContainer.appendChild(videoMetaData);
    
    videoContainer.appendChild(thumbnail)
    videoContainer.appendChild(metaContainer);
    
    main.appendChild(videoContainer)
  });
} 
