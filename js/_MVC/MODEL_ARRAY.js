var GRID_ARRAY = Array();

for (var x = 0; x < 50; x++) {
    GRID_ARRAY[x] = Array();    
    for(var y = 0; y < 50; y++) { 
        GRID_ARRAY[x][y] = 0;    
    }    
}   

/**
 * Insert function description here. 
 * @param   {String} h1
 * @param   {String} h2
 */
function MODEL_addPieceToArray(destination_string, piece_id)
{
    destination_array = destination_string.split(",");
    x_ind = destination_array[0];
    y_ind = destination_array[1];
    
    if (GRID_ARRAY[x_ind][y_ind])
        GRID_ARRAY[x_ind][y_ind] += "," + piece_id;
    else
        GRID_ARRAY[x_ind][y_ind] = piece_id;
    
    NUM_MOVES++;
    
    //Logger("MODEL: (21) ADD " + piece_id + " TO ARRAY AT [" + x_ind + "," + y_ind + "] (cell value = " + GRID_ARRAY[x_ind][y_ind] + ")");
}
    
/**
 * Removes top piece from cell in GRID_ARRAY.
 * @param   {String} source_point
 *          String in "x,y" format containing grid location to remove top piece from.
 */
function MODEL_removePieceFromArray(source_point)
{
    var x_ind = source_point.substring(0, source_point.indexOf(","));
    var y_ind = source_point.substring(source_point.indexOf(",")+1);
    //Logger("MODEL: (42) val = " + x_ind + " " + y_ind);//GRID_ARRAY[x_ind][y_ind]);
    var old_value = GRID_ARRAY[x_ind][y_ind]; 
    var piece_stack = old_value.split(",");
    var stack_string = "";
    
    if (piece_stack.length > 1) {
        for (var i=0; i<piece_stack.length-1; i++) {
            stack_string += piece_stack[i] + ","; 
        }
        stack_string = stack_string.substring(0, (stack_string.length)-1);
        GRID_ARRAY[x_ind][y_ind] = stack_string;
    }
    else {
        GRID_ARRAY[x_ind][y_ind] = 0;
    }
        
    //Logger("MODEL: (60) REMOVE " + piece_stack[piece_stack.length-1] + " FROM ARRAY AT [" + x_ind + "," + y_ind + "] (cell value = " + GRID_ARRAY[x_ind][y_ind] + ")");
}

/**
 * Insert function description here. 
 */
function MODEL_eraseGameFromArray() {
    for (var i=0; i < GRID_ARRAY.length; i++) {
        for (var j=0; j < GRID_ARRAY[i].length; j++) {
            GRID_ARRAY[i][j] = 0;
        }
    }
    NUM_MOVES = 0;
}

/**
 * Removes the top piece from cell in the array being passed.
 * @param   {Array} the_array 
 *          Array containing board.
 * @param   {int} origin_x 
 *          X Value of grid location
 * @param   {int} origin_y 
 *          Y value of grid location
 */
function removeTopPieceFromArrayCell(the_array, origin_x, origin_y) {
    origin_x = parseInt(origin_x);
    origin_y = parseInt(origin_y);
    var temp_string = the_array[origin_x][origin_y];

    if (temp_string.indexOf(",") != -1) {
        the_array[origin_x][origin_y] = temp_string.substring(0,temp_string.lastIndexOf(","));
    }
    else {
        the_array[origin_x][origin_y] = 0;
    }

}

/**
 * Gets top piece in the global GRID_ARRAY
 * @param {int} x_val 
 * X value of grid location
 * @param {int} y_val 
 * Y value of grid location
 * @return {String}
 * The piece id of the top piece from cell in GRID_ARRAY 
 */
function getTopPieceInArray(x_val, y_val) {
    x_val = parseInt(x_val);
    y_val = parseInt(y_val);
    var cell = GRID_ARRAY[x_val][y_val];
    var top_piece;
    var comma;
    if (cell) {
        comma = cell.indexOf(",");
        if (comma == -1) { // ONLY ONE PIECE IN CELL
            top_piece = cell;
        }
        else { // 2+ PIECES IN CELL
            top_piece = cell.substring(cell.lastIndexOf(",")+1);
        }
    }
    else {
        top_piece = "";
    }
    
    return top_piece;
}

/**
 * Makes a copy of an array (Arrays in JS copy by address, not value)
 * @param   {Array} obj
 *          Some array that you want to make a copy of.
 * @return  {Array} 
 *          An exact value-by-value copy of the array that was passed into the function.
 */
function arrayCloner(obj) {
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = arrayCloner(obj[key]);
    
    return temp;
}

/**
 * Copies array values into a visually appealing string. 
 * @param   {Array} in_array
 *          An array that you want to print out.
 */
function printNiceArray(in_array) {
    var out_string = "";
    for (var i=0; i < in_array.length; i++) {
        out_string += "[" + in_array[i] + "] ";
    }
    return out_string;
}
