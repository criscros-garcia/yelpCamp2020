let express = require("express");
let app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  
  var campgrounds = [
    {name: "Winsconsin", url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"},
    {name: "New York", url: "http://www.totalescape.com/GIFS/waterz/lakes/crowley/crowleylake.JPG"},
    {name: "California", url: "https://image.shutterstock.com/image-photo/camping-under-stars-bonfire-tent-260nw-639243067.jpg"},
  ]
  res.render("index", {campgrounds:campgrounds});
});


app.listen(process.env.PORT || 3000, process.env.IP, function(){
  console.log("YelpCamp server has started!");
});