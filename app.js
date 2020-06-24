let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/yelpCamp",  {useNewUrlParser: true , useUnifiedTopology: true });

let campSchema = new mongoose.Schema(
  {
    name: String,
    url:  String,
  }
);

let Campground = mongoose.model("Campground", campSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use('/css', express.static('css'));

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, campgrounds){
    if(err){
      console.log(err);
      console.log("Something went wrong");
    }else{
      res.render('index', {campgrounds:campgrounds});
    }
  });
  
});

app.get('/campgrounds/new', function(req, res){
  res.render('new');
});

app.post('/campgrounds', function(req, res){
  let name =  req.body.name;
  let url  =  req.body.image;
  let newCampground = {name:name, url:url}

  Campground.create(newCampground, function(err, newCreated){
    if(err){
      console.log('Error creating a Campground¡');
      console.log(err);
    }else{
      console.log("Campground created succesfully¡")
      res.redirect('campgrounds');
    }
  });
});


app.listen(process.env.PORT || 3000, process.env.IP, function(){
  console.log("YelpCamp server has started!");
});