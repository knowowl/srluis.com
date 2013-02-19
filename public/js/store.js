 $(document).on("ready", evento);
function evento (ev)
{
 var text_max = 130;
    $('.descriptionCount').html(text_max + ' caracteres restantes');

    $('#inputDescription').keyup(function() {
        var text_length = $('#inputDescription').val().length;
        var text_remaining = text_max - text_length;

        $('.descriptionCount').html(text_remaining + ' caracteres restantes');
    });
}