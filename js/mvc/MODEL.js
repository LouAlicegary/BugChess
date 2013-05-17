var	NUM_OF_PIECES = 11;
	
var BOARD_COLUMNS = 25;
var BOARD_ROWS = 25;
	
var NUM_MOVES = 0;

var GRID_ARRAY = [];

for (var x = 0; x < 25; x++) {
    GRID_ARRAY[x] = [];    
    for(var y = 0; y < 25; y++) { 
        GRID_ARRAY[x][y] = 0;    
    }    
}	

function MODEL_addPieceToArray(destination_string, piece_id)
{
	//Logger("MODEL: (13) dest_string = " + destination_string);
	//var the_hex = getHexByCoords(thepageX, thepageY);
	destination_array = destination_string.split(",");
	x_ind = destination_array[0];
	y_ind = destination_array[1];
	
	var stack_string = GRID_ARRAY[x_ind][y_ind];
	if (stack_string) {
		GRID_ARRAY[x_ind][y_ind] += "," + piece_id;
	}
	else {
		GRID_ARRAY[x_ind][y_ind] = piece_id;
	}	
	
	NUM_MOVES++;
	Logger("MODEL: (21) ADD PIECE TO ARRAY AT [" + x_ind + "," + y_ind+ "] (cell value = " + GRID_ARRAY[x_ind][y_ind] + ")");
	
	return destination_string;
}

function MODEL_removePieceFromArray(x_ind, y_ind) //(thepageX, thepageY) 
{
	//var the_hex = getHexByCoords(thepageX, thepageY);
	var old_value = GRID_ARRAY[x_ind][y_ind]; //GRID_ARRAY[the_hex.PathCoOrdX][the_hex.PathCoOrdY];
	//Logger("MODEL: (30) START OF REMOVE PIECE old_value / x_ind / y_ind = " + old_value + " " + x_ind + " " + y_ind);//+  "piece_stack = " + piece_stack );
	var piece_stack = old_value.split(",");
	
	var stack_string = "";
	if (piece_stack.length > 1) {
		for (i=0; i<piece_stack.length-1; i++) {
			stack_string += piece_stack[i] + ","; 
		}
		stack_string = stack_string.substring(0, (stack_string.length)-1);
		GRID_ARRAY[x_ind][y_ind] = stack_string;
	}
	else {
		GRID_ARRAY[x_ind][y_ind] = 0;
	}
		
	Logger("MODEL: (42) REMOVE " + piece_stack[piece_stack.length-1] + " FROM " + x_ind + "," + y_ind + " (GRID_ARRAY now = " + GRID_ARRAY[x_ind][y_ind] + ")");
}


function MODEL_addMoveToDB(piece_id, destination_string, origin) {
	Logger("MODEL: (48) MOVE ADDED TO DB");
	var request = $.ajax({
	 	url: "php/place_piece.php",
		type: "POST",
		data: {piece : piece_id, destination : destination_string, origin : origin},
		dataType: "html"
	});
}



function MODEL_updateArrayFromDB()
{
	
	// WHAT IF FEWER RECORDS NOW?
	
	var old_num_of_records = NUM_MOVES;
	var num_of_records = 0;
	var moves_array = new Array();	
	var new_move_array = new Array();
	var erase_flag = 0;

	var request = $.ajax({
	 	url: "php/get_moves_from_db.php",
		type: "POST",
		data: {},
		dataType: "json",
		async: false
	});
	
	request.success(function(data) {
    	var counter = 0;
    	moves_array = data; 
    	//Logger("moves_array" + moves_array + " data: " + data);
    	if (moves_array != 0) {
    		num_of_records = moves_array.length;
    	}
    	
    	if (old_num_of_records > num_of_records) {
    		erase_flag = 1;
    		NUM_MOVES = num_of_records;
    	}
    	else {
			for (var i=old_num_of_records; i < num_of_records; i++) {
				new_move_array[counter] = moves_array[i];
				piece_id = moves_array[i][2];
				origin = moves_array[i][3];
				origin_array = origin.split(",");
				dest = moves_array[i][4];
				dest_array = dest.split(",");
	
				if (origin_array.length > 1) { // origin exists
					MODEL_removePieceFromArray(origin_array[0], origin_array[1]); 
				}
				MODEL_addPieceToArray(dest, piece_id); 
				counter++;
			}    		
    	}
		if (counter) 
			Logger("MODEL: (107) UPDATE ARRAY FROM DB (" + old_num_of_records + " -> " + NUM_MOVES + ")");    	
 	});
 	
	request.fail(function(jqXHR, textStatus) {
		Logger( "MODEL: (150) REQUEST FAIL: " + textStatus + " / " + jqXHR.responseText);
	});	

   	request.done(function(data) {
    	output = new_move_array;
    });
    
    return_value = Array(erase_flag, output);
    return return_value;	
}

function MODEL_eraseGameFromDB() {
	var request = $.ajax({
	 	url: "php/erase_game_from_db.php",
		type: "POST",
		data: {},
		dataType: "json",
		async: false
	});	
}

function MODEL_eraseGameFromArray() {
	for (var i=0; i<BOARD_COLUMNS; i++) {
		for (var j=0; j < BOARD_ROWS; j++) {
			GRID_ARRAY[i][j] = 0;
		}
	}
}