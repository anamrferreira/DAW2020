var http = require('http')
var aux = require('./mymod.js')
var fs = require('fs')

const port = 7777;

var server = http.createServer(function (req, res) {
    console.log(req.method + " " + req.url + " " + aux.myDateTime());

    var num = req.url.split("/")[2]; // o número da página fica na posição 2

    if(req.url.match(/\/arqs\/[1-9]{1,3}$/))
        if(parseInt(num) <= 122)
        {
            fs.readFile('site/arq' + num + '.html', function(err, data) {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write(data);
                res.end();
            })
        }
        else{
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write("<p>O número da página deve ser menor ou igual a 122.</p>");
            res.end();
        }
    else if(req.url.match(/\/arqs$/))
    {
        fs.readFile('site/index.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(data);
            res.end();
        })
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write("<p>O URL não corresponde ao esperado.</p>");
        res.end();
    }
})

server.listen(port);
console.log('Servidor à escuta na porta ' + port + '...');