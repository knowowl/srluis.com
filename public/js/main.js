
$(document).on("ready", evento);
function evento (ev)
{
  var runningRequest = false;
  var request;
  var thread = null;

  function findMember(str) {

		e.preventDefault();
        var $q = $(".search");

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

    }
function showResults(data, highlight){
           var resultHtml = '';
            $.each(data, function(i,item){
                resultHtml+='<div class="result">';
                resultHtml+='<h2><a href="#">'+item.title+'</a></h2>';
                resultHtml+='<p>'+item.post.replace(highlight, '<span class="highlight">'+highlight+'</span>')+'</p>';
                resultHtml+='<a href="#" class="readMore">Read more..</a>'
                resultHtml+='</div>';
            });

            $('div#results').html(resultHtml);
        }

        $('form').submit(function(e){
            e.preventDefault();
        });

  $('.search').keyup(function() {


    clearTimeout(thread);
    $this = $(this);
    thread = setTimeout(function() { findMember($this.val()); }, 500); 
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