
$(window).load(function(){
  
  
});
$(document).on("ready", evento);
function evento (ev)
{
   
  
  function showCart(data){
     var resultHtml = '';
     var resultHtml2 = '';
     console.log("data: "+data.subtotal);
     $.each(data.line_items, function(i,item){                
                resultHtml+='<div class="cart-box">';
                resultHtml+='<a class="cart-product">';
                resultHtml+='<div class="cart-product-inner">';                
                resultHtml+='<p class="inCartName">'+item.nombre+'</p>';                
                resultHtml+='<p class="inCartStore">'+item.store+'</p>';                
                resultHtml+='<span class="inCartPrice">Bs. '+item.price+'</span>';    
                resultHtml+='<span class="inCartQty">Cantidad: 1</span>';                         
                resultHtml+='</div>';
                resultHtml+='</a>';
                resultHtml+='</div>';
            
            });
      resultHtml2+='<p class="subtotal-label">Sub-total</p>';
      resultHtml2+='<p class="subtotal-number">'+data.subtotal+'</p>';
      resultHtml2+='<p class="subtotal-label">Envio</p>';
      resultHtml2+='<p class="subtotal-number">'+(data.subtotal*0.10)+'</p>';
      resultHtml2+='<p class="total-label">Total</p>';
      resultHtml2+='<p class="total-number">'+(data.subtotal*1.10)+'</p>';
      resultHtml2+='<a class="ordenar">Ordenar</a>';
      $('#cartTotal').html(resultHtml2);
      $('#cartList').html(resultHtml+"<div class='cartGuide'></div>");
    }
 cart = $.getJSON('/order',{
                q:'test'
            },function(data){           
                showCart(data);               
            });
   var thread = null;
       var runningRequest = false;
    var request;
   //Identify the typing action
    $('.search').keyup(function(e){
        clearTimeout(thread);
        e.preventDefault();
        var $q = $(this);

        if($q.val() == ''){
            $('div#results').html('');
            return false;            
        }

        //Abort opened requests to speed it up
        if(runningRequest){
            request.abort();
        }
        thread = setTimeout(function() { 
            runningRequest=true;
            request = $.getJSON('/search',{
                q:$q.val()
            },function(data){           
                showResults(data,$q.val());
                runningRequest=false;
            });
        }, 500);

//Create HTML structure for the results and insert it on the result div

function showResults(data, highlight){
           var resultHtml = '';
           $('.masonry').masonry( 'destroy' );
            $.each(data, function(i,item){
             
                resultHtml+='<div class="product-box">';
                resultHtml+='<a class="product">';
                resultHtml+='<div class="product-inner">';                
                resultHtml+='<p class="Store">'+item.Store+'</p>'; 
                resultHtml+='<img src="http://www.know-owl.com/img/srluis/'+item.Path+'.jpg">';
                resultHtml+='<p class="Name">'+item.Name+'</p>'; 
                resultHtml+='<p class="Peek">'+item.Peek+'</p>'; 
                resultHtml+='<span class="Likes"> <div class="fb-like" data-href="http://www.srluis.com/product#1" data-send="false" data-layout="button_count" data-width="115" data-show-faces="false"></div>  </span>'; 
                resultHtml+='<span class="Price">Bs. 60,00</span>';                            
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
                            $("#cartList").append('<div class="cart-box"><a class="cart-product"><div class="cart-product-inner"><p class="inCartName">Pizza 4 Quesos 1</p><p class="inCartStore">PizzaHut</p><p class="inCartQty">Cantidad: 1</p><span class="inCartPrice">Bs. 60,00</span></div></a></div>');
                            
    var p = $(this).position();
    var t = $(".cartGuide").offset();
    $(this).clone().appendTo(".results").css({top:p.top+"px", left:p.left+"px", position:"absolute", opacity: "1"}).animate({'top': t.top+"px",
   'left': t.left+'px', 'opacity':0}, 1000 ,'linear', function(){
    $(this).remove();

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

}
$(".search").focus(function(){      
        $('.searchList').animate({height: '100px'}, 300);
        var delayIt = 100;
$('.category li').each(function(){                
    delayIt += 100;
    $(this).delay(delayIt).fadeIn(100);
});
        
    });
        
    
    $(".search").blur(function(){
        $('.searchList').animate({height: '0px'}, 300);
        $('.category>li').fadeOut(100);
    });

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
    if(cartListEnable){
    $('#cartList').height(($(window).height()-36-85));
    }
    });
  $(".cart").click(function(){
    console.log("cart active");
     if(cartListEnable){
         $("#cartList").animate({height: "0px"}, 300);
         $("#cartTotal").fadeOut("fast");
     cartListEnable=false;

     }else{
    $("#cartList").animate({height: ($(window).height()-36-85)+"px"}, 300);
     $("#cartTotal").fadeIn("fast");
    cartListEnable=true;
    }
  });
