/**
 * Attempts to make move. If invalid, redraws view. If valid, updates view and model.
 * @param   {String} in_origin
 *          Origin location of move in "8,9" format.
 * @param   {String} in_dest
 *          Destination location of move in "8,9" format.
 * @param   {String} in_piece_id
 *          DOM ID of piece being moved.
 * @return  {int}
 *          Returns 1 if move made successfully and 0 if it wasn't.
 */
function CONTROLLER_EVENT_attemptMove(in_origin, in_dest, in_piece_id) {
    var move_id;
    var returnflag;
    var grid = new HT.Grid($("#hexCanvas").width(), $("#hexCanvas").height());

    // check if move is valid according to game rules
    var valid_flag = isMoveValid(in_origin, in_dest, in_piece_id, MODEL_GRIDARRAY_getGridArray());
    var error_string = getMoveErrorCode(valid_flag);

    // IF MOVE VIOLATES A GAME RULE
    if (valid_flag != 1) { 
        VIEW_showInGamePopup("INVALID MOVE", error_string, 10000);        
        // reset piece to original location
        if (in_origin) { 
            //var the_hex = grid.GetHexByXYIndex(in_origin);
            //VIEW_drawPieceOnCanvas(the_hex);
            VIEW_updateHex(in_origin);       
        }
        else {
            VIEW_positionUnplacedPieces();
        }
        
        returnflag = 0;
    }
    // IF LEGITIMATE MOVE -- uses redrawhexgrid() instead of remove/addpiecetocanvas()
    else { 
        if (in_origin) {
            //var origin_hex = grid.GetHexByXYIndex(in_origin);
            //VIEW_removePieceFromCanvas(origin_hex);            
            MODEL_GRIDARRAY_removePiece(in_origin);
            MODEL_PIECEARRAY_removePiece(in_piece_id);
        }
            
        MODEL_GRIDARRAY_addPiece(in_dest, in_piece_id);
        MODEL_PIECEARRAY_addPiece(in_dest, in_piece_id);
        MODEL_MOVELIST_addMove(in_piece_id, in_origin, in_dest);
        if (!SOLO_GAME) 
            MODEL_DB_addMove(in_piece_id, in_origin, in_dest);
 
        VIEW_updateHex(in_origin);
        VIEW_updateHex(in_dest);
        //var the_hex = grid.GetHexByXYIndex(in_dest);
        //VIEW_drawPieceOnCanvas(the_hex);    
        //VIEW_SUPPORT_redrawHexGrid(MODEL_GRIDARRAY_getGridArray());
        $("#" + in_piece_id).hide();
        $("#" + in_piece_id).attr('origin', in_dest);//the_hex.GetXYLocation());

        // IF FIRST MOVE, SET AS HIVE_ORIGIN;
        if (NUM_MOVES == 1) {
            HIVE_ORIGIN = in_dest;
        }
        
        // Check if there is now a winner and if not, go on to next move.
        var game_result = isBeeSurrounded(MODEL_GRIDARRAY_getGridArray());
        if (game_result == 3)
            CONTROLLER_EVENT_winnerDeclared("draw", 1);
        else if (game_result == 2)
            CONTROLLER_EVENT_winnerDeclared(WHITE_PLAYER_NAME, 1);
        else if (game_result == 1)
            CONTROLLER_EVENT_winnerDeclared(BLACK_PLAYER_NAME, 1); 
        else if ((NUM_MOVES % 2 == 1) && (BLACK_PLAYER_NAME == "Computer"))
            CONTROLLER_doComputerMove("black"); 
        else if ((NUM_MOVES % 2 == 0) && (WHITE_PLAYER_NAME == "Computer"))
            CONTROLLER_doComputerMove("white");
        
        returnflag = 1;               
    }
    
    return returnflag;        
}

/**
 * Shows ppopup window with winner name and buttons and updated DB with winner.
 * @param   {String} the_winner
 *          The name of the winning player.
 * @param   {int} finish_type
 *          A code indicating the type of finish (1 = normal win; 2 = resignation)
 */
function CONTROLLER_EVENT_winnerDeclared(the_winner, finish_type) {
    
    if (SOLO_GAME) {
        CONTROLLER_MAIN();
    }
    else {
        VIEW_showWinnerPopup();
        MODEL_addWinnerToDB(the_winner, finish_type);    
    }
    
}

/**
 * TODO: The actual functions should be called and not window.location, if only to prevent back button clicking
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
    var current_color = getCurrentColorByMove(NUM_MOVES);
    
    var winner = (current_color == "white") ? (BLACK_PLAYER_NAME) : (WHITE_PLAYER_NAME);
    VIEW_showGameOverPopup("Game resigned.<br />" + winner + " wins.");
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
    //VIEW_removePieceFromCanvas(grid.GetHexByXYIndex(destination));
    MODEL_GRIDARRAY_removePiece(destination);
    MODEL_MOVELIST_removeLastMove();


    if (origin != "") { // If piece came from on board
        NUM_MOVES--; // Cancels out NUM_MOVES++ in addPieceToArray() that fires next
        MODEL_GRIDARRAY_addPiece(origin, piece_id);                
        //VIEW_drawPieceOnCanvas(grid.GetHexByXYIndex(origin));
    }
    else { // If piece came from side of board
        $("#" + piece_id).attr('origin', '');
        $("#" + piece_id).show();
    }
    if (!SOLO_GAME)
        MODEL_eraseLatestMoveFromDB(GAME_ID);
    
    VIEW_updateHex(origin);
    VIEW_updateHex(destination);
    VIEW_positionUnplacedPieces();
}