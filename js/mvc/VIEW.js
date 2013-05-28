var NUM_OF_PIECES;

var PIECE_HEIGHT;
var PIECE_WIDTH;
var PIECE_OVERLAP;

var PIECE_ANIMATION_INTERVAL;


function VIEW_setAllViewProperties() {
	
	NUM_OF_PIECES = 11;
	
	PIECE_HEIGHT = 80;
	PIECE_WIDTH = 100;
	PIECE_OVERLAP = 40;

    var width = PIECE_WIDTH; var height = PIECE_HEIGHT; var a = -3.0; var b = (-2.0 * width); var c = (Math.pow(width, 2)) + (Math.pow(height, 2));
    var PIECE_SIDE = (-b - Math.sqrt(Math.pow(b,2)-(4.0*a*c)))/(2.0*a);
    		
}

function VIEW_initGameWindow() {
	
	$("#container").droppable({ drop: CONTROLLER_onDrop });
	
    $("#undo_move_button").button();    	
	$("#cancel_game_button").button();
    $("#return_button").button();
    $("#resign_button").button();
	$("#clear_board_button").button();
	
	$("#game_over_rematch_button").button();
	$("#game_over_return_button").button();
	
	$("#clear_board_button").hide();
	//$("#rematch_button").hide();
	$("#resign_button").hide();
	$("#game_over_popup").hide();
	
    $('#white_player_name').text(WHITE_PLAYER_NAME);
	$('#black_player_name').text(BLACK_PLAYER_NAME);
	
	$(".game_piece").attr('origin', '');
	$(".game_piece").unbind("mouseenter");
	$(".game_piece").unbind("mouseleave");
	$(".game_piece").show();	
	
	if (!SOLO_GAME) {
		$("#resign_button").show();
	}
	
	window.onorientationchange = function(event) {
		window.location.href = window.location.href;
	};
	
	VIEW_initializeSidebarEvent();
}
	
	
function VIEW_initializeSidebarEvent() {
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
	
	var canvas = document.getElementById('hexCanvas');
	var ctx = canvas.getContext('2d');
	the_hex.drawPieceOnCanvas(ctx);	
	
	VIEW_repositionUnplacedPieces();

}

function VIEW_removePieceFromCanvas(the_hex) {
	x_ind = the_hex.PathCoOrdX;
	y_ind = the_hex.PathCoOrdY;

	var canvas = document.getElementById('hexCanvas');
	var ctx = canvas.getContext('2d');
	the_hex.removePieceFromCanvas(ctx);	

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

	$("#" + top_piece).css({ 
		top: new_point.Y-(PIECE_HEIGHT/2)+$('#container').css('border'),
		left: new_point.X-(PIECE_WIDTH/2)+$('#container').css('border')
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
}

function VIEW_repositionUnplacedPieces() {
	var num_unplayed_white_pieces = $('[class*=" white"]:visible').length;
	var num_unplayed_black_pieces = $('[class*=" black"]:visible').length;
	
	//turns off spinny effect
	$('.game_piece:hidden').unbind('mouseenter');
	$('.game_piece:hidden').unbind('mouseleave');
	
	// SHOWS ALL WHITE PIECES
    $('[class*=" white"]:visible').each(function(i, obj) {
        var pieces_length = ((num_unplayed_white_pieces-1) * PIECE_OVERLAP) + PIECE_HEIGHT;
        var effective_mbh = parseInt($('#white_mask_box').css('height').slice(0,-2)) - parseInt($('#white_mask_box').css('padding-top').slice(0,-2)) - parseInt($('#white_mask_box').css('padding-bottom').slice(0,-2));
        var pieces_top_offset = parseInt($('#white_mask_box').css('top').slice(0,-2)) + ((effective_mbh-pieces_length)/2);
		var y_offset = (i * PIECE_OVERLAP) + pieces_top_offset;
		var x_offset = parseInt($('#white_mask_box').css('left').slice(0,-2)) + parseInt($('#white_mask_box').css('width').slice(0,-2))/2 - parseInt($("#" + obj.getAttribute('id')).css('width').slice(0,-2))/2;
		Logger("VIEW 172: p_l / e_mbh / p_t_o / y_off / x_off = " + pieces_length + " / " + effective_mbh + " / " + pieces_top_offset + " / " + y_offset + " / " + x_offset);
		$('#' + obj.getAttribute('id')).css({ 'top': y_offset + 'px', 'left': x_offset + 'px', 'z-index': i+2 });
	});	
	
	// SHOWS ALL BLACK PIECES
	$('[class*=" black"]:visible').each(function(i, obj) {
        var pieces_length = ((num_unplayed_black_pieces-1) * PIECE_OVERLAP) + PIECE_HEIGHT;
        var effective_mbh = parseInt($('#black_mask_box').css('height').slice(0,-2)) - parseInt($('#black_mask_box').css('padding-top').slice(0,-2)) - parseInt($('#black_mask_box').css('padding-bottom').slice(0,-2));
        var pieces_top_offset = parseInt($('#black_mask_box').css('top').slice(0,-2)) + ((effective_mbh-pieces_length)/2);
        var y_offset = (i * PIECE_OVERLAP) + pieces_top_offset;
		var x_offset = parseInt($('#black_mask_box').css('left').slice(0,-2)) + parseInt($('#black_mask_box').css('width').slice(0,-2))/2 - parseInt($("#" + obj.getAttribute('id')).css('width').slice(0,-2))/2;
		Logger("VIEW 183: " + $('#black_mask_box').css('left') + " / " + $('#black_mask_box').css('width'));
		$('#' + obj.getAttribute('id')).css({ 'top': y_offset + 'px', 'left': x_offset + 'px', 'z-index': i+2 }); 
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
