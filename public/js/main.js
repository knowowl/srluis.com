
$(window).load(function(){
    if($('.productPage').length > 0){
    $('#myCarousel').hide();
    $('.results').masonry({itemSelector : '.product-box' });
  }  
});
$(window).scroll(function(){ $('.popover').hide();});
$('#cartList').scroll(function(){ $('.popover').hide();});
var s;
$.cloudinary.config("cloud_name", "hmoum9wou");
 function loadCart(query){
  
 cart = $.getJSON('/order',{
                q:query
            },function(data){           
                showCart(data);               
            });
}
$(".cart-box").click(function(){
  
  $('#myModal').modal('show');
});
var cartData;
 function showCart(data){
  var cartData= data;
     var resultHtml = '';
     var resultHtml2 = '';
     var order=[];
     var subtotal=0;
     $.each(data.line_items, function(i,item){                
                resultHtml+='<div class="cart-box" item="'+i+'">';                
                resultHtml+='<a class="cart-product"  data-target="#myModal" data-toggle="modal" >';
                resultHtml+='<div class="cart-product-inner">';                
                resultHtml+='<p class="inCartName">'+item.nombre+'</p>';                
                resultHtml+='<p class="inCartStore">'+item.store+'</p>';                
                resultHtml+='<span class="inCartPrice">Bs. '+item.price+'</span>';                                      
                resultHtml+='</div>';
                resultHtml+='</a>';
                resultHtml+='</div>';
                subtotal+=item.price;
                if(typeof order[item.store] == 'undefined'){
                  order[item.store]=[];                
                  order[item.store]['item']=new Array();
                  order[item.store]['price']=new Array();
                }
                order[item.store]['item'].push(item.nombre);
                order[item.store]['price'].push(item.price);
            
            });
     
      resultHtml2+='<p class="subtotal-label">Sub-total</p>';
      resultHtml2+='<p class="subtotal-number">'+subtotal+'</p>';
      resultHtml2+='<p class="subtotal-label">Envio</p>';
      resultHtml2+='<p class="subtotal-number">'+(subtotal*0.10)+'</p>';
      resultHtml2+='<p class="total-label">Total</p>';
      resultHtml2+='<p class="total-number">'+(subtotal*1.10)+'</p>';
      resultHtml2+='<a id="orderBtn" data-target="#myModal" data-toggle="modal" role="button" class="btn btn-success" style="width:83%; margin:2%">Ordenar</a>';
      $('#cartTotal').html(resultHtml2);
      $('#cartList').html(resultHtml+"<div class='cartGuide'></div>");  
      $(".cart-box").click(function(){
          var itemId=$(this).attr('item');          
          var popoverTitle=cartData.line_items[itemId].nombre+'<button class="close closeSettings" type="button" aria-hidden="true">&times;</button>';
          var popoverPeek=cartData.line_items[itemId].peek;
          var quitar=cartData.line_items[itemId].rAddon;       
          var agregar=cartData.line_items[itemId].aAddon;    
          var cambiar=cartData.line_items[itemId].cAddon;    
          $('.modal-title').html(popoverTitle);
          $('.modal-peek').html(popoverPeek);
          $('#quitar').html(renderCheckbox(quitar, 'q'));
          $('#agregar').html(renderCheckbox(agregar, 'a'));
          $('#cambiar').html(renderCheckbox(cambiar, 'c'));
          $('.closeSettings').click(function(){ $(this).parent().parent().hide();});
          $('.row-addons').click(function(){
            var c=$(this).children('td').children('input');
           
            c.prop('checked', !c.prop('checked'));
          });
          });
    }

function renderCheckbox(checkbox, type){
  switch(type){
    case 'q':
    if(checkbox==''){
      return 'Lo sentimos, opcion no disponible en este producto.';    

    }else{
      var html='<thead><tr><td>Seleccionar</td><td>Ingrediente</td></tr></thead><tbody>';
      $.each(checkbox, function(i,item){html+='<tr class="row-addons"><td><input type="checkbox" id="cb-'+i+'" '+item.checked+'></td><td>'+item.label+'</td></tr>'});          
      return '<table class="table table-striped table-popover table-hover table-condensed">'+html+'</tbody></table>';    
    }
      break;
    case 'a':
    if(checkbox==''){
      return 'Lo sentimos, opcion no disponible en este producto.';
    }else{
     var html='<thead><tr><td>Seleccionar</td><td>Ingrediente</td><td>Costo Adicional</td></tr></thead><tbody>';
     $.each(checkbox, function(i,item){html+='<tr class="row-addons"><td><input type="checkbox" id="cb-'+i+'" '+item.checked+'></td><td>'+item.label+'</td><td>'+item.price+'</td></tr>'});         
      return '<table class="table table-striped table-popover table-hover table-condensed">'+html+'</tbody></table>';    

    }
    break;
    case 'c':
    if(checkbox==''){
       return 'Lo sentimos, opcion no disponible en este producto.';
    }else{
     var html='<thead><tr><td>Cambios</td><td>Opciones</td></tr></thead><tbody>';    
     $.each(checkbox, function(i,item){
      var option='';     
      $.each(item.option, function(j, opt){        
          option+='<option value="'+opt.label+'">'+opt.label+'</option>'
      });
      html+='<tr class="row-addons"><td>'+item.label+'</td><td><select>'+option+'</select></td></tr>';
    }); 
     return '<table class="table table-striped table-popover table-hover table-condensed">'+html+'</tbody></table>';    

    }
            
    break;
  }

}
$(document).on("ready", evento);
function evento (ev)
{
  $('#myTab a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });
  loadCart("q");
  var thread = null;
  var runningRequest = false;
  var request;
  //Identify the typing action
  $('.search').keyup(function(e){
    $('.productPage').html('');
    clearTimeout(thread);
    e.preventDefault();
    var $q = $(this);
    $('.loading').show();
    $('.results').hide();
    if($q.val() == ''){
      $('.loading').hide();
      return false;            
    }
    //Abort opened requests to speed it up
    if(runningRequest){
      request.abort();
    }
    if($q.val() == ''){$('.loading').hide();}
    
    thread = setTimeout(function() { 
      runningRequest=true;
      request = $.getJSON('/search',{
        q:$q.val()
      },function(data,stat){     
        $('.loading').hide();  
        $('.searchList').animate({height: '0px'}, 300);
        $('.category>li').fadeOut(100);  
        $('.results').show();
        showResults(data,$q.val());
        runningRequest=false;
      });
    }, 500);
    //Create HTML structure for the results and insert it on the result div
  
    function showResults(data, highlight){
      var resultData= data;
      var resultHtml = '';
      $('.masonry').masonry( 'destroy' );
      $.each(data, function(i,item){
        var pic='';
        if(item.Img){
          pic = $.cloudinary.url(item.Img, {width: 240, crop: "fill"});
        }
        resultHtml+='<div class="product-box"  item="'+i+'">'; 
        resultHtml+='<a class="product"  data-target="#myModal" data-toggle="modal">';
        resultHtml+='<div class="product-inner">';                
        resultHtml+='<p class="Store">'+item.Store+'</p>'; 
        resultHtml+='<input type="hidden" class="Store_id" value="'+item.Store_id+'">'; 
        resultHtml+='<input type="hidden" class="Sku" value="'+item.SKU+'">'; 
        resultHtml+='<img src="'+pic+'">';
        resultHtml+='<p class="Name">'+item.Title+'</p>'; 
        resultHtml+='<p class="Peek">'+item.Peek+'</p>'; 
        resultHtml+='<span class="Likes"> <div class="fb-like" data-href="http://srluis.com/?o=product&q='+item._id+'" data-send="false" data-layout="button_count" data-width="115" data-show-faces="false"></div>  </span>'; 
        
        if(item.Price==0){
        resultHtml+='<span class="Price">A Convenir.</span>';
        }else{
        resultHtml+='<span class="Price">Bs. <span class="PriceNumber">'+item.Price+'</span></span>';   
        }                         
        resultHtml+='</div>';
        resultHtml+='</a>';
        resultHtml+='</div>';
      });
      var delayIt = 100;
      $('.results').html(resultHtml);
      var eachCount=0;
      var maxCount = $(".results").children().length;
      $('.product-box').each(function(){                
        delayIt += 100;
        $(this).delay(delayIt).fadeIn(100);
        var $container = $('.results');
        $container.imagesLoaded( function() {
          $container.masonry({itemSelector : '.product-box' });
          eachCount=eachCount+1;
          if(eachCount==maxCount){
            FB.XFBML.parse(document.body);
            $(".product-box").click(function(){  
              if(!cartListEnable){
                $("#cartList").animate({height: ($(window).height()-36-85)+"px"}, 300);
                $("#cartTotal").fadeIn("fast");
                $('.cart').addClass('cart-active');
                $('.results').removeClass('span12').addClass('span10').css('right','200px');
                $('.masonry').masonry( 'destroy' );
                $('.results').masonry({itemSelector : '.product-box' });
                cartListEnable=true;
              }       
              var target= $(this);
              var itemId=$(this).attr('item');   
                      console.log(resultData[itemId]);
                var popoverTitle=resultData[itemId].Title;
                var popoverPeek=resultData[itemId].Peek;
                var quitar=resultData[itemId].rAddon;       
                var agregar=resultData[itemId].aAddon;    
                var cambiar=resultData[itemId].cAddon;    
                $('.modal-header h3').html(popoverTitle);
                $('.modal-peek').html(popoverPeek);
                $('#quitar').html(renderCheckbox(quitar, 'q'));
                $('#agregar').html(renderCheckbox(agregar, 'a'));
                $('#cambiar').html(renderCheckbox(cambiar, 'c'));
                $('.closeSettings').click(function(){ $(this).parent().parent().hide();});
                $('.row-addons').click(function(){
                  var c=$(this).children('td').children('input');           
                  c.prop('checked', !c.prop('checked'));
                });
              $('#addToCart').click(function(){             
                
                sendToCart(target);
                //cerrar Modal ... buscar en bootstrap
              });
            });
          }                       
        });
      });
    
    }
    $('form').submit(function(e){
      e.preventDefault();
    });
  });
  function sendToCart(target){
    var p = $(target).position();
    var t = $(".cartGuide").offset();
    $(target).clone().appendTo(".results").css({top:p.top+"px", left:p.left+"px", position:"absolute", opacity: "1"}).animate({'top': t.top+"px",
              'left': (t.left-200)+'px', 'opacity':0}, 500 ,'linear', function(){
              $(target).remove();
              loadCart($(".Store_id",target).val()+"#"+$(".Sku",target).val());
              });
  }

  var opts = {
  lines: 11, // The number of lines to draw
  length: 0, // The length of each line
  width: 8, // The line thickness
  radius: 60, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  color: '#741620', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 74, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
  };
 $(".loading").spin(opts);

}


    $(".search").keyup(function(){
        if($(".search").val()==""){
            $("#myCarousel").fadeIn(100);
             $('.product-box').each(function(){                
                
                $(this).hide();

            });
        }else if($(".search").val()!=""){          
            $("#myCarousel").fadeOut(100);
        }
    });
    var cartListEnable=false;
  $(window).resize(function(){
    $('.popover').hide()
    if(cartListEnable){
    $('#cartList').height(($(window).height()-36-85));
    }
    });
  $(".cart").click(function(){

     if(cartListEnable){
         $("#cartList").animate({height: "0px"}, 300);
         $("#cartTotal").fadeOut("fast");
         $('.cart').removeClass('cart-active');
     cartListEnable=false;
     $('.results').removeClass('span10').addClass('span12').css('right','0');
     $('.masonry').masonry( 'destroy' );
     $('.results').masonry({itemSelector : '.product-box' });

     }else{
      $("#cartList").animate({height: ($(window).height()-36-85)+"px"}, 300);
      $("#cartTotal").fadeIn("fast");
      $('.cart').addClass('cart-active');
      $('.results').removeClass('span12').addClass('span10').css('right','200px');
      $('.masonry').masonry( 'destroy' );
      $('.results').masonry({itemSelector : '.product-box' });
      cartListEnable=true;
    }
  });
$.fn.spin = function(opts) {
      this.each(function() {
        var $this = $(this),
          spinner = $this.data('spinner');
 
        if (spinner) spinner.stop();
        if (opts !== false) {
          opts = $.extend({color: $this.css('color')}, opts);
          spinner = new Spinner(opts).spin(this);
          $this.data('spinner', spinner);
        }
      });
      return this;
    };
