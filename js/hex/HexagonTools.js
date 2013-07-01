var HT = HT || {}; // FIRST TIME HT IS REFERENCED, A NEW OBJECT IS CREATED. AFTERWARD, SAME OBJECT USED.

/**
 * A Point is simply x and y coordinates
 * @constructor
 */
HT.Point = function(x, y) {
	this.X = x;
	this.Y = y;
};

/**
 * A Rectangle is x and y origin and width and height
 * @constructor
 */
HT.Rectangle = function(x, y, width, height) {
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
};

/**
 * A Line is x and y start and x and y end
 * @constructor
 */
HT.Line = function(x1, y1, x2, y2) {
	this.X1 = x1;
	this.Y1 = y1;
	this.X2 = x2;
	this.Y2 = y2;
};

/**
 * A Hexagon is a 6 sided polygon, our hexes don't have to be symmetrical, i.e. ratio of width to height could be 4 to 3
 * @constructor
 */
HT.Hexagon = function(id, x, y) {
	
	var x1 = (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE)/2;
	var y1 = (HT.Hexagon.Static.HEIGHT / 2);
	
	this.Points = [];//Polygon Base
	this.Points.push(new HT.Point(x1 + x, y));
	this.Points.push(new HT.Point(x1 + HT.Hexagon.Static.SIDE + x, y));
	this.Points.push(new HT.Point(HT.Hexagon.Static.WIDTH + x, y1 + y));
	this.Points.push(new HT.Point(x1 + HT.Hexagon.Static.SIDE + x, HT.Hexagon.Static.HEIGHT + y));
	this.Points.push(new HT.Point(x1 + x, HT.Hexagon.Static.HEIGHT + y));
	this.Points.push(new HT.Point(x, y1 + y));
	
	this.Id = id;
	
	this.x = x; // upper left
	this.y = y; // upper left
	this.x1 = x1; // midpoint
	this.y1 = y1; // midpoint
	
	this.TopLeftPoint = new HT.Point(this.x, this.y);
	this.BottomRightPoint = new HT.Point(this.x + HT.Hexagon.Static.WIDTH, this.y + HT.Hexagon.Static.HEIGHT);
	this.MidPoint = new HT.Point(this.x + (HT.Hexagon.Static.WIDTH / 2), this.y + (HT.Hexagon.Static.HEIGHT / 2));
	
	this.P1 = new HT.Point(x + x1, y + y1);
	
	this.selected = false;

};
	
/**
 * draws this Hexagon to the canvas
 * @this {HT.Hexagon}
 */
HT.Hexagon.prototype.draw = function(ctx) {

	if(!this.selected)
		ctx.strokeStyle = "grey";
	else
		ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(this.Points[0].X, this.Points[0].Y);
	for(var i = 1; i < this.Points.length; i++)
	{
		var p = this.Points[i];
		ctx.lineTo(p.X, p.Y);
	}
	ctx.closePath();
	ctx.stroke();
	
	
	// draw co-ordinates (3, 6), (5, 9), etc
	if (this.PathCoOrdX !== null && this.PathCoOrdY !== null && typeof(this.PathCoOrdX) != "undefined" && typeof(this.PathCoOrdY) != "undefined")
	{
		ctx.fillStyle = "red";
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText("(" + this.PathCoOrdX + "," + this.PathCoOrdY + ")", this.MidPoint.X, this.MidPoint.Y);
	}
	
};

/**
 * draws this Hexagon to the canvas
 * @this {HT.Hexagon}
 */
HT.Hexagon.prototype.drawPieceOnCanvas = function(ctx, in_width, in_height) {
		var location = this.PathCoOrdX + "," + this.PathCoOrdY;
		top_piece = MODEL_GRIDARRAY_getTopPieceAtLocation(location, MODEL_GRIDARRAY_getGridArray()); //piece_stack[piece_stack.length-1];
   		var midPoint = this.MidPoint;
   		if (top_piece != "") {
            ctx.drawImage(IMG_OBJ_ARRAY[top_piece.substring(0, top_piece.length-1)], midPoint.X-(in_width/2), midPoint.Y-(in_height/2), in_width, in_height);      		    
   		}
   		else {
            ctx.strokeStyle = "grey";
            ctx.fillStyle = "white";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.Points[0].X, this.Points[0].Y);
            for (var i = 1; i < this.Points.length; i++) {
                var p = this.Points[i];
                ctx.lineTo(p.X, p.Y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();       
        
            ctx.fillStyle = "red";
            ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            ctx.fillText("(" + this.PathCoOrdX + "," + this.PathCoOrdY + ")", this.MidPoint.X, this.MidPoint.Y);       		    
   		}
};

/**
 * draws this Hexagon to the canvas
 * @this {HT.Hexagon}
 */
HT.Hexagon.prototype.removePieceFromCanvas = function(ctx, in_width, in_height) {

    var grid_array = MODEL_GRIDARRAY_getGridArray();
    var array_val = grid_array[this.PathCoOrdX][this.PathCoOrdY];
	
	if ( array_val.indexOf(",") != -1) { // fill hexagon in canvas if another piece exists there
		
		var piece_stack = array_val.split(",");
					
		for (var i=0; i<piece_stack.length; i++) {
			$("#" + piece_stack[i]).hide();
		}
		
		top_piece = piece_stack[piece_stack.length-2];

   		var midPoint = this.MidPoint;
   		var imageObj = new Image();
   		imageObj.src = "pieces/" + top_piece.substring(0, top_piece.length-1) + ".png";
		imageObj.onload = function() {
        	ctx.drawImage(imageObj, midPoint.X-(in_width/2), midPoint.Y-(in_height/2));
      	};
      	
	}
	else { // draw co-ordinates (3, 6), (5, 9), etc
		ctx.strokeStyle = "grey";
		ctx.fillStyle = "white";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(this.Points[0].X, this.Points[0].Y);
		for(var i = 1; i < this.Points.length; i++)
		{
			var p = this.Points[i];
			ctx.lineTo(p.X, p.Y);
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();		

		ctx.fillStyle = "red";
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		ctx.fillText("(" + this.PathCoOrdX + "," + this.PathCoOrdY + ")", this.MidPoint.X, this.MidPoint.Y);	
	}
};

HT.Hexagon.prototype.drawEmptyHexOnCanvas = function(ctx) {

};

/**
 * Returns true if the x,y coordinates are inside this hexagon
 * @this {HT.Hexagon}
 * @return {boolean}
 */
HT.Hexagon.prototype.isInBounds = function(x, y) {
	return this.Contains(new HT.Point(x, y));
};
	
/**
 * Returns true if the point is inside this hexagon, it is a quick contains
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {boolean}
 */
HT.Hexagon.prototype.isInHexBounds = function(/*Point*/ p) {
	if(this.TopLeftPoint.X < p.X && this.TopLeftPoint.Y < p.Y &&
	   p.X < this.BottomRightPoint.X && p.Y < this.BottomRightPoint.Y)
		return true;
	return false;
};

/**
 * Returns true if the point is inside this hexagon, it first uses the quick isInHexBounds contains, then check the boundaries
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {boolean}
 */
HT.Hexagon.prototype.Contains = function(/*Point*/ p) {
	var isIn = false;
	if (this.isInHexBounds(p))
	{
		//turn our absolute point into a relative point for comparing with the polygon's points
		//var pRel = new HT.Point(p.X - this.x, p.Y - this.y);
		var i, j = 0;
		for (i = 0, j = this.Points.length - 1; i < this.Points.length; j = i++)
		{
			var iP = this.Points[i];
			var jP = this.Points[j];
			if ( ( ((iP.Y <= p.Y) && (p.Y < jP.Y)) || ((jP.Y <= p.Y) && (p.Y < iP.Y)) ) && (p.X < (jP.X - iP.X) * (p.Y - iP.Y) / (jP.Y - iP.Y) + iP.X) )
			{
				isIn = !isIn;
			}
		}
	}
	return isIn;
};

/**
 * 
 */
HT.Hexagon.prototype.GetID = function() {
	return this.Id;
}

/**
 * 
 * @return  {String}
 *          Returns a string representing the location in "8,9" format
 */
HT.Hexagon.prototype.GetXYLocation = function() {
	var x_coord = this.PathCoOrdX;
	var y_coord = this.PathCoOrdY;
	var the_string = x_coord + "," + y_coord;
	return the_string;
}

/**
 * 
 */
HT.Hexagon.Orientation = {
	Normal: 0,
	Rotated: 1
};

/**
 * 
 */
HT.Hexagon.Static = {
	// THIS GETS SET DYNAMICALLY IN VIEW
	HEIGHT:91.14378277661477, 
	WIDTH:91.14378277661477, 
	SIDE:50.0, 
	ORIENTATION:HT.Hexagon.Orientation.Normal, 
	DRAWSTATS: false
};


