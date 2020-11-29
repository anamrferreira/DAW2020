var express = require('express');
var router = express.Router();
var Student = require('../controllers/student')

/* GET home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET students list page */
router.get('/students', function(req, res) {
  // Data retrieve
  Student.list()
    .then(data => res.render('students', { list: data }))
    .catch(err => res.render('error',{ error: err }));
});

/* GET single student page */
router.get('/students/:id', function(req, res) {
  var id = req.params.id

  // Data retrieve
  Student.lookUp(id)
    .then(data => res.render('student', { student: data }))
    .catch(err => res.render('error',{ error: err }));
});

/* GET add student form page */
router.get('/add', function(req, res) {
  res.render('add_student', { title: 'Add New Student' });
});


/* POST student */
router.post('/addStudent', function(req, res) {
  var body = req.body
  
  body.tpc = createTPCArray(body)
  console.log(body);

  Student.insert(body)
    .then(data => res.render('student', { student: body }))
    .catch(err => res.render('error',{ error: err }));
});

/* GET edit student form page */
router.get('/students/edit/:id', function(req, res) {
  var id = req.params.id

  // Data retrieve
  Student.lookUp(id)
    .then(data => res.render('edit_student', { student: data }))
    .catch(err => res.render('error',{ error: err }));
});

/* PUT student */
router.put('/students/edit', function(req, res) {
  var body = req.body
  
  body.tpc = createTPCArray(body)
  console.log(body);

  Student.edit(body)
    .then(data => res.render('student', { student: body }))
    .catch(err => res.render('error',{ error: err }));
});

/* DELETE student */
router.delete('/students/delete/:id', function(req, res) {
  var id = req.params.id

  Student.delete(id)
    .then(data => {
      Student.list()
        .then(data => res.render('students', { list: data }))
        .catch(err => res.render('error',{ error: err }));
    })
    .catch(err => res.render('error',{ error: err }));
});



function createTPCArray(body) {
  tpc = []

  if (body.tp1 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tp2 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tp3 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tp4 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tp5 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tp6 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tp7 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tp8 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  delete body.tp1
  delete body.tp2
  delete body.tp3
  delete body.tp4
  delete body.tp5
  delete body.tp6
  delete body.tp7
  delete body.tp8

  return tpc
}

module.exports = router;
