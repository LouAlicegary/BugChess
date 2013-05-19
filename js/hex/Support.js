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
	var y_scroll = string_array[5].slice(0, - 1);
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
	var y_scroll = Number(string_array[5].slice(0, - 1));
    
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



function clickOnCanvas(event) {

	var clicked_hex = SUPPORT_getHexByWindowCoords(event.pageX, event.pageY);
	
	// IF ACTUAL HEX IS CLICKED AND NOT BLANK SPACE
	if (clicked_hex) {
		var hex_contents = GRID_ARRAY[clicked_hex.PathCoOrdX][clicked_hex.PathCoOrdY];
		var hex_midpoint = SUPPORT_gridToPageCoords(clicked_hex.MidPoint.X, clicked_hex.MidPoint.Y);		
		var this_piece;
		// IF HEX IS FILLED
		if ( hex_contents != 0) {
			var hex_array = hex_contents.split(",");
			if (hex_array.length > 1) {
				this_piece = hex_array[hex_array.length-1];
			}
			else {
				this_piece = hex_array[0];
			}
			$("#" + this_piece).attr('origin', clicked_hex.GetXYLocation());
			//Logger("SUPPORT: (95) origin = " + $('#' + hex_contents).attr('origin') + " hex_contents = " + hex_contents + " hex_mid = " + hex_midpoint); 
			
			VIEW_removePieceFromCanvas(clicked_hex);
			VIEW_showDraggablePiece(this_piece, hex_midpoint);
		}	
	}	
}	

function dropFunction( event, ui ) {  			
	//Logger("DROP");
	clearInterval(piece_rotate_interval);
	
	var pos = $(ui.draggable).position();
	var piece_id = $(ui.draggable).attr("id");
	var origin = $(ui.draggable).attr('origin');	
	var hex_midpoint = new HT.Point(pos.left + (PIECE_WIDTH/2), pos.top + (PIECE_HEIGHT/2));
	var the_hex = SUPPORT_getHexByWindowCoords(hex_midpoint.X, hex_midpoint.Y);
	var grid = new HT.Grid($("#hexCanvas").width(), $("#hexCanvas").height());
	//Logger("DROP FUNCTION" + the_hex.GetXYLocation());		
	$(ui.draggable).trigger('mouseleave');
	$(ui.draggable).css({ background: "url('pieces/" + piece_id.substring(0, piece_id.length-1) + ".png')" });
				
	if (the_hex) { // IF DROPPED ON AN ACTUAL HEX ON GRID
		
		if (the_hex.GetXYLocation() == origin) { // IF PIECE HASN'T MOVED
			$(ui.draggable).hide();		
			var the_hex = grid.GetHexByXYIndex(origin);
			VIEW_drawPieceOnCanvas(the_hex);
		}
		else { // IF PIECE MOVEMENT IS LEGITIMATE
			//MODEL
			var dest = the_hex.GetXYLocation();
			if (origin) 
				MODEL_removePieceFromArray(origin);
				//Logger("SUPPORT: (133) SHOULD BE ADDING PIECE TO ARRAY HERE");
			MODEL_addPieceToArray(dest, piece_id);
			MODEL_addMoveToDB(piece_id, dest, origin);
			//VIEW
			$(ui.draggable).hide();
			$(ui.draggable).attr('origin', the_hex.GetXYLocation());  
			VIEW_drawPieceOnCanvas(the_hex);			
		}
		
	}
	else if (origin) { // IF DROPPED FROM BOARD TO BLANK SPACE ON EDGE OF CANVAS
		$(ui.draggable).hide();		
		var the_hex = grid.GetHexByXYIndex(origin);
		VIEW_drawPieceOnCanvas(the_hex);	
	}	

	VIEW_repositionUnplacedPieces();

}

