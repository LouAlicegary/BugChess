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

		return_value = MODEL_updateArrayFromDB();
		erase_flag = return_value[0];
		moves_array = return_value[1];
		
		if (erase_flag) {
			CONTROLLER_resetGame();
		}

		for (var i=0; i < moves_array.length; i++) {
			if (moves_array[i][3] !== "") {
				VIEW_removePieceFromCanvas(grid.GetHexByXYIndex(moves_array[i][3]));
			}
			VIEW_draw_piece_on_canvas(grid.GetHexByXYIndex(moves_array[i][4]));
		}

	}, frequency_timer )});	
}
	