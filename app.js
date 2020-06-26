let express = require('express');
let app = express();
let methodOverride = require('method-override');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let Campground = require('./models/campground');
let Comment = require('./models/comment');
let seedDB = require('./seed');

mongoose.connect("mongodb://localhost/yelpCamp",  {useNewUrlParser: true , useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use('/css', express.static('css'));
seedDB();
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
  // let name =  req.body.name;
  // let url  =  req.body.image;
  // let description = req.body.description;
  // let newCampground = {name:name, url:url, description:description}

  let newCampground = req.body.campground;

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

app.get('/campgrounds/:id', function(req, res){
  Campground.findById(req.params.id, function(err, foundCamp){
    if(err){
      console.log("Can't be found");
    }else{
      res.render('show', {campground:foundCamp});
    }
  });
});

app.get('/campgrounds/:id/edit', function(req, res){
  Campground.findById(req.params.id, function(err, foundToUpdate){
    if(err){
      console.log('Could not be found to update¡'+ err);
    }else{
      res.render('edit', {campground: foundToUpdate})
    }
  });
});

app.put('/campgrounds/:id', function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
    if(err){
      console.log("Error triying to Update");
      res.redirect('index');
    }else{
      console.log("Succesfull update¡");
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});

app.delete('/campgrounds/:id', function(req, res){
  Campground.findByIdAndDelete(req.params.id, function(err){
    if(err){
      console.log("Error triying to eliminate¡");
      res.redirect("/campgrounds/+req.params.id");
    }else{
      res.redirect('/campgrounds');
    }
  });
});


app.listen(process.env.PORT || 3000, process.env.IP, function(){
  console.log("YelpCamp server has started!");
});