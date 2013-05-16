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
	//alert("Hex ID: " + grid.GetHexAt(new HT.Point(canvasX, canvasY)).id);
	//console.log("canvasX (" + canvasX + ") = event.pageX (" + thepageX + ") - totalOffsetX (" + totalOffsetX + ") - x_scroll (" + x_scroll + ")")
	//console.log("canvasY (" + canvasY + ") = event.pageY (" + thepageY + ") - totalOffsetY (" + totalOffsetY + ") - y_scroll (" + y_scroll + ")")
		
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
	// GET CLICKED HEX
	Logger("*---------------------------------------------------------");
	var clicked_hex = getHexByCoords(event.pageX, event.pageY);
	var arr_value = GRID_ARRAY[clicked_hex.PathCoOrdX][clicked_hex.PathCoOrdY];
	var new_point = gridToPageCoords(getHexByCoords(event.pageX, event.pageY).MidPoint.X, getHexByCoords(event.pageX, event.pageY).MidPoint.Y);
	
	$("#" + arr_value).attr('origin', clicked_hex.GetLocation());
	Logger("CLICKED ON " + $('#' + arr_value).attr('origin') + "arr_value = " + arr_value); 

	// IF HEX IS FILLED
	if ( arr_value != 0) {

		//MODEL_removePieceFromGrid(event.pageX, event.pageY);
		MODEL_removePieceFromGrid(clicked_hex.PathCoOrdX, clicked_hex.PathCoOrdY);
		
		VIEW_showDraggablePiece(arr_value, new_point);
		VIEW_removePieceFromCanvas(clicked_hex);
	}		
}	