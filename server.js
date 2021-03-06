const fs = require("fs")
const express = require("express");
const path = require("path");
const uuid = require('./public/assets/uuid');
const app = express();
const port = process.env.PORT || 3005;

var notesData = fs.readFileSync(path.join(__dirname, "db/db.json"), "utf8");
var notesJSON = JSON.parse(notesData.toString());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, "public/index.html"))
});

app.get("/notes", (req, res) => {
    return res.sendFile(path.join(__dirname, "public/notes.html"))
})

app.get("/api/notes", (req, res) => {
    return res.json(notesJSON);
})


app.post("/api/notes", function (req, res) {
    const newNote = req.body;
    newNote.id = uuid() ;
    notesJSON.push(newNote)
    console.log(notesJSON);
    
    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notesJSON), function (err) {
        if (err){ throw err; } 
        res.json(newNote);
        
    });
});

app.delete("/api/notes/:id" , (request,response) =>{
    const noteId = request.params.id;
    let newEntryData = notesJSON.filter((note) => note.id != noteId);
    notesJSON = newEntryData;
    fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notesJSON), function (err) {
        if (err) {
        throw err;
        }
        console.log('Cleared entry!');
        response.send(notesJSON);
    })

})

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, "public/index.html"))
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

