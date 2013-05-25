var NUM_OF_PIECES;

var WINDOW_HEIGHT;
var WINDOW_WIDTH;

var PIECE_HEIGHT;
var PIECE_WIDTH;
var PIECE_SIDE;
var PIECE_OVERLAP;

var MASK_BOX_HEIGHT;
var MASK_BOX_WIDTH;
var MASK_BOX_TOP;
var MASK_BOX_PADDING;
var MASK_BOX_MARGIN;
var WHITE_MASK_BOX_LEFT;
var BLACK_MASK_BOX_LEFT;

var CANVAS_HEIGHT;
var CANVAS_WIDTH;
var CANVAS_LEFT;
var CANVAS_TOP;
var CANVAS_BORDER;
var CANVAS_BORDER_STRING;

var GAME_TITLE_WIDTH;
var GAME_TITLE_HEIGHT;
var GAME_TITLE_LEFT;
var GAME_TITLE_TOP;
var GAME_TITLE_FONT_PX;

var PLAYER_NAME_HEIGHT;
var PLAYER_NAME_TOP;
var PLAYER_NAME_FONT_PX;
var PLAYER_NAME_LINE_HEIGHT;

var WHITE_PLAYER_NAME_WIDTH;
var BLACK_PLAYER_NAME_WIDTH;
var WHITE_PLAYER_NAME_LEFT;
var BLACK_PLAYER_NAME_LEFT;

var BOTTOM_BAR_LEFT;
var BOTTOM_BAR_WIDTH;
var BOTTOM_BAR_TOP;
var BOTTOM_BAR_HEIGHT;
var BOTTOM_BAR_PADDING;


var BUTTON_WIDTH;
var BUTTON_HEIGHT;
var BUTTON_TOP;

var UNDO_BUTTON_LEFT;
var RETURN_BUTTON_LEFT;
var CANCEL_BUTTON_LEFT;
var REMATCH_BUTTON_LEFT;
var CLEAR_BOARD_BUTTON_LEFT;
var RESIGN_BUTTON_LEFT;

var GAME_OVER_WIDTH;
var GAME_OVER_HEIGHT;
var GAME_OVER_TOP;
var GAME_OVER_LEFT;
var GAME_OVER_PADDING;
var GAME_OVER_FONT_PX;
var GAME_OVER_LINE_HEIGHT;

var PIECE_ANIMATION_INTERVAL;


function VIEW_setAllViewProperties() {
	
	NUM_OF_PIECES = 11;
	
	PIECE_HEIGHT = 80;
	PIECE_WIDTH = 100;
	
	WINDOW_HEIGHT = $(window).height();   // RETURNS HEIGHT OF BROWSER VIEWPORT
	WINDOW_WIDTH = $(window).width();   // RETURNS WIDTH OF BROWSER VIEWPORT 
		
	GAME_TITLE_HEIGHT = WINDOW_HEIGHT / 8; // CHANGE ?
	BOTTOM_BAR_HEIGHT = WINDOW_HEIGHT / 8; // CHANGE ?
		
	GAME_TITLE_FONT_PX = GAME_TITLE_HEIGHT * .6;	
	GAME_TITLE_WIDTH = VIEW_getTextBlockWidth(GAME_TITLE_FONT_PX + "px Pacifico", "Bug Chess");
	GAME_TITLE_LEFT = (WINDOW_WIDTH - GAME_TITLE_WIDTH) / 2;
	GAME_TITLE_TOP = 0 - (GAME_TITLE_FONT_PX * .2);
	
	PIECE_SIDE = SUPPORT_getHexSideFromWH(PIECE_WIDTH, PIECE_HEIGHT);
	
	MASK_BOX_MARGIN = 10;
	MASK_BOX_PADDING = 10;	
	MASK_BOX_WIDTH = PIECE_WIDTH + (2 * MASK_BOX_PADDING);
	MASK_BOX_HEIGHT = WINDOW_HEIGHT - (MASK_BOX_MARGIN*2); //CANVAS_HEIGHT + (CANVAS_BORDER * 2); //((NUM_OF_PIECES-1) * PIECE_OVERLAP) + PIECE_HEIGHT + (2 * MASK_BOX_PADDING);
	MASK_BOX_TOP = MASK_BOX_MARGIN; 
	
	CANVAS_BORDER = 5;
	CANVAS_HEIGHT = WINDOW_HEIGHT - GAME_TITLE_HEIGHT - BOTTOM_BAR_HEIGHT - (CANVAS_BORDER*2) - MASK_BOX_MARGIN; // CHANGE
	CANVAS_TOP = GAME_TITLE_HEIGHT; // CHANGE

	CANVAS_WIDTH = WINDOW_WIDTH - (MASK_BOX_WIDTH * 2) - (MASK_BOX_MARGIN * 4) - (CANVAS_BORDER * 2);
	CANVAS_BORDER_STRING = CANVAS_BORDER + "PX SOLID BLACK";
	CANVAS_LEFT = MASK_BOX_WIDTH + (2 * MASK_BOX_MARGIN);
	 
	WHITE_MASK_BOX_LEFT = MASK_BOX_MARGIN; 
	BLACK_MASK_BOX_LEFT = MASK_BOX_MARGIN + MASK_BOX_WIDTH + MASK_BOX_MARGIN + CANVAS_BORDER + CANVAS_WIDTH + CANVAS_BORDER + MASK_BOX_MARGIN;
	
	PIECE_OVERLAP = (MASK_BOX_HEIGHT - (MASK_BOX_PADDING*2) - PIECE_HEIGHT) / (NUM_OF_PIECES-1);
	
	PLAYER_NAME_HEIGHT = GAME_TITLE_HEIGHT;
	PLAYER_NAME_TOP = 0; //GAME_TITLE_HEIGHT / 2;
	PLAYER_NAME_FONT_PX = GAME_TITLE_HEIGHT / 2;
	PLAYER_NAME_LINE_HEIGHT = PLAYER_NAME_FONT_PX * 2;
	
	WHITE_PLAYER_NAME_WIDTH = VIEW_getTextBlockWidth(PLAYER_NAME_FONT_PX + 'px Droid Sans', WHITE_PLAYER_NAME);
	BLACK_PLAYER_NAME_WIDTH = VIEW_getTextBlockWidth(PLAYER_NAME_FONT_PX + 'px Droid Sans', BLACK_PLAYER_NAME);
	WHITE_PLAYER_NAME_LEFT = CANVAS_LEFT + (CANVAS_BORDER * 2); //MASK_BOX_MARGIN + (MASK_BOX_WIDTH/2) - (WHITE_PLAYER_NAME_WIDTH/2); //CANVAS_LEFT + (CANVAS_WIDTH/5) - (WHITE_PLAYER_NAME_WIDTH/2);
	BLACK_PLAYER_NAME_LEFT = CANVAS_LEFT + CANVAS_WIDTH - BLACK_PLAYER_NAME_WIDTH; // + MASK_BOX_MARGIN + (MASK_BOX_WIDTH/2) - (BLACK_PLAYER_NAME_WIDTH/2);; //(CANVAS_WIDTH*4/5) - (BLACK_PLAYER_NAME_WIDTH/2);	
	
	BOTTOM_BAR_LEFT = CANVAS_LEFT - CANVAS_BORDER;
	BOTTOM_BAR_WIDTH = CANVAS_WIDTH + (CANVAS_BORDER*2);
	BOTTOM_BAR_TOP = WINDOW_HEIGHT - BOTTOM_BAR_HEIGHT - MASK_BOX_MARGIN;
	BOTTOM_BAR_PADDING = 5;
	
	BUTTON_HEIGHT = BOTTOM_BAR_HEIGHT - (BOTTOM_BAR_PADDING*2); 
	BUTTON_TOP = BOTTOM_BAR_TOP + BOTTOM_BAR_PADDING;
	BUTTON_WIDTH = MASK_BOX_WIDTH;
	BUTTON_PADDING = 10;
	
	UNDO_BUTTON_LEFT = BOTTOM_BAR_LEFT + BOTTOM_BAR_PADDING;
	CANCEL_BUTTON_LEFT = BOTTOM_BAR_LEFT + BOTTOM_BAR_PADDING;
	REMATCH_BUTTON_LEFT = BOTTOM_BAR_LEFT + BOTTOM_BAR_PADDING;
	CLEAR_BOARD_BUTTON_LEFT = BOTTOM_BAR_LEFT + BOTTOM_BAR_PADDING;
	
	RETURN_BUTTON_LEFT = CANVAS_LEFT + CANVAS_WIDTH + CANVAS_BORDER - BUTTON_WIDTH;
	
	RESIGN_BUTTON_LEFT = RETURN_BUTTON_LEFT - BUTTON_WIDTH - BUTTON_PADDING;
	
	GAME_OVER_WIDTH = WINDOW_WIDTH / 3;
	GAME_OVER_HEIGHT = GAME_OVER_WIDTH / 5;
	GAME_OVER_TOP = (WINDOW_HEIGHT/2) - (GAME_OVER_HEIGHT/2);
	GAME_OVER_LEFT = (WINDOW_WIDTH/2) - (GAME_OVER_WIDTH/2);
	GAME_OVER_PADDING = 20;
	GAME_OVER_FONT_PX = GAME_OVER_HEIGHT / 4;
	GAME_OVER_LINE_HEIGHT = GAME_OVER_HEIGHT / 2;
		
}

function VIEW_initGameWindow() {
	
	$("#container").droppable({ drop: CONTROLLER_onDrop });
	$('#container').css({ 'height': CANVAS_HEIGHT, 'width': CANVAS_WIDTH, 'left': CANVAS_LEFT, 'top': CANVAS_TOP, 'border': CANVAS_BORDER_STRING });
	
	$('#game_title').css({ 'height': GAME_TITLE_HEIGHT, 'width': GAME_TITLE_WIDTH, 'left': GAME_TITLE_LEFT, 'top': GAME_TITLE_TOP, 'font-size': GAME_TITLE_FONT_PX });
	$('#game_title').text('Bug Chess');
	
	$('#bottom_bar').css({ 'height': BOTTOM_BAR_HEIGHT, 'width': BOTTOM_BAR_WIDTH, 'left': BOTTOM_BAR_LEFT, 'top': BOTTOM_BAR_TOP, 'padding': BOTTOM_BAR_PADDING });
	
	$(".game_button").css({ 'height': BUTTON_HEIGHT, 'width': BUTTON_WIDTH, 'top': BUTTON_TOP, 'cursor': 'pointer' });
	
	$("#undo_move_button").button();
	$("#undo_move_button").css({ 'left': UNDO_BUTTON_LEFT});
	
	$("#cancel_game_button").button();
	$("#cancel_game_button").css({ 'left': CANCEL_BUTTON_LEFT });
	
	$("#rematch_button").button();
	$("#rematch_button").css({ 'left': REMATCH_BUTTON_LEFT });
	$("#rematch_button").hide();
	
	$("#clear_board_button").button();
	$("#clear_board_button").css({ 'left': CLEAR_BOARD_BUTTON_LEFT });
	$("#clear_board_button").hide();
	
	$("#return_button").button();
	$("#return_button").css({ 'left': RETURN_BUTTON_LEFT });
	
	$("#resign_button").button();
	$("#resign_button").css({ 'left': RESIGN_BUTTON_LEFT });
	$("#resign_button").hide();
	
	$("#game_over_popup").hide();
	$("#game_over_popup").css({ 'height': GAME_OVER_HEIGHT, 'width': GAME_OVER_WIDTH, 'left': GAME_OVER_LEFT, 'top': GAME_OVER_TOP, 'font-size': GAME_OVER_FONT_PX + 'px', 'padding': GAME_OVER_PADDING + 'px', 'line-height': GAME_OVER_LINE_HEIGHT + 'px', '-webkit-border-radius': GAME_OVER_HEIGHT + 'px'});	
	
	$('#white_player_name').css({ 'height': PLAYER_NAME_HEIGHT, 'width': WHITE_PLAYER_NAME_WIDTH, 'left': WHITE_PLAYER_NAME_LEFT, 'top': PLAYER_NAME_TOP, 'font-size': PLAYER_NAME_FONT_PX + 'px', 'line-height': PLAYER_NAME_LINE_HEIGHT + 'px' });
	$('#black_player_name').css({ 'height': PLAYER_NAME_HEIGHT, 'width': BLACK_PLAYER_NAME_WIDTH, 'left': BLACK_PLAYER_NAME_LEFT, 'top': PLAYER_NAME_TOP, 'font-size': PLAYER_NAME_FONT_PX + 'px', 'line-height': PLAYER_NAME_LINE_HEIGHT + 'px' });	
	$('#white_player_name').text(WHITE_PLAYER_NAME);
	$('#black_player_name').text(BLACK_PLAYER_NAME);
	
	$('#white_mask_box').css({ 'height': MASK_BOX_HEIGHT, 'width': MASK_BOX_WIDTH, 'left': WHITE_MASK_BOX_LEFT, 'top': MASK_BOX_TOP });
	$('#black_mask_box').css({ 'height': MASK_BOX_HEIGHT, 'width': MASK_BOX_WIDTH, 'left': BLACK_MASK_BOX_LEFT, 'top': MASK_BOX_TOP });		
	
	$(".game_piece").attr('origin', '');
	$('.game_piece').css({'height': PIECE_HEIGHT, 'width': PIECE_WIDTH});
	$(".game_piece").unbind("mouseenter");
	$(".game_piece").unbind("mouseleave");
	$(".game_piece").show();	
	
	if (!SOLO_GAME) {
		$("#resign_button").show();
	}
	
	window.onorientationchange = function(event) {
			window.location.href = window.location.href;
	};
	
	
	// THIS SECTION FLOATS HOVERED-OVER PIECE TO TOP OF Z STACK
    var zdex = 0;
    
	if ((WHITE_PLAYER_NAME == NAME) || SOLO_GAME) {
    	$('[class*=" white"]').draggable({revert: "invalid", distance: PIECE_WIDTH/2, cursorAt: {'top': PIECE_HEIGHT/2, 'left': PIECE_WIDTH/2}, start: function() {mid_drop_flag = 1;}});
    	
	    $('[class*=" white"]:visible').mouseenter(function(){
	    	$("#white_mask_box").css({'z-index': 30});
	    	$("#white_mask_box").css({'opacity': .3});
	    	zdex = $(this).css('zIndex');
			$(this).css({'z-index': 50});	
		});
		
		$('[class*=" white"]:visible').mouseleave(function(){
			$(this).css({'z-index': zdex});
			$("#white_mask_box").css({'z-index': 1});
			$("#white_mask_box").css({'opacity': .1});
		});	 
    }
    
    if ((BLACK_PLAYER_NAME == NAME) || SOLO_GAME) {
    	$('[class*=" black"]').draggable({revert: "invalid", distance: PIECE_WIDTH/2, cursorAt: {'top': PIECE_HEIGHT/2, 'left': PIECE_WIDTH/2 }, start: function() {mid_drop_flag = 1;}});
    	
	    $('[class*=" black"]:visible').mouseenter(function(){
	    	$("#black_mask_box").css({'z-index': 30});
	    	$("#black_mask_box").css({'opacity': .3});
	    	zdex = $(this).css('zIndex');
			$(this).css({'z-index': 50});	
		});
		
		$('[class*=" black"]:visible').mouseleave(function(){
			$(this).css({'z-index': zdex});
			$("#black_mask_box").css({'z-index': 1});
			$("#black_mask_box").css({'opacity': .1});
		});	    	
    	
    }
    
	VIEW_repositionUnplacedPieces();	
}


function VIEW_drawPieceOnCanvas(the_hex) {
	var x_ind = the_hex.PathCoOrdX;
	var y_ind = the_hex.PathCoOrdY;
	//Logger("VIEW: (192) ADD PIECE TO CANVAS AT [" + x_ind + "," + y_ind + "] CURRENT GRID ARRAY VALUE = " + GRID_ARRAY[x_ind][y_ind]);
	//Logger("VIEW: 185 xy = " + x_ind + " " + y_ind);
	var canvas = document.getElementById('hexCanvas');
	var ctx = canvas.getContext('2d');
	the_hex.drawPieceOnCanvas(ctx);	
	
	VIEW_repositionUnplacedPieces();

}

function VIEW_removePieceFromCanvas(the_hex) {
	x_ind = the_hex.PathCoOrdX;
	y_ind = the_hex.PathCoOrdY;
	//Logger("VIEW: (60) x/y" + x_ind + " " + y_ind);
	var canvas = document.getElementById('hexCanvas');
	var ctx = canvas.getContext('2d');
	the_hex.removePieceFromCanvas(ctx);	
	//Logger("VIEW: (202) REMOVE PIECE FROM CANVAS AT [" + x_ind + "," + y_ind + "]");
	VIEW_repositionUnplacedPieces();
}

function VIEW_showDraggablePiece(arr_value, new_point) {
	var multiple_pieces = arr_value.lastIndexOf(",");
	var top_piece = "";	
	
	if (multiple_pieces != -1) { // IF HEX HAS 2+ PIECES	
		top_piece = arr_value.substring(multiple_pieces+1);
	}	
	else {
		top_piece = arr_value;
	}
		
	var new_bg = "selected" + top_piece.substring(5, top_piece.length-1) + ".png";
	//Logger("VIEW: (217) show draggable new_point " + new_point.X + " " + new_point.Y + " top_piece " + top_piece);
	
	$("#" + top_piece).css({ 
		top: new_point.Y-(PIECE_HEIGHT/2)+CANVAS_BORDER,
		left: new_point.X-(PIECE_WIDTH/2)+CANVAS_BORDER//,
		//background: 'url("pieces/' + new_bg + '")'
	});
	
	//var counterrr = 0;
	$("#" + top_piece).show();
	
	PIECE_ANIMATION_INTERVAL = setInterval(function() {
		$("#" + top_piece).animate({'opacity': '1', 'height': '+=10', 'width': '+=10'}, 500);
		$("#" + top_piece).animate({'opacity': '1', 'height': '-=20', 'width': '-=20'}, 1000);
		$("#" + top_piece).animate({'opacity': '1', 'height': '+=10', 'width': '+=10'}, 500);
	}, 2000);
	
	$("#" + top_piece).animate({'opacity': '1', 'height': '+=10', 'width': '+=10'}, 500);
	$("#" + top_piece).animate({'opacity': '1', 'height': '-=20', 'width': '-=20'}, 1000);
	$("#" + top_piece).animate({'opacity': '1', 'height': '+=10', 'width': '+=10'}, 500);
	//({'-webkit-transform': 'rotate(' + 180 + 'deg)'}, 1000);	
	//alert("DRAGGABLE");
	//$(".game_piece").show();
	/*
	function animFadeIn() {
		Logger("START1: " + counterrr );
		$("#" + top_piece).clearQueue().finish();
		$("#" + top_piece).animate({'opacity': '6'}, 500, animFadeOut);	
		Logger("FINISH1: " + counterrr);
	}
	function animFadeOut() {
		Logger("START2: " + counterrr );
		$("#" + top_piece).clearQueue().finish();
		$("#" + top_piece).animate({'opacity': '.6'}, 500);
		Logger("FINISH2: " + counterrr );
		counterrr++;
	}*/
}

function VIEW_repositionUnplacedPieces() {
	var num_unplayed_white_pieces = $('[class*=" white"]:visible').length;
	var num_unplayed_black_pieces = $('[class*=" black"]:visible').length;
	
	//turns off spinny effect
	$('.game_piece:hidden').unbind('mouseenter');
	$('.game_piece:hidden').unbind('mouseleave');
	
	// SHOWS ALL WHITE PIECES
	$('[class*=" white"]:visible').each(function(i, obj) {
		var y_offset = (i * PIECE_OVERLAP) + MASK_BOX_TOP + MASK_BOX_PADDING + ((NUM_OF_PIECES-num_unplayed_white_pieces)*(PIECE_OVERLAP/2));
		var x_offset = WHITE_MASK_BOX_LEFT + MASK_BOX_PADDING;
		$('#' + obj.getAttribute('id')).css({ 'top': y_offset, 'left': x_offset, 'z-index': i+2 }); //num_of_pieces*2+2-i
	});	
	
	// SHOWS ALL BLACK PIECES
	$('[class*=" black"]:visible').each(function(i, obj) {
		var y_offset = (i * PIECE_OVERLAP) + MASK_BOX_TOP + MASK_BOX_PADDING + ((NUM_OF_PIECES-num_unplayed_black_pieces)*(PIECE_OVERLAP/2));
		var x_offset = BLACK_MASK_BOX_LEFT + MASK_BOX_PADDING;
		$('#' + obj.getAttribute('id')).css({ 'top': y_offset, 'left': x_offset, 'z-index': i+2 }); //num_of_pieces*2+2-i
	});
	
	// SHOWS EITHER RESET BUTTON OR CANCEL GAME BUTTON
	if (NUM_MOVES == 0) {
		if (SOLO_GAME) {
			$("#cancel_game_button").hide();
			$("#undo_move_button").hide();
		}
		else {
			$("#cancel_game_button").show();
			$("#undo_move_button").hide();
		}
	}
	else if (NUM_MOVES == 1 && BLACK_PLAYER_NAME != '(none)') {
		$("#undo_move_button").show();
		$("#cancel_game_button").hide();
	}
		
	// MASK GAME PIECE BARS + UNDO
	if (NUM_MOVES % 2 == 1) {
		// BLACK TURN
		$('#white_mask_box').css({'opacity': .6, 'z-index': 50, 'background': 'rgb(0,0,0)'});
		$('#black_mask_box').css({'opacity': .1, 'z-index': 1, 'background': 'rgb(0,0,0)'});
		
		if (NAME == BLACK_PLAYER_NAME)
			$("#undo_move_button").hide();
		else
			$("#undo_move_button").show();
	}
	else {
		// WHITE TURN
		$('#black_mask_box').css({'opacity': .6, 'z-index': 50, 'background': 'rgb(0,0,0)'});
		$('#white_mask_box').css({'opacity': .1, 'z-index': 1, 'background': 'rgb(0,0,0)'});
		
		if (NAME == WHITE_PLAYER_NAME)
			$("#undo_move_button").hide();
		else
			$("#undo_move_button").show();
	}
	
}

function VIEW_getTextBlockWidth(in_font, in_text) {
	//textWidth.width;
	var canvas = document.getElementById("hexCanvas");
	var ctx = canvas.getContext("2d");
	ctx.font = in_font; // '48px Pacifico'
	var textWidth = ctx.measureText (in_text);
	
	return textWidth.width + 2; // 2 is just for offset in case
} 

function VIEW_updateOpponentName() {
	$('#black_player_name').text(BLACK_PLAYER_NAME);
}
