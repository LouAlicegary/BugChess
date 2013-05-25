// USED ONLY IN SUPPORT_getHexByWindowCoords
function SUPPORT_pageToGridCoords(thepageX, thepageY)
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

// USED ONLY IN CLICK HANDLER FUNCTION
function SUPPORT_gridToPageCoords(canvasX, canvasY) //receive midpoints of hex
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

// USED IN CLICK AND DROP EVENTS
function SUPPORT_getHexByWindowCoords(thepageX, thepageY)
{	
	var grid = new HT.Grid($("#hexCanvas").width(), $("#hexCanvas").height());   	
	
	var real_point = SUPPORT_pageToGridCoords(thepageX, thepageY);
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

function SUPPORT_getHexSideFromWH(width, height) {
	var a = -3.0;
	var b = (-2.0 * width);
	var c = (Math.pow(width, 2)) + (Math.pow(height, 2));
	return (-b - Math.sqrt(Math.pow(b,2)-(4.0*a*c)))/(2.0*a);	
}

// TODO: THIS SHOULD BE BUILT OUT AND USED IN SEEDING BOARD AS WELL FOR CONSISTENCY
var bugs = Array("white_ant", "white_grasshopper", "white_spider", "white_beetle", "white_bee", "black_ant", "black_grasshopper", "black_spider", "black_beetle", "black_bee");
var load_counter = 0;
var img_obj_array = Array(); // referenced as var in HT 130

function VIEW_drawEmptyGrid() {
	
	VIEW_preloadImages();
	VIEW_setCanvasHexSize();
	VIEW_drawHexGrid();	
	
	function VIEW_preloadImages() {	
		//Logger("IMAGE PRELOADER STARTED");
		
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
				//Logger("IMAGES PRELOADER FINISHED WITHIN LAST 20 MILLISECONDS");
				clearInterval(the_int);
			}
		}, 20);	
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
