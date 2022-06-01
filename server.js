const express = require('express');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const musics = './static/musics/';
const fs = require('fs');
const jsmediatags = require("jsmediatags");


const app = express();

const TodoTask = require("./models/TodoTask");
const Column = require("./models/Column");

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



//Todo Routes
//POST METHOD
app.post('/task',urlencodedParser,async (req, res) => {
    const todoTask = new TodoTask({
        task: req.body.task,
        dueDate: req.body.dueDate,
        estimatedTime: parseInt(req.body.hour,0)+':'+parseInt(req.body.minute,0),
        column: req.body.column,
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
//POST COLUMN
app.post('/column',urlencodedParser,async (req, res) => {
    const column = new Column({
        name: req.body.column
    });
    try {
    await column.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});


// GET METHOD
app.get("/", (req, res) => {
    Column.find({}, (err, columns) => {
        if(err){
            console.log(err);
        }else{
            TodoTask.find({}, (err, todoTasks)=>{
                res.render("index.ejs", { columns : columns, todoTasks : todoTasks, title:"Task List"});
            })
        } 
    });
});

app.post('/edit-task',urlencodedParser,async (req, res) => {
    TodoTask.findByIdAndUpdate(req.body.id,{
        task: req.body.task,
        dueDate: req.body.dueDate,
        estimatedTime: parseInt(req.body.hour,0)+':'+parseInt(req.body.minute,0),
        column: req.body.column,
        priority: req.body.priority
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
                res.render("bookmark.ejs", { groups : groups, resources : resources, title:"Bookmark"});
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
    console.log(req.body.id);
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

//CLOCK ROUTES
// GET METHOD
app.get("/clock", (req, res) => {
    res.render("clock.ejs", { title:"Clock"})
});


//MUSIC ROUTES
// GET METHOD
app.get("/music", (req, res) => {
    loadPlaylist((err,callback)=>{
        res.render("music.ejs",{data:callback, title:"Music"});
    });       
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
