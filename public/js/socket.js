var nombre;
var arrayNames = {};
var websocket = io.connect(window.location.hostname);

$(document).on('ready', iniciar);

function iniciar()
{
	websocket.on('mensaje', procesarUsuario);
	
	
}
function procesarUsuario(mensaje)
{

}