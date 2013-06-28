/**
 * Adds new record to Moves table in DB
 * @param   {String} piece_id             
 *          DOM id of piece being moved
 * @param   {String} destination_string   
 *          Destination hex of move in format "8,9"
 * @param   {String} origin               
 *          Origin hex of move in format "8,9" (blank if piece being moved for first time from off board)
 */
function MODEL_DB_addMove(piece_id, origin, destination) {
    //Logger("MODEL: (110) MOVE ADDED TO DB");
    var request = $.ajax({
        url: "php/add_move_to_db.php",
        type: "POST",
        data: {game_id: GAME_ID, piece : piece_id, origin : origin, destination : destination},
        dataType: "html"
    });
}

/**
 * Update record in Games table when win occurs
 * @param   {String} the_winner           
 *          Name of winning player
 * @param   {int} finish_type             
 *          Code for how game ended. (0 = xxx; 1 = xxx; 2 = xxx)
 */
function MODEL_addWinnerToDB(the_winner, finish_type) {
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

/**
 * Update record in Games table with second player name (when joining game)
 * @param   {int} game_id          
 *          ID of the game being joined
 */
function MODEL_addSecondPlayerToDB(game_id) {
    var request = $.ajax({
        url: "php/add_second_player_to_db.php",
        type: "POST",
        data: {name: NAME, gameid: game_id},
        dataType: "json",
        async: false
    });
}
                
/**
 * Erases game from Games DB
 * TODO: Change this to add a gameid parameter -- right not it relies on GAME_ID global, which is unnecessary.
 */
function MODEL_eraseGameFromDB() {
    var flag;
    var request = $.ajax({
        url: "php/erase_game_from_db.php",
        type: "POST",
        data: {gameid: GAME_ID},
        dataType: "html",
        async: false
    }); 
    request.success(function(data) {
        //Logger( "DATA: " + data);
        flag = 1;
    }); 

    request.fail(function(jqXHR, textStatus) {
        //Logger( "ERASE GAME REQUEST FAIL: " + textStatus + " / " + jqXHR.responseText);
        flag = 0;
    }); 

    request.done(function(data) {
        output = flag;
        //Logger("DONE");
    }); 
    
    return output;
}

/**
 * Erases record from Moves table in DB
 * @param   {String} move_id      
 *          ID of move to delete from Moves table
 * TODO: Why is moveid being passed as a string?
 */
function MODEL_eraseMoveFromDB(move_id) {
    var flag;
    var request = $.ajax({
        url: "php/erase_move_from_db.php",
        type: "POST",
        data: {moveid: move_id},
        dataType: "html",
        async: false
    }); 
    request.success(function(data) {
        flag = 1;
    }); 

    request.fail(function(jqXHR, textStatus) {
        flag = 0;
    }); 

    request.done(function(data) {
        output = flag;
    }); 
    
    return output;
}

/**
 * Erases record from Moves table in DB
 * @param   {String} move_id      
 *          ID of move to delete from Moves table
 * TODO: Why is moveid being passed as a string?
 */
function MODEL_eraseLatestMoveFromDB(game_id) {
    var flag;
    var request = $.ajax({
        url: "php/erase_latest_move_from_db.php",
        type: "POST",
        data: {gameid: game_id},
        dataType: "html",
        async: false
    }); 
    request.success(function(data) {
        flag = data;
    }); 

    request.fail(function(jqXHR, textStatus) {
        flag = -1;
    }); 

    request.done(function(data) {
        output = flag;
    }); 
    
    return output;
}

/**
 * Gets all of the moves from the current game from the DB.
 * @return  {Array} return_value
 *          Array with two elements. array[0] is erase_flag (UNUSED); array[1] is an array with all of the moves from the game.    
 * TODO: Get rid of erase_flag because it's not used        
 */
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
        //Logger( "MODEL: (98) REQUEST FAIL: " + textStatus + " / " + jqXHR.responseText);
    }); 

    request.done(function(data) {
        output = moves_array;
    });
    
    var return_value = Array(erase_flag, output);
    
    return return_value;    
}

/**
 * Gets black player's name from Games table in DB. 
 * Called if new opponent enters game while player has game screen open.
 * @param   {int} game_id
 *          ID of game to get record of
 */
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
