/**
 * Shows the lobby screen, sets up events, etc.
 */
function VIEW_LOBBY_showGamesLobby() {
    
    // prevent bump on iPad
    document.ontouchmove = function(event) {event.preventDefault();};

    /************** THE FOLLOWING IS FOR THE BIG MENU (COMPUTERS  TABLETS) *********************/
    // CLICK ON CURRENT GAME FROM TOP LIST
    $('.current_game').bind('click', LOBBY_EVENT_selectCurrentGame); 

    // CLICK ON OPEN GAME FROM SECOND LIST
    $('.open_game').bind('click', LOBBY_EVENT_selectOpenGame);
    
    // CLICK ON SOLO PRACTICE GAME
    $('#solo_game').button();
    $('#solo_game').bind('click', LOBBY_EVENT_selectStartSoloGame);                
    
    // CLICK ON PLAY VS ONLINE OPPONENT
    $('#vs_game').button();
    $('#vs_game').bind('click', LOBBY_EVENT_selectStartOnlineGame);
    
    // SHOW YELLOW RIBBON ON MOUSEOVER GAME AND GET RID OF YELLOW RIBBON ON MOUSEOUT OF GAME
    $('.open_game, .current_game').bind('mouseover', function() {
        $(this).css({'background': 'rgba(255,255,0,1)' });
    });
    $('.open_game, .current_game').bind('mouseout', function() {
        $(this).css({'background': 'none' });
    });                   
    
    /************** THIS PART IS FOR MOBILES *********************/
    // Make menu buttons mobile
    $('.mini_menu_div').button();
    $('#game_title').bind('click', LOBBY_EVENT_showMainMenu);
    
    $('#play_alone_button').bind('click', LOBBY_EVENT_selectStartSoloGame);
    $('#play_someone_button').bind('click', LOBBY_EVENT_selectPlaySomeoneButton);
    
    $('#show_my_games_button').bind('click', LOBBY_EVENT_selectShowMyGames);
    $('#show_opponents_button').bind('click', LOBBY_EVENT_selectShowOpponents);          
    $('#make_new_game_button').bind('click', LOBBY_EVENT_selectStartOnlineGame);
    
    $('.my_game_button').bind('click', LOBBY_EVENT_selectCurrentGame);
    $('.open_game_button').bind('click', LOBBY_EVENT_selectOpenGame);
    
    $('#back_to_lobby_button').bind('click', LOBBY_EVENT_showMainMenu);
    $('#back_to_games_button').bind('click', LOBBY_EVENT_selectPlaySomeoneButton);
}
  
/**
 * 
 */
function LOBBY_EVENT_showMainMenu() {
    $('.mini_menu_div').hide();
    $('#play_alone_button').show();
    $('#play_someone_button').show();       
    $('#learn_to_play_button').show();
}

/**
 * 
 */
function LOBBY_EVENT_selectCurrentGame(event) {
    var game_id = this.id;
    var white_player;
    var black_player;
    var request = $.ajax({
        url: "php/get_game_from_db.php",
        type: "POST",
        data: {gameid: game_id},
        dataType: "json",
        async: false 
    }); 
    request.success(function(data){
        white_player = data[1];
        black_player = data[2];
    });
    request.fail(function(error, status){
        //Logger("games_lobby: (207) AJAX FAIL. Error/Status = " + error + " / " + status);
    });
    request.done(function(done){
        window.location = "play_game.php?gameid=" + game_id + "&name=" + NAME + "&white_player=" + white_player + "&black_player=" + black_player;
    });
}   

/**
 * 
 */
function LOBBY_EVENT_selectOpenGame(event) {
    var flag = 0;
    var game_id = this.id;
    var opponent = "";
    var request = $.ajax({
        url: "php/get_game_from_db.php",
        type: "POST",
        data: {gameid: game_id},
        dataType: "json",
        async: false
    });
    request.success(function(data) {
        opponent = data[1];
        if (data[1] !== "" && data[2] !== "") { // check if second player has already joined
            flag = 0;
            alert("Sorry, but somebody alredy took the open spot. Please try another game."); // TODO: Change this to a real popup and not an a lert.
        }
        else {
            flag = 1;
        }
        
    }); 
    request.fail(function(jqXHR, textStatus) {
        //Logger("FAIL");
        flag = 0;
    }); 
    request.done(function(data) {
        if (flag) {
            MODEL_addSecondPlayerToDB(game_id);
            window.location = "play_game.php?gameid=" + game_id + "&name=" + NAME + "&white_player=" + opponent + "&black_player=" + NAME;
        }
        else {
            window.location = "games_lobby.php?name=" + NAME;
        }
    });         
}

/**
 * 
 */
function LOBBY_EVENT_selectStartSoloGame(event) {
    GAME_ID = 0;
    window.location = 'play_game.php?name=' + NAME + '&gameid=' + GAME_ID + '&white_player=' + NAME + '&black_player=' + NAME;
} 

/**
 * 
 * @param   {Object} event
 */
function LOBBY_EVENT_selectStartOnlineGame(event) {
    var request = $.ajax({
        url: "php/add_game_to_db.php",
        type: "POST",
        data: {name: NAME},
        dataType: "html"
    }); 
    request.success(function(data) {
        GAME_ID = data;
    });
    request.fail(function(jqXHR, textStatus) {
        //Logger( "AJAX FAIL: " + textStatus + " / " + jqXHR.responseText);
    });         
    request.done(function(data) {
        var game_id = GAME_ID;
        var white_player;
        var black_player;
        var request = $.ajax({
            url: "php/get_game_from_db.php",
            type: "POST",
            data: {gameid: game_id},
            dataType: "json",
            async: false
        });
        request.success(function(data){
            white_player = data[1];
            black_player = data[2];
        });
        request.fail(function(error, status){
            // NOTHING RIGHT NOW
        });
        request.done(function(done){
            window.location = "play_game.php?gameid=" + game_id + "&name=" + NAME + "&white_player=" + white_player + "&black_player=" + black_player;
        }); 
            
    }); 
} 

/**
 * 
 * @param   {Object} event
 */
function LOBBY_EVENT_selectPlaySomeoneButton(event) {
    $('.mini_menu_div').hide();
    $('#show_my_games_button').show();
    $('#show_opponents_button').show();
    $('#make_new_game_button').show();
    $('#back_to_lobby_button').show();           
}

/**
 * 
 * @param   {Object} event
 */
function LOBBY_EVENT_selectShowMyGames(event) {
    $('.mini_menu_div').hide();
    $('.my_game_button').show();
    $('#back_to_games_button').show();          
}

/**
 * 
 * @param   {Object} event
 */
function LOBBY_EVENT_selectShowOpponents(event) {
    $('.mini_menu_div').hide();         
    $('.open_game_button').show();
    $('#back_to_games_button').show();  
}