var	NUM_OF_PIECES = 11;
	
var BOARD_COLUMNS = 30; 
var BOARD_ROWS = 20; // THIS IS RIGHT, BUT NOT FOR ARRAY
	
var NUM_MOVES = 0;

var GRID_ARRAY = [];


for (var x = 0; x < 50; x++) {
    GRID_ARRAY[x] = [];    
    for(var y = 0; y < 50; y++) { 
        GRID_ARRAY[x][y] = 0;    
    }    
}	


function MODEL_addPieceToArray(destination_string, piece_id)
{
	destination_array = destination_string.split(",");
	x_ind = destination_array[0];
	y_ind = destination_array[1];
	
	if (GRID_ARRAY[x_ind][y_ind])
		GRID_ARRAY[x_ind][y_ind] += "," + piece_id;
	else
		GRID_ARRAY[x_ind][y_ind] = piece_id;
	
	NUM_MOVES++;
	
	//Logger("MODEL: (21) ADD " + piece_id + " TO ARRAY AT [" + x_ind + "," + y_ind + "] (cell value = " + GRID_ARRAY[x_ind][y_ind] + ")");
}

function MODEL_removePieceFromArray( /*String*/ source_point)
{
	var x_ind = source_point.substring(0, source_point.indexOf(","));
	var y_ind = source_point.substring(source_point.indexOf(",")+1);
	//Logger("MODEL: (42) val = " + x_ind + " " + y_ind);//GRID_ARRAY[x_ind][y_ind]);
	var old_value = GRID_ARRAY[x_ind][y_ind]; 
	var piece_stack = old_value.split(",");
	var stack_string = "";
	
	if (piece_stack.length > 1) {
		for (var i=0; i<piece_stack.length-1; i++) {
			stack_string += piece_stack[i] + ","; 
		}
		stack_string = stack_string.substring(0, (stack_string.length)-1);
		GRID_ARRAY[x_ind][y_ind] = stack_string;
	}
	else {
		GRID_ARRAY[x_ind][y_ind] = 0;
	}
		
	//Logger("MODEL: (60) REMOVE " + piece_stack[piece_stack.length-1] + " FROM ARRAY AT [" + x_ind + "," + y_ind + "] (cell value = " + GRID_ARRAY[x_ind][y_ind] + ")");
}

function MODEL_getUpdateFromDB()
{
	var old_num_of_records = NUM_MOVES;
	var num_of_records = 0;
	var moves_array = new Array();	
	var erase_flag = 0;

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
    	if (data[0] == 0)
    		num_of_records = 0;
    	//Logger("MODEL: (79) MA_LEN + MA + NUM_REC = " + moves_array.length + " / " + moves_array + " / " + num_of_records);
    	
    	if ((num_of_records) == 0 && (num_of_records < old_num_of_records)) { // RESET BUTTON EVENT (NO RECORDS NOW BUT WERE SOME BEFORE)
    		erase_flag = 1;
    		NUM_MOVES = 0;   
    		Logger("0 records (were some before)"); 		
    	}
    	else if (num_of_records < old_num_of_records) { // NON-ZERO BUT FEWER RECORDS NOW THAN BEFORE
    		//erase_flag = 1;
    		NUM_MOVES = num_of_records;
    		Logger("WEIRD DATABASE ERROR. OLD-> NEW RECORDS = " + old_num_of_records + " -> " + num_of_records);    		
    	}
    	else {  		
    	}

		//Logger("MODEL: (107) UPDATE ARRAY FROM DB FINISHED (" + old_num_of_records + " -> " + NUM_MOVES + ")");    	
 	});
 	
	request.fail(function(jqXHR, textStatus) {
		Logger( "MODEL: (98) REQUEST FAIL: " + textStatus + " / " + jqXHR.responseText);
	});	

   	request.done(function(data) {
    	output = moves_array;
    });
    
    return_value = Array(erase_flag, output);
    return return_value;	
}

function MODEL_addMoveToDB(piece_id, destination_string, origin) {
	Logger("MODEL: (48) MOVE ADDED TO DB");
	var request = $.ajax({
	 	url: "php/place_piece.php",
		type: "POST",
		data: {piece : piece_id, destination : destination_string, origin : origin},
		dataType: "html"
	});
	//NUM_MOVES++;
}

function MODEL_eraseGameFromDB() {
	Logger("MODEL: (138) ERASE GAME FROM DB FIRED");
	var request = $.ajax({
	 	url: "php/erase_game_from_db.php",
		type: "POST",
		data: {},
		dataType: "json",
		async: false
	});	
}

function MODEL_eraseGameFromArray() {
	for (var i=0; i < GRID_ARRAY.length; i++) {
		for (var j=0; j < GRID_ARRAY[i].length; j++) {
			GRID_ARRAY[i][j] = 0;
		}
	}
	NUM_MOVES = 0;
}