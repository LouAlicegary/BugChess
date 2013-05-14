<!DOCTYPE html>
<html>

<head>
	<title>loualicegary.com / Bug Chess (alpha)</title>

	<script type="text/javascript">
		//MODEL
		var arr = [];
		for(var x = 0; x < 100; x++) {
		    arr[x] = [];    
		    for(var y = 0; y < 100; y++) { 
		        arr[x][y] = 0;    
		    }    
		}	
			
	</script>

	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
	<script src="https://raw.github.com/furf/jquery-ui-touch-punch/master/jquery.ui.touch-punch.js"></script>
		
	<script type="text/javascript" src="js/hex/HexagonTools.js"></script>
	<script type="text/javascript" src="js/hex/Grid.js"></script>
	<script type="text/javascript" src="js/hex/Support.js"></script>
	
	<!-- Scroller -->
	<script src="js/scroller/Animate.js"></script>
	<script src="js/scroller/Scroller.js"></script>
	<script src="js/scroller/EasyScroller.js"></script>
	
	<style type="text/css">
		body { background-color: #EEE; overflow: hidden; padding: 0; }
		#container { background-color: #FFF; border: 5px solid #000; height: 480px; margin: 100px auto 0 auto; overflow: hidden; width: 80%; position: absolute; top: 0px; left: 0px; right: 0px; }
		#content { padding: 10px; position: absolute; }
		
		.game_piece { width: 100px; height: 80px; border: 0px; }
		.black_spider { background-image:url('pieces/black_spider.png'); }
		.black_grasshopper { background-image:url('pieces/black_grasshopper.png'); }
		.black_ant { background-image:url('pieces/black_ant.png'); }
		.black_beetle { background-image:url('pieces/black_beetle.png'); }
		.black_bee { background-image:url('pieces/black_bee.png'); }
		
		.white_spider { background-image:url('pieces/white_spider.png'); }
		.white_grasshopper { background-image:url('pieces/white_grasshopper.png'); }
		.white_ant { background-image:url('pieces/white_ant.png'); }
		.white_beetle { background-image:url('pieces/white_beetle.png'); }
		.white_bee { background-image:url('pieces/white_bee.png'); }

	</style>

</head>
 
<body>
	<!-- WHITE PIECES -->
	<div id="white_ant3" class="game_piece white_ant" style="position: absolute;"></div>
	<div id="white_ant2" class="game_piece white_ant" style="position: absolute;"></div>
	<div id="white_ant1" class="game_piece white_ant" style="position: absolute;"></div>
	<div id="white_grasshopper3" class="game_piece white_grasshopper" style="position: absolute;"></div>
	<div id="white_grasshopper2" class="game_piece white_grasshopper" style="position: absolute;"></div>
	<div id="white_grasshopper1" class="game_piece white_grasshopper" style="position: absolute;"></div>
	<div id="white_spider2" class="game_piece white_spider" style="position: absolute;"></div>
	<div id="white_spider1" class="game_piece white_spider" style="position: absolute;"></div>
	<div id="white_beetle2" class="game_piece white_beetle" style="position: absolute;"></div>
	<div id="white_beetle1" class="game_piece white_beetle" style="position: absolute;"></div>
	<div id="white_bee1" class="game_piece white_bee" style="position: absolute;"></div>
	
	<!-- BLACK PIECES -->	
	<div id="black_ant3" class="game_piece black_ant" style="position: absolute;"></div>
	<div id="black_ant2" class="game_piece black_ant" style="position: absolute;"></div>
	<div id="black_ant1" class="game_piece black_ant" style="position: absolute;"></div>
	<div id="black_spider2" class="game_piece black_spider" style="position: absolute;"></div>
	<div id="black_spider1" class="game_piece black_spider" style="position: absolute;"></div>
	<div id="black_grasshopper3" class="game_piece black_grasshopper" style="position: absolute;"></div>
	<div id="black_grasshopper2" class="game_piece black_grasshopper" style="position: absolute;"></div>
	<div id="black_grasshopper1" class="game_piece black_grasshopper" style="position: absolute;"></div>
	<div id="black_beetle2" class="game_piece black_beetle" style="position: absolute;"></div>
	<div id="black_beetle1" class="game_piece black_beetle" style="position: absolute;"></div>
	<div id="black_bee1" class="game_piece black_bee" style="position: absolute;"></div>	
	
	
	<div id="container" style="z-index: 1;">
		<div id="content" data-scrollable="true" data-zoomable="0.5-2.0">
			<canvas id="hexCanvas">Your browser does not support HTML5, so the game won't work. Sorry.</canvas>
		</div>
	</div>
	
	<script type="text/javascript">
	$(document).ready(function() {
		
		var request = $.ajax({
		 	url: "get_board_from_db.php",
			type: "POST",
			data: {},
			dataType: "json"
		});
    	request.success(function(data) {
        	for (i=0; i < arr.length; i++) {
        		arr[i] = data[i];
        		for (j=0; j < arr[0].length; j++)
        			if (arr[i][j] != "")
        				console.log(arr[i][j] + " found at " + i + "," + j);
        	}
        	getHexGridWH();
     	});
		request.fail(function(jqXHR, textStatus) {
  			alert( "Request failed: " + textStatus );
  			 //alert( jqXHR.responseText);
		});
		
		
		var origin = ""; // USED TO STORE INITIAL LOCATION OF MOVED PIECE
		
		$(".game_piece").draggable({revert: "invalid"});
		
		$("#container").droppable({
      		drop: function( event, ui ) {
      			var pos = $(ui.draggable).position();
      			var destination_string = updateGrid(pos.left + 50, pos.top + 40, ui);
      			$(ui.draggable).hide();
      			
      			var piece_id = $(ui.draggable).attr("id");
      			//piece_id = piece_id.substring(0, piece_id.length-1);
      			//MODEL
				var request = $.ajax({
				 	url: "place_piece.php",
					type: "POST",
					data: {piece : piece_id, destination : destination_string, origin : origin},
					dataType: "html"
				});
				origin = "";
      		}
    	});
		
		$(".game_piece").each(function(i, obj) {
    		y_offset = (i % 11) * 40 + 100;
    		x_offset = Math.floor(i / 11) * (.9 * window.innerWidth) + (((window.innerWidth/10)-100)/2);
    		$('#' + obj.getAttribute('id')).css({
    			'top': y_offset,
    			'left': x_offset,
    			'z-index': i+2
    		})
		});
		
		getHexGridWH(); //MOVED TO AJAX SUCCESS
		
		var canvas = document.getElementById('hexCanvas');
		canvas.addEventListener('click', clickHandler, false);
		canvas.addEventListener('touchstart', clickHandler, false);
				
		function clickHandler(event) {
			// GET CLICKED HEX
			var clicked_hex = getHexByCoords(event.pageX, event.pageY);
			var arr_value = arr[clicked_hex.PathCoOrdX][clicked_hex.PathCoOrdY];
			origin = clicked_hex.PathCoOrdX + "," + clicked_hex.PathCoOrdY;
			
			// IF HEX IS FILLED
			if ( arr_value != 0) {
				
				var n = arr_value.lastIndexOf(",");
				if (n) {
					// IF HEX HAS 2+ PIECES
					arr_value = arr_value.substring(n+1);
				}
				//MODEL
				removePieceFromGrid(event.pageX, event.pageY);
				
				var new_point = gridToPageCoords(getHexByCoords(event.pageX, event.pageY).MidPoint.X, getHexByCoords(event.pageX, event.pageY).MidPoint.Y);
				var new_bg = "selected" + arr_value.substring(5, arr_value.length-1) + ".png";
				$("#" + arr_value).css({ // CENTERS TILE OVER HEX. 35/45 vs 40/50 BECAUSE OF 5PX CANVAS DIV BORDER
       				top: new_point.Y-35,
       				left: new_point.X-45,
       				background: 'url("pieces/' + new_bg + '")'
     			});
				$("#" + arr_value).show();
			}		
	    }	
	    
	    // THIS SECTION FLOATS HOVERED-OVER PIECE TO TOP OF Z STACK
	    var zdex = 0;
	    
        $(".game_piece").mouseenter(function(){
        	zdex = $(this).css('zIndex');
  			$(this).css({'z-index': 50}); 
  		});
  		
  		$(".game_piece").mouseleave(function(){
  			$(this).css({'z-index': zdex});
		});	
	   
	});    	
	</script>

</body>

</html>