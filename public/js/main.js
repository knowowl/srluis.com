
$(document).on("ready", evento);
function evento (ev)
{
   
       var runningRequest = false;
    var request;
   //Identify the typing action
    $('.search').keyup(function(e){
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

        runningRequest=true;
        request = $.getJSON('/search',{
            q:$q.val()
        },function(data){           
            showResults(data,$q.val());
            runningRequest=false;
        });

//Create HTML structure for the results and insert it on the result div
function showResults(data, highlight){
           var resultHtml = '';
            $.each(data, function(i,item){
             
                resultHtml+='<div class="product-box">';
                resultHtml+='<a href="#" class="product">';
                resultHtml+='<div class="product-inner">';                
                resultHtml+='<p class="Store">'+item.Store+'</p>'; 
                resultHtml+='<img src="http://www.know-owl.com/img/srluis/'+item.Path+'.jpg">';
                resultHtml+='<p class="Name">'+item.Name+'</p>'; 
                resultHtml+='<p class="Peek">'+item.Peek+'</p>'; 
                resultHtml+='<span>Bs. 60,00</span>';                               
                resultHtml+='</div>';
                resultHtml+='</a>';
                resultHtml+='</div>';
            });
            var delayIt = 100;
            $('.results').html(resultHtml);
                
                $('.product-box').each(function(){                
                delayIt += 100;
                $(this).delay(delayIt).fadeIn(100);

                 $('.results').masonry({itemSelector : '.product-box' });
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