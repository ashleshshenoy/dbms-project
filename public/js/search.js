const  main = document.querySelector('section')

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


function searchVideos(){
    searchBar.value = query.search

    fetch(`http://localhost:8000/video/search/${query.search}`,{
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

searchVideos()


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
  
  
  