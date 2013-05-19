function CONTROLLER_MAIN() {
	VIEW_setAllViewProperties();
	VIEW_drawEmptyGrid();
	VIEW_initGameWindow();

	document.getElementById('hexCanvas').addEventListener('click', clickOnCanvas, false);
	document.getElementById('hexCanvas').addEventListener('touchstart', clickOnCanvas, false);
	document.getElementById('reset_button').addEventListener('click', CONTROLLER_resetGame, false);
	
	CONTROLLER_doInitialUpdateFromDB(20);
				
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
				Logger("CONTROLLER: (42) MOVES_ARRAY LEN / MA = " + moves_array.length + " " + moves_array);
				piece_id = moves_array[i][2];
				origin = moves_array[i][3]; 
				destination = moves_array[i][4]; 
				//Logger("CONROLLER: (46) piece_id / origin / dest = " + piece_id + " " + origin + " " + destination);
					if (origin !== "") {
						//Logger("CONTROLLER: (46) REMOVE PIECE FROM CANVAS");
						VIEW_removePieceFromCanvas(grid.GetHexByXYIndex(origin));
						//Logger("CONTROLLER: (46) REMOVE PIECE FROM ARRAY");
						MODEL_removePieceFromArray(origin);
					}
					//Logger("CONTROLLER: (46) ADD PIECE TO ARRAY");
					MODEL_addPieceToArray(destination, piece_id);	
					//Logger("CONTROLLER: (46) ADD PIECE CANVAS");			
					VIEW_drawPieceOnCanvas(grid.GetHexByXYIndex(destination));
					

			}			
		}
	}, frequency_timer )});	
}


function CONTROLLER_doInitialUpdateFromDB(frequency_timer) {
		
	var moves_array = Array();
	var da_width = $("#hexCanvas").innerWidth();
	var da_height = $("#hexCanvas").innerWidth();
	var grid = new HT.Grid(da_width, da_height); 
	
	return_value = MODEL_getUpdateFromDB();
	
	$(function(){window.setInterval( function(){

		erase_flag = return_value[0];
		moves_array = return_value[1];
		var origin;
		var destination;
		var piece_id;

		if ((moves_array[0] != 0) && (moves_array.length != NUM_MOVES)) {
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
			Logger("CONTROLLER: (98) INITIAL UPDATE = " + NUM_MOVES + " -> " + moves_array.length);
		}			
	}, frequency_timer )});	
}	