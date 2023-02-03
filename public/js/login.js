var myVar;

function myFunction() {
  myVar = setTimeout(showPage, 2000);
}

function showPage() {
  console.log("yello")
  document.getElementsByClassName("loader-container")[0].style.display = "none";    
  const list = document.getElementsByTagName("section")
  for(var i=0; i<list.length; i++) 
    list[i].style.display = "flex";
}
myFunction()



const button = document.getElementById("login-form");
button.onsubmit = (e)=>{
    e.preventDefault();
    console.log("login");
    email = document.getElementById("email");
    password = document.getElementById("password");
    if( email.value != "" && password.value != ""){
        console.log(password.value , email.value)
    }
    fetch("http://localhost:8000/auth/login", {
     
    // Adding method type
    method: "POST",
     
    // Adding body or contents to send
    body: JSON.stringify({
        email : email.value,
        password : password.value
    }),
     
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then((e)=>{
        if(e.status == 200)
        window.location.href = './home.html'
        else if(e.status == 404)
        alert("invalid password or email")
    })
}