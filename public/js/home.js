let main = document.querySelector('section')



fetch('http://localhost:8000/video/prefered/',{
  method : "GET",
  headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then(function (a) {
    return a.json(); // call the json method on the response to get JSON
})
.then(function (json) {
  console.log(json);
  renderVideoTiles(json);
})


function renderVideoTiles(videos){
  videos.forEach(video => {
    console.log(video);
    //video container
    const videoContainer = document.createElement("div");
    videoContainer.classList ="video-container"

    const thumbnail = document.createElement("img");
    thumbnail.src = "http://localhost:8000/" + video.thumbnail;
    thumbnail.classList = "video-thumbnail"
    

    const metaContainer = document.createElement("div");
    metaContainer.classList = "video-meta-container"

    const channelImage = document.createElement("img");
    channelImage.src = "http://localhost:8000/" + video.image_url;
    channelImage.classList = "video-channel-img"
  
    
    const videoMetaData = document.createElement("div");
    videoMetaData.classList = "video-meta";
    
      const videoTitle = document.createElement("h6");
      videoTitle.className  = "video-title";
      videoTitle.innerHTML = (video.name.length > 55)? video.name.slice(0,55)+ "..." : video.name;
      const viewCount = document.createElement("span");
      viewCount.className = "view-count" ;
      viewCount.innerHTML = video.view_count + " views &nbsp; 	•  &nbsp;" +  video.up_data.split("T")[0];;
      
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
    
    const link = document.createElement("a");
    link.href = `http://localhost:8000/views/video.html?id=${video._id}`;
    link.appendChild(videoContainer)    
    main.appendChild(link)
  });
} 







fetch('http://localhost:8000/auth/data/',{
  method : "GET",
  headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then(function (a) {
    return a.json(); // call the json method on the response to get JSON
})
.then(function (json) {
  console.log(json);
})