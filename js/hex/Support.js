
function findHexWithWidthAndHeight()
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

function drawHexGrid()
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
/*
	$("#hexCanvas").css({ //moves center of tile to where I clicked
		-webkit-transform: translate3d(-1000px, -1000px, 0px) scale(1)
	});
*/	
	
}

function getHexGridWH()
{
	findHexWithWidthAndHeight();
	drawHexGrid();
}

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
	console.log("canvasX (" + canvasX + ") = event.pageX (" + thepageX + ") - totalOffsetX (" + totalOffsetX + ") - x_scroll (" + x_scroll + ")")
	console.log("canvasY (" + canvasY + ") = event.pageY (" + thepageY + ") - totalOffsetY (" + totalOffsetY + ") - y_scroll (" + y_scroll + ")")
		
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
        console.log(currentElement.offsetLeft + " / " +  currentElement.scrollLeft + " / " + currentElement.offsetTop + " / " +  currentElement.scrollTop)
    }
    while (currentElement = currentElement.offsetParent)

	node = document.getElementById("content");
	var string_array = window.getComputedStyle(node).webkitTransform.split(",");
	var x_scroll = Number(string_array[4]);
	var y_scroll = Number(string_array[5].slice(0, - 1));
    
    var thepageX = totalOffsetX + x_scroll + canvasX;
    var thepageY = totalOffsetY + y_scroll + canvasY; 
    //console.log("Offsets L/T: " + currentElement.offsetLeft + " / " + currentElement.offsetTop + "\nx_scroll: " + x_scroll + ", " + y_scroll + "\nFinal: " + thepageX + ", " + thepageY); 
	//alert("Hex ID: " + grid.GetHexAt(new HT.Point(canvasX, canvasY)).id);
	//console.log("canvasX (" + canvasX + ") = event.pageX (" + thepageX + ") - totalOffsetX (" + totalOffsetX + ") - x_scroll (" + x_scroll + ")")
	//console.log("canvasY (" + canvasY + ") = event.pageY (" + thepageY + ") - totalOffsetY (" + totalOffsetY + ") - y_scroll (" + y_scroll + ")")
		
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
	console.log("CLICKED ON " + grid.GetHexAt(new HT.Point(canvasX, canvasY)).GetID());
	
	return grid.GetHexAt(new HT.Point(canvasX, canvasY));	
}

function updateGrid(thepageX, thepageY, theui)
{
	var the_hex = getHexByCoords(thepageX, thepageY);
	var stack_string = arr[the_hex.PathCoOrdX][the_hex.PathCoOrdY];
	//MODEL
	if (stack_string) {
		arr[the_hex.PathCoOrdX][the_hex.PathCoOrdY] += "," + $(theui.draggable).attr('id');
	}
	else {
		arr[the_hex.PathCoOrdX][the_hex.PathCoOrdY] = $(theui.draggable).attr('id');
	}
		
	getHexGridWH();	
	
	var the_string = the_hex.PathCoOrdX + "," + the_hex.PathCoOrdY;
	return the_string;
}

function removePieceFromGrid(thepageX, thepageY) 
{
	var the_hex = getHexByCoords(thepageX, thepageY);
	var old_value = arr[the_hex.PathCoOrdX][the_hex.PathCoOrdY];
	var piece_stack = old_value.split(",");
	var stack_string = "";
	//MODEL
	if (piece_stack.length > 1) {
		for (i=0; i<piece_stack.length-1; i++) {
			stack_string += piece_stack[i] + ","; 
		}
		stack_string = stack_string.substring(0, (stack_string.length)-1);
		arr[the_hex.PathCoOrdX][the_hex.PathCoOrdY] = stack_string;
	}
	else {
		arr[the_hex.PathCoOrdX][the_hex.PathCoOrdY] = 0;
	}
		
	getHexGridWH();	
}
