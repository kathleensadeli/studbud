const express = require('express');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const musics = './static/musics/';


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
    app.listen(8888, () => console.log("Server Up and running"));
});


const trackList=[{
    id:1,
    name:"Bedtime after a coffee",
    artist:"Barradeen",
    image:"static/musics/images/Barradeen.jpg",
    path:"static/musics/bedtime.mp3"
},{
    id:2,
    name:"Devyzed Downtown",
    artist:"Ghostrifter Official",
    image:"static/musics/images/Ghostrifter official.jpg",
    path:"static/musics/devyzed.mp3"
},{
    id:3,
    name:"Ethereal",
    artist:"Ghostrifter Official",
    image:"static/musics/images/Ghostrifter official.jpg",
    path:"static/musics/ethereal.mp3"
},{
    id:4,
    name:"Morning Routine",
    artist:"Ghostrifter Official",
    image:"static/musics/images/Ghostrifter official.jpg",
    path:"static/musics/morningroutine.mp3"
},{
    id:5,
    name:"Flamingo",
    artist:"Kidcut",
    image:"static/musics/images/kidcut.jpg",
    path:"static/musics/flamingo.mp3"
},{
    id:6,
    name:"End Credits",
    artist:"Mountaineer",
    image:"static/musics/images/Mountaineer.jpg",
    path:"static/musics/endcredits.mp3"
},{
    id:7,
    name:"Fly Away",
    artist:"Mountaineer",
    image:"static/musics/images/Mountaineer.jpg",
    path:"static/musics/flyaway.mp3"
},{
    id:8,
    name:"Cozy",
    artist:"Prigida",
    image:"static/musics/images/Prigida.jpg",
    path:"static/musics/cozy.mp3"
},{
    id:9,
    name:"Mellow Bop",
    artist:"Prigida",
    image:"static/musics/images/Prigida.jpg",
    path:"static/musics/mellowbop.mp3"
},{
    id:10,
    name:"Moonshine",
    artist:"Prigida",
    image:"static/musics/images/Prigida.jpg",
    path:"static/musics/moonshine.mp3"
},{
    id:11,
    name:"Midnight Snack",
    artist:"Purrple Cat",
    image:"static/musics/images/Purrple cat.jpg",
    path:"static/musics/midnightsnack.mp3"
},{
    id:12,
    name:"Missing You",
    artist:"Purrple Cat",
    image:"static/musics/images/Purrple cat.jpg",
    path:"static/musics/missingyou.mp3"
},{
    id:13,
    name:"Your Love is What I Need",
    artist:"Soundroll",
    image:"static/musics/images/Soundroll.jpg",
    path:"static/musics/yourloveiswhatineed.mp3"
},{
    id:14,
    name:"Mellow Skies",
    artist:"Tatami",
    image:"static/musics/images/Tatami.jpg",
    path:"static/musics/mellowskies.mp3"
},{
    id:15,
    name:"Name",
    artist:"Walz",
    image:"static/musics/images/Walz.jpg",
    path:"static/musics/name.mp3"
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



