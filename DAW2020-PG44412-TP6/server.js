var http = require('http')
var axios = require('axios')
var fs = require('fs')

var static = require('./static')

var {parse} = require('querystring')

// Funções auxiliares
// Recupera a informação da task do request body
function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
            console.log(body)
            callback(parse(body))
        })
    }
}

// Template para a página de confirmação do POST ou PUT
function generateConfirm(task, r, d){
    if (r == 'POST') {
        var status = "inserida"
    }
    else if (r == 'PUT') {
        var status = "atualizada"
    }
    return `
    <html>
        <head>
            <title>Pedido ${r}: ${task.id}</title>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
            <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://www.w3schools.com/lib/w3-colors-metro.css">
        </head>

        <body style="font-family:'Roboto',sans-serif">
            <div class="w3-bar w3-metro-darken w3-xlarge">
                <span class="w3-bar-item w3-mobile"><b>Lista de Tarefas</b></span>
            </div>
            <div id="registo" class="w3-container w3-blue-grey w3-large w3-padding"><b>Tarefa ${task.id} ${status}</b></div>

            <table class="w3-table w3-bordered w3-striped">
                <tr>
                    <th>Data Limite</th>
                    <th>Identificador</th>
                    <th>Responsável</th>
                    <th>Tipo</th>
                    <th>Descrição</th>
                </tr>
                <tr>
                    <td>${task.date}</td>
                    <td>${task.id}</td>
                    <td>${task.name}</td>
                    <td>${task.type}</td>
                    <td>${task.description}</td>
                </tr>
            </table>

            <div class="w3-container">
                    <p><a class="w3-button w3-blue-grey w3-round" href="/tasks">Voltar</a></p>
            </div>

            <footer class="w3-container w3-metro-darken w3-padding-xlarge w3-center">
                <p>Gerado em ${d}, PG44412 &copy; 2020</p>
            </footer>
        </body>
    </html>
    `
}


// Template para a página de confirmação do DELETE
function generateDeleteConfirm(idTask, d){
    return `
    <html>
        <head>
            <title>Pedido DELETE: ${idTask}</title>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
            <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://www.w3schools.com/lib/w3-colors-metro.css">
        </head>

        <body style="font-family:'Roboto',sans-serif">
            <div class="w3-bar w3-metro-darken w3-xlarge">
                <span class="w3-bar-item w3-mobile"><b>Lista de Tarefas</b></span>
            </div>
            <div id="registo" class="w3-container w3-blue-grey w3-large w3-padding"><b>Tarefa ${idTask} eliminada</b></div>
            <div class="w3-container">
                    <p><a class="w3-button w3-blue-grey w3-round" href="/tasks">Voltar</a></p>
            </div>
            <footer class="w3-container w3-metro-darken w3-padding-xlarge w3-center">
                <p>Gerado em ${d}, PG44412 &copy; 2020</p>
            </footer>
        </body>
    </html>
    `
}


// Template para a página da Lista de Tarefas
function generateTasksPage(tasks, d){
  let pagHTML = `
    <html>
        <head>
            <title>Lista de Tarefas</title>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://www.w3schools.com/lib/w3-colors-metro.css">
        </head>

        <body style="font-family:'Roboto',sans-serif">
            <div class="w3-bar w3-metro-darken w3-xlarge">
                <span class="w3-bar-item w3-mobile"><b>Lista de Tarefas</b></span>
                <span class="w3-right w3-mobile">
                    <a class="w3-bar-item w3-button w3-mobile" href="#registo">Registo</a>
                    <a class="w3-bar-item w3-button w3-mobile" href="#pendentes">Pendentes</a>
                    <a class="w3-bar-item w3-button w3-mobile" href="#cumpridas">Cumpridas</a>
                </span>
            </div>

            <!-- REGISTO DE TAREFAS -->
            <div id="registo" class="w3-container w3-blue-grey w3-large w3-padding"><b>Registo da Tarefa</b></div>
            <form class="w3-container w3-padding" action="/tasks" method="POST">
                <label><b>Identificador</b></label>
                <input style="height:38px;margin-bottom:5px" class="w3-input w3-border w3-light-grey" type="text" name="id" placeholder="T#">
        
                <label><b>Nome do Responsável</b></label>
                <input style="height:38px;margin-bottom:5px" class="w3-input w3-border w3-light-grey" type="text" name="name">

                <label><b>Tipo</b></label>
                <select style="height:38px;margin-bottom:5px" class="w3-select w3-border w3-light-grey" name="type">
                    <option value="" disabled selected>Selecione uma opção</option>
                    <option value="Importância baixa">Importância baixa</option>
                    <option value="Normal">Normal</option>
                    <option value="Importância elevada">Importância elevada</option>
                    <option value="Urgente">Urgente</option>
                </select>

                <label><b>Descrição</b></label>
                <input style="height:38px;margin-bottom:5px" class="w3-input w3-border w3-light-grey" type="text" name="description">

                <label><b>Data Limite</b></label>
                <input style="height:38px;margin-bottom:10px" class="w3-input w3-border w3-light-grey" type="text" name="date" placeholder="yyyy-mm-dd">
                
                <input class="w3-button w3-blue-grey w3-round" type="submit" value="Registar"/>
                <input class="w3-button w3-blue-grey w3-round" type="reset" value="Limpar valores"/> 
            </form>

            <!-- TAREFAS PENDENTES-->
            <div id="pendentes" class="w3-container w3-blue-grey w3-large w3-padding"><b>Tarefas Pendentes</b></div>
            <table class="w3-table w3-bordered w3-striped">
                <tr>
                    <th style="width:10%"></th>
                    <th style="width:10%">Data Limite</th>
                    <th style="width:10%">Identificador</th>
                    <th style="width:20%">Responsável</th>
                    <th style="width:15%">Tipo</th>
                    <th style="width:35%">Descrição</th>
                </tr>
  `
  tasks.forEach(t => {
    if (t.status != 'done'){
        pagHTML += `
            <tr>
                <td>
                    <a class="w3-button w3-blue-grey w3-round w3-hover-green" href="/tasks/${t.id}/done">
                        <span style="font-size:18px" class="material-icons">done</span>
                    </a>
                    <a class="w3-button w3-blue-grey w3-round w3-hover-blue" href="/tasks/${t.id}/edit">
                        <span style="font-size:18px" class="material-icons">edit</span>
                    </a>
                </td>
                <td>${t.date}</td>
                <td>${t.id}</td>
                <td>${t.name}</td>
                <td>${t.type}</td>
                <td>${t.description}</td>
            </tr>        
        `
    }
  });

  pagHTML += `
            </table>

            <!-- TAREFAS CUMPRIDAS -->
            <div id="cumpridas" class="w3-container w3-blue-grey w3-large w3-padding"><b>Tarefas Cumpridas</b></div>
            <table class="w3-table w3-bordered w3-striped">
                <tr>
                    <th style="width:10%"></th>
                    <th style="width:10%">Data Limite</th>
                    <th style="width:10%">Identificador</th>
                    <th style="width:20%">Responsável</th>
                    <th style="width:15%">Tipo</th>
                    <th style="width:35%">Descrição</th>
                </tr>
    `
    tasks.forEach(t => {
        if (t.status == 'done'){
            pagHTML += `
                    <tr>
                        <td class="w3-center">
                            <a class="w3-button w3-blue-grey w3-round w3-hover-red" href="/tasks/${t.id}/delete">
                                <span style="font-size:18px" class="material-icons">delete</span>
                            </a>
                        </td>
                        <td>${t.date}</td>
                        <td>${t.id}</td>
                        <td>${t.name}</td>
                        <td>${t.type}</td>
                        <td>${t.description}</td>
                    </tr>        
            `
        }
    });

    pagHTML += `
            </table>
            
            <footer class="w3-container w3-metro-darken w3-padding-xlarge w3-center">
                <p>Gerado em ${d}, PG44412 &copy; 2020</p>
            </footer>
        </body>
    </html>
  `
  return pagHTML
}


// Template para o formulário de alteração de task
function generateEditForm(t, d){
    return `
    <html>
        <head>
            <title>Alteração da tarefa: ${t.id}</title>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://www.w3schools.com/lib/w3-colors-metro.css">
        </head>

        <body style="font-family:'Roboto',sans-serif">
            <div class="w3-bar w3-metro-darken w3-xlarge">
                <span class="w3-bar-item w3-mobile"><b>Lista de Tarefas</b></span>
            </div>

            <div id="registo" class="w3-container w3-blue-grey w3-large w3-padding"><b>Alteração da tarefa: ${t.id}</b></div>
            
            <form class="w3-container w3-padding" action="/tasks/${t.id}/edit" method="POST">
                <label><b>Identificador</b></label>
                <input style="height:38px;margin-bottom:5px" class="w3-input w3-border w3-white" type="text" name="id" value="${t.id}" disabled>
        
                <label><b>Nome do Responsável</b></label>
                <input style="height:38px;margin-bottom:5px" class="w3-input w3-border w3-light-grey" type="text" name="name" value="${t.name}">

                <label><b>Tipo</b></label>
                <select style="height:38px;margin-bottom:5px" class="w3-select w3-border w3-light-grey" name="type">
                    <option value="${t.type}" selected>${t.type}</option>
                    <option value="Importância baixa">Importância baixa</option>
                    <option value="Normal">Normal</option>
                    <option value="Importância elevada">Importância elevada</option>
                    <option value="Urgente">Urgente</option>
                </select>

                <label><b>Descrição</b></label>
                <input style="height:38px;margin-bottom:5px" class="w3-input w3-border w3-light-grey" type="text" name="description" value="${t.description}">

                <label><b>Data Limite</b></label>
                <input style="height:38px;margin-bottom:10px" class="w3-input w3-border w3-light-grey" type="text" name="date" placeholder="yyyy-mm-dd" value="${t.date}">
                
                <input class="w3-button w3-blue-grey w3-round" type="submit" value="Editar"/>
                <input class="w3-button w3-blue-grey w3-round" type="reset" value="Limpar valores"/> 
            </form>

            <footer class="w3-container w3-metro-darken w3-padding-xlarge w3-center">
                <p>Gerado em ${d}, PG44412 &copy; 2020</p>
            </footer>
        </body>
    </html>
    `
}


// Criação do servidor
var tasksServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    d = d.replace('T',' ')
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido
    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req,res)
    }
    else {
        switch(req.method){
            case "GET": 
                // GET /tasks --------------------------------------------------------------------
                if((req.url == "/") || (req.url == "/tasks")){
                    axios.get("http://localhost:3000/tasks?_sort=date,name,description")
                        .then(response => {
                            var tasks = response.data
                            
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(generateTasksPage(tasks, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possí­vel obter a lista de tarefas...")
                            res.end()
                        })
                }
                // GET /tasks/:id/edit --------------------------------------------------------------------
                else if(/\/tasks\/(T)[0-9]+\/edit/.test(req.url)){
                    var idTask = req.url.split("/")[2]

                    axios.get("http://localhost:3000/tasks/" + idTask)
                    .then( response => {
                        let t = response.data
                        
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(generateEditForm(t, d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possí­vel obter o registo da tarefa...")
                        res.end()
                    })
                }
                // GET /tasks/:id/done --------------------------------------------------------------------
                else if(/\/tasks\/(T)[0-9]+\/done/.test(req.url)){
                    var idTask = req.url.split("/")[2]
                    var request = "PUT"

                    axios.get("http://localhost:3000/tasks/" + idTask)
                    .then( response => {
                        resultado = response.data;
                        resultado["status"] = "done"
                        console.log('PUT de tarefa:' + JSON.stringify(resultado))
                        
                        axios.put('http://localhost:3000/tasks/' + idTask, resultado)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(generateConfirm(resp.data, request, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no PUT: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possí­vel obter o registo da tarefa...")
                        res.end()
                    })
                }
                // GET /tasks/:id/delete --------------------------------------------------------------------
                else if(/\/tasks\/(T)[0-9]+\/delete/.test(req.url)){
                    var idTask = req.url.split("/")[2]
                    
                    axios.delete("http://localhost:3000/tasks/" + idTask)
                    .then(resp => {                        
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(generateDeleteConfirm(idTask, d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write('<p>Erro no DELETE: ' + erro + '</p>')
                        res.end()
                    })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                break
            case "POST":
                // POST /tasks --------------------------------------------------------------------
                if(req.url == '/tasks'){
                    var request = "POST"

                    recuperaInfo(req, resultado => {
                        console.log('POST de tarefa:' + JSON.stringify(resultado))

                        axios.post('http://localhost:3000/tasks', resultado)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(generateConfirm(resp.data, request, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                }
                // POST tasks/:id/edit --------------------------------------------------------------------
                else if(/\/tasks\/(T)[0-9]+\/edit/.test(req.url)){
                    var idTask = req.url.split("/")[2]
                    var request = "PUT"

                    recuperaInfo(req, resultado => {
                        console.log('PUT de tarefa:' + JSON.stringify(resultado))
                        
                        axios.put('http://localhost:3000/tasks/' + idTask, resultado)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(generateConfirm(resp.data, request, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no PUT: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write('<p>Recebi um POST ou PUT não suportado.</p>')
                    res.write('<p><a href="/">Voltar</a></p>')
                    res.end()
                }
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }
    }
})

tasksServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')