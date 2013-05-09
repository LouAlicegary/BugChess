
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
	
	console.log("Hex width: " + width + " height: " + height + " side length: " + z);
}

function drawHexGrid()
{
	var canvas = document.getElementById('hexCanvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;	
	var da_width = $("#hexCanvas").innerWidth();
	var da_height = $("#hexCanvas").innerWidth();
	var grid = new HT.Grid(da_width, da_height);
	var canvas = document.getElementById("hexCanvas");
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, da_width, da_height);
	for(var h in grid.Hexes)
	{
		grid.Hexes[h].draw(ctx);
	}
}

function getHexGridWH()
{
	findHexWithWidthAndHeight();
	drawHexGrid();
}

function updateGrid(thepageX, thepageY)
{
	    var totalOffsetX = 0;
	    var totalOffsetY = 0;
	    var canvasX = 0;
	    var canvasY = 0;
	    var currentElement = document.getElementById("hexCanvas");
	
	    do {
	        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
	        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
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
    	
    	var da_width = $("#hexCanvas").innerWidth();
		var da_height = $("#hexCanvas").innerWidth();
		var grid = new HT.Grid(da_width, da_height);   	
		console.log("CLICKED ON " + grid.GetHexAt(new HT.Point(canvasX, canvasY)).GetID());
		
		var the_hex = grid.GetHexAt(new HT.Point(canvasX, canvasY));
		arr[the_hex.PathCoOrdX][the_hex.PathCoOrdY] = 1;
		
		getHexGridWH();	
}
