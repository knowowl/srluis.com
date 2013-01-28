var http = require("http");
var url = require("url");
var port = process.env.PORT || 5000;
function iniciar(route) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Peticion para " + pathname + " recibida.");

    route(pathname);

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Hola Mundo");
    response.end();
  }

  http.createServer(onRequest).listen(port);
  console.log("Servidor Iniciado.");
}

exports.iniciar = iniciar;