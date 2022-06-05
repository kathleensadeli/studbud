const express = require('express');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const musics = './static/musics/';
const fs = require('fs');
const jsmediatags = require("jsmediatags");


const app = express();
const TodoTask = require("./models/TodoTask");
const Progress = require("./models/Progress");

const Group = require("./models/Group");
const Resource = require("./models/Resource");



dotenv.config();
app.use("/static",express.static('static'));
app.set('views', 'static/views')
app.set("view engine", "ejs");

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//connection to db
mongoose.connect(process.env.DB_CONNECT).then(()=>{
    app.listen(3000, () => console.log("Server Up and running"));
});


const trackList=[{
    id:1,
    name:"Indigo",
    artist:"Niki",
    image:"static/musics/images/niki1.png",
    path:"static/musics/indigo.mp3"
},{
    id:2,
    name:"Shivers",
    artist:"Ed Sheeran",
    image:"static/musics/images/edsheeran1.png",
    path:"static/musics/shivers.mp3"
},{
    id:3,
    name:"Leave Your Life",
    artist:"Ed Sheeran",
    image:"static/musics/images/edsheeran1.png",
    path:"static/musics/leaveyourlife.mp3"
},{
    id:4,
    name:"Stop The Rain",
    artist:"Ed Sheeran",
    image:"static/musics/images/edsheeran1.png",
    path:"static/musics/stoptherain.mp3"
},{
    id:5,
    name:"Perfect",
    artist:"Ed Sheeran",
    image:"static/musics/images/edsheeran2.png",
    path:"static/musics/perfect.mp3"
},{
    id:6,
    name:"Bad Habits",
    artist:"Ed Sheeran",
    image:"static/musics/images/edsheeran1.png",
    path:"static/musics/badhabits.mp3"
},{
    id:7,
    name:"Willow",
    artist:"Taylor Swift",
    image:"static/musics/images/taylor1.png",
    path:"static/musics/willow.mp3"
},{
    id:8,
    name:"Positions",
    artist:"Arianna Grande",
    image:"static/musics/images/arianna1.png",
    path:"static/musics/positions.mp3"
},{
    id:9,
    name:"Closure",
    artist:"Taylor Swift",
    image:"static/musics/images/taylor1.png",
    path:"static/musics/closure.mp3"
},{
    id:10,
    name:"Visiting Hours",
    artist:"Ed Sheeran",
    image:"static/musics/images/edsheeran1.png",
    path:"static/musics/visitinghours.mp3"
},{
    id:11,
    name:"Shape of You",
    artist:"Ed Sheeran",
    image:"static/musics/images/edsheeran2.png",
    path:"static/musics/shapeofyou.mp3"
},{
    id:12,
    name:"Gold Rush",
    artist:"Taylor Swift",
    image:"static/musics/images/taylor1.png",
    path:"static/musics/goldrush.mp3"
},{
    id:13,
    name:"Test Drive",
    artist:"Arianna Grande",
    image:"static/musics/images/arianna1.png",
    path:"static/musics/testdrive.mp3"
},{
    id:14,
    name:"Majorie",
    artist:"Taylor Swift",
    image:"static/musics/images/taylor1.png",
    path:"static/musics/majorie.mp3"
},{
    id:15,
    name:"Galway Girl",
    artist:"Ed Sheeran",
    image:"static/musics/images/edsheeran2.png",
    path:"static/musics/galwaygirl.mp3"
}];


//Todo Routes
//POST METHOD
app.post('/task',urlencodedParser,async (req, res) => {
    const todoTask = new TodoTask({
        task: req.body.task,
        dueDate: req.body.dueDate,
        estimatedTime: parseInt(req.body.hour,0)+':'+parseInt(req.body.minute,0),
        progress: req.body.progress,
        priority: req.body.priority
    });
    try {
    await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//TODO
//POST PROGRESS
app.post('/progress',urlencodedParser,async (req, res) => {
    const progress = new Progress({
        name: req.body.progress
    });
    try {
    await progress.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});


// GET METHOD
app.get("/", (req, res) => {
    Progress.find({}, (err, progresses) => {
        if(err){
            console.log(err);
        }else{
            TodoTask.find({}, (err, todoTasks)=>{
                res.render("index.ejs", { progresses : progresses, todoTasks : todoTasks, title:"Task List", trackList:trackList});
            })
        } 
    });
});

app.post('/edit-task',urlencodedParser,async (req, res) => {
    TodoTask.findByIdAndUpdate(req.body.id,{
        task: req.body.task,
        dueDate: req.body.dueDate,
        estimatedTime: parseInt(req.body.hour,0)+':'+parseInt(req.body.minute,0),
        progress: req.body.progress,
        priority: req.body.priority
    },err=>{
        if(err)
            console.log(err)
        else
            res.redirect("/");
    });
});

//EDIT PROGRESS
app.post('/edit-progress',urlencodedParser,async (req, res) => {
    Progress.findByIdAndUpdate(req.body.id,{
        name: req.body.progress
    },err=>{
        if(err)
            console.log(err)
        else
            res.redirect("/");
    });
});




//BOOKMARK ROUTES
app.get("/bookmarks", (req, res) => {
    Group.find({}, (err, groups) => {
        if(err){
            console.log(err);
        }else{
            Resource.find({}, (err, resources)=>{
                res.render("bookmark.ejs", { groups : groups, resources : resources, title:"Bookmark", trackList:trackList});
            })
        } 
    });
});

//POST RESOURCE METHOD
app.post('/resource',urlencodedParser,async (req, res) => {
    const resource = new Resource({
        title: req.body.title,
        content: req.body.content,
        url: req.body.url,
        group: req.body.group
    });
    try {
    await resource.save();
        res.redirect("/bookmarks");
    } catch (err) {
        res.redirect("/bookmarks");
    }
});

//BOOKMAR
//POST GROUP
app.post('/group',urlencodedParser,async (req, res) => {
    const group = new Group({
        name: req.body.group
    });
    try {
    await group.save();
        res.redirect("/bookmarks");
    } catch (err) {
        res.redirect("/bookmarks");
    }
});

//EDIT RESOURCE
app.post('/edit-resource',urlencodedParser,async (req, res) => {
    Resource.findByIdAndUpdate(req.body.id,{
        title: req.body.title,
        content: req.body.content,
        url: req.body.url,
        group: req.body.group
    },err=>{
        if(err)
            console.log(err)
        else
            res.redirect("/bookmarks");
    });
});

//EDIT GROUP
app.post('/edit-group',urlencodedParser,async (req, res) => {
    Group.findByIdAndUpdate(req.body.id,{
        name: req.body.group
    },err=>{
        if(err)
            console.log(err)
        else
            res.redirect("/bookmarks");
    });
});

//CLOCK ROUTES
// GET METHOD
app.get("/clock", (req, res) => {
    res.render("clock.ejs", { title:"Clock", trackList:trackList})
});


//MUSIC ROUTES
// GET METHOD
app.get("/music", (req, res) => {
    res.render("music.ejs",{trackList:trackList, title:"Music"});      
});

app.get("/playlist", (req, res) => {
    
        res.render("playlist.ejs",{title:"Music"});
           
});




function loadPlaylist(callback){
    fs.readdir(musics, (err, files) => {
            if(err){
                console.log(err);
            }else{
                // create array of getTags() promises
                let promises = files.map(file => getTags(file))
                Promise.all(promises).then(results=>{
                    callback(null,results);
                }).catch(err=> console.log('One of the requests failed'))
            }
            
    });
}

function getTags(file) {      
    return new Promise((resolve, reject) => {
        jsmediatags.read("static/musics/"+file, {
            onSuccess: (tag) => {   
                let music = {
                    'title':null,
                    'artist':null,
                    'path':null,
                    'image':null,
                    'format':null,
                };
                let image = tag.tags.picture;
                music['title']=tag.tags.title;
                music['artist']=tag.tags.artist;
                music['path']='/static/musics/'+file;

                if (image) {
                    music['format']=image.format;
                    var base64String = "";
                    for (var i = 0; i < image.data.length; i++) {
                        base64String += String.fromCharCode(image.data[i]);
                    }
                    // var base64 = "data:" + image.format + ";base64," +window.btoa(base64String);
                    // music['image']=base64String;
                    // document.getElementById('picture').setAttribute('src',base64);
                    
                }            
                resolve( music);
            },
            onError: (error) => {                
            reject(error);
            }
        });
    });
}
