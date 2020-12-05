var express = require('express')
var bodyParser = require('body-parser')
var templates = require('./html-templates')
var jsonfile = require('jsonfile')
var logger = require('morgan')
var fs = require('fs')
var multer = require('multer')
var upload = multer({dest: 'uploads/'})

var app = express()

// set logger
app.use(logger('dev'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse appplication/json
app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/', function(req, res) {
    var d = new Date().toISOString().substr(0,16)
    d = d.replace('T', ' ')
    var files = jsonfile.readFileSync('./dbFiles.json')
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
    res.write(templates.fileList(files, d))
    res.end()
})

app.get('/files/upload', function(req, res) {
    var d = new Date().toISOString().substr(0,16)
    d = d.replace('T', ' ')
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
    res.write(templates.fileForm(d))
    res.end()
})

app.get('/files/download/:fname', (req, res) => {
    res.download(__dirname + '/public/fileStore/' + req.params.fname)
})

app.post('/files', upload.array('myFiles'), function(req, res) {
    // req.files is the 'myFiles' array of files
    // req.body will hold the text fields if any
    // multiple files: upload.array(...) => files is an array

    for (var i in req.files){
        let oldPath = __dirname + '/' + req.files[i].path
        let newPath = __dirname + '/public/fileStore/' + req.files[i].originalname

        fs.rename(oldPath, newPath, function (err) {
            if(err) throw err
        })

        if(Array.isArray(req.body.desc)) {
            var description = req.body.desc[i]
        }
        else {
            var description = req.body.desc        
        }

        var d = new Date().toISOString().substr(0,16)
        var files = jsonfile.readFileSync('./dbFiles.json')
        files.push(
            {
                date: d,
                name: req.files[i].originalname,
                size: req.files[i].size,
                mimetype: req.files[i].mimetype,
                desc: description
            }
        )
        jsonfile.writeFileSync('./dbFiles.json', files)
    }
   
    res.redirect('/')
})

app.listen(7701, () => console.log('Servidor à escuta na porta 7701...'))