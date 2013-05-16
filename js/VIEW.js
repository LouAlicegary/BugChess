
function VIEW_setHexSize()
{
	var width = 100; //parseFloat(document.getElementById("hexWidth").value);
	var height = 80; //parseFloat(document.getElementById("hexHeight").value);
	var y = height/2.0;
	//solve quadratic
	var a = -3.0;
	var b = (-2.0 * width);
	var c = (Math.pow(width, 2)) + (Math.pow(height, 2));
	var z = (-b - Math.sqrt(Math.pow(b,2)-(4.0*a*c)))/(2.0*a);
	var x = (width - z)/2.0;
	
	HT.Hexagon.Static.WIDTH = width;
	HT.Hexagon.Static.HEIGHT = height;
	HT.Hexagon.Static.SIDE = z;
	
	//console.log("Hex width: " + width + " height: " + height + " side length: " + z);
}

function VIEW_drawHexGrid()
{
	var canvas = document.getElementById('hexCanvas');
	canvas.width = 2500; //window.innerWidth;
	canvas.height = 2000; //window.innerHeight;	
	var da_width = $("#hexCanvas").innerWidth();
	var da_height = $("#hexCanvas").innerWidth();
	var grid = new HT.Grid(da_width, da_height);
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, da_width, da_height);
	for(var h in grid.Hexes)
	{
		grid.Hexes[h].draw(ctx);
	}	
}

function getHexGridWH()
{
	//console.log(timestamp() + "GRID REDRAW START");
	Logger("VIEW: (37) getHexGridWH() GRID REDRAW");
	VIEW_setHexSize();
	VIEW_drawHexGrid();
	//Logger("GRID REDRAW END");
}

function VIEW_draw_empty_grid() {
	Logger("VIEW: DRAW EMPTY GRID");
	VIEW_setHexSize();
	VIEW_drawHexGrid();
	//Logger("DRAW EMPTY GRID END");	
}

function VIEW_draw_piece_on_canvas(the_hex) {
	x_ind = the_hex.PathCoOrdX;
	y_ind = the_hex.PathCoOrdY;
	var canvas = document.getElementById('hexCanvas');
	var ctx = canvas.getContext('2d');
	the_hex.drawPieceOnCanvas(ctx);	
	Logger("VIEW: (59) DRAW PIECE ON CANVAS AT " + x_ind + "," + y_ind);
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
	//Logger("VIEW: (77) Draggable ID = " + top_piece + " / BG of Draggable = " + new_bg );
	$("#" + top_piece).css({ // CENTERS TILE OVER HEX. 35/45 vs 40/50 BECAUSE OF 5PX CANVAS DIV BORDER
		top: new_point.Y-35,
		left: new_point.X-45,
		background: 'url("pieces/' + new_bg + '")'
	});
	
	$("#" + top_piece).show();
}

function VIEW_initGamePieces() {
	$(".game_piece").each(function(i, obj) {
		y_offset = (i % 11) * 40 + 100;
		x_offset = Math.floor(i / 11) * (.9 * window.innerWidth) + (((window.innerWidth/10)-100)/2);
		$('#' + obj.getAttribute('id')).css({
			'top': y_offset,
			'left': x_offset,
			'z-index': i+2
		})
	});	

    // THIS SECTION FLOATS HOVERED-OVER PIECE TO TOP OF Z STACK
    var zdex = 0;
    
    $(".game_piece").mouseenter(function(){
    	zdex = $(this).css('zIndex');
		$(this).css({'z-index': 50}); 
	});
	
	$(".game_piece").mouseleave(function(){
		$(this).css({'z-index': zdex});
	});	   		
	
}
