function CONTROLLER_MAIN() {
	VIEW_setAllViewProperties();
	VIEW_preloadImages();
	VIEW_drawEmptyGrid();
	VIEW_initGameWindow();

	document.getElementById('hexCanvas').addEventListener('click', clickOnCanvas, false);
	document.getElementById('hexCanvas').addEventListener('touchstart', clickOnCanvas, false);
	document.getElementById('reset_button').addEventListener('click', CONTROLLER_resetGame, false);
	
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
			
			Logger("CONTROLLER: (98) INITIAL UPDATE = " + NUM_MOVES + " -> " + moves_array.length);
	
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