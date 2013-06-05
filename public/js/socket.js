
var arrayNames = {};
var websocket = io.connect(window.location.hostname);

$(document).on('ready', iniciar);

function iniciar()
{

	websocket.on('newMessage', procesarMsj);
	websocket.on('newUser', procesarUsuario);
	var nombre = new Array();
	nombre[0]=name;
	websocket.emit('enviarNombre', nombre);
	$(".btnMsj").click(function(){
		console.log("hola");
		var mensaje = $("#mensaje").val();
		websocket.emit('enviarMensaje', mensaje);
	});
}
function procesarMsj(mensaje)
{
	$("#myModal2").modal("show");
	$(".msjTest").text(mensaje);
}
function procesarUsuario(mensaje)
{
	console.log(mensaje);	
}