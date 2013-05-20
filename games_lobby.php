<!DOCTYPE html>
<html>

<head>
	
	<title>loualicegary.com / Bug Chess (alpha)</title>
	
	<!-- jQuery + jQuery Touch Punch -->
	<script src="js/jquery/jquery-1.9.1.min.js"></script>
	<script src="js/jquery/jquery-ui-1.10.3.min.js"></script>
	<script src="js/jquery/jquery.ui.touch-punch.min.js"></script>
	
	<!-- CSS -->
	<link href='css/jquery-ui.css' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Pacifico|Droid+Sans:bold|Open+Sans:bold|Oswald:bold' rel='stylesheet' type='text/css'>
	<link href='css/index.css' rel='stylesheet' type='text/css'>

</head>
 
<body>

<?php 

if(isset($_POST['name']) || isset($_GET['name']) ) {
	
	if(isset($_POST['name'])) {
		$name = $_POST['name'];
	}
	else {
		$name = $_GET["name"];
	}
		
	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
  
 /////////////////////////////////////////////////////////////////////////////
 
 	echo "<div class='game_menu_div'><div class='header_text'>games you're currently in: </div><br />";
	
	$data = mysql_query("SELECT * FROM games WHERE white_player LIKE '" . $name . "' OR black_player LIKE '" . $name . "' ORDER BY game_id DESC LIMIT 5") or die(mysql_error()); 
	
	while($info = mysql_fetch_array( $data )) 
	{ 
		$game_id = $info['game_id'];
		$white_player = $info['white_player'];
		$black_player = $info['black_player'];
		
		if ($white_player === "") {
			$white_player = "(?)";
		}
		else if ($black_player === "") {
			$black_player = "(waiting)";
		}
		
		$time_diff = mysql_query("SELECT TIMEDIFF(NOW(), time_created) AS DIFF FROM moves WHERE game_id = '" . $game_id . "' ORDER BY move_id DESC LIMIT 1");
		$the_diff = mysql_fetch_array($time_diff);

		$count = mysql_query("SELECT COUNT(*) FROM moves WHERE game_id =" . $game_id ) or die(mysql_error()); 
		$the_info = mysql_fetch_array( $count );
		$num_moves = $the_info[0];
		
		if ($num_moves == 0) {
			$game_time = mysql_query("SELECT TIMEDIFF(NOW(), time_created) AS DIFF FROM games WHERE game_id = '" . $game_id . "'");
			$the_gt = mysql_fetch_array($game_time);
			$time_since_last = "started " . $the_gt[0] . " ago";
		}
		else {
			$time_since_last = "last move " . $the_diff[0] . " ago";
		}

		echo "<div id='" . $game_id . "' class='regular_text current_game'><div class='column1'> " . $white_player . " vs. " . $black_player . "</div><div class='column2'>[" . $time_since_last . "]</div>";
		echo "<div class='column3'> ::: ";
		
		
		
		if ( (($name == $white_player) && ($num_moves%2 == 0)) || (($name == $black_player) && ($num_moves%2 == 1)) ) {
			echo "YOUR TURN :::";
		} 
		else {
			echo "OPPONENT'S TURN :::";
		}
		echo "</div></div>"; 
 	}	
 	
 	echo  "</div>";
    
    /////////////////////////////////////////////////////////////////////////////
     
	echo "<div class='game_menu_div'><div class='header_text'>opponents looking for players: </div><br />";
	
	$data = mysql_query("SELECT * FROM games WHERE white_player LIKE '' OR black_player LIKE '' AND white_player NOT LIKE '" . $name . "' AND black_player NOT LIKE '" . $name . "' ORDER BY game_id DESC LIMIT 5") or die(mysql_error()); 
	
	while($info = mysql_fetch_array( $data )) 
	{ 
		$game_id = $info['game_id'];
		$white_player = $info['white_player'];
		$black_player = $info['black_player'];
		
		$time_diff = mysql_query("SELECT TIMEDIFF(NOW(), time_created) as diff FROM games WHERE game_id = '" . $game_id . "' LIMIT 1");
		$the_diff = mysql_fetch_array($time_diff);
				
		//echo "<div id='" . $game_id . "' class='regular_text open_game'>[started " . $the_diff[0] . " ago] " . $white_player . "</div>";
		echo "<div id='" . $game_id . "' class='regular_text open_game'><div class='column1'> " . $white_player . "</div><div class='column2'>[started " . $the_diff[0] . " ago]</div></div>";
		
 	}
	
	echo "</div>";

}

?>	



<div class='game_menu_div'>
	<div class='header_text'>start a new game:</div>
	<div id="solo_game" style="font-family: 'Droid Sans'; font-size: 32px; background: #000000; color: #ffffff; border: '5px solid black'; padding: 5px 10px 5px 10px; -webkit-border-radius: 15px; text-align: center;">solo practice mode</div>
	<div id="vs_game" style=" background: #000000; color: #ffffff; border: '5px solid black'; padding: 5px 10px 5px 10px; -webkit-border-radius: 15px; text-align: center;">vs. online opponent</div>
</div>


	<script type="text/javascript">
	
	<?php 
	
	if ($_POST['name']) {
		$name = $_POST['name'];
	}
	else {
		$name = $_GET['name'];
	}
	echo "var NAME = '" . $name . "'"; 
	
	?>
	
	$(document).ready(function(){
		
		var WINDOW_HEIGHT = $(window).height();
		var WINDOW_WIDTH = $(window).width();
		
		var DIV_MARGINLR = WINDOW_WIDTH / 20;
		var DIV_MARGINTB = 20;
		var DIV_SIDE_BORDER = 5;
		var DIV_HEIGHT = (WINDOW_HEIGHT / 3) - (DIV_SIDE_BORDER * 2) - (DIV_MARGINTB);
		var DIV_WIDTH = WINDOW_WIDTH - (DIV_MARGINLR * 2);
		
		var REGULAR_BAR_HEIGHT = DIV_HEIGHT / 8;
		var REGULAR_TEXT_PX = REGULAR_BAR_HEIGHT / 1.5;
		var REGULAR_TEXT_LEFT_MARGIN = 5;
		
		var HEADER_BAR_HEIGHT = DIV_HEIGHT / 4; 
		var HEADER_TEXT_PX = HEADER_BAR_HEIGHT / 2;
		var HEADER_TEXT_LEFT_MARGIN = 10;
		
		var BUTTON_HEIGHT = 50;
		var BUTTON_WIDTH = 300;
		var BUTTON_TOP = ((DIV_HEIGHT - HEADER_BAR_HEIGHT) / 2) - (BUTTON_HEIGHT/2) + HEADER_BAR_HEIGHT;
		var BUTTON_LEFT = 50;
		var BUTTON_MARGIN = 50;
		var BUTTON_TEXT_PX = 24;
		
		$('.header_text').css({ 
			'height' : HEADER_BAR_HEIGHT, 
			'font-size': + HEADER_TEXT_PX + 'px', 
			'font-family': 'Pacifico', 
			'margin-left': HEADER_TEXT_LEFT_MARGIN 
		});
		
		$('.regular_text').css({ 
			'height' : REGULAR_BAR_HEIGHT, 
			'font-size': + REGULAR_TEXT_PX + 'px', 
			'font-family': 'Droid Sans',
			'margin-left': REGULAR_TEXT_LEFT_MARGIN,
			'cursor': 'pointer'  
		});
		
		$(".game_menu_div").each(function( index ) {
			$(this).css({
				'position': 'absolute', 
				'height': DIV_HEIGHT, 
				'width': DIV_WIDTH, 
				'top': index*(WINDOW_HEIGHT/3), 
				'background': 'rgba(255, 255, 0, 0.2)', 
				'border': DIV_SIDE_BORDER + 'px solid black', 
				'-webkit-border-radius': '15px', 
				'margin':  DIV_MARGINTB + 'px ' + DIV_MARGINLR + 'px'
			});
		});
		
		$("#solo_game, #vs_game").css({
			'position': 'absolute', 
			'height': BUTTON_HEIGHT, 
			'width': BUTTON_WIDTH, 
			'top': BUTTON_TOP, 
			'left': BUTTON_LEFT, 
			'font-family': 'Open Sans', 
			'font-size': BUTTON_TEXT_PX + 'px', 
			'line-height': BUTTON_HEIGHT-5 + 'px',
			'cursor': 'pointer' 
		});
		
		$("#vs_game").css({
			'left': BUTTON_LEFT + BUTTON_WIDTH + BUTTON_MARGIN
		});
		
		$(".column1").css({
			'width': DIV_WIDTH/3-5,
			'left': REGULAR_TEXT_LEFT_MARGIN = 5, 
			'position': 'absolute',
		});	
			
		$(".column2").css({
			'width': DIV_WIDTH/3,
			'left': DIV_WIDTH/3, 
			'position': 'absolute',
		});	
		
		$(".column3").css({
			'width': DIV_WIDTH/3,
			'left': DIV_WIDTH*2/3, 
			'position': 'absolute',
		});	
		
		
		$('.open_game, .current_game').each( function(index) {
			REGULAR_TEXT_PX = getMaxFontSizeByWidth(DIV_WIDTH, "Pacifico", $(this).text());
			$(this).css({
				'font-size': REGULAR_TEXT_PX + 'px'
			});
			
		});		
		
		
		var temp=0;
		var min=99999; 
		
		$(".column1, .column2, .column3").each( function (index) {
			temp = getMaxFontSizeByWidth($(this).width(), "Droid Sans", $(this).text());
			if ( (temp < min) && (temp != 0) )
				min = temp;
		});	
			
		$(".column1, .column2, .column3").each( function (index) {
			$(this).css({'font-size': + min + 'px'});
		});
		
		
		$('.current_game').bind('click', selectCurrentGame);
		$('.current_game').bind('touchstart', selectCurrentGame);	
		
		function selectCurrentGame(event) {
			window.location="play_game.php?gameid=" + this.id + "&name=" + NAME;
		}	
		
		
		$('.open_game').bind('click', selectOpenGame);
		$('.open_game').bind('touchstart', selectOpenGame);
		
		function selectOpenGame(event) {
			writeSecondPlayerToDB(event.target.id);
			window.location="play_game.php?gameid=" + this.id + "&name=" + NAME;
		}
		function writeSecondPlayerToDB(game_id) {
			var request = $.ajax({
			 	url: "php/add_second_player_to_db.php",
				type: "POST",
				data: {name: NAME, gameid: game_id},
				dataType: "json",
				async: false
			});
		}	
		
		
		var GAME_ID = 0;
		
		$('#vs_game').bind('click', selectStartOnlineGame);
		$('#vs_game').bind('touchstart', selectStartOnlineGame);	
			
		function selectStartOnlineGame(event) {
			//alert(NAME);
			var bequest = $.ajax({
			 	url: "php/add_game_to_db.php",
				type: "POST",
				data: {},
				dataType: "html"
			});	
			bequest.success(function(data) {
				GAME_ID = data;
			});
			bequest.fail(function(jqXHR, textStatus) {
				alert( "AJAX FAIL: " + textStatus + " / " + jqXHR.responseText);
			});			
			bequest.done(function(data) {
				window.location = "play_game.php?name=" + NAME + "&game_id=" + GAME_ID;	
			});	
				
		} 

		
		
			
		$('.open_game, .current_game').bind('mouseover', function() {
			$(this).css({'background': '#ffff00' });
		});
		
		$('.open_game, .current_game').bind('mouseout', function() {
			$(this).css({'background': 'none' });
		});

		

		function getTextBlockWidth(in_font, in_text) {
			//textWidth.width;
			canvas = document.createElement("canvas");
			document.body.appendChild(canvas);
			canvas.width  = WINDOW_WIDTH;
			canvas.height = WINDOW_HEIGHT;
			var ctx = canvas.getContext("2d");
			ctx.font = in_font; // "56px Pacifico"
			var textWidth = ctx.measureText (in_text);
			
			return textWidth.width;
		}
		
		function getMaxFontSizeByWidth(in_width, in_font, in_text) {
			var in_text_len = in_text.length;
			var width_guess = in_width*2/in_text_len;
			var flag = 1;
				
			while (flag) {
		
				var width = getTextBlockWidth( width_guess + "px " + in_font, in_text);
			
				if (width > in_width) {
					width_guess = width_guess / 2;
				}
				else if ((width < in_width) && ((in_width*.7) > width)) {
					width_guess = width_guess * 1.2;
				}
				else {
					flag = 0;
				}
			}
			//alert("DIV WIDTH = " + DIV_WIDTH + " AT " + REGULAR_TEXT_PX + " / COMPUTED WIDTH = " + width + " AT " + width_guess + " PX" );
			if ( width_guess > (REGULAR_BAR_HEIGHT * .8) )
			{
				return REGULAR_BAR_HEIGHT * .8;
			}	
			else {
				return width_guess;
			}		
		}
	
	});	
			
	</script>

</body>

</html>








