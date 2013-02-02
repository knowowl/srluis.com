
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
                resultHtml+='<div class="result">';
                resultHtml+='<h4><a href="#">'+item.DisplayName+'</a></h4>';                
                resultHtml+='</div>';
            });

            $('div#results').html(resultHtml);
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
		}else if($(".search").val()!=""){
			$("#myCarousel").fadeOut(100);
		}
	});