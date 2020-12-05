function showImage(name, type) {
    if(type == 'image/png' || type == 'image/jpeg' )
        var ficheiro = '<img src="/fileStore/' + name + '" width="80%"/>'
    else
        var ficheiro = '<p>' + name + ', ' + type + '</p>'

    var fileObj = $(`
    <div class="w3-row w3-margin">
        <div class="w3-col s6">
            ${ficheiro}
        </div>
        <div class="w3-col s6 w3-border w3-padding">
            <p>Filename: ${name}</p>
            <p>Mimetype: ${type}</p>
        </div>
    </div>
    `)

    var download = $('<div class="w3-center"><a class="w3-button w3-black w3-round w3-margin" href="/files/download/' + name +'">Download</a></div>')
    $("#display").empty()
    $("#display").append(fileObj, download)
    $("#display").modal()
}