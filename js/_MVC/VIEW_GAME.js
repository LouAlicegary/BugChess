var NUM_OF_PIECES = 11;
var PIECE_HEIGHT;
var PIECE_WIDTH;
var HIVE_ORIGIN = "15,15";
var PIECE_ANIMATION_INTERVAL;
var MID_DRAG_FLAG = 0; // set to 1 on draggable event start
var MID_MOVE_FLAG = 0;

// Changes all touchstart events on iOS to clicks
var ua = navigator.userAgent;
var clicktouchevent = (ua.match(/(iPhone|iPod|iPad)/)) ? "touchstart" : "click";
    
/**
 * Initializes window buttons, click events, etc. Calls VIEW_repositionUnplayedPieces() when finished.
 */
function VIEW_initGameWindow() {
    
    PIECE_HEIGHT = $(".game_piece").height();
    PIECE_WIDTH = $(".game_piece").width();    
    VIEW_SUPPORT_drawEmptyGrid();
    	
	$("#container").droppable({ drop: VIEW_EVENT_dropPiece });
	
    $("#undo_move_button").button();    	
	$("#cancel_game_button").button();
    $("#lobby_button").button();
    $("#resign_button").button();
	$("#clear_board_button").button();
	$("#game_over_return_button").button();
	
	$("#clear_board_button").hide();
	$("#resign_button").hide();
	$("#in_game_popup").hide();
	$("#game_over_popup").hide();
	
    $('#white_player_name').text(WHITE_PLAYER_NAME);
	$('#black_player_name').text(BLACK_PLAYER_NAME);
	
	// These two lines can probably be deleted.
	//$('#white_mask_box').css({left: document.getElementById('white_piece_box').getBoundingClientRect().left + 'px'})
	//$('#black_mask_box').css({left: document.getElementById('black_piece_box').getBoundingClientRect().left + 'px'})
	
	$(".game_piece").attr('origin', '');
	$(".game_piece").unbind("mouseenter");
	$(".game_piece").unbind("mouseleave");
	$(".game_piece").show();	
	
	if (!SOLO_GAME) {
		$("#resign_button").show();
	}
	
	// RELOAD PAGE FROM SCRATCH ON ORIENTATION CHANGE / WINDOW RESIZE
    window.onresize = function(event) {
        VIEW_SUPPORT_redrawHexGrid(); 
        VIEW_positionUnplacedPieces();
    };
    
    // STOPS BOUNCE ON MOBILE DEVICES WHEN DRAGGING
    document.ontouchmove = function(e) {e.preventDefault()};
    
    	
	$('#hexCanvas').bind(clicktouchevent, VIEW_EVENT_clickPieceOnBoard);
    $('#undo_move_button').bind(clicktouchevent, CONTROLLER_EVENT_undoMove);
    $('#cancel_game_button').bind(clicktouchevent, CONTROLLER_EVENT_cancelGame);
    $('#resign_button').bind(clicktouchevent, CONTROLLER_EVENT_resignGame);
    $('#lobby_button').bind(clicktouchevent, CONTROLLER_EVENT_returnToLobby);
    $('#game_over_return_button').bind(clicktouchevent, CONTROLLER_EVENT_returnToLobby);
    
    $('#in_game_popup').bind(clicktouchevent, function(){
        $(this).hide();
        window.clearTimeout(POPUP_TIMER);
    });
    
    VIEW_EVENT_mouseoverUnplayedPiece();
    
    VIEW_positionUnplacedPieces(); 

    /**
     * Floats hovered-over unplayed piece to top of z-index stack
     */ 
    function VIEW_EVENT_mouseoverUnplayedPiece() {
        var zdex = 0;
        
        if ((WHITE_PLAYER_NAME == NAME) || SOLO_GAME) {
            $('[class*=" white"]').draggable({revert: "invalid", distance: PIECE_WIDTH/2, cursorAt: {'top': PIECE_HEIGHT/2, 'left': PIECE_WIDTH/2}, start: function() {MID_DRAG_FLAG = 1;}});
            
            $('[class*=" white"]:visible').mouseenter(function(){
                $("#white_mask_box").show();
                zdex = $(this).css('zIndex');
                $(this).css({'z-index': 50});   
            });
            
            $('[class*=" white"]:visible').mouseleave(function(){
                $(this).css({'z-index': zdex});
                $("#white_mask_box").hide();
            });  
        }
        
        if ((BLACK_PLAYER_NAME == NAME) || SOLO_GAME) {
            $('[class*=" black"]').draggable({revert: "invalid", distance: PIECE_WIDTH/2, cursorAt: {'top': PIECE_HEIGHT/2, 'left': PIECE_WIDTH/2 }, start: function() {MID_DRAG_FLAG = 1;}});
            
            $('[class*=" black"]:visible').mouseenter(function(){
                $("#black_mask_box").show(); 
                zdex = $(this).css('zIndex');
                $(this).css({'z-index': 50});   
            });
            
            $('[class*=" black"]:visible').mouseleave(function(){
                $("#black_mask_box").hide(); 
                $(this).css({'z-index': zdex});
            });            
        }   
    }
}

/**
 * Displays unplayed pieces on the side of the board and masks them to indicate whose turn it is.
 */
function VIEW_positionUnplacedPieces() {
    var num_unplayed_white_pieces = $('[class*=" white"]:visible').length;
    var num_unplayed_black_pieces = $('[class*=" black"]:visible').length;
    
    //turns off spinny effect
    $('.game_piece:hidden').unbind('mouseenter');
    $('.game_piece:hidden').unbind('mouseleave');
    
    // SHOWS ALL WHITE PIECES
    $('[class*=" white"]:visible').each(function(i, obj) {
        if ( $(window).height() < $(window).width() ) {
            var effective_mbh = parseInt($('#white_piece_box').css('height').slice(0,-2));
            var PIECE_OVERLAP = (effective_mbh - $(".game_piece").height()) / (NUM_OF_PIECES - 1);
            var pieces_length = ((num_unplayed_white_pieces-1) * PIECE_OVERLAP) + PIECE_HEIGHT;
            var pieces_top_offset = parseInt($('#white_piece_box').css('top').slice(0,-2)) + parseInt($('#white_piece_box').css('padding-top').slice(0,-2)) + ((effective_mbh-pieces_length)/2);
            var y_offset = (i * PIECE_OVERLAP) + pieces_top_offset;
            var x_offset = document.getElementById('white_piece_box').getBoundingClientRect().left + parseInt($('#white_piece_box').css('padding-left').slice(0,-2)) + parseInt($('#white_piece_box').css('width').slice(0,-2))/2 - parseInt($("#" + obj.getAttribute('id')).css('width').slice(0,-2))/2;                
        }
        else {
            var pieces_length = $(window).width() - 170 - $(".game_piece").width();
            var PIECE_OVERLAP = pieces_length / (NUM_OF_PIECES-1);
            x_offset = (i * PIECE_OVERLAP) + 150;
            y_offset = document.getElementById('game_title').getBoundingClientRect().bottom + 10;
        }
        $('#' + obj.getAttribute('id')).css({ 'top': y_offset + 'px', 'left': x_offset + 'px', 'z-index': i+2 });
    }); 
    
    // SHOWS ALL BLACK PIECES
    $('[class*=" black"]:visible').each(function(i, obj) {
        if ( $(window).height() < $(window).width() ) {
            var effective_mbh = parseInt($('#black_piece_box').css('height').slice(0,-2));
            var PIECE_OVERLAP = (effective_mbh - $(".game_piece").height()) / (NUM_OF_PIECES - 1);
            var pieces_length = ((num_unplayed_black_pieces-1) * PIECE_OVERLAP) + PIECE_HEIGHT;
            var pieces_top_offset = parseInt($('#black_piece_box').css('top').slice(0,-2)) + parseInt($('#black_piece_box').css('padding-top').slice(0,-2)) + ((effective_mbh-pieces_length)/2);
            var y_offset = (i * PIECE_OVERLAP) + pieces_top_offset;
            var x_offset = document.getElementById('black_piece_box').getBoundingClientRect().left + parseInt($('#black_piece_box').css('padding-left').slice(0,-2)) + parseInt($('#black_piece_box').css('width').slice(0,-2))/2 - parseInt($("#" + obj.getAttribute('id')).css('width').slice(0,-2))/2;                
        }
        else {
            var pieces_length = $(window).width() - 170 - $(".game_piece").width(); // ((num_unplayed_white_pieces-1) * PIECE_OVERLAP) + PIECE_HEIGHT;
            var PIECE_OVERLAP = pieces_length / (NUM_OF_PIECES-1);
            x_offset = (i * PIECE_OVERLAP) + 150;
            y_offset = document.getElementById('container').getBoundingClientRect().bottom + 10;
        }    
        //Logger("VIEW 183: " + document.getElementById('black_piece_box').getBoundingClientRect().left + " / " + $('#black_piece_box').css('width'));
        $('#' + obj.getAttribute('id')).css({ 'top': y_offset + 'px', 'left': x_offset + 'px', 'z-index': i+2 }); 
    });
    

                   
    // SHOWS EITHER RESET BUTTON OR CANCEL GAME BUTTON        
    if (NUM_MOVES == 0) {
        $("#resign_button").hide();
        $("#cancel_game_button").show();
    }
    else if (NUM_MOVES == 1) {
        $("#resign_button").hide();
        $("#cancel_game_button").show();
    }
    else {
        $('#resign_button').show();
        $('#cancel_game_button').hide();
    }  
    // BLACK TURN -> MASK GAME PIECE BARS FOR WHITE + HIDE BLACK UNDO
    if (NUM_MOVES % 2 == 1) {
        $('#white_mask_box').show();
        $('#black_mask_box').hide();
        
        if ( (NAME == BLACK_PLAYER_NAME) || isBeeSurrounded() ) {
            $("#undo_move_button").hide();
        }
        else {
            $("#undo_move_button").show();
            $("#cancel_game_button").hide();
        }
    }
     // WHITE TURN -> MASK GAME PIECE BARS FOR BLACK + HIDE WHITE UNDO
    else {
        $('#black_mask_box').show();
        $('#white_mask_box').hide();
        
        if ( (NAME == WHITE_PLAYER_NAME) || isBeeSurrounded() || (NUM_MOVES == 0) )
            $("#undo_move_button").hide();
        else
            $("#undo_move_button").show();
    }
        // HIDES CANCEL GAME BUTTON IF SOLO GAME
    if (SOLO_GAME) {
        $("#cancel_game_button").hide();
        $("#resign_button").hide();
    }
           
}
  
/**
 * Adds piece to canvas and calls VIEW_positionUnplacedPieces() upon finishing.
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
	
	VIEW_positionUnplacedPieces();

}

/**
 * Removes piece from canvas and calls VIEW_positionUnplacedPieces() upon finishing.
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

	VIEW_positionUnplacedPieces();
}

/**
 * Updates opponent name displayed on screen (fires if opponent comes into game while game window is open)
 */
function VIEW_updateOpponentName() {
	$('#black_player_name').text(BLACK_PLAYER_NAME);
}

/**
 * Displays popup window with winner name, message, and buttons. 
 */
function VIEW_showWinnerPopup() {
    $(".game_button").hide();
    $("#game_over_popup").show();
    $("#game_over_popup .game_button").show();    
}
   
/**
 * Fires when a piece on the board is clicked.
 * @param   {Event} event
 *          Contains x- and y-coordinates of window location where click occurred. 
 */
function VIEW_EVENT_clickPieceOnBoard(event) {
    
    var break_flag = 0;    
    if (MID_MOVE_FLAG)
        break_flag = 1;      
    MID_MOVE_FLAG = Math.abs(MID_MOVE_FLAG-1); // toggle flag no matter what    
    if (break_flag)
        return;
    
    // Added to handle iPad clicks
    var touch;
    if (typeof event.pageX === "undefined") {
        event.preventDefault();
        touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];        
    }
    else {
        touch = event;
    }

    var clicked_hex = VIEW_SUPPORT_getHexByWindowCoords(touch.pageX, touch.pageY);
    
    // IF ACTUAL HEX IS CLICKED AND NOT BLANK SPACE
    if (clicked_hex) {
        CLICKED_ON = clicked_hex.GetXYLocation();
        //Logger("CLICKED HEX AT: " + CLICKED_ON);
        var hex_contents = GRID_ARRAY[clicked_hex.PathCoOrdX][clicked_hex.PathCoOrdY];
        var hex_midpoint = VIEW_SUPPORT_gridToPageCoords(clicked_hex.MidPoint.X, clicked_hex.MidPoint.Y);        
        var this_piece;
        
        // IF HEX CONTAINS PIECE(S)
        if ( hex_contents != 0) {
            var hex_array = hex_contents.split(",");
            if (hex_array.length > 1) {
                this_piece = hex_array[hex_array.length-1];
            }
            else {
                this_piece = hex_array[0];
            }
            
            // IF PIECE IS PLAYER'S COLOR
            if ( ((NUM_MOVES % 2 == 1) && (this_piece.indexOf("black") != -1)) || ( ((NUM_MOVES % 2) == 0) && (this_piece.indexOf("white") != -1)) ) {   
                $(".game_piece").bind(clicktouchevent, VIEW_EVENT_dropPieceByClick);
                document.getElementById('hexCanvas').removeEventListener(clicktouchevent, VIEW_EVENT_clickPieceOnBoard);
                document.getElementById('hexCanvas').addEventListener(clicktouchevent, VIEW_EVENT_dropPieceByClick, false);
                $("#" + this_piece).attr('origin', clicked_hex.GetXYLocation());
                VIEW_removePieceFromCanvas(clicked_hex);
                VIEW_showDraggablePiece(this_piece, hex_midpoint);
            }

        }   
    }  

    /**
     * 
     * @param   {String} arr_value
     *          String containing all pieces present in a given array cell representing a board hex location.
     * @param   {HT.Point} new_point
     *          Point structure containing the window coordinate of the piece's initial location.
     *          
     */
    function VIEW_showDraggablePiece(arr_value, new_point) {
        var multiple_pieces = arr_value.lastIndexOf(",");
        var top_piece = ""; 
        
        if (multiple_pieces != -1) // IF HEX HAS 2+ PIECES    
            top_piece = arr_value.substring(multiple_pieces+1); 
        else
            top_piece = arr_value;
            
        var new_bg = "selected" + top_piece.substring(5, top_piece.length-1) + ".png";
    
        $("#" + top_piece).css({ 
            top: new_point.Y-(PIECE_HEIGHT/2),
            left: new_point.X-(PIECE_WIDTH/2)
        });
        
        //var counterrr = 0;
        $("#" + top_piece).show();
        
        PIECE_ANIMATION_INTERVAL = setInterval(function() {
            $("#" + top_piece).animate({'opacity': '1', 'height': '+=10', 'width': '+=10'}, 500);
            $("#" + top_piece).animate({'opacity': '1', 'height': '-=20', 'width': '-=20'}, 1000);
            $("#" + top_piece).animate({'opacity': '1', 'height': '+=10', 'width': '+=10'}, 500);
        }, 2000);
        
        // This part is here so there's not a 2000ms delay on the animation.
        $("#" + top_piece).animate({'opacity': '1', 'height': '+=10', 'width': '+=10'}, 500);
        $("#" + top_piece).animate({'opacity': '1', 'height': '-=20', 'width': '-=20'}, 1000);
        $("#" + top_piece).animate({'opacity': '1', 'height': '+=10', 'width': '+=10'}, 500);
    }    
     
}   

/**
 * 
 */
function VIEW_EVENT_dropPieceByClick(event) {    

    MID_DRAG_FLAG = 0;    
    var x_val = parseInt(CLICKED_ON.substring(0, CLICKED_ON.indexOf(",")));
    var y_val = parseInt(CLICKED_ON.substring(CLICKED_ON.indexOf(",") + 1));
    var the_piece = "#" + getTopPieceInArray(x_val,y_val); //"#" + this.id;
    var origin = $(the_piece).attr('origin');
    var hex_midpoint = new HT.Point(event.pageX, event.pageY);    
    var the_hex = VIEW_SUPPORT_getHexByWindowCoords(hex_midpoint.X, hex_midpoint.Y);
    var grid = new HT.Grid($("#hexCanvas").width(), $("#hexCanvas").height());
            
    clearInterval(PIECE_ANIMATION_INTERVAL);
    document.getElementById('hexCanvas').removeEventListener(clicktouchevent, VIEW_EVENT_dropPieceByClick, false);
    document.getElementById('hexCanvas').addEventListener(clicktouchevent, VIEW_EVENT_clickPieceOnBoard, false);
    $('.game_piece').unbind(clicktouchevent);
        
    $(the_piece).trigger('mouseleave');
    
    if (the_hex) { // IF DROPPED ON AN ACTUAL HEX ON GRID 
        if (the_hex.GetXYLocation() == origin) { // IF PIECE UNMOVED FROM ORIGINAL SPOT, REDRAW PIECE
            //$(the_piece).hide();        
            var the_hex = grid.GetHexByXYIndex(origin);
            VIEW_drawPieceOnCanvas(the_hex);
        }
        else { // IF PIECE ACTUALLY MOVED / INTRODUCED
            //$(the_piece).hide(); 
            var dest = the_hex.GetXYLocation();
            var piece_id = $(the_piece).attr("id");
            CONTROLLER_EVENT_attemptMove(origin, dest, piece_id);
        }               

    }
    else if (origin) { // IF DROPPED FROM BOARD TO BLANK SPACE ON EDGE OF CANVAS, REDRAW IN ORIGINAL PLACE
        $(the_piece).hide();        
        var the_hex = grid.GetHexByXYIndex(origin);
        VIEW_drawPieceOnCanvas(the_hex);    
    }
        
}

/**
 * Processes the move when a piece is dropped on the gameboard. Fires on piece drag/drop and also on straightforward click on destination hex.
 * @param   {Event} event
 *          The type of event, because this fires on a drop and also on a click. 
 * @param   {} ui
 *          Contains information about the draggable object (we use position).
 */
function VIEW_EVENT_dropPiece(event, ui) {
       
    MID_DRAG_FLAG = 0;
    var the_piece = ui.draggable;
    var piece_id = $(the_piece).attr("id");
    var origin = $(the_piece).attr('origin'); 
    var pos = $(the_piece).position();
    var hex_midpoint = new HT.Point(pos.left + (PIECE_WIDTH/2), pos.top + (PIECE_HEIGHT/2));
    
    clearInterval(PIECE_ANIMATION_INTERVAL);
    document.getElementById('hexCanvas').removeEventListener(clicktouchevent, VIEW_EVENT_dropPieceByClick, false);
    document.getElementById('hexCanvas').addEventListener(clicktouchevent, VIEW_EVENT_clickPieceOnBoard, false);    
    $(the_piece).trigger('mouseleave');
    
    var the_hex = VIEW_SUPPORT_getHexByWindowCoords(hex_midpoint.X, hex_midpoint.Y);
    var grid = new HT.Grid($("#hexCanvas").width(), $("#hexCanvas").height());
    
    if (the_hex) { // IF DROPPED ON AN ACTUAL HEX ON GRID 
        if (the_hex.GetXYLocation() == origin) { // IF PIECE NOT MOVED
            $(the_piece).hide();        
            var the_hex = grid.GetHexByXYIndex(origin);
            VIEW_drawPieceOnCanvas(the_hex);
        }
        else { // IF PIECE ACTUALLY MOVED / INTRODUCED
            var dest = the_hex.GetXYLocation();
            CONTROLLER_EVENT_attemptMove(origin, dest, piece_id);
        }               
    }
    else if (origin) { // IF DROPPED FROM BOARD TO BLANK SPACE ON EDGE OF CANVAS
        $(the_piece).hide();        
        var the_hex = grid.GetHexByXYIndex(origin);
        VIEW_drawPieceOnCanvas(the_hex);    
    }   
}

