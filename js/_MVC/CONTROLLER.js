var NUM_BEES = 1;
var NUM_SPIDERS = 2;
var NUM_GRASSHOPPERS = 3;
var NUM_BEETLES = 2;
var NUM_ANTS = 3;
var NUM_LADYBUGS = 0;
var NUM_MOSQUITOES = 0;
var NUM_PIECES = NUM_BEES + NUM_SPIDERS + NUM_GRASSHOPPERS + NUM_BEETLES + NUM_ANTS + NUM_LADYBUGS + NUM_MOSQUITOES;

var NUM_MOVES = 0;
var WHITE_BEE_PLACED = 0;
var BLACK_BEE_PLACED = 0;
var CLICKED_ON = "";
var POPUP_TIMER;
var VS_COMPUTER = 0;

/**
 * Sets event listeners for clicking pieces and buttons and runs polling functions to get updates from DB.
 */
function CONTROLLER_MAIN() {
	VIEW_initGameWindow();	
	MODEL_PIECEARRAY_initialize();
	if (SOLO_GAME) {
	    VS_COMPUTER = 1;
	    $('#black_player_name').text("Computer");
	    BLACK_PLAYER_NAME = "Computer";
	    if (WHITE_PLAYER_NAME == "Computer") {
	        //CONTROLLER_doComputerMove("white");
	    }
	}
	else {
		CONTROLLER_MAIN_doInitialUpdateFromDB(30);
		CONTROLLER_MAIN_pollingFunction(3000); // POLLS SERVER FOR UPDATES TO DB		
	}
}

/**
 * Sets up initial board display after pulling moves from DB
 * @param   {int} frequency_timer
 *          Polling interval in milliseconds. Polls until all images preloaded and puts one move at a time onto board. 
 */
function CONTROLLER_MAIN_doInitialUpdateFromDB(frequency_timer) {    
    var moves_array = Array();
    var da_width = $("#hexCanvas").innerWidth();
    var da_height = $("#hexCanvas").innerWidth();
    var grid = new HT.Grid(da_width, da_height); 
    
    var return_value = MODEL_getUpdateFromDB();
    erase_flag = return_value[0];
    moves_array = return_value[1];

    var the_init_timer = window.setInterval( function() {
        
        if (PIECE_IMG_FILE_LOAD_COUNTER == 10) { // if all piece images preloaded successfully
            var origin;
            var destination;
            var piece_id;

            if ((moves_array[0] != 0) && (moves_array.length != NUM_MOVES)) { // IF NEW MOVE FOUND IN DB
                var i = NUM_MOVES; // does one move at a time because this function runs on an interval
                move_id = moves_array[i][0];
                game_id = moves_array[i][1];
                piece_id = moves_array[i][2];
                origin = moves_array[i][3]; 
                destination = moves_array[i][4]; 
                
                if (origin !== "") {
                    VIEW_removePieceFromCanvas(grid.GetHexByXYIndex(origin));
                    MODEL_GRIDARRAY_removePiece(origin);
                }
                MODEL_GRIDARRAY_addPiece(destination, piece_id);
                MODEL_PIECEARRAY_addPiece(destination, piece_id);
                MODEL_MOVELIST_addMove(piece_id, origin, destination);               
                VIEW_drawPieceOnCanvas(grid.GetHexByXYIndex(destination));
                
                if (NUM_MOVES == moves_array.length) {
                    window.clearInterval(the_init_timer);
                }
            }
            
            else {
                window.clearInterval(the_init_timer);
            }   
                
            var game_result = isBeeSurrounded(MODEL_GRIDARRAY_getGridArray());
            if (game_result) {
                if (game_result == 3)
                     CONTROLLER_EVENT_winnerDeclared("draw", 1);
                else if (game_result == 2)
                     CONTROLLER_EVENT_winnerDeclared(WHITE_PLAYER_NAME, 1);
                else
                     CONTROLLER_EVENT_winnerDeclared(BLACK_PLAYER_NAME, 1);                                 
            }           
        }

         
    }, frequency_timer );   
}   

/**
 * Polling function to check DB for new moves.
 * @param   {int} frequency_timer
 *          Polling interval in milliseconds. Polls DB for any new moves. 
 */
function CONTROLLER_MAIN_pollingFunction(frequency_timer) {
		
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
		// IF DB AND BOARD ARE DIFFERENT
		if ((moves_array[0] != 0) && (moves_array.length != NUM_MOVES)) { 
			
			if (NUM_MOVES < moves_array.length)	{ // IF MORE MOVES THAN BEFORE
				Logger("POLLER UPDATE: was " + NUM_MOVES + " moves but now " + moves_array.length + " moves.")
				i = NUM_MOVES;
				piece_id = moves_array[i][2];
				origin = moves_array[i][3]; 
				destination = moves_array[i][4]; 
				
				if (origin !== "") {
					VIEW_removePieceFromCanvas(grid.GetHexByXYIndex(origin));
					MODEL_GRIDARRAY_removePiece(origin);
					MODEL_PIECEARRAY_removePiece(piece_id);
				}
				MODEL_GRIDARRAY_addPiece(destination, piece_id);
				MODEL_PIECEARRAY_addPiece(destination, piece_id);				
				VIEW_drawPieceOnCanvas(grid.GetHexByXYIndex(destination));
			}
	
	        var game_result = isBeeSurrounded(MODEL_GRIDARRAY_getGridArray());
			if (game_result) {
			    if (game_result == 3)
			         CONTROLLER_EVENT_winnerDeclared("draw", 1);
			    else if (game_result == 2)
			         CONTROLLER_EVENT_winnerDeclared(WHITE_PLAYER_NAME, 1);
                else
                     CONTROLLER_EVENT_winnerDeclared(BLACK_PLAYER_NAME, 1);			         
			} 		
		}
		
	}, frequency_timer )});	

}

/**
 * Attempts to make move. If invalid, redraws view. If valid, updates view and model.
 * @param   {String} in_origin
 *          Origin location of move in "8,9" format.
 * @param   {String} in_dest
 *          Destination location of move in "8,9" format.
 * @param   {String} in_piece_id
 *          DOM ID of piece being moved.
 */
function CONTROLLER_EVENT_attemptMove(in_origin, in_dest, in_piece_id) {
    var move_id;
    var grid = new HT.Grid($("#hexCanvas").width(), $("#hexCanvas").height());

    // check if move is valid according to game rules
    var valid_flag = isMoveValid(in_origin, in_dest, in_piece_id, MODEL_GRIDARRAY_getGridArray());
    var error_string = getMoveErrorCode(valid_flag);

    if (valid_flag != 1) { // IF MOVE VIOLATES A GAME RULE
        $('#in_game_header').html("INVALID MOVE");
        $('#in_game_text').html(error_string);
        $('#in_game_popup').show();
        
        POPUP_TIMER = setTimeout(function(){
            $('#in_game_popup').hide();
        }, 10000);
        
        if (in_origin) { // redraw piece at origin on invalid move
            var the_hex = grid.GetHexByXYIndex(in_origin);
            VIEW_drawPieceOnCanvas(the_hex);        
        }
        else {
            VIEW_positionUnplacedPieces();
        }
    }
    
    else { // IF LEGITIMATE MOVE
        if (in_origin) {
            var origin_hex = grid.GetHexByXYIndex(in_origin);
            //VIEW_removePieceFromCanvas(origin_hex);            
            MODEL_GRIDARRAY_removePiece(in_origin);
            MODEL_PIECEARRAY_removePiece(in_piece_id);
        }
        else if (in_piece_id.indexOf("white_bee1") != -1)
            WHITE_BEE_PLACED++;
        else if (in_piece_id.indexOf("black_bee1") != -1)
            BLACK_BEE_PLACED++;
            
        MODEL_GRIDARRAY_addPiece(in_dest, in_piece_id);
        MODEL_PIECEARRAY_addPiece(in_dest, in_piece_id);
        MODEL_MOVELIST_addMove(in_piece_id, in_origin, in_dest);
        if (!SOLO_GAME) 
            MODEL_DB_addMove(in_piece_id, in_origin, in_dest);
 
        var the_hex = grid.GetHexByXYIndex(in_dest);
        //VIEW_drawPieceOnCanvas(the_hex);    
        
        $("#" + in_piece_id).hide();
        $("#" + in_piece_id).attr('origin', in_dest);//the_hex.GetXYLocation());
        //Logger("Set origin for " + in_piece_id + " = " + $("#" + in_piece_id).attr('origin'));
        VIEW_SUPPORT_redrawHexGrid(MODEL_GRIDARRAY_getGridArray());
        // IF FIRST MOVE, SET AS ORIGIN;
       if (NUM_MOVES == 1) {
           HIVE_ORIGIN = in_dest;
       }
        // CHECK IF BEE IS SURROUNDED = LOSS
        setTimeout(function() {
            var game_result = isBeeSurrounded(MODEL_GRIDARRAY_getGridArray());
            if (game_result) {
                if (game_result == 3)
                     CONTROLLER_EVENT_winnerDeclared("draw", 1);
                else if (game_result == 2)
                     CONTROLLER_EVENT_winnerDeclared(WHITE_PLAYER_NAME, 1);
                else
                     CONTROLLER_EVENT_winnerDeclared(BLACK_PLAYER_NAME, 1);                                  
            }
            else if ( (NUM_MOVES % 2) && (BLACK_PLAYER_NAME == "Computer")) {
                CONTROLLER_doComputerMove("black"); 
            }  
            else if ( !(NUM_MOVES % 2) && (WHITE_PLAYER_NAME == "Computer")) {
                CONTROLLER_doComputerMove("white");
            }
        },200);               
    }
            
}

/**
 * Shows ppopup window with winner name and buttons and updated DB with winner.
 * @param   {String} the_winner
 *          The name of the winning player.
 * @param   {int} finish_type
 *          A code indicating the type of finish (1 = normal win; 2 = resignation)
 */
function CONTROLLER_EVENT_winnerDeclared(the_winner, finish_type) {
    VIEW_showWinnerPopup();
    MODEL_addWinnerToDB(the_winner, finish_type);
}

/**
 * TODO: Should this (and the other button handlers) be in VIEW_GAME.js? Not sure how to follow MVC on this. 
 */
function CONTROLLER_EVENT_returnToLobby() {
    window.location = "games_lobby.php?name=" + NAME;
}

/**
 * 
 */
function CONTROLLER_EVENT_cancelGame() {
    var ret_val = MODEL_eraseGameFromDB();
    if (ret_val) {
        window.location = "games_lobby.php?name=" + NAME;
    }
}

/**
 * 
 */
function CONTROLLER_EVENT_resignGame() {
    var winner = '';
    if (NAME == WHITE_PLAYER_NAME)
        winner = BLACK_PLAYER_NAME;
    else
        winner = WHITE_PLAYER_NAME;
        
    $("#game_over_text").html("Game resigned.<br />" + winner + " wins.");
    CONTROLLER_EVENT_winnerDeclared(winner, 2); 
}

/**
 * 
 */
function CONTROLLER_EVENT_undoMove() {
    var da_width = $("#hexCanvas").innerWidth();
    var da_height = $("#hexCanvas").innerWidth();
    var grid = new HT.Grid(da_width, da_height);
    
    var last_move = MODEL_MOVELIST_getLastMove();
    var piece_id = last_move[0];
    var origin = last_move[1];
    var destination = last_move[2]; 
          
    NUM_MOVES--; //NECESSARY BECAUSE WE'RE ACTUALLY REMOVING A PIECE FROM THE BOARD
    VIEW_removePieceFromCanvas(grid.GetHexByXYIndex(destination));
    MODEL_GRIDARRAY_removePiece(destination);
    MODEL_MOVELIST_removeLastMove();


    if (origin !== "") { // If piece came from on board
        NUM_MOVES--; // Cancels out NUM_MOVES++ in addPieceToArray() that fires next
        MODEL_GRIDARRAY_addPiece(origin, piece_id);                
        VIEW_drawPieceOnCanvas(grid.GetHexByXYIndex(origin));
    }
    else { // If piece came from side of board
        $("#" + piece_id).attr('origin', '');
        $("#" + piece_id).show();
        VIEW_positionUnplacedPieces();
    }
    if (!SOLO_GAME)
        MODEL_eraseLatestMoveFromDB(GAME_ID);
}

