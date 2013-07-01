//TODO: Fold all of the functions into generic calls except for getGridArray()

var GRID_ARRAY;

function MODEL_GRIDARRAY_initialize() {
    GRID_ARRAY = new Array();    
    for (var x = 0; x < 50; x++) {
        GRID_ARRAY[x] = new Array();    
        for(var y = 0; y < 50; y++) { 
            GRID_ARRAY[x][y] = "";    
        }    
    }    
}
   
/**
 * Returns cloned version of the GRID_ARRAY (so real GRID_ARRAY can't be edited)
 */
function MODEL_GRIDARRAY_getGridArray() {
    return arrayCloner(GRID_ARRAY);
}
/**
 * Insert function description here. 
 * @param   {String} h1
 * @param   {String} h2
 */
function MODEL_GRIDARRAY_addPiece(destination_string, piece_id)
{
    destination_array = destination_string.split(",");
    x_ind = destination_array[0];
    y_ind = destination_array[1];
    
    if (GRID_ARRAY[x_ind][y_ind])
        GRID_ARRAY[x_ind][y_ind] += "," + piece_id;
    else
        GRID_ARRAY[x_ind][y_ind] = piece_id;
    
    NUM_MOVES++;
    }
    
/**
 * Removes top piece from cell in GRID_ARRAY.
 * @param   {String} source_point
 *          String in "x,y" format containing grid location to remove top piece from.
 */
function MODEL_GRIDARRAY_removePiece(source_point)
{
    var x_ind = source_point.substring(0, source_point.indexOf(","));
    var y_ind = source_point.substring(source_point.indexOf(",")+1);
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
        GRID_ARRAY[x_ind][y_ind] = "";
    }
}

/**
 * Insert function description here. 
 */
function MODEL_eraseGameFromGridArray() {
    for (var i=0; i < GRID_ARRAY.length; i++) {
        for (var j=0; j < GRID_ARRAY[i].length; j++) {
            GRID_ARRAY[i][j] = "";
        }
    }
    NUM_MOVES = 0;
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
function getTopPieceFromGridArrayCell(x_val, y_val) {
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

function addPieceToGenericGridArray(destination_string, piece_id, grid_array) {
    var destination_array = destination_string.split(",");
    x_ind = destination_array[0];
    y_ind = destination_array[1];
    
    if (grid_array[x_ind][y_ind]) {
        grid_array[x_ind][y_ind] += "," + piece_id;
    }
    else {
        grid_array[x_ind][y_ind] = piece_id;
    }
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
function removePieceFromGenericGridArray(in_grid, origin) {
    var origin_array = origin.split(",");
    var x_val = parseInt(origin_array[0]);
    var y_val = parseInt(origin_array[1]);
    var temp_string = in_grid[x_val][y_val];
    //Logger("in_grid / origin = " + in_grid.length + " " + origin + " x/y = " + x_val + " " + y_val + " temp_string = " + temp_string);

    if (temp_string.indexOf(",") != -1) {
        in_grid[x_val][y_val] = temp_string.substring(0,temp_string.lastIndexOf(","));
    }
    else {
        in_grid[x_val][y_val] = "";
    }

}

function MODEL_GRIDARRAY_getTopPieceAtLocation(in_loc_string, in_grid) {
    var loc_array = in_loc_string.split(",");
    var x_val = loc_array[0];
    var y_val = loc_array[1];
    var cell = in_grid[x_val][y_val];
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
