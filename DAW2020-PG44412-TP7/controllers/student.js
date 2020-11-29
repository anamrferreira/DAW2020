// Student controller

var Student = require('../models/student')

// List all
module.exports.list = () => {
    return Student
    .find()
    .sort({nome: 1})
    .exec()
}

// Find one
module.exports.lookUp = id => {
    return Student
    .findOne({numero: id})
    .exec()
}

// Insert
module.exports.insert = student => {
    var newStudent = new Student(student)
    return newStudent.save()
}

// Edit
module.exports.edit = student => {
    return Student 
    .updateOne({numero: student.numero}, {$set: {nome: student.nome, git: student.git, tpc: student.tpc}})
    .exec()
} 

// Delete
module.exports.delete = id => {
    return Student 
    .deleteOne({numero: id})
    .exec()
} 