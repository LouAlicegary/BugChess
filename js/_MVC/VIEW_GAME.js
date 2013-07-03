/**
 * Initializes window buttons, click events, etc.
 * Calls VIEW_SUPPORT_drawEmptyGrid, VIEW_repositionUnplayedPieces() when finished.
 */
function VIEW_initGameWindow() {    
    PIECE_HEIGHT = $(".game_piece").height();
    PIECE_WIDTH = $(".game_piece").width();    
    
    VIEW_SUPPORT_drawEmptyGrid(1);
   	
   	// SET UP DROPPABLE BOARD 	
	$("#container").droppable({ 
	    drop: VIEW_EVENT_draggableDrop, 
	    out: VIEW_SUPPORT_setScrollerTimers,
	    over: VIEW_SUPPORT_clearScrollerTimers,
        deactivate: VIEW_SUPPORT_clearScrollerTimers 
	});

    // SET UP DRAGGABLE GAME PIECES
    $(".game_piece").each(function (i, obj) {
        $(obj).attr('origin', "");
        $(obj).show();   
    });          
    $('[class*=" ' + getPlayerColor() + '"]').draggable({
        revert: "invalid", 
        distance: PIECE_WIDTH/2, 
        cursorAt: {'top': PIECE_HEIGHT/2, 'left': PIECE_WIDTH/2},
        start: function() { MID_DRAG = 1; },
        stop: function() { setTimeout(function() {MID_DRAG = 0;}, 100); }
    });
    VIEW_drawUnplayedPieces();
       
	// SET UP BUTTONS ON SCREEN
    $("#undo_move_button").button();    	
	$("#cancel_game_button").button();
    $("#lobby_button").button();
    $("#resign_button").button();
	$("#clear_board_button").button();
	$("#game_over_return_button").button();	
	
	// SETS PLAYER NAMES IN WINDOW	
    $('#white_player_name').text(WHITE_PLAYER_NAME);
	$('#black_player_name').text(BLACK_PLAYER_NAME);
		      	
	// EVENT BINDINGS
    $('#undo_move_button').bind(startclickevent, CONTROLLER_EVENT_undoMove);
    $('#cancel_game_button').bind(startclickevent, CONTROLLER_EVENT_cancelGame);
    $('#resign_button').bind(startclickevent, CONTROLLER_EVENT_resignGame);
    $('#lobby_button').bind(startclickevent, CONTROLLER_EVENT_returnToLobby);
    $('#game_over_return_button').bind(startclickevent, CONTROLLER_EVENT_returnToLobby);
    
    $('#in_game_popup').bind(startclickevent, VIEW_EVENT_dismissInGamePopup);
    
    $('#hexCanvas').bind(startclickevent, VIEW_EVENT_clickCanvas);
    $('.game_piece').bind("mouseenter", VIEW_EVENT_popHoveredPieceForward);
    $('.game_piece').bind("mouseleave", VIEW_EVENT_pushHoveredPieceBack);    
    
    $(window).bind("resize", VIEW_EVENT_resizeWindow);   
    $(document).bind("touchmove", function(event) {event.preventDefault()});  // STOPS BOUNCE ON MOBILE DEVICES WHEN SWIPING       
}


/**
 * Fires when a piece on the board is clicked.
 * @param   {Event} event
 *          Contains x- and y-coordinates of window location where click occurred. 
 */
function VIEW_EVENT_clickCanvas(event, ui) {      
    Logger("click canvas : this + event.target = " + $(this).attr("id") + " " + $(event.target).attr("id") + " " + event.type);
    swipe_start = Date.now();
    
    // Added to handle iPad clicks
    var touch = (typeof event.pageX === "undefined") ? (event.originalEvent.touches[0] || event.originalEvent.changedTouches[0]) : (event);        
    
    var grid_array;
    var hex_contents;
    var hex_array;
    var this_piece;    
    var clicked_hex = VIEW_SUPPORT_getHexByWindowCoords(touch.pageX, touch.pageY);        
    var current_color = getCurrentColorByMove(NUM_MOVES);
    
    if (clicked_hex) {
        grid_array = MODEL_GRIDARRAY_getGridArray();
        hex_contents = grid_array[clicked_hex.PathCoOrdX][clicked_hex.PathCoOrdY];
        hex_array = hex_contents.split(",");
        this_piece = (hex_array.length > 1) ? (hex_array[hex_array.length-1]) : (hex_array[0]);         
        CLICKED_ON = clicked_hex.GetXYLocation();
        
        // IF ACTUAL HEX IS CLICKED AND NOT BLANK AND CONTAINS PIECE(S) OF THE PLAYER'S COLOR
        if ( (hex_contents != "") && (this_piece.indexOf(current_color) != -1) && (current_color == getPlayerColor()) ) {    
            $('#hexCanvas').bind(stopclickevent, function (e, u) {    
                swipe_end = Date.now();
                // if piece actually clicked and not just a swipe across it
                Logger("click canvas stopclick : this + event.target = " + $(this).attr("id") + " " + $(event.target).attr("id") + " " + event.type);
                if ((swipe_end - swipe_start) < 300) {
                    VIEW_removePieceFromCanvas(clicked_hex);
                    VIEW_showDraggablePiece(this_piece, VIEW_SUPPORT_gridToPageCoords(clicked_hex.MidPoint.X, clicked_hex.MidPoint.Y));           
                    $("#hexCanvas").unbind();
                    $("#hexCanvas").bind(startclickevent, VIEW_EVENT_dropPieceByClick);
                    $(".game_piece").bind(stopclickevent, function(event) {
                        VIEW_SUPPORT_clearAnimationTimer();
                        $(this).unbind(event);
                        $('#hexCanvas').unbind().bind(startclickevent, VIEW_EVENT_clickCanvas);
                        VIEW_updateHex(CLICKED_ON);
                        $(this).hide();         
                    })        
                }
                else {
                    $('#hexCanvas').unbind().bind(startclickevent);    
                }
                             
            });             
        }          
    }
    
    function VIEW_showDraggablePiece(top_piece, new_point) {      
        VIEW_SUPPORT_setupDraggable(top_piece);
        $("#" + top_piece).css({ 
            top: new_point.Y-(PIECE_HEIGHT/2),
            left: new_point.X-(PIECE_WIDTH/2)
        });    
        $("#" + top_piece).show();        
        VIEW_SUPPORT_setPieceAnimationTimer(top_piece);        
    }    
}   

function VIEW_EVENT_dropPieceByClick(event) {
    Logger("drop piece by click : this + event.target = " + $(this).attr("id") + " " + $(event.target).attr("id") + " " + event.type);
    swipe_start = Date.now();
    $('#hexCanvas').bind(stopclickevent, function (e, u) {
        swipe_end = Date.now();
        Logger("drop piece stopclick : this + event.target = " + $(this).attr("id") + " " + $(event.target).attr("id") + " " + event.type);
        // if click on hex/blinking piece and not a swipe
        if ((swipe_end - swipe_start) < 300) {            
            if (MID_DRAG == 0) { // THIS ONLY FIRES IF THE CANVAS CLICK EVENT ISN'T THE RESULT OF DRAGGING A PIECE (BECAUSE DROPPABLE'S DROP EVENT WILL ALREADY FIRE INDEPENDENTLY)

                VIEW_SUPPORT_clearAnimationTimer();
                
                var xy_array = CLICKED_ON.split(",");
                var piece_id = getTopPieceFromGridArrayCell(xy_array[0], xy_array[1]);
                var origin = $("#" + piece_id).attr('origin');
                var touch = (typeof event.pageX === "undefined") ? (event.originalEvent.touches[0] || event.originalEvent.changedTouches[0]) : (event);
                var the_hex = VIEW_SUPPORT_getHexByWindowCoords(touch.pageX, touch.pageY);
                var dest = the_hex.GetXYLocation();            

                // IF DROPPED ON AN ACTUAL HEX AND PIECE ACTUALLY MOVED / INTRODUCED        
                if (the_hex) {              
                    VIEW_SUPPORT_clearAnimationTimer();
                    Logger("origin -> dest : " + origin + " -> " + dest);                                        
                    if (origin != dest) {
                        CONTROLLER_EVENT_attemptMove(origin, dest, piece_id);    
                    }      
                    else {
                        $("#" + piece_id).hide();
                        VIEW_updateHex(origin);    
                    }                        
                }                                            
            }            
        }
        $("#hexCanvas").unbind();        
        $("#hexCanvas").bind(startclickevent, VIEW_EVENT_clickCanvas);   
        //$("#hexCanvas").unbind(stopclickevent, e);                  
    }); 
}



/**
 * Processes the move when a piece is dropped on the gameboard. Fires on piece drag/drop and also on straightforward click on destination hex.
 * @param   {Event} event
 *          The type of event, because this fires on a drop and also on a click. 
 * @param   {} ui
 *          Contains information about the draggable object (we use position).
 */
function VIEW_EVENT_draggableDrop(event, ui) {     
    //Logger("draggable drop");
    var piece_id = $(ui.draggable).attr('id');
    var origin = $(ui.draggable).attr('origin'); 
    var pos = $(ui.draggable).position();
    var the_hex = VIEW_SUPPORT_getHexByWindowCoords(event.pageX, event.pageY);//( (pos.left + PIECE_WIDTH/2), (pos.top + PIECE_HEIGHT/2) );
    var dest = the_hex.GetXYLocation();
    Logger("piece, origin, dest, $(ui.draggable).position().left: " + piece_id + " " + origin + " " + dest + " " + event.pageX + "" + pos.left);
                   
    // IF DROPPED ON AN ACTUAL HEX AND PIECE ACTUALLY MOVED / INTRODUCED        
    if (the_hex) {              
        VIEW_SUPPORT_clearAnimationTimer();
        VIEW_SUPPORT_clearScrollerTimers();
        $("#hexCanvas").unbind().bind(startclickevent, VIEW_EVENT_clickCanvas);                                       
        if (origin != dest) {
            CONTROLLER_EVENT_attemptMove(origin, dest, piece_id);    
        }      
        else {
            $("#" + piece_id).hide();
            VIEW_updateHex(origin);    
        }                                
    }
}






function VIEW_EVENT_popHoveredPieceForward(event, ui) {    
    if ( (getPlayerColor() == "white") && ($(this).attr("origin") == "") ) {
        $("#white_mask_box").show();
        gamepiece_z = $(this).css('z-index');
        $(this).css({'z-index': 50});
    }
    else if ( (getPlayerColor() == "black") && ($(this).attr("origin") == "") ) {
        $("#black_mask_box").show(); 
        gamepiece_z = $(this).css('z-index');
        $(this).css({'z-index': 50});     
    }      
}

function VIEW_EVENT_pushHoveredPieceBack(event, ui) {
    if ( (getPlayerColor() == "white") && ($(this).attr("origin") == "") ) {
        $(this).css({'z-index': gamepiece_z});
        $("#white_mask_box").hide();
    }
    else if ( (getPlayerColor() == "black") && ($(this).attr("origin") == "") ) {
        $(this).css({'z-index': gamepiece_z});
        $("#white_mask_box").hide();    
    }      
}

function VIEW_EVENT_dismissInGamePopup(event, ui) {
    $(this).hide();
    window.clearTimeout(POPUP_TIMER);    
}

function VIEW_EVENT_resizeWindow(event) {
    $(".game_piece").hide();
    VIEW_SUPPORT_redrawHexGrid(MODEL_GRIDARRAY_getGridArray());
    VIEW_SUPPORT_scrollToOrigin();         
}

/**
 * Displays popup window with winner name, message, and buttons. 
 */
function VIEW_EVENT_showWinnerPopup() {
    $(".game_button").hide();
    $("#game_over_popup").show();
    $("#game_over_popup .game_button").show();    
}

 

/**
 * Displays unplayed pieces on the side of the board and masks them to indicate whose turn it is.
 */
function VIEW_drawUnplayedPieces() {
    var effective_mbh;
    var PIECE_OVERLAP;
    var pieces_length;
    var pieces_top_offset;
    var y_offset;
    var x_offset;   
    
    // Hides all played pieces and shows all unplayed ones...
    for (var key in PIECE_ARRAY) { 
        if (PIECE_ARRAY[key] == "")
            $("#" + key).show();    
        else
            $("#" + key).hide();
    }                    
    var num_unplayed_white_pieces = $('[class*=" white"]:visible').length;
    var num_unplayed_black_pieces = $('[class*=" black"]:visible').length;
     
    // SHOWS ALL UNPLAYED WHITE PIECES
    $('[class*=" white"]:visible').each(function(i, obj) {
        // Arrange pieces for landscape mode
        if ( $(window).height() < $(window).width() ) {
            effective_mbh = parseInt($('#white_piece_box').css('height').slice(0,-2));
            piece_overlap = (effective_mbh - $(".game_piece").height()) / (NUM_PIECES - 1);
            pieces_length = ((num_unplayed_white_pieces-1) * piece_overlap) + PIECE_HEIGHT;
            pieces_top_offset = parseInt($('#white_piece_box').css('top').slice(0,-2)) + parseInt($('#white_piece_box').css('padding-top').slice(0,-2)) + ((effective_mbh-pieces_length)/2);
            y_offset = (i * piece_overlap) + pieces_top_offset;
            x_offset = document.getElementById('white_piece_box').getBoundingClientRect().left + parseInt($('#white_piece_box').css('padding-left').slice(0,-2)) + parseInt($('#white_piece_box').css('width').slice(0,-2))/2 - parseInt($("#" + obj.getAttribute('id')).css('width').slice(0,-2))/2;                
        }
        // Arrange pieces for portrait mode TODO: WHY THE HARD CODED NUMBERS BELOW? THIS IS WHY IT OVERLAPS NAME. 
        else {
            pieces_length = $(window).width() - 170 - $(".game_piece").width();
            piece_overlap = pieces_length / (NUM_PIECES-1);
            x_offset = (i * piece_overlap) + 150;
            y_offset = document.getElementById('game_title').getBoundingClientRect().bottom + 10;
        }
        
        $('#' + obj.getAttribute('id')).css({ 'top': y_offset + 'px', 'left': x_offset + 'px', 'z-index': i+2 });
    }); 
    
    // SHOWS ALL UNPLAYED BLACK PIECES
    $('[class*=" black"]:visible').each(function(i, obj) {
        // Arrange pieces for landscape mode
        if ( $(window).height() < $(window).width() ) {
            effective_mbh = parseInt($('#black_piece_box').css('height').slice(0,-2));
            piece_overlap = (effective_mbh - $(".game_piece").height()) / (NUM_PIECES - 1);
            pieces_length = ((num_unplayed_black_pieces-1) * piece_overlap) + PIECE_HEIGHT;
            pieces_top_offset = parseInt($('#black_piece_box').css('top').slice(0,-2)) + parseInt($('#black_piece_box').css('padding-top').slice(0,-2)) + ((effective_mbh-pieces_length)/2);
            y_offset = (i * piece_overlap) + pieces_top_offset;
            x_offset = document.getElementById('black_piece_box').getBoundingClientRect().left + parseInt($('#black_piece_box').css('padding-left').slice(0,-2)) + parseInt($('#black_piece_box').css('width').slice(0,-2))/2 - parseInt($("#" + obj.getAttribute('id')).css('width').slice(0,-2))/2;                
        }
        // Arrange pieces for portrait mode TODO: WHY THE HARD CODED NUMBERS BELOW? THIS IS WHY IT OVERLAPS NAME.
        else {
            pieces_length = $(window).width() - 170 - $(".game_piece").width(); // ((num_unplayed_white_pieces-1) * piece_overlap) + PIECE_HEIGHT;
            piece_overlap = pieces_length / (NUM_PIECES-1);
            x_offset = (i * piece_overlap) + 150;
            y_offset = document.getElementById('container').getBoundingClientRect().bottom + 10;
        } 
           
        $('#' + obj.getAttribute('id')).css({ 'top': y_offset + 'px', 'left': x_offset + 'px', 'z-index': i+2 }); 
    
    });
    
    if (getCurrentColorByMove(NUM_MOVES) == "white") {
        $("#black_mask_box").css({  'z-index': 100 });
        $("#black_mask_box").show();    
    }
    else if (getCurrentColorByMove(NUM_MOVES) == "black") {
        $("#white_mask_box").show();    
        $("#white_mask_box").css({  'z-index': 50 });        
    }
    
    if ( getCurrentColorByMove(NUM_MOVES) != getPlayerColor() ) {
        $("#" + getCurrentColorByMove(NUM_MOVES) + "_mask_box").show();
        $("#" + getCurrentColorByMove(NUM_MOVES) + "_mask_box").css({  'z-index': 50, 'opacity': .1 });
    }
    
    if ( getCurrentColorByMove(NUM_MOVES) == getPlayerColor() ) {
        $("#" + getPlayerColor() + "_mask_box").hide();
        $("#" + getOpponentColor() + "_mask_box").show();
        $("#" + getOpponentColor() + "_mask_box").css({  'z-index': 50, 'opacity': .5 });
    }        
                            
    VIEW_redrawButtons();
     
}

function VIEW_redrawButtons() {
    // HIDES LOTS OF BUTTONS IF SOLO GAME
    if (SOLO_GAME) {
        //$("#clear_board_button").hide();
        $("#cancel_game_button").hide();
        //$("#resign_button").hide();
        //$("#undo_move_button").hide();
    }
    else {
        // SHOWS CANCEL GAME BUTTON ON EITHER PLAYER'S FIRST TURN      
        if (NUM_MOVES < 2) {
            //$("#resign_button").hide();
            $("#cancel_game_button").show();
        }
        // SHOWS RESIGN BUTTON IF SECOND TURN OR LATER
        else {
            //$('#resign_button').show();
            $('#cancel_game_button').hide();
        }
        // HIDES UNDO BUTTON IF MY TURN, IF BEE SURROUNDED, OR IF FIRST MOVE OF GAME
        if ( (getPlayerColor() == getCurrentColorByMove()) || (NUM_MOVES == 0) ) {
            //$("#undo_move_button").hide();    
        }
        else {
            //$("#undo_move_button").show();    
        }                  
    }    
}

  
/**
 * Adds piece to canvas
 * @param {HT.Hexagon} the_hex
 */
function VIEW_drawPieceOnCanvas(the_hex) {
	var x_ind = the_hex.PathCoOrdX;
	var y_ind = the_hex.PathCoOrdY;
	
	var canvas = document.getElementById('hexCanvas');
	var ctx = canvas.getContext('2d');
	
	var the_width = $(".game_piece").width();
	var the_height = $(".game_piece").height();
	the_hex.drawPieceOnCanvas(ctx, the_width, the_height);	
	
	//VIEW_drawUnplayedPieces();
}

/**
 * Removes piece from canvas.
 * @param {HT.Hexagon} the_hex
 */
function VIEW_removePieceFromCanvas(the_hex) {
	x_ind = the_hex.PathCoOrdX;
	y_ind = the_hex.PathCoOrdY;

	var canvas = document.getElementById('hexCanvas');
	var ctx = canvas.getContext('2d');
	
	var the_width = $(".game_piece").width();
    var the_height = $(".game_piece").height();
	the_hex.removePieceFromCanvas(ctx, the_width, the_height);	

	//VIEW_drawUnplayedPieces();
}

/**
 * Updates a hex's appearance depending on its current value
 * @param   {String} in_loc_string
 */
function VIEW_updateHex(in_loc_string) {    
    if (in_loc_string != "") {
        var canvas = document.getElementById('hexCanvas');
        var ctx = canvas.getContext('2d');    
        var grid = new HT.Grid($("#hexCanvas").width(), $("#hexCanvas").height());
        var the_hex = grid.GetHexByXYIndex(in_loc_string);    
        var the_width = $(".game_piece").width();
        var the_height = $(".game_piece").height();
        the_hex.drawPieceOnCanvas(ctx, the_width, the_height);          
    }
    //VIEW_drawUnplayedPieces();

}

/**
 * Updates opponent name displayed on screen (fires if opponent comes into game while game window is open)
 */
function VIEW_updateOpponentName() {
	$('#black_player_name').text(BLACK_PLAYER_NAME);
}


function VIEW_showInGamePopup(in_title, in_text, in_duration) {
    $('#in_game_header').html(in_title);
    $('#in_game_text').html(in_text);
    $('#in_game_popup').show();
    
    POPUP_TIMER = setTimeout(function(){
        $('#in_game_popup').hide();
    }, in_duration);    
}

function VIEW_showGameOverPopup(in_message) {
    $("#game_over_text").html(in_message);
    $("#game_over_popup").show();
}

/**
 * origin is used right now to keep track of the origin location at the beginning of a click/drag sequence
 * @param {Object} in_piece_id
 * @param {Object} in_dest
 */
function VIEW_setPieceOrigin(in_piece_id, in_dest) {
    $("#" + in_piece_id).attr('origin', in_dest);
}
