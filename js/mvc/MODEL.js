	
var BOARD_COLUMNS = 30; 
var BOARD_ROWS = 20; // THIS IS RIGHT, BUT NOT FOR ARRAY
	
var NUM_MOVES = 0;

var GRID_ARRAY = Array();


for (var x = 0; x < 50; x++) {
    GRID_ARRAY[x] = Array();    
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
		data: {game_id: GAME_ID},
		dataType: "json",
		async: false
	});
	
	request.success(function(data) {
    	moves_array = data; 

    	num_of_records = moves_array.length;
    	if (data[0] == 0)
    		num_of_records = 0;
    	//Logger("MODEL: (79) MA_LEN + MA + NUM_REC = " + moves_array.length + " / " + moves_array + " / " + num_of_records);
    	
    	if (num_of_records < old_num_of_records) { // NON-ZERO BUT FEWER RECORDS NOW THAN BEFORE
			$("#game_over_text").html("Opponent has requested undo.");
			$("#game_over_popup").show();
			setTimeout(function(){
				window.location = "play_game.php?gameid=" + GAME_ID + "&name=" + NAME + "&white_player=" + WHITE_PLAYER_NAME + "&black_player=" + BLACK_PLAYER_NAME;
			},1500);
		}
		//Logger("MODEL: (107) UPDATE ARRAY FROM DB FINISHED (" + old_num_of_records + " -> " + NUM_MOVES + ")");    	
 	});
 	
	request.fail(function(jqXHR, textStatus) {
		Logger( "MODEL: (98) REQUEST FAIL: " + textStatus + " / " + jqXHR.responseText);
	});	

   	request.done(function(data) {
    	output = moves_array;
    });
    
    var return_value = Array(erase_flag, output);
    
    return return_value;	
}

function MODEL_addMoveToDB(piece_id, destination_string, origin) {
	//Logger("MODEL: (110) MOVE ADDED TO DB");
	var request = $.ajax({
	 	url: "php/add_move_to_db.php",
		type: "POST",
		data: {game_id: GAME_ID, piece : piece_id, destination : destination_string, origin : origin},
		dataType: "html"
	});
	//NUM_MOVES++;
}

function MODEL_eraseGameFromDB() {
	//Logger("MODEL: (138) ERASE GAME FROM DB FIRED");
	//alert("GAME_ID");
	var flag;
	var request = $.ajax({
	 	url: "php/erase_game_from_db.php",
		type: "POST",
		data: {gameid: GAME_ID},
		dataType: "html",
		async: false
	});	
	request.success(function(data) {
		//alert( "DATA: " + data);
		flag = 1;
	});	

	request.fail(function(jqXHR, textStatus) {
		//alert( "ERASE GAME REQUEST FAIL: " + textStatus + " / " + jqXHR.responseText);
		flag = 0;
	});	

   	request.done(function(data) {
    	output = flag;
    	//Logger("DONE");
    });	
    
    return output;
}


function MODEL_eraseMoveFromDB(/*string*/ move_id) {
	//Logger("MODEL: (138) ERASE MOVE FROM DB FIRED");
	//alert("GAME_ID");
	var flag;
	var request = $.ajax({
	 	url: "php/erase_move_from_db.php",
		type: "POST",
		data: {moveid: move_id},
		dataType: "html",
		async: false
	});	
	request.success(function(data) {
		//alert( "DATA: " + data);
		flag = 1;
	});	

	request.fail(function(jqXHR, textStatus) {
		//alert( "ERASE GAME REQUEST FAIL: " + textStatus + " / " + jqXHR.responseText);
		flag = 0;
	});	

   	request.done(function(data) {
    	output = flag;
    	//Logger("DONE");
    });	
    
    return output;
}


function MODEL_eraseGameFromArray() {
	for (var i=0; i < GRID_ARRAY.length; i++) {
		for (var j=0; j < GRID_ARRAY[i].length; j++) {
			GRID_ARRAY[i][j] = 0;
		}
	}
	NUM_MOVES = 0;
}

function MODEL_checkIfBeeSurrounded() {
	//Logger("BEE CHECK STARTED"); 
	var white_bee_surrounded = 0;
	var black_bee_surrounded = 0;
	
	for (var i=1; i < GRID_ARRAY.length-1; i++) {
		for (var j=1; j < GRID_ARRAY[i].length-1; j++) {
			
			if (GRID_ARRAY[i][j]) { // IF THIS SPACE IN SEARCH IS OCCUPIED
				
				if (GRID_ARRAY[i][j].indexOf("white_bee1") != -1) { // WITH A WHITE BEE
					
					var a = GRID_ARRAY[i-1][j-1];
					var b = GRID_ARRAY[i-1][j];
					var c = GRID_ARRAY[i][j-1];
					var d = GRID_ARRAY[i][j+1];
					var e = GRID_ARRAY[i+1][j+1];
					var f = GRID_ARRAY[i+1][j];
					
					if (a != 0 && b != 0 && c != 0 && d != 0 && e != 0 && f != 0) { // AND ALL SURROUNDING SPACES ARE OCCUPIED
						white_bee_surrounded++;								
					}
				}
				if (GRID_ARRAY[i][j].indexOf("black_bee1") != -1) {
					var a = GRID_ARRAY[i-1][j-1];
					var b = GRID_ARRAY[i-1][j];
					var c = GRID_ARRAY[i][j-1];
					var d = GRID_ARRAY[i][j+1];
					var e = GRID_ARRAY[i+1][j+1];
					var f = GRID_ARRAY[i+1][j];
					
					if (a != 0 && b != 0 && c != 0 && d != 0 && e != 0 && f != 0) { // IF ALL SURROUNDING HEXES ARE OCCUPIED
						black_bee_surrounded++;
					}
				}
			}
		}
	}

	if (black_bee_surrounded && white_bee_surrounded) {
		$("#game_over_text").html("Both players queen bees are surrounded.<br />Game is a draw.");
		MODEL_processWinner("draw", 1);	
	}
	else if (white_bee_surrounded) {
		$("#game_over_text").html( BLACK_PLAYER_NAME + " has surrounded " + WHITE_PLAYER_NAME + "'s queen bee.<br />" + BLACK_PLAYER_NAME + " wins.");
		MODEL_processWinner(BLACK_PLAYER_NAME, 1);
	}
	else if (black_bee_surrounded) {
		$("#game_over_text").html( WHITE_PLAYER_NAME + " has surrounded " + BLACK_PLAYER_NAME + "'s queen bee.<br />" + WHITE_PLAYER_NAME + " wins.");
		MODEL_processWinner(WHITE_PLAYER_NAME, 1);
	}
		
}

function MODEL_processWinner(the_winner, finish_type) {
	$("#game_over_popup").show();
	$("#undo_move_button").hide();
	$("#resign_button").hide();
	if (SOLO_GAME) {
		$("#clear_board_button").show();
	}
	else {
		//$("#rematch_button").show();
	}
	
	if (!SOLO_GAME) {
		var request = $.ajax({
		 	url: "php/add_winner_to_db.php",
			type: "POST",
			data: {game_id: GAME_ID, winner: the_winner, finished: finish_type},
			dataType: "html",
			async: false
		});	
	}	
}

function MODEL_getBlackPlayerNameFromDB(game_id) {
	var black_player = "";
	var ret_val;
	var request = $.ajax({
	 	url: "php/get_black_player_from_db.php",
		type: "POST",
		data: {gameid: game_id},
		dataType: "html",
		async: false
	});	
	request.success(function(data) {
		black_player = data;
		if (black_player == "") {
			black_player = "(none)";
		}
	});	
	request.fail(function(jqXHR, textStatus) {
		//flag = 0;
	});	
   	request.done(function(data) {
    	ret_val = black_player;
    });
    return ret_val;		
}
