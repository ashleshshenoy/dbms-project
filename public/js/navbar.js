function collapse() {
    let sidebar = document.getElementsByClassName("sidebar")[0];
    if(document.body.clientWidth > 600){
      if (sidebar.style.width != "200px") {
        sidebar.style.width = "200px";
        sidebar.style.alignItems = "center";
        sidebar.style.textAlign = "left";
      
      } else {
        sidebar.style.width = "80px";
        sidebar.style.textAlign = "center";
        sidebar.style.alignItems = "start";
      }
    }
    else{
      if(sidebar.style.display == "none") 
        sidebar.style.display = "flex";
      else
        sidebar.style.display = "none";

      
    }
  }


const searchBtn = document.querySelector("#search-btn");
const searchBar = document.querySelector("#search-bar");
searchBtn.onclick = function(){
    window.location.href = `http://localhost:8000/views/search.html?search=${searchBar.value}`;
}