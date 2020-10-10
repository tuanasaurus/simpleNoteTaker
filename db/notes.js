const util = require('util');
const fs = require('fs');

// until.promisify taking a function following the common error
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//Creating the class notes constructor and GET notes

class Notes {
    constructor () {
        this.idDum = 0;
    }
    read() {
        return readFileAsync("db/db.json", "utf8");
    }
    write(note) {
        return writeFileAsync("db/db.json", JSON.stringify(note))
    }
    getNotes() {
        console.logs("get notes")
        return this.read().then(notes => {
            console.log(notes)
            let notesArray;
            try {
             notesArray = [].concat(JSON.parse(notes));
            }
            catch (err) {
                notesArray = [];
            }
            return notesArray;
            })
    }
    // Adding notes with title and text
    addNotes(note) {
        console.log("add notes");
        const { title, text } = note;
        const newNote = { title, text, id: ++this.idDum }
        return this.getNotes()
            .then(notes => [...notes, newNote])
            .then(updateNotes => this.write(updateNotes))
            .then(() => newNote)
    }
    // Remove notes
    removeNote(id) {
        console.log("remove note");
        return this.getNotes()
            .then(notes => notes.filter(note => note.id !== parseInt(id)))
            .then(updatedNotes => this.write(updatedNotes))
    }
}

module.exports = new Notes();