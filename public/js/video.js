

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
        video.src = "http://localhost:8000/user_2_1673198544174.mp4";
        console.log(json)
    })
}






fetchVideo()
