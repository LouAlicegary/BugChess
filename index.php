<!DOCTYPE html>
<html>

<head>
	<title>loualicegary.com / Bug Chess (alpha)</title>

	<script type="text/javascript">
		//MODEL
	
			
	</script>

	<!-- jQuery -->
	<script src="js/jquery//jquery-1.9.1.min.js"></script>
	<script src="js/jquery/jquery-ui-1.10.3.min.js"></script>
	<script src="js/jquery/jquery.ui.touch-punch.min.js"></script>
	<!-- jQuery Touch Punch -->
	
	
	<!-- MVC Architecture -->
	<script src="js/MODEL.js"></script>
	<script src="js/VIEW.js"></script>
	<script src="js/logger.js"></script>
	
	<!-- Hex -->	
	<script src="js/hex/HexagonTools.js"></script>
	<script src="js/hex/Grid.js"></script>
	<script src="js/hex/Support.js"></script>
	
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
				
		$(".game_piece").draggable({revert: "invalid"});
		$(".game_piece").attr('origin', '');
		
		$("#container").droppable({
      		drop: function( event, ui ) {
      			
      			var pos = $(ui.draggable).position();
      			var hex_midpoint = new HT.Point(pos.left + 50, pos.top + 40);
      			var piece_id = $(ui.draggable).attr("id");
      			var origin = $(ui.draggable).attr('origin');
				var the_hex = getHexByCoords(hex_midpoint.X, hex_midpoint.Y);
      			var destination_string = the_hex.GetLocation();
      			//Logger("DROP FUNCTION: PIECE " + piece_id + " MOVED FROM " + origin + " TO " + destination_string);

      			//MODEL
				MODEL_addPieceToGrid(destination_string, piece_id);
				MODEL_addMoveToDB(piece_id, destination_string, origin);

				//VIEW
				$(ui.draggable).hide();
				$("#" + piece_id).hide();
				$("#" + piece_id).attr('origin', the_hex.GetLocation());  
				VIEW_draw_piece_on_canvas(the_hex);
				//getHexGridWH();
				
				Logger("---------------------------------------------------------*");
      		}
    	});
		
		VIEW_initGamePieces();
		
		VIEW_draw_empty_grid();
		
		var canvas = document.getElementById('hexCanvas');
		canvas.addEventListener('click', clickHandler, false);
		canvas.addEventListener('touchstart', clickHandler, false);

		var moves_array = Array();
		var da_width = $("#hexCanvas").innerWidth();
		var da_height = $("#hexCanvas").innerWidth();
		var grid = new HT.Grid(da_width, da_height); 

		// POLLS SERVER FOR UPDATES TO SERVER
		
		$(function(){window.setInterval(function(){
			Logger("*----------------------------------------------------------");
			Logger("POLLER");
			
			// get new moves from model
			// for each move, update view based on single move
			
			var moves_array = MODEL_updateArrayFromDB();
			Logger("POLLER: (141) moves_array len " + moves_array.length);

				for (var i=0; i < moves_array.length; i++) {
					//Logger("POLLER: (147) moves_array[" + i + "] len = " + moves_array[i].length);
   					
   					if (moves_array[i][3] !== "") {
   						//Logger("moves_array[" + i + "][3] = " + moves_array[i][3]);
   						VIEW_removePieceFromCanvas(grid.GetHexByXYIndex(moves_array[i][3]));
   					}
   					// destination add piece
   					VIEW_draw_piece_on_canvas(grid.GetHexByXYIndex(moves_array[i][4]));
				}
			
			Logger("----------------------------------------------------------*");
		},3000)});	
		
		
		
		
	}); 	
	
	</script>

</body>

</html>