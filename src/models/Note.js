const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    note_id: String,
    note: String
});

const Note = mongoose.model('Note',NoteSchema,'observations');

module.exports = {Note};