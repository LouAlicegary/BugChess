function CONTROLLER_MAIN() {
	VIEW_setAllViewProperties();
	VIEW_preloadImages();
	VIEW_drawEmptyGrid();
	VIEW_initGameWindow();
	
	document.getElementById('hexCanvas').addEventListener('click', CONTROLLER_clickOnPiece, false);
	document.getElementById('hexCanvas').addEventListener('touchstart', CONTROLLER_clickOnPiece, false);
	
	document.getElementById('reset_button').addEventListener('click', CONTROLLER_resetGame, false);
	
	document.getElementById('return_button').addEventListener('click', CONTROLLER_returnToLobby, false);
	document.getElementById('return_button').addEventListener('touchstart', CONTROLLER_returnToLobby, false);
	
	CONTROLLER_doInitialUpdateFromDB(30);
				
	CONTROLLER_pollingFunction(3000); // POLLS SERVER FOR UPDATES TO SERVER
}

function CONTROLLER_resetGame() {
   	MODEL_eraseGameFromDB();
   	MODEL_eraseGameFromArray();
	VIEW_drawEmptyGrid();
	VIEW_initGameWindow();
}

function CONTROLLER_pollingFunction(frequency_timer) {
		
	var moves_array = Array();
	var da_width = $("#hexCanvas").innerWidth();
	var da_height = $("#hexCanvas").innerWidth();
	var grid = new HT.Grid(da_width, da_height); 
	
	$(function(){window.setInterval( function(){ 
		return_value = MODEL_getUpdateFromDB();
		erase_flag = return_value[0];
		moves_array = return_value[1];
		var origin;
		var destination;
		var piece_id;
		
		if (erase_flag) {
			CONTROLLER_resetGame();
		}
		else if ((moves_array[0] != 0) && (moves_array.length != NUM_MOVES)) {
			Logger("CONTROLLER: (40) ERASE_FLAG / MOVES_ARRAY = " + erase_flag + " " + moves_array);
			//for (var i=NUM_MOVES; i < moves_array.length; i++) {
			if (NUM_MOVES < moves_array.length)	{
				i = NUM_MOVES; // ADDED FOR QUICKFIX
				piece_id = moves_array[i][2];
				origin = moves_array[i][3]; 
				destination = moves_array[i][4]; 
					if (origin !== "") {
						VIEW_removePieceFromCanvas(grid.GetHexByXYIndex(origin));
						MODEL_removePieceFromArray(origin);
					}
					MODEL_addPieceToArray(destination, piece_id);				
					VIEW_drawPieceOnCanvas(grid.GetHexByXYIndex(destination));
			}	
			MODEL_checkIfBeeSurrounded(); 		
		}
	}, frequency_timer )});	

}


function CONTROLLER_doInitialUpdateFromDB(frequency_timer) {
		
	var moves_array = Array();
	var da_width = $("#hexCanvas").innerWidth();
	var da_height = $("#hexCanvas").innerWidth();
	var grid = new HT.Grid(da_width, da_height); 
	
	var return_value = MODEL_getUpdateFromDB();
	erase_flag = return_value[0];
	moves_array = return_value[1];

	var the_init_timer = window.setInterval( function() {
		
		if (load_counter == 10) {
			var origin;
			var destination;
			var piece_id;
			
			Logger("CONTROLLER: (98) INITIAL UPDATE = " + NUM_MOVES + " MOVES");
	
			if ((moves_array[0] != 0) && (moves_array.length != NUM_MOVES)) { // IF ACTUAL MOVE IN ARRAY
				//for (var i=NUM_MOVES; i < moves_array.length; i++) {
				i = NUM_MOVES; // ADDED FOR QUICKFIX
				piece_id = moves_array[i][2];
				origin = moves_array[i][3]; 
				destination = moves_array[i][4]; 
				if (origin !== "") {
					VIEW_removePieceFromCanvas(grid.GetHexByXYIndex(origin));
					MODEL_removePieceFromArray(origin);
				}
				MODEL_addPieceToArray(destination, piece_id);				
				VIEW_drawPieceOnCanvas(grid.GetHexByXYIndex(destination));
				
				if (NUM_MOVES == moves_array.length) {
					window.clearInterval(the_init_timer);
				}
			}
			else {
				window.clearInterval(the_init_timer);
			}	
				
			MODEL_checkIfBeeSurrounded();			
		}

		 
	}, frequency_timer );	
}	


function CONTROLLER_clickOnPiece(event) {

	var clicked_hex = SUPPORT_getHexByWindowCoords(event.pageX, event.pageY);
	
	// IF ACTUAL HEX IS CLICKED AND NOT BLANK SPACE
	if (clicked_hex) {
		var hex_contents = GRID_ARRAY[clicked_hex.PathCoOrdX][clicked_hex.PathCoOrdY];
		var hex_midpoint = SUPPORT_gridToPageCoords(clicked_hex.MidPoint.X, clicked_hex.MidPoint.Y);		
		var this_piece;
		// IF HEX IS FILLED
		if ( hex_contents != 0) {
			var hex_array = hex_contents.split(",");
			if (hex_array.length > 1) {
				this_piece = hex_array[hex_array.length-1];
			}
			else {
				this_piece = hex_array[0];
			}
			$("#" + this_piece).attr('origin', clicked_hex.GetXYLocation());
			//Logger("SUPPORT: (95) origin = " + $('#' + hex_contents).attr('origin') + " hex_contents = " + hex_contents + " hex_mid = " + hex_midpoint); 
			
			VIEW_removePieceFromCanvas(clicked_hex);
			VIEW_showDraggablePiece(this_piece, hex_midpoint);
		}	
	}	
}	


function CONTROLLER_onDrop( event, ui ) {  			
	//Logger("DROP");
	
	clearInterval(piece_rotate_interval);
	
	var pos = $(ui.draggable).position();
	var piece_id = $(ui.draggable).attr("id");
	var origin = $(ui.draggable).attr('origin');	
	var hex_midpoint = new HT.Point(pos.left + (PIECE_WIDTH/2), pos.top + (PIECE_HEIGHT/2));
	var the_hex = SUPPORT_getHexByWindowCoords(hex_midpoint.X, hex_midpoint.Y);
	var grid = new HT.Grid($("#hexCanvas").width(), $("#hexCanvas").height());
	//Logger("DROP FUNCTION" + the_hex.GetXYLocation());		
	$(ui.draggable).trigger('mouseleave');
	//$(ui.draggable).css({ background: "url('pieces/" + piece_id.substring(0, piece_id.length-1) + ".png')" });
	//ui.draggable.style.webkitTransform = "rotate(0deg)";
				
	if (the_hex) { // IF DROPPED ON AN ACTUAL HEX ON GRID
		
		if (the_hex.GetXYLocation() == origin) { // IF PIECE HASN'T MOVED
			$(ui.draggable).hide();		
			var the_hex = grid.GetHexByXYIndex(origin);
			VIEW_drawPieceOnCanvas(the_hex);
		}
		else { // IF PIECE MOVEMENT IS LEGITIMATE
			//MODEL
			var dest = the_hex.GetXYLocation();
			if (origin) 
				MODEL_removePieceFromArray(origin);
				//Logger("SUPPORT: (133) SHOULD BE ADDING PIECE TO ARRAY HERE");
			MODEL_addPieceToArray(dest, piece_id);
			MODEL_addMoveToDB(piece_id, dest, origin);
			//VIEW
			$(ui.draggable).hide();
			$(ui.draggable).attr('origin', the_hex.GetXYLocation());  
			VIEW_drawPieceOnCanvas(the_hex);	
			
			// CHECK IF BEE IS SURROUNDED = LOSS
			setTimeout(MODEL_checkIfBeeSurrounded,200);		
		}
		
	}
	else if (origin) { // IF DROPPED FROM BOARD TO BLANK SPACE ON EDGE OF CANVAS
		$(ui.draggable).hide();		
		var the_hex = grid.GetHexByXYIndex(origin);
		VIEW_drawPieceOnCanvas(the_hex);	
	}	

	VIEW_repositionUnplacedPieces();

}

function CONTROLLER_returnToLobby() {
	window.location = "games_lobby.php?name=" + NAME;
}
