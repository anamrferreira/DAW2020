var http = require('http');
const axios = require('axios');
const stylelink = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">';

http.createServer(function (req, res) {
    console.log(req.method + ' ' + req.url);
    if(req.method == 'GET')
    {
        if(req.url == '/'){
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(stylelink);
            res.write('<div class="d-block p-2 bg-dark text-white"><center><h1>Escola de Música</h1></center></div>');
            res.write('<div style="font-size:20;padding-left:150px;padding-right:150px;margin-top:10px" class="list-group">');
            res.write('<a href=/alunos class="list-group-item list-group-item-action">Lista de Alunos</a>');
            res.write('<a href=/cursos class="list-group-item list-group-item-action">Lista de Cursos</a>');
            res.write('<a href=/instrumentos class="list-group-item list-group-item-action">Lista de Instrumentos</a>');
            res.write('</div>');
            res.end();
        }
        else if(req.url == '/alunos' || req.url.match(/\/alunos\?_page=[0-9]+$/)){
            if (req.url == '/alunos') {
                var page = 1;
            }
            else{
                var page = req.url.replace('/alunos?_page=', '');
            }
            axios.get('http://localhost:3000/alunos?_page=' + page)
                .then(function (resp) {
                    alunos = resp.data;
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(stylelink);
                    res.write('<title>Alunos</title>')
                    res.write('<div class="d-block p-2 bg-dark text-primary"><center><h2>Escola de Música</h2></center></div>');
                    res.write('<div class="d-block p-2 bg-dark text-white"><center><h3>Lista de Alunos</h3></center></div>');
                    res.write('<div style="padding-left:150px;padding-right:150px;margin-top:10px" class="list-group">');
                    alunos.forEach(a => {
                        res.write('<a href=/alunos/' + a.id + ' class="list-group-item list-group-item-action"><span style="font-size:14" class="badge badge-primary">' + a.id + '</span>&emsp;' + a.nome + '</a>')
                    });
                    res.write('</div>');

                    var pages = resp.headers.link.split(',');
                    var flag = false;
                    res.write('<center>');
                    res.write('<div style="margin:10px" class="btn-group center" role="group">');
                    res.write('<button type="button" class="btn btn-primary active"><a style="color:white;text-decoration:none" href="/">Index</a></button>');
                    pages.forEach(p => {
                        if (p.includes("first") && page != 1)
                            res.write('<button type="button" class="btn btn-primary"><a style="color:white;text-decoration:none" href="/alunos?_page=1">Início</a></button>');
                        else if (p.includes("next")){
                            res.write('<button type="button" class="btn btn-primary"><a style="color:white;text-decoration:none" href="' + p.split(';')[0].replace('<http://localhost:3000', '').replace('>','') + '" >Seguinte</a></button>');
                            flag = true;
                        }
                        else if (p.includes("prev"))
                            res.write('<button type="button" class="btn btn-primary"><a style="color:white;text-decoration:none" href="' + p.split(';')[0].replace('<http://localhost:3000', '').replace('>','') + '" >Anterior</a></button>');
                        else if (p.includes("last") && flag)
                            res.write('<button type="button" class="btn btn-primary"><a style="color:white;text-decoration:none" href="' + p.split(';')[0].replace('<http://localhost:3000', '').replace('>','') + '" >Fim</a></button>');
                    });
                    res.write('</div>');
                    res.write('</center>');

                    res.end();
                })
                .catch(function (error) {
                    console.log('Erro na obtenção da lista de alunos: ' + error);
                });
        }
        else if(req.url.match(/\/alunos\/(A|PG|AE-)[0-9]+$/)){
            var id = req.url.split("/")[2];

            axios.get('http://localhost:3000/alunos/' + id)
                .then(function (resp) {
                    aluno = resp.data;
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(stylelink);
                    res.write('<title>Aluno ' + id + '</title>')
                    res.write('<div class="d-block p-2 bg-dark text-primary"><center><h2>Escola de Música</h2></center></div>');
                    res.write('<div class="d-block p-2 bg-dark text-white"><center><h3>Informação do Aluno</h3></center></div>');
                    
                    res.write('<center><table style="width:50%;margin-top:10px" class="table table-hover"><tbody>');
                    res.write('<tr><th scope="row">ID:</th><td>' + aluno.id + '</td></tr>');
                    res.write('<tr><th scope="row">Nome:</th><td>' + aluno.nome + '</td></tr>');
                    res.write('<tr><th scope="row">Data de Nascimento:</th><td>' + aluno.dataNasc + '</td></tr>');
                    res.write('<tr><th scope="row">Curso:</th><td>' + aluno.curso + '</td></tr>');
                    res.write('<tr><th scope="row">Ano do Curso:</th><td>' + aluno.anoCurso + '</td></tr>');
                    res.write('<tr><th scope="row">Instrumento:</th><td>' + aluno.instrumento + '</td></tr>');
                    res.write('</tbody></table></center>');
   
                    res.write('<div style="font-size:20;margin:10px">');
                    res.write('<center><a class="btn btn-primary" href="/alunos">Voltar</a></center>');
                    res.write('</div>');

                    res.end();
                })
                .catch(function (error) {
                    console.log('Erro na obtenção da informação do aluno: ' + error);
                });
        }
        else if(req.url == '/cursos' || req.url.match(/\/cursos\?_page=[0-9]+$/)){
            if (req.url == '/cursos') {
                var page = 1;
            }
            else{
                var page = req.url.replace('/cursos?_page=', '');
            }
            axios.get('http://localhost:3000/cursos?_page=' + page)
                .then(function (resp) {
                    cursos = resp.data;
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(stylelink);
                    res.write('<title>Cursos</title>')
                    res.write('<div class="d-block p-2 bg-dark text-primary"><center><h2>Escola de Música</h2></center></div>');
                    res.write('<div class="d-block p-2 bg-dark text-white"><center><h3>Lista de Cursos</h3></center></div>');
                    res.write('<div style="padding-left:150px;padding-right:150px;margin-top:10px" class="list-group">');
                    cursos.forEach(c => {
                        res.write('<a href=/cursos/' + c.id + ' class="list-group-item list-group-item-action"><span style="font-size:14" class="badge badge-primary">' + c.id + '</span>&emsp;' + c.designacao + '</a>')
                    });
                    res.write('</div>');

                    var pages = resp.headers.link.split(',');
                    var flag = false;
                    res.write('<center>');
                    res.write('<div style="margin:10px" class="btn-group center" role="group">');
                    res.write('<button type="button" class="btn btn-primary active"><a style="color:white;text-decoration:none" href="/">Index</a></button>');
                    pages.forEach(p => {
                        if (p.includes("first") && page != 1)
                            res.write('<button type="button" class="btn btn-primary"><a style="color:white;text-decoration:none" href="/cursos?_page=1">Início</a></button>');
                        else if (p.includes("next")){
                            res.write('<button type="button" class="btn btn-primary"><a style="color:white;text-decoration:none" href="' + p.split(';')[0].replace('<http://localhost:3000', '').replace('>','') + '" >Seguinte</a></button>');
                            flag = true;
                        }
                        else if (p.includes("prev"))
                            res.write('<button type="button" class="btn btn-primary"><a style="color:white;text-decoration:none" href="' + p.split(';')[0].replace('<http://localhost:3000', '').replace('>','') + '" >Anterior</a></button>');
                        else if (p.includes("last") && flag)
                            res.write('<button type="button" class="btn btn-primary"><a style="color:white;text-decoration:none" href="' + p.split(';')[0].replace('<http://localhost:3000', '').replace('>','') + '" >Fim</a></button>');
                    });
                    res.write('</div>');
                    res.write('</center>');

                    res.end();
                })
                .catch(function (error) {
                    console.log('Erro na obtenção da lista de cursos: ' + error);
                });
        }
        else if(req.url.match(/\/cursos\/(CS|CB)[0-9]+$/)){
            var id = req.url.split("/")[2];

            axios.get('http://localhost:3000/cursos/' + id)
                .then(function (resp) {
                    curso = resp.data;
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(stylelink);
                    res.write('<title>Curso ' + id + '</title>')
                    res.write('<div class="d-block p-2 bg-dark text-primary"><center><h2>Escola de Música</h2></center></div>');
                    res.write('<div class="d-block p-2 bg-dark text-white"><center><h3>Informação do Curso</h3></center></div>');
                    
                    res.write('<center><table style="width:50%;margin-top:10px" class="table table-hover"><tbody>');
                    res.write('<tr><th scope="row">ID:</th><td>' + curso.id + '</td></tr>');
                    res.write('<tr><th scope="row">Designação:</th><td>' + curso.designacao + '</td></tr>');
                    res.write('<tr><th scope="row">Duração:</th><td>' + curso.duracao + '</td></tr>');
                    res.write('<tr><th scope="row">Instrumento:</th><td><span class="badge badge-pill badge-light">' + curso.instrumento.id + '</span>&emsp;' + curso['instrumento']['#text'] + '</td></tr>');
                    res.write('</tbody></table></center>');
   
                    res.write('<div style="font-size:20;margin:10px">');
                    res.write('<center><a class="btn btn-primary" href="/cursos">Voltar</a></center>');
                    res.write('</div>');

                    res.end();
                })
                .catch(function (error) {
                    console.log('Erro na obtenção da informação do curso: ' + error);
                });
        }
        else if(req.url == '/instrumentos' || req.url.match(/\/instrumentos\?_page=[0-9]+$/)){
            if (req.url == '/instrumentos') {
                var page = 1;
            }
            else{
                var page = req.url.replace('/instrumentos?_page=', '');
            }
            axios.get('http://localhost:3000/instrumentos?_page=' + page)
                .then(function (resp) {
                    instrumentos = resp.data;
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(stylelink);
                    res.write('<title>Instrumentos</title>')
                    res.write('<div class="d-block p-2 bg-dark text-primary"><center><h2>Escola de Música</h2></center></div>');
                    res.write('<div class="d-block p-2 bg-dark text-white"><center><h3>Lista de Instrumentos</h3></center></div>');
                    res.write('<div style="padding-left:150px;padding-right:150px;margin-top:10px" class="list-group">');
                    instrumentos.forEach(i => {
                        res.write('<a href=/instrumentos/' + i.id + ' class="list-group-item list-group-item-action"><span style="font-size:14" class="badge badge-primary">' + i.id + '</span>&emsp;' + i['#text'] + '</a>')
                    });
                    res.write('</div>');

                    var pages = resp.headers.link.split(',');
                    var flag = false;
                    res.write('<center>');
                    res.write('<div style="margin:10px" class="btn-group center" role="group">');
                    res.write('<button type="button" class="btn btn-primary active"><a style="color:white;text-decoration:none" href="/">Index</a></button>');
                    pages.forEach(p => {
                        if (p.includes("first") && page != 1)
                            res.write('<button type="button" class="btn btn-primary"><a style="color:white;text-decoration:none" href="/instrumentos?_page=1">Início</a></button>');
                        else if (p.includes("next")){
                            res.write('<button type="button" class="btn btn-primary"><a style="color:white;text-decoration:none" href="' + p.split(';')[0].replace('<http://localhost:3000', '').replace('>','') + '" >Seguinte</a></button>');
                            flag = true;
                        }
                        else if (p.includes("prev"))
                            res.write('<button type="button" class="btn btn-primary"><a style="color:white;text-decoration:none" href="' + p.split(';')[0].replace('<http://localhost:3000', '').replace('>','') + '" >Anterior</a></button>');
                        else if (p.includes("last") && flag)
                            res.write('<button type="button" class="btn btn-primary"><a style="color:white;text-decoration:none" href="' + p.split(';')[0].replace('<http://localhost:3000', '').replace('>','') + '" >Fim</a></button>');
                    });
                    res.write('</div>');
                    res.write('</center>');

                    res.end();
                })
                .catch(function (error) {
                    console.log('Erro na obtenção da lista de instrumentos: ' + error);
                });
        }
        else if(req.url.match(/\/instrumentos\/(I|X)[0-9]+$/)){
            var id = req.url.split("/")[2];

            axios.get('http://localhost:3000/instrumentos/' + id)
                .then(function (resp) {
                    instrumento = resp.data;
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(stylelink);
                    res.write('<title>Instrumento ' + id + '</title>')
                    res.write('<div class="d-block p-2 bg-dark text-primary"><center><h2>Escola de Música</h2></center></div>');
                    res.write('<div class="d-block p-2 bg-dark text-white"><center><h3>Informação do Instrumento</h3></center></div>');
                    
                    res.write('<center><table style="width:50%;margin-top:10px" class="table table-hover"><tbody>');
                    res.write('<tr><th scope="row">ID:</th><td>' + instrumento.id + '</td></tr>');
                    res.write('<tr><th scope="row">Designação:</th><td>' + instrumento['#text'] + '</td></tr>');
                    res.write('</tbody></table></center>');
   
                    res.write('<div style="font-size:20;margin:10px">');
                    res.write('<center><a class="btn btn-primary" href="/instrumentos">Voltar</a></center>');
                    res.write('</div>');

                    res.end();
                })
                .catch(function (error) {
                    console.log('Erro na obtenção da informação do instrumento: ' + error);
                });
        }
        else{
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write("<p>Pedido não suportado: " + req.method + " " + req.url + "</p>");
            res.end();
       }
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write("<p>Pedido não suportado: " + req.method + " " + req.url + "</p>");
        res.end();
    }
}).listen(4000);
console.log('Servidor à escuta na porta 4000...')