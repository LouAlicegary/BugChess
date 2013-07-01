

/**
 * USED ONLY IN VIEW_SUPPORT_getHexByWindowCoords
 * @param {Object} thepageX
 * @param {Object} thepageY
 */
function VIEW_SUPPORT_pageToGridCoords(thepageX, thepageY)
{
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = document.getElementById("hexCanvas");

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        //console.log(currentElement.offsetLeft + " / " +  currentElement.scrollLeft + " / " + currentElement.offsetTop + " / " +  currentElement.scrollTop)
    }
    while (currentElement = currentElement.offsetParent)

	// THIS PART DETERMINES THE X AND Y SCROLL VALUES 
	// FROM style="-webkit-transform-origin: 0% 0%; -webkit-transform: translate3d(-188px, -217px, 0px) scale(1);"
	node = document.getElementById("content");
	var string_array = window.getComputedStyle(node).webkitTransform.split(",");
	var x_scroll = string_array[4];
	var y_scroll = string_array[5].slice(0, - 1); // cuts everything but last element / char in string_array[5]
    canvasX = thepageX - totalOffsetX - x_scroll;
    canvasY = thepageY - totalOffsetY - y_scroll;   

	var new_point = new HT.Point(canvasX, canvasY);
	return new_point;
}

/**
 * USED ONLY IN CLICK HANDLER FUNCTION
 * @param   {Object} canvasX
 *          X-value of hex midpoint
 * @param   {Object} canvasY
 *          Y-value pf hex midpoint
 */
function VIEW_SUPPORT_gridToPageCoords(canvasX, canvasY)
{
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var currentElement = document.getElementById("hexCanvas");

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
   	}
    while (currentElement = currentElement.offsetParent)

	var node = document.getElementById("content");
	var string_array = window.getComputedStyle(node).webkitTransform.split(",");
	var x_scroll = Number(string_array[4]);
	var y_scroll = Number(string_array[5].slice(0, - 1)); // cuts everything but last element / char in string_array[5]
    
    var thepageX = totalOffsetX + x_scroll + canvasX;
    var thepageY = totalOffsetY + y_scroll + canvasY; 
	
	var new_point = new HT.Point(thepageX, thepageY);
	return new_point;	
}

/**
 * USED IN CLICK AND DROP EVENTS
 * @param {Object} thepageX
 * @param {Object} thepageY
 */
function VIEW_SUPPORT_getHexByWindowCoords(thepageX, thepageY)
{	
	var grid = new HT.Grid($("#hexCanvas").width(), $("#hexCanvas").height());   	
	
	var real_point = VIEW_SUPPORT_pageToGridCoords(thepageX, thepageY);
	canvasX = real_point.X;
	canvasY = real_point.Y; 	
	
	var the_hex = grid.GetHexAt(new HT.Point(canvasX, canvasY));
	
	var max_array = grid.GetMaxXY(); 
	
	if (the_hex) {
		if ( (the_hex.PathCoOrdX <= max_array[0]) && (the_hex.PathCoOrdY <= max_array[1]) )
			return the_hex;
		else
			return 0;		
	}	
	else {
		return 0;
	}
}

/**
 * 
 * @param {Object} width
 * @param {Object} height
 */
function VIEW_SUPPORT_getHexSideFromWH(width, height) {
	var a = -3.0;
	var b = (-2.0 * width);
	var c = (Math.pow(width, 2)) + (Math.pow(height, 2));
	return (-b - Math.sqrt(Math.pow(b,2)-(4.0*a*c)))/(2.0*a);	
}

/**
 * TODO: THIS SHOULD BE BUILT OUT AND USED IN SEEDING BOARD AS WELL FOR CONSISTENCY
 */
function VIEW_SUPPORT_drawEmptyGrid() {

    var BOARD_COLUMNS = 30; 
    var BOARD_ROWS = 20;
    
	
	VIEW_SUPPORT_preloadImages();
	VIEW_SUPPORT_setCanvasHexSize();
	VIEW_SUPPORT_drawHexGrid();	
	
	function VIEW_SUPPORT_preloadImages() {	
		//TODO: We should build the below using global variables programmatically
		var bugs_array = Array("white_ant", "white_grasshopper", "white_spider", "white_beetle", "white_bee", "black_ant", "black_grasshopper", "black_spider", "black_beetle", "black_bee");
        
        PIECE_IMG_FILE_LOAD_COUNTER = 0;
        IMG_OBJ_ARRAY = new Array();
        
        for (var i=0; i < bugs_array.length; i++) {
			var imageObj = new Image();
			imageObj.src = "pieces/" + bugs_array[i] + ".png";  
			imageObj.onload = function() {
				PIECE_IMG_FILE_LOAD_COUNTER++;
			};       	
			IMG_OBJ_ARRAY[bugs_array[i]] = imageObj; 
        }
		
		var the_int = setInterval(function() {
			if (PIECE_IMG_FILE_LOAD_COUNTER == 10) {
				clearInterval(the_int);
			}
		}, 20);	
    }
	
	function VIEW_SUPPORT_setCanvasHexSize() {
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
	
	function VIEW_SUPPORT_drawHexGrid() {
		var grid_height = BOARD_ROWS * PIECE_HEIGHT; 
		var grid_width = (Math.floor((BOARD_COLUMNS+1)/2) * PIECE_WIDTH) + (Math.floor((BOARD_COLUMNS+1)/2) * HT.Hexagon.Static.SIDE) ; 
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

/**
 * 
 */
function VIEW_SUPPORT_redrawHexGrid(in_grid_array) {
    var unplayed_white = $('[class*=" white"]:visible').length;
    var unplayed_black = $('[class*=" black"]:visible').length;
    PIECE_HEIGHT = $(".game_piece").height();
    PIECE_WIDTH = $(".game_piece").width();    
    VIEW_SUPPORT_drawEmptyGrid();
    var da_width = $("#hexCanvas").innerWidth();
    var da_height = $("#hexCanvas").innerWidth();
    var grid = new HT.Grid(da_width, da_height);
    var the_piece;
    var destination;
    var grid_array = MODEL_GRIDARRAY_getGridArray();
    
    for (var i=0; i < in_grid_array.length; i++) {
        for (var j=0; j < in_grid_array[0].length; j++) {
            if (in_grid_array[i][j] != 0) {
                destination = i + "," + j; 
                VIEW_drawPieceOnCanvas(grid.GetHexByXYIndex(destination));
            }
        }
    }    
    
}  

function VIEW_SUPPORT_scrollToOrigin() {
    // set view to view origin
    var grid = new HT.Grid(da_width, da_height);
    var the_hex = grid.GetHexByXYIndex(HIVE_ORIGIN);
    var box_y = the_hex.MidPoint.Y - $('#container').height()/2;
    var box_x = the_hex.MidPoint.X - $('#container').width()/2;
    the_scroller.scroller.scrollTo(box_x, box_y, false, 1); //the_scroller is declared in EasyScroller.js    
}
