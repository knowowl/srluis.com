
$(document).on("ready", evento);
function evento (ev)
{
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
                resultHtml+='<a href="#" class="product">';
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
                
                $('.product-box').each(function(){                
                delayIt += 100;
                $(this).delay(delayIt).fadeIn(100);

                
                  var $container = $('.results');
                      $container.imagesLoaded( function() {
                        $container.masonry({itemSelector : '.product-box' });
                        (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "http://connect.facebook.net/es_ES/all.js#xfbml=1&appId=390325411063913";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
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
    window.fbAsyncInit = function() {
                FB.init({appId: '100001780719494', status: true, cookie: true,xfbml: true});
                FB.Event.subscribe('edge.create', function(url) {
                  _gaq.push(['_trackSocial', 'facebook', 'like', url]);
                });
                FB.Event.subscribe('edge.remove', function(url) {
                  _gaq.push(['_trackSocial', 'facebook', 'unlike', url]);
                });
            };
            (function() {
                var e = document.createElement('script'); e.async = true;
                e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
                document.getElementById('fb-root').appendChild(e);
            }());