 $(document).on("ready", evento);
function evento (ev)
{

 var text_max_title = 32;
 var text_max_description = 130;
    $('.descriptionCount').html(text_max_description + ' caracteres restantes');
    $('.titleCount').html(text_max_title + ' caracteres restantes');
    $('#inputTitle').keyup(function() {
        var text_length = $('#inputTitle').val().length;
        var text_remaining = text_max_title - text_length;
        $('.titleCount').html(text_remaining + ' caracteres restantes');
    });
    $('#inputDescription').keyup(function() {
        var text_length = $('#inputDescription').val().length;
        var text_remaining = text_max_description - text_length;
        $('.descriptionCount').html(text_remaining + ' caracteres restantes');
    });
    $('.selectpicker').selectpicker();
    $('.removibleChexbox').click(function() {
    if( $(this).is(':checked')) {
        $(".items_removibles").show();
    } else {
        $(".items_removibles").hide();
    }
}); 
    $('.adicionalChexbox').click(function() {
    if( $(this).is(':checked')) {
        $(".items_adicionales").show();
    } else {
        $(".items_adicionales").hide();
    }
}); 
    $('.sustitutoChexbox').click(function() {
    if( $(this).is(':checked')) {
        $(".items_sustitutos").show();
    } else {
        $(".items_sustitutos").hide();
    }
}); 
function parseObject(c){
    var objeto=new Array();
    $('.label'+c).each(function(i){
        var label=$(this).val();
        var price=$(this).parent().next().children('.price'+c).val();
        objeto[i]='{"label":"'+label+'", "price":'+price+'}';
       
    });
    return '['+objeto.join(',')+']';    
}
$('#addBtn').mouseenter(function(e){
    if($(".removibleChexbox").is(':checked')){
        $('#inputR').val(parseObject('R'));
    }else{
        $('#inputR').val('');
    }
    if($(".adicionalChexbox").is(':checked')){
        $('#inputA').val(parseObject('A'));
    }else{
        $('#inputA').val('');
    }
    if($(".sustitutoChexbox").is(':checked')){
        $('#inputC').val(parseObject('C'));
    }else{
        $('#inputC').val('');
    }
    
});
     $('.add').click(function(){
        
        var number = parseInt($(this).prev().children('.add-on').html());
        var text= $(this).prev().prev().children('input').attr('placeholder')
        var span= $(this).prev().prev().children('input').attr('class')
        $(this).before('<br><div class="input-prepend"><span class="add-on">Nombre</span><input class="'+span+' labelR"  type="text" placeholder="'+text+'"></div><div class="input-prepend"><span class="add-on">Precio</span><input class="span1 priceR" type="text" ></div>');
     });
    $("#foodPicker").change(function(){
        $("#" + this.value ).show().siblings().hide();
    });
    $("#foodPicker").change();
}
