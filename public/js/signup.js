
var myVar;
        
function myFunction() {
  myVar = setTimeout(showPage, 3000);
}

function showPage() {
  document.getElementsByClassName("loader-container")[0].style.display = "none";    
  const list = document.getElementsByTagName("section")
  for(var i=0; i<list.length; i++) 
    list[i].style.display = "flex";
}
myFunction()


const form = document.getElementById("signup-form");
form.onsubmit = (e)=>{
    e.preventDefault();
    email = document.getElementById("email");
    password = document.getElementById("password");
    if( email.value != "" && password.value != ""){
        fetch("http://localhost:8000/auth/signup", {
        
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
            alert("user created successfully")
            else if(e.status == 409)
            alert("user already exists !")
        })
    }

}