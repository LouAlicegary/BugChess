var WINDOW_HEIGHT;
var WINDOW_WIDTH;

var PIECE_HEIGHT;
var PIECE_WIDTH;
var PIECE_OVERLAP;

var SIDE_PANEL_PADDING;
var MASK_BOX_PADDING;

var MASK_BOX_HEIGHT;
var MASK_BOX_WIDTH;

var CANVAS_BORDER_WIDTH;
var CANVAS_HEIGHT;
var CANVAS_WIDTH;
var CANVAS_BORDER_STRING;

var CANVAS_LEFT;
var CANVAS_TOP;

var MASK_BOX_TOP;
var WHITE_MASK_BOX_LEFT;
var BLACK_MASK_BOX_LEFT;

var GAME_TITLE_WIDTH;
var GAME_TITLE_HEIGHT;
var GAME_TITLE_LEFT;
var GAME_TITLE_TOP;


function VIEW_setCanvasHexSize()
{
	var width = PIECE_WIDTH; 
	var height = PIECE_HEIGHT; 
	var y = height/2.0;

	var a = -3.0;
	var b = (-2.0 * width);
	var c = (Math.pow(width, 2)) + (Math.pow(height, 2));
	var z = (-b - Math.sqrt(Math.pow(b,2)-(4.0*a*c)))/(2.0*a);
	var x = (width - z)/2.0;
	
	HT.Hexagon.Static.WIDTH = width;
	HT.Hexagon.Static.HEIGHT = height;
	HT.Hexagon.Static.SIDE = z;
}

function VIEW_drawHexGrid()
{
	var grid_height = BOARD_ROWS * PIECE_WIDTH; 
	var grid_width = BOARD_COLUMNS * PIECE_HEIGHT; 
	
	var canvas = document.getElementById('hexCanvas');
	canvas.width = grid_width;
	canvas.height = grid_height;
	
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, grid_width, grid_height);

	var grid = new HT.Grid(grid_width, grid_height);

	for(var h in grid.Hexes)
	{
		grid.Hexes[h].draw(ctx);
	}	
}

function VIEW_drawEmptyGrid() {
	VIEW_setCanvasHexSize();
	VIEW_drawHexGrid();	
}

function VIEW_draw_piece_on_canvas(the_hex) {
	x_ind = the_hex.PathCoOrdX;
	y_ind = the_hex.PathCoOrdY;
	var canvas = document.getElementById('hexCanvas');
	var ctx = canvas.getContext('2d');
	the_hex.drawPieceOnCanvas(ctx);	
	
	VIEW_repositionUnplacedPieces();
	
	Logger("VIEW: (59) ADD PIECE TO CANVAS AT [" + x_ind + "," + y_ind + "]");
}

function VIEW_removePieceFromCanvas(the_hex) {
	x_ind = the_hex.PathCoOrdX;
	y_ind = the_hex.PathCoOrdY;
	//Logger("VIEW: (60) x/y" + x_ind + " " + y_ind);
	var canvas = document.getElementById('hexCanvas');
	var ctx = canvas.getContext('2d');
	the_hex.removePieceFromCanvas(ctx);	
	Logger("VIEW: (65) REMOVE PIECE FROM CANVAS AT " + x_ind + "," + y_ind);
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
		top: new_point.Y-(PIECE_HEIGHT/2)+CANVAS_BORDER_WIDTH,
		left: new_point.X-(PIECE_WIDTH/2)+CANVAS_BORDER_WIDTH,
		background: 'url("pieces/' + new_bg + '")'
	});
	
	$("#" + top_piece).show();
}

function VIEW_initGameWindow() {
	
	$("#container").droppable({ drop: dropFunction });
	$('#container').css({ 'height': CANVAS_HEIGHT, 'width': CANVAS_WIDTH, 'left': CANVAS_LEFT, 'top': CANVAS_TOP, 'border': CANVAS_BORDER_STRING });
	
	$('#game_title').css({ 'height': GAME_TITLE_HEIGHT, 'width': GAME_TITLE_WIDTH, 'left': GAME_TITLE_LEFT, 'top': GAME_TITLE_TOP });
	
	$("#reset_button").button();
	
	$('#white_mask_box').css({ 'height': MASK_BOX_HEIGHT, 'width': MASK_BOX_WIDTH, 'left': WHITE_MASK_BOX_LEFT, 'top': MASK_BOX_TOP });
	$('#black_mask_box').css({ 'height': MASK_BOX_HEIGHT, 'width': MASK_BOX_WIDTH, 'left': BLACK_MASK_BOX_LEFT, 'top': MASK_BOX_TOP });		
	
	$(".game_piece").draggable({revert: "invalid"});
	$(".game_piece").attr('origin', '');
	$('.game_piece').css({'height': PIECE_HEIGHT, 'width': PIECE_WIDTH});
	$(".game_piece").unbind("mouseenter");
	$(".game_piece").unbind("mouseleave");
	$(".game_piece:hidden").show();	
    
    // THIS SECTION FLOATS HOVERED-OVER PIECE TO TOP OF Z STACK
    var zdex = 0;
    
    $(".game_piece").mouseenter(function(){
    	the_piece = $(this);
    	
    	$(".mask_box").css({'z-index': 30});
    	$(".mask_box").css({'opacity': .3});
    	zdex = $(this).css('zIndex');
		$(this).css({'z-index': 50});	
	});
	
	$(".game_piece").mouseleave(function(){
		$(this).css({'z-index': zdex});
		$(".mask_box").css({'z-index': 1});
		$(".mask_box").css({'opacity': .1});
	});	   		
	
	VIEW_repositionUnplacedPieces();	
}


function VIEW_setAllViewProperties() {
		
	PIECE_HEIGHT = 80;
	PIECE_WIDTH = 100;
	PIECE_OVERLAP = 40;
	
	SIDE_PANEL_PADDING = 10;
	MASK_BOX_PADDING = 10;
	MASK_BOX_TOP = 100;
	
	CANVAS_BORDER_WIDTH = 5;
	CANVAS_HEIGHT = 500;
	CANVAS_TOP = 100;
	
	GAME_TITLE_HEIGHT = 60;
	 
	WINDOW_HEIGHT = $(window).height();   // RETURNS HEIGHT OF BROWSER VIEWPORT
	WINDOW_WIDTH = $(window).width();   // RETURNS WIDTH OF BROWSER VIEWPORT 
	 
	MASK_BOX_HEIGHT = ((NUM_OF_PIECES-1) * PIECE_OVERLAP) + PIECE_HEIGHT + (2 * MASK_BOX_PADDING);
	MASK_BOX_WIDTH = PIECE_WIDTH + (2 * MASK_BOX_PADDING);

	CANVAS_WIDTH = WINDOW_WIDTH - (MASK_BOX_WIDTH * 2) - (SIDE_PANEL_PADDING * 4) - (CANVAS_BORDER_WIDTH * 2);
	CANVAS_BORDER_STRING = CANVAS_BORDER_WIDTH + "PX SOLID BLACK";
	CANVAS_LEFT = MASK_BOX_WIDTH + (2 * SIDE_PANEL_PADDING);
	 
	WHITE_MASK_BOX_LEFT = SIDE_PANEL_PADDING; 
	BLACK_MASK_BOX_LEFT = SIDE_PANEL_PADDING + MASK_BOX_WIDTH + SIDE_PANEL_PADDING + CANVAS_BORDER_WIDTH + CANVAS_WIDTH + CANVAS_BORDER_WIDTH + SIDE_PANEL_PADDING;
	
	GAME_TITLE_WIDTH = VIEW_getTextBlockWidth("64px Pacifico", "Bug Chess");
	GAME_TITLE_LEFT = (WINDOW_WIDTH - GAME_TITLE_WIDTH) / 2;
	GAME_TITLE_TOP = 0-(GAME_TITLE_HEIGHT/4);	
}

function VIEW_repositionUnplacedPieces() {
	var num_unplayed_white_pieces = $('[class*=" white"]:visible').length;
	var num_unplayed_black_pieces = $('[class*=" black"]:visible').length;
	
	//Logger(num_unplayed_white_pieces + " " + num_unplayed_black_pieces);
	$('.game_piece:hidden').unbind('mouseenter');
	$('.game_piece:hidden').unbind('mouseleave');
	
	$('[class*=" white"]:visible').each(function(i, obj) {
		var y_offset = (i * PIECE_OVERLAP) + MASK_BOX_TOP + MASK_BOX_PADDING + ((NUM_OF_PIECES-num_unplayed_white_pieces)*(PIECE_OVERLAP/2));
		var x_offset = WHITE_MASK_BOX_LEFT + MASK_BOX_PADDING;
		$('#' + obj.getAttribute('id')).css({ 'top': y_offset, 'left': x_offset, 'z-index': i+2 }); //num_of_pieces*2+2-i
	});	
	
	$('[class*=" black"]:visible').each(function(i, obj) {
		var y_offset = (i * PIECE_OVERLAP) + MASK_BOX_TOP + MASK_BOX_PADDING + ((NUM_OF_PIECES-num_unplayed_black_pieces)*(PIECE_OVERLAP/2));
		var x_offset = BLACK_MASK_BOX_LEFT + MASK_BOX_PADDING;
		$('#' + obj.getAttribute('id')).css({ 'top': y_offset, 'left': x_offset, 'z-index': i+2 }); //num_of_pieces*2+2-i
	});
	
}

function VIEW_getTextBlockWidth(in_font, in_text) {
	//textWidth.width;
	var canvas = document.getElementById("hexCanvas");
	var ctx = canvas.getContext("2d");
	ctx.font = in_font;
	var textWidth = ctx.measureText (in_text);
	
	return textWidth.width;
} 