var WHITE_BEE_PLACED = 0;
var BLACK_BEE_PLACED = 0;

var CLICKED_ON = "";
var mid_drop_flag = 0; // set to 1 on draggable start


function CONTROLLER_MAIN() {
	VIEW_setAllViewProperties();
	VIEW_drawEmptyGrid();
	VIEW_initGameWindow();
	
	document.getElementById('hexCanvas').addEventListener('click', VIEW_EVENT_clickPieceOnBoard, false);
	document.getElementById('hexCanvas').addEventListener('touchstart', VIEW_EVENT_clickPieceOnBoard, false);
	
	document.getElementById('undo_move_button').addEventListener('click', CONTROLLER_undoMove, false);
	document.getElementById('cancel_game_button').addEventListener('click', CONTROLLER_cancelGame, false);
	document.getElementById('resign_button').addEventListener('click', CONTROLLER_resignGame, false);
	
	document.getElementById('return_button').addEventListener('click', CONTROLLER_returnToLobby, false);
	//document.getElementById('return_button').addEventListener('touchstart', CONTROLLER_returnToLobby, false);
	
	$(".game_piece").click(VIEW_EVENT_clickPieceOnBoard);
	
	$(".game_piece").bind("drag", function(event, ui) {
        //ui.draggable.css({"opacity": "0"});
        //ui.helper
        /*
        PIECE_ANIMATION_INTERVAL = setInterval(function() {
            $(ui.helper).animate({'opacity': '1', 'height': '+=10', 'width': '+=10', 'left': '-=5', 'top': '-=5'}, 500);
            $(ui.helper).animate({'opacity': '1', 'height': '-=20', 'width': '-=20', 'left': '+=10', 'top': '+=10'}, 1000);
            $(ui.helper).animate({'opacity': '1', 'height': '+=10', 'width': '+=10', 'left': '-=5', 'top': '-=5'}, 500);
        }, 2000);
        
        $(ui.helper).animate({'opacity': '1', 'height': '+=10', 'width': '+=10', 'left': '-=5', 'top': '-=5'}, 500);
        $(ui.helper).animate({'opacity': '1', 'height': '-=20', 'width': '-=20', 'left': '+=10', 'top': '+=10'}, 1000);
        $(ui.helper).animate({'opacity': '1', 'height': '+=10', 'width': '+=10', 'left': '-=5', 'top': '-=5'}, 500);
        */
        });
	
	
	document.ontouchmove = function(e) {e.preventDefault()}; // STOPS BOUNCE ON MOBILE
	
	if (!SOLO_GAME) {
		CONTROLLER_doInitialUpdateFromDB(30);
		CONTROLLER_pollingFunction(3000); // POLLS SERVER FOR UPDATES TO SERVER		
	}

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

		var origin;
		var destination;
		var piece_id;
		
		// UPDATE OPPONENT NAME IF RECENTLY ENTERED GAME
		if (BLACK_PLAYER_NAME == "(none)") {
			BLACK_PLAYER_NAME = MODEL_getBlackPlayerNameFromDB(GAME_ID);
			VIEW_updateOpponentName();
		}
		
		var db_update = MODEL_getUpdateFromDB();
		var erase_flag = db_update[0];
		moves_array = db_update[1];
		// IF DELETE GAME BUTTON HIT, RESET. ELSE: CHECK FOR NEW MOVES IN DB.			
		if ((moves_array[0] != 0) && (moves_array.length != NUM_MOVES)) { // IF DB AND BOARD ARE DIFFERENT
			if (NUM_MOVES < moves_array.length)	{ // IF MORE MOVES THAN BEFORE
				i = NUM_MOVES;
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
		
		if (load_counter == 10) { // if all piece images preloaded successfully
			var origin;
			var destination;
			var piece_id;

			if ((moves_array[0] != 0) && (moves_array.length != NUM_MOVES)) { // IF NEW MOVE FOUND IN DB
				var i = NUM_MOVES; // does one move at a time because it's this function runs on an interval
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





function VIEW_EVENT_clickPieceOnBoard(event) {
    
    var break_flag = 0;
    
    if(mid_drop_flag) {
        break_flag = 1;
    }
    
    mid_drop_flag = 0;
    
    if (break_flag)
        return;
    
    var clicked_hex = SUPPORT_getHexByWindowCoords(event.pageX, event.pageY);
    
    // IF ACTUAL HEX IS CLICKED AND NOT BLANK SPACE
    if (clicked_hex) {
        CLICKED_ON = clicked_hex.GetXYLocation();
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
            
            // IF BLACK'S TURN + BLACK PIECE CLICKED OR WHITE TURN -> WHITE PIECE
            if ( ((NUM_MOVES % 2 == 1) && (this_piece.indexOf("black") != -1)) || ( ((NUM_MOVES % 2) == 0) && (this_piece.indexOf("white") != -1)) ) { 
                $(".game_piece").unbind("click");   
                $(".game_piece").click(CONTROLLER_onDrop);  
    
                document.getElementById('hexCanvas').removeEventListener('click', VIEW_EVENT_clickPieceOnBoard);
                document.getElementById('hexCanvas').addEventListener('click', CONTROLLER_onDrop, false); //VIEW_EVENT_clickOncePieceSelected, false);

                $("#" + this_piece).attr('origin', clicked_hex.GetXYLocation());
                VIEW_removePieceFromCanvas(clicked_hex);
                VIEW_showDraggablePiece(this_piece, hex_midpoint);
            }

        }   
    }   
}   



function CONTROLLER_onDrop( event, ui ) {           
    //Logger("DROP");
    var the_piece;
    
    var pos;
    var hex_midpoint;
    
    mid_drop_flag = 0;
    
    if (typeof ui == 'undefined' ) { // CLICK ON DESTINATION HEX INSTEAD OF DRAG / DROP
        var x_val = parseInt(CLICKED_ON.substring(0, CLICKED_ON.indexOf(",")));
        var y_val = parseInt(CLICKED_ON.substring(CLICKED_ON.indexOf(",") + 1));
        the_piece = "#" + getTopPieceInArray(x_val,y_val); //"#" + this.id;
        hex_midpoint = new HT.Point(event.pageX, event.pageY);
        $(".game_piece").unbind("click");
        $(".game_piece").click(VIEW_EVENT_clickPieceOnBoard);
    }
    else { // DROP PIECE
        the_piece = ui.draggable;
        pos = $(the_piece).position();
        hex_midpoint = new HT.Point(pos.left + (PIECE_WIDTH/2), pos.top + (PIECE_HEIGHT/2));
    }
    
    clearInterval(PIECE_ANIMATION_INTERVAL);
    //document.getElementById($(ui.draggable).attr('id')).style.webkitTransform = "rotate(0deg)";
    
    document.getElementById('hexCanvas').removeEventListener('click', CONTROLLER_onDrop, false);
    document.getElementById('hexCanvas').addEventListener('click', VIEW_EVENT_clickPieceOnBoard, false);
    
    $(the_piece).unbind("click");
    
    $(the_piece).trigger('mouseleave'); // forgot why this is here...stop highlighting sidebar pieces?;
    
    var piece_id = $(the_piece).attr("id");
    var origin = $(the_piece).attr('origin');   
    
    var the_hex = SUPPORT_getHexByWindowCoords(hex_midpoint.X, hex_midpoint.Y);
    var grid = new HT.Grid($("#hexCanvas").width(), $("#hexCanvas").height());
    
    if (the_hex) { // IF DROPPED ON AN ACTUAL HEX ON GRID // TODO: COULD BE ALLOWING DROPS ON EDGE OF CANVAS DESPITE LOGIC OF THIS IF/ELSE...MAY NEED TO FIX 
        
        if (the_hex.GetXYLocation() == origin) { // IF ORIGIN == DEST
            $(the_piece).hide();        
            var the_hex = grid.GetHexByXYIndex(origin);
            VIEW_drawPieceOnCanvas(the_hex);
        }
        else { // IF NEW PIECE BEING PLACED OR IF ORIGIN != DEST
            var dest = the_hex.GetXYLocation();
            CONTROLLER_processMove(origin, dest, piece_id);
        }               

    }
    else if (origin) { // IF DROPPED FROM BOARD TO BLANK SPACE ON EDGE OF CANVAS
        $(the_piece).hide();        
        var the_hex = grid.GetHexByXYIndex(origin);
        VIEW_drawPieceOnCanvas(the_hex);    
    }   
}



function CONTROLLER_processMove(in_origin, in_dest, in_piece_id) {
    var invalid_flag = 0;
    var current_color = getCurrentColorByMove(NUM_MOVES);
    var grid = new HT.Grid($("#hexCanvas").width(), $("#hexCanvas").height());
    
    var dest_x = in_dest.substring(0, in_dest.indexOf(",")); 
    var dest_y = in_dest.substring(in_dest.indexOf(",")+1);
    
    var error_string = "";
    if (!in_origin) { // IF PIECE NOT ALREADY ON BOARD
        // MAKE SURE HEX ISN'T OCCUPIED
        if (GRID_ARRAY[dest_x][dest_y] && NUM_MOVES != 0) {
            invalid_flag += 1;
            error_string += "You can't place a piece onto the board for the first time in an occupied square.\n\n";
        }
            
        // MAKE SURE PIECE NOT TOUCHING OPPONENT'S COLOR
        if (isHexTouchingOpponent(in_piece_id, in_dest) && NUM_MOVES > 1) {
            invalid_flag += 2;
            error_string += "A piece coming onto the board for the first time can't be placed touching an opponent's piece.\n\n"; 
        }
                
        // MAKE SURE TARGET HEX IS CONNECTED TO BOARD
        if (!isHexConnectedToBoard(in_origin, in_dest) && NUM_MOVES != 0) {
            invalid_flag += 4;
            error_string += "The destination hex isn't touching the hive.\n\n";
        }
        // MAKE SURE BEE IS PLACED BY COMPLETION OF 4TH MOVE    
        if ( (current_color = "white") && (NUM_MOVES == 6) && (in_piece_id.indexOf( "white_bee1")==-1) && !(WHITE_BEE_PLACED) ) {
            invalid_flag += 8;
            error_string += "This is your fourth move, so the bee must be placed by this point. Please put the bee on the board.\n\n";
        }
        else if ( (current_color = "black") && (NUM_MOVES == 7) && (in_piece_id.indexOf( "black_bee1")==-1) && !(BLACK_BEE_PLACED) ) {
            invalid_flag += 8;
            error_string += "This is your fourth move, so the bee must be placed by this point. Please put the bee on the board.\n\n";
        }   

    }
    else { // IF PIECE ALREADY ON BOARD
        var origin_x = parseInt(in_origin.substring(0, in_origin.indexOf(","))); 
        var origin_y = parseInt(in_origin.substring(in_origin.indexOf(",")+1));
        
        // MAKE SURE DOESN'T VIOLATE 1 HIVE RULE
        if (!oneHiveDuringMove(in_origin)) {
            invalid_flag += 16;
            error_string += "The move you are trying to make violates the one hive rule.\nWhen you pick up your piece to move it, the hive can't segment into two.\n\n";
            $("#" + in_piece_id).hide();
        }
        // SAME AS ABOVE, HENCE LOW FLAG    
        if (!isHexConnectedToBoard(in_origin, in_dest) && NUM_MOVES != 0) {
            invalid_flag += 4;
            error_string += "The destination hex isn't touching the hive.\n\n";
            $("#" + in_piece_id).hide();
        }
                        
        // CANT MOVE UNTIL QUEEN PLACED
        if ( (current_color == "white") && !(WHITE_BEE_PLACED) ) {
            invalid_flag+=32;
            error_string += "You can't move a piece that's on the board until the queen has been placed.\n\n";
            $("#" + in_piece_id).hide();
        }
        else if ( (current_color == "black") && !(BLACK_BEE_PLACED) ) {
            invalid_flag+=32;
            error_string += "You can't move a piece that's on the board until the queen has been placed.\n\n";
            $("#" + in_piece_id).hide();                    
        }
        
        // ONLY BEETLE CAN GO ON TOP
        if (in_piece_id.indexOf("beetle") == -1) {
            if (GRID_ARRAY[dest_x][dest_y]) {
                invalid_flag+= 64;
                error_string += "Only beetles may climb on top of another piece.\n\n";
                $("#" + in_piece_id).hide();
            }
        }
        
        // MAKE SURE BEETLE IS ONLY MOVING ONE PIECE = 64
        if (in_piece_id.indexOf("beetle") != -1) {
            if (getDistanceBetweenHexes(in_origin, in_dest) != 1) {
                invalid_flag += 128;
                error_string += "The beetle can only move one space, but may move on top of another piece.\n\n";  
            }
        }
        
        // MAKE SURE QUEEN IS ONLY MOVING ONE PIECE = 64
        if (in_piece_id.indexOf("bee1") != -1) {
            if (getDistanceBetweenHexes(in_origin, in_dest) != 1) {
                invalid_flag += 128;
                error_string += "The queen bee can only move one space.\n\n"; 
            }                   
        }
        
        // MAKE SURE GRASSHOPPER IS ONLY MOVING DIAGONALLY AND INTO FIRST EMPTY SPACE
        if (in_piece_id.indexOf("grasshopper") != -1) {
            var invalid_jump_flag = 0;
            
            if (getDistanceBetweenHexes(in_origin, in_dest) == 1 ) {
                invalid_jump_flag = 3;
            }
             else if (  (dest_y == origin_y) && (dest_x > origin_x) ) {
                for (var i=origin_x + 1; i < dest_x; i++) {
                    if (GRID_ARRAY[i][origin_y] == 0) {
                        invalid_jump_flag = 1;
                        empty_space = "(" + i + "," + origin_y + ")";
                        break;
                    }
                }
            }
            
            else if (  (dest_y == origin_y) && (origin_x > dest_x) ) {
                for (var i=origin_x - 1; i > dest_x; i--) {
                    if (GRID_ARRAY[i][origin_y] == 0) {
                        invalid_jump_flag = 1;
                        empty_space = "(" + i + "," + origin_y + ")";
                        break;
                    }
                }
            }
            else if (  (dest_y != origin_y) && (dest_x > origin_x) && (Math.abs(dest_x-origin_x) == Math.abs(dest_y - origin_y)) ) {
                for (var i=origin_x + 1; i < dest_x; i++) {
                    if (GRID_ARRAY[i][origin_y-origin_x+i] == 0) {
                        invalid_jump_flag = 1;
                        empty_space = "(" + i + "," + origin_y + ")";
                        break;
                    }
                }
            }
            else if (  (dest_y != origin_y) && (origin_x > dest_x) && (Math.abs(dest_x-origin_x) == Math.abs(dest_y - origin_y)) ) {
                // quadrant 2
                for (var i=origin_x-1; i > dest_x; i--) {
                    if (GRID_ARRAY[i][origin_y - origin_x + i] == 0) {
                        invalid_jump_flag = 1;
                        empty_space = "(" + i + "," + origin_y + ")";
                        break;
                    }
                }
            }
            else if (  (dest_x == origin_x) && (dest_y > origin_y) ) {
                for (var i=origin_y + 1; i < dest_y; i++) {
                    if (GRID_ARRAY[origin_x][i] == 0) {
                        invalid_jump_flag = 1;
                        empty_space = "(" + origin_x + "," + i + ")";
                        break;
                    }
                }
            }
            
            else if (  (dest_x == origin_x) && (origin_y > dest_y) ) {
                for (var i=origin_x - 1; i > dest_x; i--) {
                    if (GRID_ARRAY[origin_x][i] == 0) {
                        invalid_jump_flag = 1;
                        empty_space = "(" + origin_x + "," + i + ")";
                        break;
                    }
                }
            }
            
            // ILLEGAL MOVE NOT ON DIAGONAL
            else {
                invalid_jump_flag = 2;
            }
            
            if (invalid_jump_flag == 3) {
                invalid_flag += 128;
                error_string += "The grasshopper must actually jump a piece. It can't just move one spot.\n\n";                
            }
            else if (invalid_jump_flag == 2) {
                invalid_flag += 128;
                error_string += "The grasshopper must move on a diagonal and cannot skip any empty spaces while moving.\n\n"; 
            }
            else if (invalid_jump_flag == 1) {
                invalid_flag += 128;
                error_string += "The grasshopper must move on a diagonal and cannot skip any empty spaces while moving.\nThere was an empty space at " + empty_space + ".\n\n";
            }
        }
        
        // MAKE SURE SPIDER IS MOVING THREE MOVES AROUND OUTSIDE OF BOARD
        if (in_piece_id.indexOf("spider") != -1) {
            var theHive = getOutsideOfHive(in_origin);
            if (!possibleSpiderPath(theHive, in_origin, in_dest)) {
                invalid_flag += 128;
                error_string += "The spider must move three spaces around the outside edge of the hive.\n\n"; 
            }
        }
        
        // MAKE SURE ANT IS ONLY MOVING ALONG OUTSIDE OF BOARD
        if (in_piece_id.indexOf("ant") != -1) {
            var theHive = getOutsideOfHive(in_origin) ;
            Logger("FINAL HIVE: " + theHive);
            if (isHexInStack(new Array(dest_x, dest_y), theHive))  {
                invalid_flag += 128;
                error_string += "The ant can only move around the outside edge of the hive.\n\n";       
            }
            
        }
        
        
    } // END OF "ELSE" LOOP FOR PIECE DROPS WHERE ORIGIN EXISTS
    
    if (invalid_flag) { // IF MOVE VIOLATES A GAME RULE
        alert("INVALID MOVE\n" + error_string);
        
        if (in_origin) { // redraw piece at origin on invalid move
            var the_hex = grid.GetHexByXYIndex(in_origin);
            VIEW_drawPieceOnCanvas(the_hex);        
        }
        else {
            VIEW_repositionUnplacedPieces();
        }
    }
    
    else { // IF LEGITIMATE MOVE
        
        if (in_origin)
            MODEL_removePieceFromArray(in_origin);
        else if (in_piece_id.indexOf("white_bee1") != -1)
            WHITE_BEE_PLACED++;
        else if (in_piece_id.indexOf("black_bee1") != -1)
            BLACK_BEE_PLACED++;
            
        MODEL_addPieceToArray(in_dest, in_piece_id);
        
        if (!SOLO_GAME) 
            MODEL_addMoveToDB(in_piece_id, in_dest, in_origin);
        
        var the_hex = grid.GetHexByXYIndex(in_dest);
        
        VIEW_drawPieceOnCanvas(the_hex);    
        
        $("#" + in_piece_id).hide();
        $("#" + in_piece_id).attr('origin', the_hex.GetXYLocation());

        
        // CHECK IF BEE IS SURROUNDED = LOSS
        setTimeout(MODEL_checkIfBeeSurrounded,200);                 
    }       
}



function CONTROLLER_returnToLobby() {
    window.location = "games_lobby.php?name=" + NAME;
}

function CONTROLLER_cancelGame() {
    var ret_val = MODEL_eraseGameFromDB();
    if (ret_val) {
        window.location = "games_lobby.php?name=" + NAME;
    }
}

function CONTROLLER_resignGame() {
    var winner = '';
    if (NAME == WHITE_PLAYER_NAME)
        winner = BLACK_PLAYER_NAME;
    else
        winner = WHITE_PLAYER_NAME;
        
    $("#game_over_text").html("Game resigned.<br />" + winner + " wins.");
    MODEL_processWinner(winner, 2); 
}

function CONTROLLER_undoMove() {
    
    if (!SOLO_GAME) { // DONT WRITE TO DB IF SOLO
        var old_num_of_records = NUM_MOVES;
        var num_of_records = 0;
        var moves_array = new Array();  
        //var erase_flag = 0;
        var last_move = new Array();
        
        var da_width = $("#hexCanvas").innerWidth();
        var da_height = $("#hexCanvas").innerWidth();
        var grid = new HT.Grid(da_width, da_height);
    
        var request = $.ajax({
            url: "php/get_moves_from_db.php",
            type: "POST",
            data: {game_id: GAME_ID},
            dataType: "json",
            async: false
        });
        
        request.success(function(data) {
            moves_array = data;     
        });
        
        request.fail(function(jqXHR, textStatus) {
        }); 
    
        request.done(function(data) {
            last_move = moves_array[moves_array.length-1]; 
            var move_id = last_move[0];
            var piece_id = last_move[2];
            var origin =  last_move[3];
            var destination = last_move[4];
    
            NUM_MOVES--; //NECESSARY BECAUSE WE'RE ACTUALLY REMOVING A PIECE FROM THE BOARD
            VIEW_removePieceFromCanvas(grid.GetHexByXYIndex(destination));
            MODEL_removePieceFromArray(destination);
                    
            if (origin !== "") {
                NUM_MOVES--; // CANCELS OUT NUM_MOVES++ in addPiecetArray function
                MODEL_addPieceToArray(origin, piece_id);                
                VIEW_drawPieceOnCanvas(grid.GetHexByXYIndex(origin));
            }
    
            MODEL_eraseMoveFromDB(move_id);
            
        }); 
    }
}

function /*string*/ getTopPieceInArray( /*int*/ x_val, /*int*/ y_val) {
    x_val = parseInt(x_val);
    y_val = parseInt(y_val);
    var cell = GRID_ARRAY[x_val][y_val];
    var top_piece;
    var comma;
    if (cell) {
        comma = cell.indexOf(",");
        if (comma == -1) { // ONLY ONE PIECE IN CELL
            top_piece = cell;
        }
        else { // 2+ PIECES IN CELL
            top_piece = cell.substring(cell.lastIndexOf(",")+1);
        }
    }
    else {
        top_piece = "";
    }
    
    return top_piece;
}

function isHexTouchingOpponent(piece, dest) {
    var dest_x = parseInt(dest.substring(0, dest.indexOf(","))); 
    var dest_y = parseInt(dest.substring(dest.indexOf(",")+1));
    var search_str;
    if (piece.indexOf("white") != -1) // if piece contains white, search for black
        search_str = "black";
    else
        search_str = "white";
    
    var val_a = getTopPieceInArray(dest_x-1, dest_y-1);
    var val_b = getTopPieceInArray(dest_x-1, dest_y);
    var val_c = getTopPieceInArray(dest_x, dest_y-1);
    var val_d = getTopPieceInArray(dest_x, dest_y+1);
    var val_e = getTopPieceInArray(dest_x+1, dest_y);
    var val_f = getTopPieceInArray(dest_x+1, dest_y+1);
    
    var flag_a, flag_b, flag_c, flag_d, flag_e, flag_f;
    
    if (val_a)
        flag_a = val_a.indexOf(search_str);
    else
        flag_a = -1;
    if (val_b)
        flag_b = val_b.indexOf(search_str);
    else
        flag_b = -1;
    if (val_c)
        flag_c = val_c.indexOf(search_str);
    else
        flag_c = -1;
    if (val_d)
        flag_d = val_d.indexOf(search_str);
    else
        flag_d = -1;
    if (val_e)
        flag_e = val_e.indexOf(search_str);
    else
        flag_e = -1;
    if (val_f)
        flag_f = val_f.indexOf(search_str);
    else
        flag_f = -1;                                
    
    if ( (flag_a != -1) ||  (flag_b != -1) || (flag_c != -1) || (flag_d != -1) || (flag_e != -1) || (flag_f != -1) ) // TOUCHING OPPONENT PIECE
        return 1; 
    else            
        return 0;   
}

function getPlayerColorByName(name) {
    var color;
    
    if (name == WHITE_PLAYER_NAME)
        color = "white";
    else if (name == BLACK_PLAYER_NAME)
        color = "black";
    else
        color = "";
        
    return color;
}

function getCurrentColorByMove(move) {
    var color;
    
    if (move % 2 == 0)
        color = "white";
    else 
        color = "black";
        
    return color;
}

// is this useless now?
function getPlayerColor() {
    var color;
    if (NAME == WHITE_PLAYER_NAME) {
        color = "white";
    }
    else {
        color = "black";
    }
    return color;
}

function isHexConnectedToBoard(origin, dest) { // the array hasn't been updated yet, so piece still in origin location
    var dest_x = parseInt(dest.substring(0, dest.indexOf(","))); 
    var dest_y = parseInt(dest.substring(dest.indexOf(",")+1));
    
    var temp_array = Array();
    temp_array = arrayCloner(GRID_ARRAY);
    
    if (origin) {
        var origin_x = parseInt(origin.substring(0, origin.indexOf(","))); 
        var origin_y = parseInt(origin.substring(origin.indexOf(",")+1));   
        removeTopPieceFromArrayCell(temp_array, origin_x, origin_y);
    }
    
    var flag_a = temp_array[dest_x-1][dest_y-1];
    var flag_b = temp_array[dest_x-1][dest_y];
    var flag_c = temp_array[dest_x][dest_y-1];
    var flag_d = temp_array[dest_x][dest_y+1];
    var flag_e = temp_array[dest_x+1][dest_y];
    var flag_f = temp_array[dest_x+1][dest_y+1];
    
    if ( flag_a || flag_b || flag_c || flag_d || flag_e || flag_f ) // TOUCHING HIVE
        return 1; 
    else            
        return 0;       
}

function oneHiveDuringMove(origin) {
    var stack = Array();
    var temp_xy = Array();
    var origin_x = parseInt(origin.substring(0, origin.indexOf(","))); 
    var origin_y = parseInt(origin.substring(origin.indexOf(",")+1));
    
    // stack will contain all coordinate sets that contain pieces
    for (var i=0; i < GRID_ARRAY.length; i++)
        for (var j=0; j < GRID_ARRAY[i].length; j++) 
            if (GRID_ARRAY[i][j] && !((i == origin_x) && (j == origin_y)) )
                    stack.push(new Array(i,j));
    
    if (GRID_ARRAY[origin_x][origin_y].indexOf(",") != -1) { // if the hex i'm moving piece from is still occupied, add it back
        stack.push(new Array(origin_x,origin_y));
    } 
        
    // starts with random value from stack. iterates through whole stack
    // each time it finds a neighbor, it pops it off the stack and recurses from the new point
     
    temp_xy = stack.pop();
    var x_value = temp_xy[0];
    var y_value = temp_xy[1];
    var flag = 0;
    var iteration = 0;
    recurseHive(x_value, y_value);
        
    function recurseHive(x_val, y_val) {
        var this_num = iteration;   
        //Logger("ITERATION " + this_num + " STARTED. X/Y = " + x_val + "/" + y_val);
        iteration++;
        for (var i=0; i < stack.length; i++)
            if ( (stack[i][0] == x_val-1) && (stack[i][1] == y_val-1) ) {
                flag = 1;
                stack.splice(i,1);
                recurseHive(x_val-1, y_val-1);
            }   
        for (var i=0; i < stack.length; i++)
            if ( (stack[i][0] == x_val-1) && (stack[i][1] == y_val) ) {
                flag = 1;
                stack.splice(i,1);
                recurseHive(x_val-1, y_val);
            }
        for (var i=0; i < stack.length; i++)
            if ( (stack[i][0] == x_val) && (stack[i][1] == y_val-1) ) {
                flag = 1;
                stack.splice(i,1);
                recurseHive(x_val, y_val-1);
            }
        for (var i=0; i < stack.length; i++)
            if ( (stack[i][0] == x_val) && (stack[i][1] == y_val+1) ) {
                flag = 1;
                stack.splice(i,1);
                recurseHive(x_val, y_val+1);
            }
        for (var i=0; i < stack.length; i++)
            if ( (stack[i][0] == x_val+1) && (stack[i][1] == y_val) ) {
                flag = 1;
                stack.splice(i,1);
                recurseHive(x_val+1, y_val);
            }
        for (var i=0; i < stack.length; i++)
            if ( (stack[i][0] == x_val+1) && (stack[i][1] == y_val+1) ) {
                flag = 1;
                stack.splice(i,1);
                recurseHive(x_val+1, y_val+1);
            }       
    }
    if (stack.length)
        return 0;
    else 
        return 1;
    
}   

function removeTopPieceFromArrayCell(/*Array*/ the_array, /*int*/ origin_x, /*int*/ origin_y) {
    origin_x = parseInt(origin_x);
    origin_y = parseInt(origin_y);
    var temp_string = the_array[origin_x][origin_y];

    if (temp_string.indexOf(",") != -1) {
        the_array[origin_x][origin_y] = temp_string.substring(0,temp_string.lastIndexOf(","));
    }
    else {
        the_array[origin_x][origin_y] = 0;
    }

}

function arrayCloner(obj) {
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = arrayCloner(obj[key]);
    
    return temp;
}

function getDistanceBetweenHexes(/*string*/ h1, /*string*/ h2) {
    var hex1_x = h1.substring(0, h1.indexOf(","));
    var hex1_y = h1.substring(h1.indexOf(",")+1);
    var hex2_x = h2.substring(0, h2.indexOf(","));
    var hex2_y = h2.substring(h2.indexOf(",")+1);
    var deltaX = hex1_x - hex2_x;
    var deltaY = hex1_y - hex2_y;
    return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);
};

function getOutsideOfHive(origin) {
    var stack = Array();
    var temp_xy = Array();
    var origin_x = parseInt(origin.substring(0, origin.indexOf(","))); 
    var origin_y = parseInt(origin.substring(origin.indexOf(",")+1));
    
    // stack will contain all coordinate sets that contain pieces
    for (var i=0; i < GRID_ARRAY.length; i++)
        for (var j=0; j < GRID_ARRAY[i].length; j++) 
            if (GRID_ARRAY[i][j] && !((i == origin_x) && (j == origin_y)) )
                    stack.push(new Array(i,j));
    
    // if the hex i'm moving piece from is still occupied, add it back
    if (GRID_ARRAY[origin_x][origin_y].indexOf(",") != -1) { 
        stack.push(new Array(origin_x,origin_y));
    } 
    
    //Logger("EARLY STACK: " + stack);
    
    var theHive = arrayCloner(stack);
    
    for (var i=0; i < stack.length; i++) {
        var x_val = parseInt(stack[i][0]);
        var y_val = parseInt(stack[i][1]); 
        //Logger("x/y: " + x_val + " " + y_val);
        
        if (isHexInternalToHive(x_val-1, y_val-1) && !(isHexInStack(new Array(x_val-1, y_val-1), theHive)) && !((origin_x == x_val-1) && (origin_y == y_val-1)) )
            theHive.push(new Array (x_val-1, y_val-1));

        if (isHexInternalToHive(x_val-1, y_val) && !(isHexInStack(new Array(x_val-1, y_val), theHive)) && !((origin_x == x_val-1) && (origin_y == y_val)) )
            theHive.push(new Array (x_val-1, y_val));

        if (isHexInternalToHive(x_val, y_val+1) && !(isHexInStack(new Array(x_val, y_val+1), theHive)) && !((origin_x == x_val) && (origin_y == y_val+1)) )
            theHive.push(new Array (x_val, y_val+1));

        if (isHexInternalToHive(x_val+1, y_val+1) && !(isHexInStack(new Array(x_val+1, y_val+1), theHive)) && !((origin_x == x_val+1) && (origin_y == y_val+1)) )
            theHive.push(new Array (x_val+1, y_val+1));

        if (isHexInternalToHive(x_val+1, y_val) && !(isHexInStack(new Array(x_val+1, y_val), theHive)) && !((origin_x == x_val+1) && (origin_y == y_val)) )
            theHive.push(new Array (x_val+1, y_val));

        if (isHexInternalToHive(x_val, y_val-1) && !(isHexInStack(new Array(x_val, y_val-1), theHive)) && !((origin_x == x_val) && (origin_y == y_val-1)) )
            theHive.push(new Array (x_val, y_val-1));

    }
    
    return theHive;      
}

function isHexInternalToHive(in_x, in_y)
{
    if (GRID_ARRAY[in_x][in_y] != 0) {
        return 1;
    }
    else {
        if (!GRID_ARRAY[in_x-1][in_y-1] && !GRID_ARRAY[in_x][in_y-1])
            return 0;
        if (!GRID_ARRAY[in_x-1][in_y] && !GRID_ARRAY[in_x-1][in_y-1])
            return 0;
        if (!GRID_ARRAY[in_x][in_y+1] && !GRID_ARRAY[in_x-1][in_y])
            return 0;
        if (!GRID_ARRAY[in_x+1][in_y+1] && !GRID_ARRAY[in_x][in_y+1])
            return 0;
        if (!GRID_ARRAY[in_x+1][in_y] && !GRID_ARRAY[in_x+1][in_y+1])
            return 0;
        if (!GRID_ARRAY[in_x][in_y-1] && !GRID_ARRAY[in_x+1][in_y])
            return 0;
        return 1;                      
    }
 
}

function isHexInStack(/*Array*/in_hex, /*Array*/in_stack) {
    var x_val = in_hex[0];
    var y_val = in_hex[1];
    
    for (var i=0; i < in_stack.length; i++)
        if ((x_val == in_stack[i][0]) && (y_val == in_stack[i][1]))
            return 1;
    
    return 0;
}

function possibleSpiderPath(/*Array*/ in_hive, /*String*/ in_origin, /*String*/ in_dest) {
    
    var skip_index = 0;
    var skip_index_2 = 0;
    
    var origin_x = in_origin.substring(0, in_origin.indexOf(","));
    var origin_y = in_origin.substring(in_origin.indexOf(",") + 1);
    
    // right now hive only contains "hive pieces" + blocked in ones
    var outside_hive = getHexesOutsideHive(in_hive);
    
    //alert("ORIGIN / DEST / HIVE / OUTSIDE\n" + in_origin + " / " + in_dest + "\n" + printNiceArray(in_hive) + "\n / " + printNiceArray(outside_hive) );
    
    for (var i=0; i < outside_hive.length; i++) {
        var h1 = origin_x + "," + origin_y;
        var h2 = outside_hive[i][0] + "," + outside_hive[i][1];
        
        if ( (getDistanceBetweenHexes(h1, h2) == 1) ) {
            skip_index = i;
            
            for (var j=0; j < outside_hive.length; j++) {
                var h3 = outside_hive[j][0] + "," + outside_hive[j][1];
                
                if (j != skip_index) {
                   
                    if (getDistanceBetweenHexes(h2, h3) == 1) {
                        skip_index_2 = j;
                     
                        for (var k=0; k < outside_hive.length; k++) {
                            var h4 = outside_hive[k][0] + "," + outside_hive[k][1];
                        
                            if ( (k != skip_index) && (k != skip_index_2) ) {
                        
                                if (getDistanceBetweenHexes(h3, h4) == 1) {
                        
                                    if (h4 == in_dest) {
                                        return 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }   
        }
    }
    return 0;
}

function isHexAdjacentToHive(in_hive, in_hex) {
    for (var i=0; i < in_hive.length; i++) {
        var temp_hex_string = in_hive[i][0] + "," + in_hive[i][1];
        if ( getDistanceBetweenHexes(temp_hex_string, in_hex) == 1) {
            return 1;
        }    
    }
    return 0;
}

function getHexesOutsideHive(in_hive) {
    
    var outsideStack = Array();
    
    for (var i=0; i < in_hive.length; i++) {
        var x_val = parseInt(in_hive[i][0]);
        var y_val = parseInt(in_hive[i][1]); 
        
        if ( (GRID_ARRAY[x_val-1][y_val-1] == 0) && !(isHexInStack(new Array(x_val-1,y_val-1), outsideStack)) )
            outsideStack.push(new Array (x_val-1, y_val-1));
        if ( (GRID_ARRAY[x_val-1][y_val] == 0)  && !(isHexInStack(new Array(x_val-1,y_val), outsideStack)) )
            outsideStack.push(new Array (x_val-1, y_val));
        if ( (GRID_ARRAY[x_val][y_val+1] == 0 ) && !(isHexInStack(new Array(x_val,y_val+1), outsideStack)) )
            outsideStack.push(new Array (x_val, y_val+1));
        if ( (GRID_ARRAY[x_val+1][y_val+1] == 0) && !(isHexInStack(new Array(x_val+1,y_val+1), outsideStack)) )
            outsideStack.push(new Array (x_val+1, y_val+1));
        if ( (GRID_ARRAY[x_val+1][y_val] == 0) && !(isHexInStack(new Array(x_val+1,y_val), outsideStack)) )
            outsideStack.push(new Array (x_val+1, y_val));
        if ( (GRID_ARRAY[x_val][y_val-1] == 0) && !(isHexInStack(new Array(x_val,y_val-1), outsideStack)) )
            outsideStack.push(new Array (x_val, y_val-1));
    }
    
    return outsideStack;
}


function printNiceArray(in_array) {
    var out_string = "";
    for (var i=0; i < in_array.length; i++) {
        out_string += "[" + in_array[i] + "] ";
    }
    return out_string;
}
