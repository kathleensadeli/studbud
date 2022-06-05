const express = require('express');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');


const app = express();
// Import Modal 
const TodoTask = require("./models/TodoTask");
const Progress = require("./models/Progress");

const Group = require("./models/Group");
const Resource = require("./models/Resource");

//Load Config from database
dotenv.config();
//Set EJS and Folder Static as Main
app.use("/static",express.static('static'));
app.set('views', 'static/views')
app.set("view engine", "ejs");

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//connection to db
mongoose.connect(process.env.DB_CONNECT).then(()=>{
    app.listen(9999, () => console.log("Server Up and running in Port 9999"));
});


//TrackList for Music Player and Music Page
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
//POST METHOD And insert to mongodb todotasks collection from Todo Modal In Todo Page
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
//POST PROGRESS And insert to mongodb progresses collection from Progress Modal In Todo Page
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


// GET METHOD SENDING List of Progresses and TodoTask to Todo Page also Title for Tab
app.get("/", (req, res) => {
    Progress.find({}, (err, progresses) => {
        if(err){
            console.log(err);
        }else{
            TodoTask.find({}, (err, todoTasks)=>{
                res.render("index.ejs", { progresses : progresses, todoTasks : todoTasks, title:"Task List"});
            })
        } 
    });
});


//EDIT data Task from Modal and update the data to mongodb
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

//EDIT data Progress from Modal and update the data to mongodb
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
//GET groups and resources list from mongodb and send it to Bookmarks page also with title bookmark
app.get("/bookmarks", (req, res) => {
    Group.find({}, (err, groups) => {
        if(err){
            console.log(err);
        }else{
            Resource.find({}, (err, resources)=>{
                res.render("bookmark.ejs", { groups : groups, resources : resources, title:"Bookmark"});
            })
        } 
    });
});

//POST RESOURCE METHOD to insert form resource to mongodb from Resource Modal in Bookmark Page
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


//POST Group METHOD to insert form group to mongodb from Grpi[] Modal in Bookmark Page
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

//EDIT RESOURCE Data from edit resource modal and update to mongo db
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

//EDIT Group Data from edit group modal and update to mongo db
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
// GET METHOD Send Title and TrackList
app.get("/clock", (req, res) => {
    res.render("clock.ejs", { title:"Clock"})
});


//MUSIC ROUTES
// GET METHOD Open the page and sending trackList and Title for Tab
app.get("/music", (req, res) => {
    res.render("music.ejs",{trackList:trackList, title:"Music"});      
});


