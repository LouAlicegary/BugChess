<!DOCTYPE html>
<html>

<head>
    <meta name="HandheldFriendly" content="True">
	<meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0">
	
	<title>loualicegary.com / Bug Chess (alpha)</title>
	
	<!-- jQuery + jQuery Touch Punch -->
	<script src="js/jquery/jquery-1.9.1.min.js"></script>
	<script src="js/jquery/jquery-ui-1.10.3.min.js"></script>
	<script src="js/jquery/jquery.ui.touch-punch.min.js"></script>
	
	<!-- Logger -->
	<script src="js/logger/logger.js"></script>
	
	<!-- CSS -->
	<link href='css/jquery-ui.css' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Pacifico|Droid+Sans:bold|Open+Sans:bold|Oswald:bold' rel='stylesheet' type='text/css'>
	<link href='css/index.css' rel='stylesheet' type='text/css'>

</head>
 
<body>
	<div id="wrapper">	
		<div id="game_title">Bug Chess</div>
		<!--<form action="games_lobby.php" method="post">-->
			<div id="directions">type your name:</div>
			<input id="name_input" type="text" autocomplete="off" autocorrect="off" spellcheck="false" style="font-size: 16px;">
			<div id="submit_button">enter game</div>
		</form>
	</div>
	
	<div id="portrait_warning">
	    This app is designed for use in landscape mode. Please flip your device.
	</div>
	
	<script type="text/javascript">
	$(document).ready(function(){
	    
	    //setTimeout(function() {setPageAttributes(); }, 200);
        setPageAttributes();
        
        window.addEventListener("orientationchange", function() {
            Logger("Orientation change (" + window.orientation + "). OuterW/H / InnerW/H = " + window.outerWidth + " " + window.outerHeight + " " + window.innerWidth + " " + window.innerHeight);
            setTimeout(function() {setPageAttributes(); }, 200);
        });
	    
        document.ontouchmove = function(event) {
            event.preventDefault();
        };
        
        document.getElementById('submit_button').addEventListener('click', goToLobby, false);
        document.getElementById('submit_button').addEventListener('touchstart', goToLobby, false);
        
        function goToLobby(event) {
             window.location.href = "games_lobby.php?name=" + document.getElementById("name_input").value;
        }
    
    });


    function setPageAttributes() {
    
        var WINDOW_HEIGHT = $(window).height();  
        var WINDOW_WIDTH = $(window).width();
         Logger("WINDOW RESIZE = " + WINDOW_WIDTH + "x" + WINDOW_HEIGHT);
         Logger("WINDOW (" + window.orientation + "). OuterW/H / InnerW/H = " + window.outerWidth + " " + window.outerHeight + " " + window.innerWidth + " " + window.innerHeight);
 
        $("#game_title").css({ 
            'font-size': getMaxFontSizeByWidth($('#game_title').width(), $('#game_title').height() * .7, 'Pacifico', $('#game_title').text()) + 'px',
            'line-height': ($("#game_title").height() * .8) + 'px'
        });  
    
        $("#directions").css({ 
            'font-size': getMaxFontSizeByWidth($('#directions').width(), $('#directions').height() * .7, 'Pacifico', $('#directions').text()) + 'px',
            'line-height': ($("#directions").height() * .8) + 'px'
        });     
        
        $("#name_input").css({
            'font-size': getMaxFontSizeByWidth($('#name_input').width(), $('#name_input').height() * .8, 'Droid Sans', 'Insert Name') + 'px', 
            'line-height': ($("#name_input").height() * .8) + 'px'
        });             
        
        $("#submit_button").css({ 
           'font-size': getMaxFontSizeByWidth($("#submit_button").width(), $('#submit_button').height() * .4, 'Pacifico', $("#submit_button").text()) + 'px',
           'line-height': ($("#submit_button").height() * .8) + 'px' //getMaxFontSizeByWidth($("#submit_button").width(), $('#submit_button').height(), 'Pacifico', $("#submit_button").text()) + 'px' //
        });
     
    }


	</script>

</body>

</html>