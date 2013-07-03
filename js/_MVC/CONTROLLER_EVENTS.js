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

    // IF MOVE VIOLATES A GAME RULE, SHOW POPUP AND RESET PIECE TO ORIGINAL LOCATION
    var valid_flag = isMoveValid(in_origin, in_dest, in_piece_id, MODEL_GRIDARRAY_getGridArray());
    if (valid_flag != 1) { 
        VIEW_showInGamePopup("INVALID MOVE", getMoveErrorCode(valid_flag), 10000);        
        if (in_origin != "") {
            VIEW_updateHex(in_origin);
        }
        VIEW_drawUnplayedPieces();           
    }
    
    // IF LEGITIMATE MOVE
    else {
        if (NUM_MOVES == 0)
            HIVE_ORIGIN = in_dest; 
            
        if (in_origin != "")         
            MODEL_GRIDARRAY_removePiece(in_origin);
        
        if (!SOLO_GAME) 
            MODEL_DB_addMove(in_piece_id, in_origin, in_dest);
               
        MODEL_GRIDARRAY_addPiece(in_dest, in_piece_id);
        MODEL_PIECEARRAY_addPiece(in_dest, in_piece_id);
        MODEL_MOVELIST_addMove(in_piece_id, in_origin, in_dest);
        VIEW_updateHex(in_origin);
        VIEW_updateHex(in_dest);
        VIEW_setPieceOrigin(in_piece_id, in_dest);
        VIEW_drawUnplayedPieces();
                        
        // Check if there is now a winner and if not, see if it's computer's turn. If not, wait for player input.
        if (isGameWon() == 1)
            CONTROLLER_EVENT_winnerDeclared();
        else if ( (getCurrentColorByMove(NUM_MOVES) == "white") && (WHITE_PLAYER_NAME == "Computer") ) 
            CONTROLLER_doComputerMove("white");    
        else if ( (getCurrentColorByMove(NUM_MOVES) == "black") && (BLACK_PLAYER_NAME == "Computer") ) 
            CONTROLLER_doComputerMove("black");          
                       
    }            
}

/**
 * Shows popup window with winner name and buttons and updated DB with winner.
 * @param   {String} the_winner
 *          The name of the winning player.
 * @param   {int} finish_type
 *          A code indicating the type of finish (1 = normal win; 2 = resignation)
 */
function CONTROLLER_EVENT_winnerDeclared() {    
    var game_result = isBeeSurrounded(MODEL_GRIDARRAY_getGridArray());    
    var msg;
    if (game_result == 3) {
         MODEL_addWinnerToDB("draw", 1);
         msg = "Both queens are surrounded. Game is a draw.";
     }
    else if (game_result == 2) {
         MODEL_addWinnerToDB(WHITE_PLAYER_NAME, 1);
         msg = WHITE_PLAYER_NAME + " has surrounded " + BLACK_PLAYER_NAME + "'s queen. " + WHITE_PLAYER_NAME + " wins.";
    }
    else if (game_result == 1) {
         MODEL_addWinnerToDB(BLACK_PLAYER_NAME, 1);
         msg = BLACK_PLAYER_NAME + " has surrounded " + WHITE_PLAYER_NAME + "'s queen. " + BLACK_PLAYER_NAME + " wins.";
    }
    else {
        MODEL_addWinnerToDB(winner, 2);
        msg = "There was a resignation. " + winner + " has won the match.";
    }              
    VIEW_showGameOverPopup(msg);          
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
    MODEL_addWinnerToDB(winner, 2);
    msg = "You have chosen to resign. " + winner + " has won the match.";              
    VIEW_showGameOverPopup(msg);    
    //VIEW_showGameOverPopup("Game resigned.<br />" + winner + " wins.");
    //CONTROLLER_EVENT_winnerDeclared(); 
}

/**
 * 
 */
function CONTROLLER_EVENT_undoMove() {    
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
    //VIEW_drawUnplayedPieces();
}