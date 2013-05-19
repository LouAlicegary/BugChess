var WINDOW_HEIGHT;
var WINDOW_WIDTH;

var PIECE_HEIGHT;
var PIECE_WIDTH;
var PIECE_SIDE;
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

var RESET_BUTTON_WIDTH;
var RESET_BUTTON_HEIGHT;
var RESET_BUTTON_LEFT;
var RESET_BUTTON_TOP;

var piece_rotate_interval;
var bugs = Array("white_ant", "white_grasshopper", "white_spider", "white_beetle", "white_bee", "black_ant", "black_grasshopper", "black_spider", "black_beetle", "black_bee");
var load_counter = 0;
var img_obj_array = Array();

function VIEW_setAllViewProperties() {
		
	PIECE_HEIGHT = 80;
	PIECE_WIDTH = 100;
	PIECE_OVERLAP = 40;
	
	SIDE_PANEL_PADDING = 10;
	MASK_BOX_PADDING = 10;
	MASK_BOX_TOP = 100;
	
	CANVAS_BORDER_WIDTH = 5;
	CANVAS_HEIGHT = 490;
	CANVAS_TOP = 100;
	
	GAME_TITLE_HEIGHT = 60;
	
	RESET_BUTTON_HEIGHT = 40;
	RESET_BUTTON_TOP = 20;
	
	var width = PIECE_WIDTH; 
	var height = PIECE_HEIGHT; 
	var a = -3.0;
	var b = (-2.0 * width);
	var c = (Math.pow(width, 2)) + (Math.pow(height, 2));
	PIECE_SIDE = (-b - Math.sqrt(Math.pow(b,2)-(4.0*a*c)))/(2.0*a);
	 
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

	RESET_BUTTON_WIDTH = MASK_BOX_WIDTH;
	RESET_BUTTON_LEFT = WHITE_MASK_BOX_LEFT;
		
}

function VIEW_initGameWindow() {
	
	$("#container").droppable({ drop: dropFunction });
	$('#container').css({ 'height': CANVAS_HEIGHT, 'width': CANVAS_WIDTH, 'left': CANVAS_LEFT, 'top': CANVAS_TOP, 'border': CANVAS_BORDER_STRING });
	
	$('#game_title').css({ 'height': GAME_TITLE_HEIGHT, 'width': GAME_TITLE_WIDTH, 'left': GAME_TITLE_LEFT, 'top': GAME_TITLE_TOP });
	
	$("#reset_button").button();
	$("#reset_button").css({ 'height': RESET_BUTTON_HEIGHT, 'width': RESET_BUTTON_WIDTH, 'left': RESET_BUTTON_LEFT, 'top': RESET_BUTTON_TOP });
	
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
	
	VIEW_repositionUnplacedPieces();	
}

function VIEW_preloadImages() {	
	Logger("IMAGE PRELOADER STARTED");
	
	for (var i=0; i < bugs.length; i++) {
		var imageObj = new Image();
		imageObj.src = "pieces/" + bugs[i] + ".png";  
		imageObj.onload = function() {
			load_counter++;
		};       	
		img_obj_array[bugs[i]] = imageObj; 
	}
	
	var the_int = setInterval(function() {
		if (load_counter == 10) {
			Logger("IMAGES PRELOADER FINISHED WITHIN LAST 20 MILLISECONDS");
			clearInterval(the_int);
		}
	}, 20);	
}

function VIEW_drawEmptyGrid() {
	
	VIEW_preloadImages();
	VIEW_setCanvasHexSize();
	VIEW_drawHexGrid();	
	
	function VIEW_preloadImages() {

	}
	
	function VIEW_setCanvasHexSize()
	{
		var width = PIECE_WIDTH; 
		var height = PIECE_HEIGHT; 

		var a = -3.0;
		var b = (-2.0 * width);
		var c = (Math.pow(width, 2)) + (Math.pow(height, 2));
		var z = (-b - Math.sqrt(Math.pow(b,2)-(4.0*a*c)))/(2.0*a);
		
		var x = (width - z)/2.0;
		var y = height/2.0;
		
		HT.Hexagon.Static.WIDTH = width;
		HT.Hexagon.Static.HEIGHT = height;
		HT.Hexagon.Static.SIDE = z;
	}
	
	function VIEW_drawHexGrid()
	{
		var grid_height = BOARD_ROWS * PIECE_HEIGHT; 
		var grid_width = (Math.floor((BOARD_COLUMNS+1)/2) * PIECE_WIDTH) + (Math.floor((BOARD_COLUMNS+1)/2) * PIECE_SIDE) ; 
	
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
	
}

function VIEW_drawPieceOnCanvas(the_hex) {
	x_ind = the_hex.PathCoOrdX;
	y_ind = the_hex.PathCoOrdY;
	//Logger("VIEW: 185 xy = " + x_ind + " " + y_ind);
	var canvas = document.getElementById('hexCanvas');
	var ctx = canvas.getContext('2d');
	the_hex.drawPieceOnCanvas(ctx);	
	
	VIEW_repositionUnplacedPieces();
	
	Logger("VIEW: (192) ADD PIECE TO CANVAS AT [" + x_ind + "," + y_ind + "]");
}

function VIEW_removePieceFromCanvas(the_hex) {
	x_ind = the_hex.PathCoOrdX;
	y_ind = the_hex.PathCoOrdY;
	//Logger("VIEW: (60) x/y" + x_ind + " " + y_ind);
	var canvas = document.getElementById('hexCanvas');
	var ctx = canvas.getContext('2d');
	the_hex.removePieceFromCanvas(ctx);	
	//Logger("VIEW: (202) REMOVE PIECE FROM CANVAS AT [" + x_ind + "," + y_ind + "]");
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
		top: new_point.Y-(PIECE_HEIGHT/2)+CANVAS_BORDER_WIDTH,
		left: new_point.X-(PIECE_WIDTH/2)+CANVAS_BORDER_WIDTH//,
		//background: 'url("pieces/' + new_bg + '")'
	});
	
	var angle = 0;
	piece_rotate_interval = setInterval(function(){
		angle = (angle + 1) % 360;
		document.getElementById(top_piece).style.webkitTransform = "rotate(" + angle + "deg)";
	}, 100);
		
	$("#" + top_piece).show();
	//$(".game_piece").show();
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