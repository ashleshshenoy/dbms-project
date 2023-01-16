
const form = document.querySelector('form');
const title = document.querySelector('.title');
const desc = document.querySelector('.desc');


form.onsubmit = function onSubmit(e){
    e.preventDefault();
    submitForm(); 
    var myModalEl = document.getElementById('staticBackdrop');
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();      
}

function submitForm(){
    let cat=[];
    const categories = document.querySelectorAll('.category-container > input');
    categories.forEach((category)=>{
        console.log(category.checked + category.value )
        if(category.checked)
        cat.push(category.value)
    })
    let file = document.getElementById("file").files[0];
    const formData = new FormData();
    formData.append("name", title.value);
    formData.append("description",desc.value);
    formData.append("category",cat);
    formData.append("file",file);
    fetch("http://localhost:8000/video/", {
        method: 'POST',
        body: formData,
        headers: {
        }
    })
        .then((res) => {if(res.status == 200) getMyVideos()})
        .catch((err) => console.log("Error occured", err));
}




function getCategory(){
    fetch(`http://localhost:8000/category/`,{
    method : "GET",
    headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(function (a) {
        return a.json(); // call the json method on the response to get JSON
    })
    .then(function (json) {
    console.log(json)
    renderCategory(json)
})
}





function renderCategory(categories){
    const categoryContainer = document.querySelector('.category-container');
    categoryContainer.innerHTML = "";

    categories.forEach(category => {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = category.name;
        input.value = category._id;
        
        const label = document.createElement('label'); 
        label.htmlFor = category.name;
        label.innerHTML = category.name;

        categoryContainer.appendChild(input)
        categoryContainer.appendChild(label);
    });


}


function getMyVideos(){
    fetch(`http://localhost:8000/video/myvideos`,{
    method : "GET",
    headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    }).then(function (a) {
        return a.json(); // call the json method on the response to get JSON
    })
    .then(function (json) {
        console.log(json);
        renderMyVideos(json)
    })
}




getMyVideos()
function renderMyVideos(videos){
    const videoContainer = document.querySelector('.video-container');
    videoContainer.innerHTML = "";
    const upBtn = document.createElement('button');
    upBtn.onclick = getCategory();
    upBtn.classList = 'upload-btn';
    upBtn.setAttribute('data-bs-toggle', "modal");
    upBtn.setAttribute('data-bs-target','#staticBackdrop')
    upBtn.innerHTML = "upload a new video"
    videoContainer.appendChild(upBtn);


    videos.forEach(video => {   
        const videoTile = document.createElement('div');
        videoTile.className = 'video-tile';


        const videoMetaData = document.createElement("div");
        videoMetaData.classList = "video-meta";
    

        const thumbnail = document.createElement('img');
        thumbnail.src = 'http://localhost:8000/1672759015340.png'
        thumbnail.classList = 'video-thumbnail';

        const videoTitle = document.createElement("h6");
        videoTitle.className  = "video-title";
        videoTitle.innerHTML = (video.name.length > 55)? video.name.slice(0,55)+ "..." : video.name;
        
        const viewCount = document.createElement("span");
        viewCount.className = "view-count" ;
        viewCount.innerHTML = video.view_count + " views &nbsp; 	•  &nbsp;" +  video.up_data.split("T")[0];;
        
        const channelName = document.createElement("span");
        channelName.className = "video-channel"
        channelName.innerHTML = video.username;

        const editBtn = document.createElement("button");
        editBtn.classList = 'edit-btn'
        const editIcon = document.createElement("i");
        editIcon.classList = 'bi bi-pencil';
        editBtn.append(editIcon);
        editIcon.setAttribute('_id', video._id);
        editBtn.onclick = (e)=>{
        
            console.log(e.target.getAttribute('_id'))
        }
        const deleteBtn = document.createElement("button");
        deleteBtn.classList = 'delete-btn'
        const deleteIcon = document.createElement("i");
        deleteIcon.classList = "bi bi-trash3"
        deleteBtn.append(deleteIcon)
        deleteIcon.setAttribute('_id',video._id)
        deleteBtn.onclick = (e)=>{
            
            console.log(e.target.getAttribute('_id'));
            deleteVideo(e.target.getAttribute('_id'))
        }

        videoMetaData.appendChild(videoTitle);
        videoMetaData.appendChild(channelName);
        videoMetaData.appendChild(viewCount);

        videoTile.appendChild(thumbnail);
        videoTile.appendChild(videoMetaData);
        videoTile.appendChild(deleteBtn)
        videoTile.appendChild(editBtn)

        videoContainer.appendChild(videoTile);

        
        
    });
}





function deleteVideo(id){
    fetch(`http://localhost:8000/video/${id}`,{
        method : "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then(function (a) {
            return a.json(); // call the json method on the response to get JSON
        })
        .then(function (json) {
            getMyVideos()
    })
}

