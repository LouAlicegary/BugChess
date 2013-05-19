/**
 * A Grid is the model of the playfield containing hexes
 * @constructor
 */
HT.Grid = function(/*double*/ width, /*double*/ height) {
	
	this.Hexes = [];
	//setup a dictionary for use later for assigning the X or Y CoOrd (depending on Orientation)
	var HexagonsByXOrYCoOrd = {}; //Dictionary<int, List<Hexagon>>

	var row = 0;
	var y = 0.0;
	
	while (y + HT.Hexagon.Static.HEIGHT <= height)
	{
		var col = 0;
		var offset = 0.0;
		
		if (row % 2 == 1)
		{
			offset = (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE)/2 + HT.Hexagon.Static.SIDE;
			col = 1;
		}
		
		var x = offset;
		
		while (x + HT.Hexagon.Static.WIDTH <= width)
		{
		    var hexId = this.GetHexId(row, col);
			var h = new HT.Hexagon(hexId, x, y);
			var pathCoOrd = col;
			
			h.PathCoOrdX = col;
			this.Hexes.push(h);
			
			if (!HexagonsByXOrYCoOrd[pathCoOrd])
				HexagonsByXOrYCoOrd[pathCoOrd] = [];
				
			HexagonsByXOrYCoOrd[pathCoOrd].push(h);

			col+=2;
			
			x += HT.Hexagon.Static.WIDTH + HT.Hexagon.Static.SIDE;
		}
		
		row++;
		
		y += HT.Hexagon.Static.HEIGHT / 2;
	}

	//finally go through our list of hexagons by their x co-ordinate to assign the y co-ordinate
	for (var coOrd1 in HexagonsByXOrYCoOrd)
	{
		var hexagonsByXOrY = HexagonsByXOrYCoOrd[coOrd1];
		var coOrd2 = Math.floor(coOrd1 / 2) + (coOrd1 % 2);
		for (var i in hexagonsByXOrY)
		{
			var h = hexagonsByXOrY[i];//Hexagon
			h.PathCoOrdY = coOrd2++;
		}
	}
};

HT.Grid.Static = {Letters:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'};

HT.Grid.prototype.GetHexId = function(row, col) {
	var letterIndex = row;
	var letters = "";
	while(letterIndex > 25)
	{
		letters = HT.Grid.Static.Letters[letterIndex%26] + letters;
		letterIndex -= 26;
	}
		
	return HT.Grid.Static.Letters[letterIndex] + letters + (col + 1);
};

/**
 * Returns a hex at a given point
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetHexAt = function(/*Point*/ p) {
	//find the hex that contains this point
	for (var h in this.Hexes)
	{
		if (this.Hexes[h].Contains(p))
		{
			return this.Hexes[h];
		}
	}

	return null;
};

/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {number}
 */
HT.Grid.prototype.GetHexDistance = function(/*Hexagon*/ h1, /*Hexagon*/ h2) {
	//a good explanation of this calc can be found here:
	//http://playtechs.blogspot.com/2007/04/hex-grids.html
	var deltaX = h1.PathCoOrdX - h2.PathCoOrdX;
	var deltaY = h1.PathCoOrdY - h2.PathCoOrdY;
	return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);
};

/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetHexById = function(id) {
	for(var i in this.Hexes)
	{
		if(this.Hexes[i].Id == id)
		{
			return this.Hexes[i];
		}
	}
	return null;
};

/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetHexByXYIndex = function(xy_string) {
	xy_array = xy_string.split(",");
	for(var i in this.Hexes)
	{
		if(this.Hexes[i].PathCoOrdX == xy_array[0] && this.Hexes[i].PathCoOrdY == xy_array[1])
		{
			return this.Hexes[i];
		}
	}
	return null;
};


/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetMaxXY = function() {
	var max_col = 0;
	var max_row = 0;
	
	for(var i in this.Hexes)
	{
		if ( this.Hexes[i].PathCoOrdX > max_col) 
			max_col = this.Hexes[i].PathCoOrdX;
		if ( this.Hexes[i].PathCoOrdY > max_row) 
			max_row = this.Hexes[i].PathCoOrdY;
	}
	
	return new Array(max_col, max_row);
};
