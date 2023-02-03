const categoryContainer = document.getElementsByClassName('category-container')[0];
const activeCategoryContainer = document.getElementsByClassName('active-category')[0];
const inactiveCategoryContainer = document.getElementsByClassName('inactive-category')[0];
const main = document.querySelector('section')

function fetchCategories(){
    fetch('http://localhost:8000/category/',{
    method : "GET",
    headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(function (a) {
        return a.json(); // call the json method on the response to get JSON
    })
    .then(function (json) {
        loadCategories(json);
    })


}


fetchCategories()

function loadCategories(categories){

    categories.forEach(item => {
        const category = document.createElement('p');
        category.className = "category";
        category.innerHTML = item.name;
        category.setAttribute("_id", item._id);
        inactiveCategoryContainer.appendChild(category)
        category.onclick = (e)=>{
            if(e.target.parentNode == inactiveCategoryContainer){

                activeCategoryContainer.append(e.target);
                e.target.style.backgroundColor = "rgb(222, 255, 222)"
                e.target.innerHTML += " x "                
            }
            else{
                inactiveCategoryContainer.append(e.target);
                e.target.style.backgroundColor = "white"

                e.target.innerHTML = e.target.innerHTML.slice(0, e.target.innerHTML.length -3)
            }
            fetchVideo()
        }

    });
    
}



function fetchVideo(){
    const children = activeCategoryContainer.children;
    const cat = []
    for(var i=0; i<children.length; i++){
        cat.push(children[i].getAttribute('_id'))
    }
    if(cat.length <= 0 )
        path = `http://localhost:8000/video/random`
    else 
        path = `http://localhost:8000/video/category/${cat}`
    console.log(path)
    fetch(path,{
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



fetchVideo()



function renderVideoTiles(videos){
    main.innerHTML = ""
    console.log(videos)
    videos.forEach(video => {
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
      

      const link = document.createElement("a");
      link.href = `http://localhost:8000/views/video.html?id=${video._id}`;
      link.appendChild(videoContainer)    
      main.appendChild(link)

    });
  } 
  