var GRID_ARRAY = [];
for(var x = 0; x < 100; x++) {
    GRID_ARRAY[x] = [];    
    for(var y = 0; y < 100; y++) { 
        GRID_ARRAY[x][y] = 0;    
    }    
}	

var NUM_MOVES = 0;

function MODEL_addPieceToGrid(destination_string, piece_id)
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
	Logger("MODEL: (21) ADD PIECE TO [" + x_ind + "," + y_ind+ "] (cell value = " + GRID_ARRAY[x_ind][y_ind] + ")");
	
	return destination_string;
}

function MODEL_removePieceFromGrid(x_ind, y_ind) //(thepageX, thepageY) 
{
	//var the_hex = getHexByCoords(thepageX, thepageY);
	var old_value = GRID_ARRAY[x_ind][y_ind]; //GRID_ARRAY[the_hex.PathCoOrdX][the_hex.PathCoOrdY];
	Logger("MODEL: (30) START OF REMOVE PIECE old_value / x_ind / y_ind = " + old_value + " " + x_ind + " " + y_ind);//+  "piece_stack = " + piece_stack );
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
	var old_num_of_records = NUM_MOVES;
	var num_of_records = 0;
	var done_bit = 0;

	var moves_array = new Array();
	
	var new_move_array = new Array();

	var request = $.ajax({
	 	url: "php/get_moves_from_db.php",
		type: "POST",
		data: {},
		dataType: "json",
		async: false
	});
	
	request.success(function(data) {
    	moves_array = data; 
    	num_of_records = moves_array.length;
    	//Logger("MODEL: (74) num_of_records = " + num_of_records + " old_num_of_records = " + old_num_of_records);
    	
		//NUM_MOVES = num_of_records;
		done_bit = NUM_MOVES;
		
		counter = 0;
		
		for (var i=old_num_of_records; i < num_of_records; i++) {
			new_move_array[counter] = moves_array[i];
			piece_id = moves_array[i][2];
			origin = moves_array[i][3];
			origin_array = origin.split(",");
			dest = moves_array[i][4];
			dest_array = dest.split(",");
			Logger("MODEL: (99) origin = " + origin + " dest = " + dest + " i = " + i);
			
			if (origin_array.length > 1) { // origin exists
				MODEL_removePieceFromGrid(origin_array[0], origin_array[1]); 
			}
			MODEL_addPieceToGrid(dest, piece_id); 
			counter++;
		}
		if (counter) 
			Logger("MODEL: (107) UPDATE ARRAY FROM DB (" + old_num_of_records + " -> " + NUM_MOVES + ")");    	
 	});
 	
	request.fail(function(jqXHR, textStatus) {
		new_move_array = NULL;
		Logger( "MODEL: (150) REQUEST FAIL: " + textStatus + " / " + jqXHR.responseText);
	});	

   	request.done(function(data){
    	output = new_move_array; //done_bit;
    });
    
    return output;	
}




    	/*
		if (old_num_of_records == 0) {
			NUM_MOVES = num_of_records;
			//getHexGridWH();
			done_bit = NUM_MOVES;
			
			for (i=0; i < num_of_records; i++) {
				piece_id = moves_array[i][2];
				origin = moves_array[i][3];
				origin_array = origin.split(",");
				dest = moves_array[i][4];
				Logger("MODEL: (145) origin = " + origin + " dest = " + dest);
				dest_array = dest.split(",");
				if (origin_array.length > 1) { // origin exists
					MODEL_removePieceFromGrid(origin_array[0], origin_array[1]); 
				}
				// add new piece
				MODEL_addPieceToGrid(dest, piece_id); 
			}
			
			Logger("MODEL: (80) UPDATE ARRAY FROM DB (0 -> " + NUM_MOVES + ")");
		}
		else if (num_of_records != old_num_of_records) {
			NUM_MOVES = num_of_records;
			//getHexGridWH();
			done_bit = NUM_MOVES;
			Logger("MODEL: (86) UPDATE ARRAY FROM DB ( " + old_num_of_records + " -> " + num_of_records + ")");
		}
		else {
			done_bit = 0;
		}
		*/



/*	
	var request = $.ajax({
	 	url: "php/get_board_from_db.php",
		type: "POST",
		data: {},
		dataType: "json",
		async: false
	});
	
	request.success(function(data) {
    	for (i=0; i < GRID_ARRAY.length; i++) {
    		GRID_ARRAY[i] = data[i];
    		for (j=0; j < GRID_ARRAY[0].length; j++)
    			if (GRID_ARRAY[i][j] != "")
    				num_of_records++;
    	}
		if (old_num_of_records == 0) {
			Logger("MODEL: (80) UPDATE ARRAY FROM DB (INIT)");
			NUM_MOVES = num_of_records;
			getHexGridWH();
			done_bit = NUM_MOVES;
		}
		else if (num_of_records != old_num_of_records) {
			Logger("MODEL: (86) UPDATE ARRAY FROM DB (+/-)");
			NUM_MOVES = num_of_records;
			//getHexGridWH();
			done_bit = NUM_MOVES;
		}
		else {
			done_bit = 0;
		}
 	});
 	
	request.fail(function(jqXHR, textStatus) {
		done_bit = 0;
		alert( "Request failed: " + textStatus );
		 //alert( jqXHR.responseText);
	});	

   	request.done(function(data){
    	output = done_bit;
    });

*/