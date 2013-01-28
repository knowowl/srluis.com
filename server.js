var http = require("http");
var url = require("url");
var port = process.env.PORT || 5000;

function iniciar(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Peticion para " + pathname + " recibida.");

    response.writeHead(200, {"Content-Type": "text/html"});
    var content = route(handle, pathname)
    response.write(content);
    response.end();
  }

  http.createServer(onRequest).listen(port);
  console.log("Servidor Iniciado.");
}

exports.iniciar = iniciar;