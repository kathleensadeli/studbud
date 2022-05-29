const express = require('express');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const app = express();

const TodoTask = require("./models/TodoTask");
const Column = require("./models/Column");

dotenv.config();
app.use("/static",express.static('static'));
app.set('views', 'static/views')
app.set("view engine", "ejs");

// create application/json parser
var jsonParser = bodyParser.json()
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
        estimatedTime: req.body.hour+':'+req.body.minute,
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

// GET METHOD
app.get("/clock", (req, res) => {
    res.render("clock.ejs")
});


// GET METHOD
app.get("/", (req, res) => {
    Column.find({}, (err, columns) => {
        if(err){
            console.log(err);
        }else{
            TodoTask.find({}, (err, todoTask)=>{
                res.render("index.ejs", { columns : columns, todoTask : todoTask});
            })
        }
        
    });
});

//TODO
//POST METHOD
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