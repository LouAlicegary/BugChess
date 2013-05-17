function pageToGridCoords(thepageX, thepageY)
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

function gridToPageCoords(canvasX, canvasY) //receive midpoints of hex
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

function getHexByCoords(thepageX, thepageY)
{
	var real_point = pageToGridCoords(thepageX, thepageY);
	canvasX = real_point.X;
	canvasY = real_point.Y;
	
	var da_width = $("#hexCanvas").innerWidth();
	var da_height = $("#hexCanvas").innerWidth();
	var grid = new HT.Grid(da_width, da_height);   	
	
	return grid.GetHexAt(new HT.Point(canvasX, canvasY));	
}



function clickHandler(event) {

	var clicked_hex = getHexByCoords(event.pageX, event.pageY);
	var hex_contents = GRID_ARRAY[clicked_hex.PathCoOrdX][clicked_hex.PathCoOrdY];
	var new_point = gridToPageCoords(getHexByCoords(event.pageX, event.pageY).MidPoint.X, getHexByCoords(event.pageX, event.pageY).MidPoint.Y);
	
	$("#" + hex_contents).attr('origin', clicked_hex.GetLocation());
	Logger("CLICKED ON " + $('#' + hex_contents).attr('origin') + "hex_contents = " + hex_contents); 

	// IF HEX IS FILLED
	if ( hex_contents != 0) {

		MODEL_removePieceFromArray(clicked_hex.PathCoOrdX, clicked_hex.PathCoOrdY);
		
		VIEW_showDraggablePiece(hex_contents, new_point);
		VIEW_removePieceFromCanvas(clicked_hex);
	}		
}	

function dropFunction( event, ui ) {
      			
	var pos = $(ui.draggable).position();
	var hex_midpoint = new HT.Point(pos.left + 50, pos.top + 40);
	var piece_id = $(ui.draggable).attr("id");
	var origin = $(ui.draggable).attr('origin');
	var the_hex = getHexByCoords(hex_midpoint.X, hex_midpoint.Y);
	var destination_string = the_hex.GetLocation();
	//Logger("DROP FUNCTION: PIECE " + piece_id + " MOVED FROM " + origin + " TO " + destination_string);

	//MODEL
	MODEL_addPieceToArray(destination_string, piece_id);
	MODEL_addMoveToDB(piece_id, destination_string, origin);

	//VIEW
	$(ui.draggable).css({ background: "url('pieces/" + piece_id.substring(0, piece_id.length-1) + ".png')" });
	$(ui.draggable).hide();
	$(ui.draggable).trigger('mouseleave');
	$(ui.draggable).attr('origin', the_hex.GetLocation());  
	
	VIEW_draw_piece_on_canvas(the_hex);
}
