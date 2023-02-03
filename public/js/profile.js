const videoHistoryContainer = document.querySelector('.video-history-container');
const profileContainer = document.querySelector('.profile-container');



function getProfileDetails(){
    fetch('http://localhost:8000/profile',{
        method : "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
                }
        }).then(function (a) {
            return a.json(); // call the json method on the response to get JSON
        })
        .then(function (json) {
            console.log(json)
            renderProfileDetails(json)
        })
}

getProfileDetails()


function renderProfileDetails(profile){
    profileContainer.innerHTML = "";
    const profileBackgroundImage = document.createElement("div");
    profileBackgroundImage.classList = "profile-background"
    profileContainer.appendChild(profileBackgroundImage);
    const profileImg = document.createElement('img');
    profileImg.src = 'http://localhost:8000/' + profile.image_url;
    profileImg.classList = "profile-pic";

    const username  = document.createElement('h3');
    username.innerHTML = profile.username  ;
    username.classList = "profile-username";


    const editBtn = document.createElement('button');
    editBtn.classList = "edit-btn btn btn-outline-primary";
    editIcon = document.createElement('i');
    editIcon.classList = 'bi bi-pencil ms-3 ';
    const editText = document.createElement('span');
    editText.innerHTML = "edit"
    editBtn.setAttribute('data-bs-toggle', 'modal');
    editBtn.setAttribute('data-bs-target', '#exampleModal');
    editBtn.appendChild(editText)
    editBtn.appendChild(editIcon)

    const metaContainer = document.createElement('div');
    metaContainer.classList = "meta-container";
    metaContainer.appendChild(username)
    metaContainer.appendChild(editBtn)

    profileContainer.appendChild(profileImg)
    profileContainer.appendChild(metaContainer);



    //modal form rendering ;
    const profileIcon = document.querySelector('#profile-icon');
    profileIcon.src =  'http://localhost:8000/' + profile.image_url;

    const usernameInput = document.querySelector('#username-input');
    usernameInput.value = profile.username; 

    const headerUsername = document.querySelector('#header-txt');
    headerUsername.innerHTML = 'Hey '+ profile.username;
}



function getUserHistroy(){
    fetch('http://localhost:8000/video/history',{
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
getUserHistroy()



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
      videoHistoryContainer.appendChild(link)
    });
  } 
  
  
  
  


// update profile 


const form  = document.querySelector('.profile-form')
form.onsubmit = function(e){
    e.preventDefault();
    submitForm(); 
    var myModalEl = document.getElementById('exampleModal');
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();      
}

function submitForm(){
    let username = document.querySelector('#username-input')
    let file = document.getElementById("file").files[0];
    const formData = new FormData();
    formData.append("username", username.value);
    formData.append("file",file);
    console.log(username.value, file )
    fetch("http://localhost:8000/profile/", {
        method: 'PATCH',
        body: formData,
        headers: {
        }
    })
    .then((res) => {if(res.status == 200) location.reload()})
    .catch((err) => console.log("Error occured", err));
}