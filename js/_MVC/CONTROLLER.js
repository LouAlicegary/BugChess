var NUM_BEES = 1;
var NUM_SPIDERS = 2;
var NUM_GRASSHOPPERS = 3;
var NUM_BEETLES = 2;
var NUM_ANTS = 3;
var NUM_LADYBUGS = 0;
var NUM_MOSQUITOES = 0;
var NUM_PIECES = NUM_BEES + NUM_SPIDERS + NUM_GRASSHOPPERS + NUM_BEETLES + NUM_ANTS + NUM_LADYBUGS + NUM_MOSQUITOES;

var NUM_MOVES = 0;
var CLICKED_ON = "";
var POPUP_TIMER;
var VS_COMPUTER = 0;


//VIEW_SUPPORT.js
var PIECE_IMG_FILE_LOAD_COUNTER = 0;
var IMG_OBJ_ARRAY = new Array(); // referenced as var in HT 130
    
var BOARD_COLUMNS = 23; 
var BOARD_ROWS = 20;


//VIEW_GAME.js
var PIECE_HEIGHT;
var PIECE_WIDTH;
var HIVE_ORIGIN = Math.floor(BOARD_COLUMNS/2) + "," + Math.floor(BOARD_ROWS+(BOARD_COLUMNS/2));
var PIECE_ANIMATION_INTERVAL;
var gamepiece_z = 0; // used in mouseover functions to make pieces in piecebar pop in and out
var grid;
var swipe_start;
var swipe_end;
var MID_DRAG = 0;

// timers used on droppable (only in this file -- broken up because droppable drop function is separate)
var top_timer;
var bottom_timer; 
var left_timer;
var right_timer;


// Changes all touchstart events on iOS to clicks
var startclickevent = (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) ? ("touchstart") : ("mousedown");
var stopclickevent = (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) ? ("touchend") : ("mouseup");


/**
 * Sets event listeners for clicking pieces and buttons and runs polling functions to get updates from DB.
 */
function CONTROLLER_MAIN() {
	VIEW_initGameWindow();
	MODEL_GRIDARRAY_initialize();	
	MODEL_PIECEARRAY_initialize();
	MODEL_MOVELIST_initialize();
	NUM_MOVES = 0; // CHANGE THIS TO BE A FUNCTION THAT READS LENGTH OF MOVELIST. LESS MANAGEMENT.
	//SOLO_GAME = 1;

	// IF VS COMPUTER
	if (SOLO_GAME) {
	    VS_COMPUTER = 1;
	    if (WHITE_PLAYER_NAME == "Computer") {
	        CONTROLLER_doComputerMove("white");
	    }
	}
	// IF VS ONLINE OPPONENT
	else {
		CONTROLLER_MAIN_doInitialUpdateFromDB();
		CONTROLLER_MAIN_pollingFunction(3000); // POLLS SERVER FOR UPDATES TO DB		
	}
}

/**
 * Sets up initial board display after pulling moves from DB
 * @param   {int} frequency_timer
 *          Polling interval in milliseconds. Polls until all images preloaded and puts one move at a time onto board. 
 */
function CONTROLLER_MAIN_doInitialUpdateFromDB() {    
    var game_result;
    var origin;
    var destination;
    var piece_id;       
    var return_value = MODEL_getUpdateFromDB();
    var erase_flag = return_value[0];
    var moves_array = return_value[1];
       
    // IF NEW MOVE FOUND IN DB, UPDATE THIS 
    if ( (moves_array[0] != 0) && (moves_array.length != NUM_MOVES) ) { 
        for (var i in moves_array) {
            move_id = moves_array[i][0];
            game_id = moves_array[i][1];
            piece_id = moves_array[i][2];
            origin = moves_array[i][3]; 
            destination = moves_array[i][4];
            
            if (origin !== "") {
                MODEL_GRIDARRAY_removePiece(origin);    
            }
                
            MODEL_GRIDARRAY_addPiece(destination, piece_id);
            MODEL_PIECEARRAY_addPiece(destination, piece_id);
            MODEL_MOVELIST_addMove(piece_id, origin, destination); 
            VIEW_setPieceOrigin(piece_id, destination);                                   
        }
        
        VIEW_SUPPORT_redrawHexGrid(MODEL_GRIDARRAY_getGridArray());
        VIEW_drawUnplayedPieces();
    }  
    
    if (isGameWon()) {
        CONTROLLER_EVENT_winnerDeclared();
    }                                                
  
 
}   

/**
 * Polling function to check DB for new moves.
 * @param   {int} frequency_timer
 *          Polling interval in milliseconds. Polls DB for any new moves. 
 */
function CONTROLLER_MAIN_pollingFunction(frequency_timer) {
		
	var moves_array = Array();
    var origin;
    var destination;
    var piece_id;
         	
	$(function(){window.setInterval( function(){ 

		// UPDATE OPPONENT NAME IF RECENTLY ENTERED GAME
		if (BLACK_PLAYER_NAME == "(none)") {
			BLACK_PLAYER_NAME = MODEL_getBlackPlayerNameFromDB(GAME_ID);
			VIEW_updateOpponentName();
		}
		
		var db_update = MODEL_getUpdateFromDB();
		var erase_flag = db_update[0];
		moves_array = db_update[1];
		
		// IF DELETE GAME BUTTON HIT, RESET. ELSE: CHECK FOR NEW MOVES IN DB.			
		// CHECK IF DB AND BOARD ARE DIFFERENT
		if ((moves_array[0] != 0) && (moves_array.length != NUM_MOVES)) { 
			
			if (NUM_MOVES < moves_array.length)	{ // IF MORE MOVES THAN BEFORE
				i = NUM_MOVES;
				piece_id = moves_array[i][2];
				origin = moves_array[i][3]; 
				destination = moves_array[i][4]; 
				
				if (origin !== "") {
					MODEL_GRIDARRAY_removePiece(origin);
					MODEL_PIECEARRAY_removePiece(piece_id);
				}
				MODEL_GRIDARRAY_addPiece(destination, piece_id);
				MODEL_PIECEARRAY_addPiece(destination, piece_id);				

				VIEW_updateHex(origin);
				VIEW_updateHex(destination);
				VIEW_drawUnplayedPieces();
			}
			else {
			    // if few moves than before, do what? right now = nothing.
			}		
		}
		
        if (isGameWon()) {
            CONTROLLER_EVENT_winnerDeclared();
        }
		
		if (0) {
		    // eventually this should look for a resign flag
		}
		
		if (0) {
		    // to handle undo, maybe I should institute an undo flag that gets set by one player and cleared by the other
		}
		
	}, frequency_timer )});	

}
