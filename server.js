const express = require("express");
const db = require("./models/db");
const Tasks = require("./models/Tasks");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;

//get requests
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/styles.css", (req,res) => {
    res.sendFile(__dirname + "/public/styles.css");
});
app.get("/images/bg.jpg", (req,res) => {
    res.sendFile(__dirname + "/public/images/bg.jpg");
});

app.get("/script.js", (req,res) => {
    res.sendFile(__dirname + "/public/script.js");
});

app.get("/api/todo", async (req,res) => {
    try {
        const taskList = await Tasks.find({});
        res.json(taskList);
    } catch (error) {
        console.log(error);
    }
});

// post request
app.post("/", async (req,res) => {
    if(req.body.type === 1) {
        try {
            const result = await Tasks.findByIdAndUpdate(req.body.id, {complete: req.body.content});
            console.log('updated', result);
        }
        catch (error) {
            console.log('error to update: ', error);
        }
    }
    else if(req.body.type === 2) {
        await Tasks.findByIdAndDelete(req.body.id);
        console.log('deleted');
    }
    else {
        const task = new Tasks(req.body);
        try {
            await task.save();
            console.log("new task added");
        }
        catch(err) {
            console.log("error to save", err);
        }
    }
});

// connect with db and start server
db.init()
.then(() => {
    console.log("db connected");
    app.listen(PORT, ()=> {
        console.log("server is running at " + PORT);
    });
})
.catch((err) => {
    console.log(err);
});