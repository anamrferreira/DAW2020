exports.myDateTime = function () {
    var d = new Date();
    return d.toISOString().substring(0,16) //(0,16) data e tempo com horas e minutos
}
