/**
 * Determines all empty hex locations on outside edge of hive. Used to compute possible spider paths.
 * @param   {Array} in_hive
 *          2-Dimensional array (array[x][0] = x_val; array[x][1] = y_val) containing pieces making up hive.
 * @return  {Array}
 *          Contains all of the hex locations that are along the outside of the hive. 
 */

/**
 * 
 */
function getHive(in_grid) {
    var hiveArray = new Array();
    for (var i=0; i < in_grid.length; i++) {
        for (var j=0; j < in_grid[0].length; j++) {
            if (in_grid[i][j]) {
                hiveArray.push(Array(i,j));           
            }
        }
    }
    return hiveArray;
}

/**
 * Returns every empty space touching the hive, including spaces that can't be slid into / holes in middle. GOOD FOR START / JUMPERS. 
 * @param   {Array} in_hive
 * @param   {Array} in_grid
 * @return  {Array} 
 *          Returns 2-D array of outside grid locations.
 */
function getAllHexesOutsideHive(in_grid) {
    
    var outsideStack = Array();
    var in_hive = getHive(in_grid);
    
    for (var i=0; i < in_hive.length; i++) {
        var x_val = parseInt(in_hive[i][0]);
        var y_val = parseInt(in_hive[i][1]); 
        
        // If a hex one space away from a hive piece is empty, its x/y coords are added to the array (stack) that's returned.
        if ( (in_grid[x_val-1][y_val-1] == 0) && !(isHexInStack(new Array(x_val-1,y_val-1), outsideStack)) )
            outsideStack.push(new Array (x_val-1, y_val-1));
        if ( (in_grid[x_val-1][y_val] == 0)  && !(isHexInStack(new Array(x_val-1,y_val), outsideStack)) )
            outsideStack.push(new Array (x_val-1, y_val));
        if ( (in_grid[x_val][y_val+1] == 0 ) && !(isHexInStack(new Array(x_val,y_val+1), outsideStack)) )
            outsideStack.push(new Array (x_val, y_val+1));
        if ( (in_grid[x_val+1][y_val+1] == 0) && !(isHexInStack(new Array(x_val+1,y_val+1), outsideStack)) )
            outsideStack.push(new Array (x_val+1, y_val+1));
        if ( (in_grid[x_val+1][y_val] == 0) && !(isHexInStack(new Array(x_val+1,y_val), outsideStack)) )
            outsideStack.push(new Array (x_val+1, y_val));
        if ( (in_grid[x_val][y_val-1] == 0) && !(isHexInStack(new Array(x_val,y_val-1), outsideStack)) )
            outsideStack.push(new Array (x_val, y_val-1));
    }
    
    return outsideStack;
}

/**
 * Determines hive once a piece is removed. Used in validating ant and spider moves. NOT GOOD FOR JUMPERS.
 * @param   {String} origin
 *          The origin location of the move in "8,9" string format. Piece must be added back to array if space still occupied after move (i.e. beetle moved)
 * @return  {Array}
 *          An array containing string representations of locations in "8,9" format.
 */
function getHexesOutsideHiveWithoutPiece(origin, in_grid) {
    var popped_grid = arrayCloner(in_grid);
    var origin_x = parseInt(origin.substring(0, origin.indexOf(","))); 
    var origin_y = parseInt(origin.substring(origin.indexOf(",")+1));
    var piece_id = MODEL_GRIDARRAY_getTopPieceAtLocation(origin, in_grid);
    
    // remove piece from grid_array 
    //Logger("popped_grid / origin = " + popped_grid.length + " " + origin);
    removePieceFromGenericGridArray(popped_grid, origin);

    // if the hex i'm moving piece from is still occupied, add it back
    if (in_grid[origin_x][origin_y].indexOf(",") != -1) { 
        addPieceToGenericGridArray(origin, piece_id, popped_grid);
    }
    
    // compute outside
    var outside_stack = getAllHexesOutsideHive(popped_grid); 
    var return_stack = new Array();
    
    for (var i in outside_stack) {
        var x_val = parseInt(outside_stack[i][0]);
        var y_val = parseInt(outside_stack[i][1]); 
        
        // If hex is not the origin location and is slidable, add piece
        if ( !((x_val == origin_x) && (y_val == origin_y)) ) {
            if ( !(isHexInternalToHive(x_val, y_val, in_grid)) ) {
                return_stack.push(outside_stack[i][0] + "," + outside_stack[i][1]);
            }
        }
    }
    
    return return_stack;              
}

/**
 * Determines whether a Hex is a part of the hive.  
 * @param   {int} in_x
 *          X Value of hex coordinates.
 * @param   {int} in_y
 *          Y value of hex coordinates.
 */
function isHexInternalToHive(in_x, in_y, in_grid)
{
    // If hex being tested is actually in hive, return 1
    if (in_grid[in_x][in_y] != "") {
        return 1;
    }
    // If any two adjacent spaces surrounding hex are empty, return 0
    else {
        if ( (in_grid[in_x-1][in_y-1] == "") && (in_grid[in_x-1][in_y] == "") )
            return 0;
        if ( (in_grid[in_x-1][in_y] == "") && (in_grid[in_x][in_y+1] == "") )
            return 0;
        if ( (in_grid[in_x][in_y+1] == "") && (in_grid[in_x+1][in_y+1] == "") )
            return 0;
        if ( (in_grid[in_x+1][in_y+1] == "") && (in_grid[in_x+1][in_y] == "") )
            return 0;
        if ( (in_grid[in_x+1][in_y] == "") && (in_grid[in_x][in_y-1] == "") )
            return 0;
        if ( (in_grid[in_x][in_y-1] == "") && (in_grid[in_x-1][in_y-1] == "") )
            return 0;
        return 1;                      
    }
 
}

/**
 * Determines the distance between two hexes.
 * @param   {String} hex_string1
 *          First hex as string in "8,9" format.
 * @param   {String} hex_string2
 *          Second hex as string in "8,9" format.
 * @return  {int}
 *          Distance between the hexes.
 */
function getDistanceBetweenHexes(h1, h2) {
    var hex1_x = h1.substring(0, h1.indexOf(","));
    var hex1_y = h1.substring(h1.indexOf(",")+1);
    var hex2_x = h2.substring(0, h2.indexOf(","));
    var hex2_y = h2.substring(h2.indexOf(",")+1);
    var deltaX = hex1_x - hex2_x;
    var deltaY = hex1_y - hex2_y;
    return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);
};

/**
 * Determines who the current player is by the current move number (because players take turns).
 * @param   {int} move
 *          The move number
 * @return  {String}
 *          Either "white" or "black" is returned.
 */
function getCurrentColorByMove(move) {
    var color = (move % 2 == 0) ? ("white") : ("black");
        
    return color;
}

/**
 * Determines if a hex is adjacent to the hive.
 * @param   {Array} in_hive
 *          An array of all the pieces in the hive.
 * @param   {Array} in_hex
 *          A 2-element array with the location of the hex being tested. array[0] = x-val; array[1] = y-val
 * @return  {int}
 *          Returns 1 if hex is adjacent; 0 if it's not.
 */
function isHexAdjacentToHive(in_hive, in_hex) {
    for (var i=0; i < in_hive.length; i++) {
        var temp_hex_string = in_hive[i][0] + "," + in_hive[i][1];
        if ( getDistanceBetweenHexes(temp_hex_string, in_hex) == 1) {
            return 1;
        }    
    }
    return 0;
}

/**
 * Determine if destination hex is adjacent to hive (or could even be part of hive). 
 * @param   {String} origin
 *          Origin location of move in "8,9" format.
 * @param   {String} dest
 *          Destination location of move in "8,9" format.
 * @return  {int}
 *          Returns 1 if destination location is touching hive; returns 0 if it's not.
 */
function isHexConnectedToBoard(origin, dest, grid_array) { 
    // the array hasn't been updated yet, so piece still in origin location
    var dest_x = parseInt(dest.substring(0, dest.indexOf(","))); 
    var dest_y = parseInt(dest.substring(dest.indexOf(",")+1));
    
    var temp_array = Array();
    temp_array = arrayCloner(grid_array);
        
    if (origin != "") {
        var origin_x = parseInt(origin.substring(0, origin.indexOf(","))); 
        var origin_y = parseInt(origin.substring(origin.indexOf(",")+1));   
        //Logger("temp_array / origin = " + temp_array.length + " " + origin);
        removePieceFromGenericGridArray(temp_array, origin);
    }
    
    var flag_a = temp_array[dest_x-1][dest_y-1];
    var flag_b = temp_array[dest_x-1][dest_y];
    var flag_c = temp_array[dest_x][dest_y-1];
    var flag_d = temp_array[dest_x][dest_y+1];
    var flag_e = temp_array[dest_x+1][dest_y];
    var flag_f = temp_array[dest_x+1][dest_y+1];
    
    if ( flag_a || flag_b || flag_c || flag_d || flag_e || flag_f ) // TOUCHING HIVE
        return 1; 
    else            
        return 0;       
}

/**
 * Determine whether or not a piece is being moved adjacent to an opponent's piece
 * @param   {String} piece
 *          DOM ID of piece being moves (used to determine color)
 * @param   {String} dest
 *          Destination location on grid in "8,9" format
 * @return  {int}
 *          Returns 1 if destination is touching an opponents piece; Returns 0 if not.    
 */
function isHexTouchingOpponent(piece, dest) {
    var dest_x = parseInt(dest.substring(0, dest.indexOf(","))); 
    var dest_y = parseInt(dest.substring(dest.indexOf(",")+1));
    var search_str;
    if (piece.indexOf("white") != -1) // if piece contains white, search for black
        search_str = "black";
    else
        search_str = "white";
    
    var val_a = getTopPieceFromGridArrayCell(dest_x-1, dest_y-1);
    var val_b = getTopPieceFromGridArrayCell(dest_x-1, dest_y);
    var val_c = getTopPieceFromGridArrayCell(dest_x, dest_y-1);
    var val_d = getTopPieceFromGridArrayCell(dest_x, dest_y+1);
    var val_e = getTopPieceFromGridArrayCell(dest_x+1, dest_y);
    var val_f = getTopPieceFromGridArrayCell(dest_x+1, dest_y+1);
    
    var flag_a, flag_b, flag_c, flag_d, flag_e, flag_f;
    
    if (val_a)
        flag_a = val_a.indexOf(search_str);
    else
        flag_a = -1;
    if (val_b)
        flag_b = val_b.indexOf(search_str);
    else
        flag_b = -1;
    if (val_c)
        flag_c = val_c.indexOf(search_str);
    else
        flag_c = -1;
    if (val_d)
        flag_d = val_d.indexOf(search_str);
    else
        flag_d = -1;
    if (val_e)
        flag_e = val_e.indexOf(search_str);
    else
        flag_e = -1;
    if (val_f)
        flag_f = val_f.indexOf(search_str);
    else
        flag_f = -1;                                
    
    if ( (flag_a != -1) ||  (flag_b != -1) || (flag_c != -1) || (flag_d != -1) || (flag_e != -1) || (flag_f != -1) ) // TOUCHING OPPONENT PIECE
        return 1; 
    else            
        return 0;   
}

/**
 * Finds whether a grid location is occupied.
 * @param   {Array} in_hex 
 *          Length-2 array containing x_val and y_val of grid location
 * @param   {Array} in_Stack 
 *          Two-Dimensional array containing all locations of pieces (x-val = array[x][0] / y_val = array[x][1])
 * @return  {int} 
 *          Returns 1 if hex is in stack, 0 otherwise. 
 */
function isHexInStack(in_hex, in_stack) {
    var x_val = in_hex[0];
    var y_val = in_hex[1];
    
    for (var i=0; i < in_stack.length; i++)
        if ((x_val == in_stack[i][0]) && (y_val == in_stack[i][1]))
            return 1;
    
    return 0;
}

/**
 * Determines if the move is valid or invalid.
 * @param   {String} in_origin
 *          Origin location of move in "8,9" format.
 * @param   {String} in_dest
 *          Destination location of move in "8,9" format.
 * @param   {String} in_piece_id
 *          DOM ID of piece being moved.
 * @param   {Array} in_grid
 *          Grid array representing all pieces on board.
 * @return  {int}
 *          Returns 1 if move is valid; returns negative error code if move invalid 
 */
function isMoveValid(in_origin, in_dest, in_piece_id, in_grid_array) {
    var current_color = getCurrentColorByMove(NUM_MOVES);
    var dest_x = in_dest.substring(0, in_dest.indexOf(",")); 
    var dest_y = in_dest.substring(in_dest.indexOf(",")+1);
    var invalid_flag = 0;
    var error_string = "";
    
    // doublechecks that piece isn't wrong color
    if (in_piece_id.indexOf(current_color) == -1) {
        return 0;
    }
        
    if (in_origin == "") { // IF PIECE BEING PLACED FOR FIRST TIME, CHECK IF MOVE FOLLOWS RULES
        
        // doublechecks that piece isn't already on board
        if (PIECE_ARRAY[in_piece_id] != "") {
            return 0;
        }       
        // RULE CHECK: MAKE SURE BEE IS PLACED BY COMPLETION OF 4TH MOVE   
        if ( (invalid_flag == 0) && (current_color = "white") && (NUM_MOVES == 6) && (in_piece_id.indexOf("white_bee1")==-1) && (PIECE_ARRAY["white_bee1"] == "") ) {
            invalid_flag -= 8192;
        }
        else if ( (invalid_flag == 0) && (current_color = "black") && (NUM_MOVES == 7) && (in_piece_id.indexOf("black_bee1")==-1) && (PIECE_ARRAY["black_bee1"] == "") ) {
            invalid_flag -= 8192;
        }
        
        // RULE CHECK: MAKE SURE HEX ISN'T ALREADY OCCUPIED WHEN FIRST PLACING PIECE
        if ((invalid_flag == 0) && in_grid_array[dest_x][dest_y] && NUM_MOVES != 0) { 
            invalid_flag -= 4096;
        }

        // RULE CHECK: MAKE SURE DESTINATION HEX IS CONNECTED TO BOARD
        if ((invalid_flag == 0) && !isHexConnectedToBoard(in_origin, in_dest, in_grid_array) && NUM_MOVES != 0) {
            invalid_flag -= 2048;
        } 
                    
        // RULE CHECK: MAKE SURE PIECE NOT TOUCHING OPPONENT'S COLOR WHEN PLACED
        if ((invalid_flag == 0) && isHexTouchingOpponent(in_piece_id, in_dest) && NUM_MOVES > 1) {
            invalid_flag -= 1024;
        }
                  

    }
    else { // IF PIECE ALREADY ON BOARD
        var origin_x = parseInt(in_origin.substring(0, in_origin.indexOf(","))); 
        var origin_y = parseInt(in_origin.substring(in_origin.indexOf(",")+1));
              
        // RULE CHECK: MAKE SURE PIECE ISN'T TRAPPED AND CAN'T SLIDE OUT
        if ( (invalid_flag == 0) && (isPieceTrapped(in_origin, in_piece_id, in_grid_array) == 1) ) {
            invalid_flag -= 16384;
            $("#" + in_piece_id).hide();
        }
        // RULE CHECK: MAKE SURE PIECE ISN'T BEING PUT SOMEWHERE UNCONNECTED TO HIVE
        if ( (invalid_flag == 0) && !(isHexConnectedToBoard(in_origin, in_dest, in_grid_array)) && (NUM_MOVES != 0) ) {
            invalid_flag -= 512;
            $("#" + in_piece_id).hide();
        }
        
        // RULE CHECK: MAKE SURE MOVE DOESN'T VIOLATE ONE-HIVE RULE UPON PICKING UP PIECE
        if ((invalid_flag == 0) && !isOneHiveMaintained(in_origin, in_grid_array)) {
            invalid_flag -= 256;
            $("#" + in_piece_id).hide();
        }
        
        // RULE CHECK: TRICKY ONE HIVE SITUATION
        if ( (invalid_flag == 0) && ((in_piece_id.indexOf("beetle") != -1) || (in_piece_id.indexOf("bee1") != -1))  ) {
            if (isMoveTrickyViolation(in_origin, in_dest, in_grid_array)) {
                invalid_flag -= 256;
                $("#" + in_piece_id).hide();                
            }
        }         
                        
        // RULE CHECK: CANT MOVE PIECE ON BOARD UNTIL QUEEN PLACED
        if ( ( (invalid_flag == 0) && (current_color == "white") && (PIECE_ARRAY["black_bee1"] == "") ) || ( (invalid_flag == 0) && (current_color == "black") && (PIECE_ARRAY["black_bee1"] == "") ) ) {
            invalid_flag -= 128;
            $("#" + in_piece_id).hide();                    
        }
        
        // RULE CHECK: CANNOT CLIMB ATOP OTHER PIECE (ONLY BEETLE)
        if ((invalid_flag == 0) && (in_piece_id.indexOf("beetle") == -1) ) {
            if (in_grid_array[dest_x][dest_y]) {
                invalid_flag -= 64;
                $("#" + in_piece_id).hide();
            }
        }
        
        // RULE CHECK: INDIVIDUAL PIECE RULES
        if ((invalid_flag == 0)) {
            
            // RULE CHECK; MAKE SURE BEETLE IS ONLY MOVING ONE SPACE 
            if (in_piece_id.indexOf("beetle") != -1) {
                if (getDistanceBetweenHexes(in_origin, in_dest) != 1) {
                    invalid_flag -= 32;
                }
            }
            
            // RULE CHECK: MAKE SURE QUEEN IS ONLY MOVING ONE SPACE
            if (in_piece_id.indexOf("bee1") != -1) {
                if (getDistanceBetweenHexes(in_origin, in_dest) != 1) {
                    invalid_flag -= 16;
                }                   
            }
            
            // RULE CHECK: MAKE SURE GRASSHOPPER IS ONLY MOVING DIAGONALLY AND INTO FIRST EMPTY SPACE
            if (in_piece_id.indexOf("grasshopper") != -1) {
     
                var invalid_jump_flag;
                invalid_jump_flag = isGrasshopperPathValid(in_origin, in_dest, in_grid_array);
                 
                if (invalid_jump_flag == -3) {
                    invalid_flag -= 8;
                }
                else if (invalid_jump_flag == -2) {
                    invalid_flag -= 4;
                }
                else if (invalid_jump_flag == -1) {
                    invalid_flag -= 4;
                }
            }
            
            // RULE CHECK: MAKE SURE SPIDER IS MOVING THREE MOVES AROUND OUTSIDE OF BOARD 
            if (in_piece_id.indexOf("spider") != -1) {
                if (isSpiderPathValid(in_origin, in_dest, in_grid_array) == 0) {
                    invalid_flag -= 2;
                }
            }
            
            // RULE CHECK: MAKE SURE ANT IS ONLY MOVING ALONG OUTSIDE OF BOARD
            if (in_piece_id.indexOf("ant") != -1) {
                var outerStringHive = getHexesOutsideHiveWithoutPiece(in_origin, in_grid_array);
                var outerHive = convertHexStringArrayTo2DArray(outerStringHive);
                if (isHexInStack(new Array(dest_x, dest_y), outerHive) == 0)  {
                    invalid_flag -= 1;
                }     
            }
            
        } // end of individual piece rules if
                
    } // end of big else statement (piece on board already)
    
    if (invalid_flag == 0) {
        return 1;
    } 
    else {
        return invalid_flag;
    }
        
}

function getMoveErrorCode(return_value) {
    var error_string = "";
    if (return_value != 1) {
        if (return_value <= -32768) {
            error_string += "SPECIAL SLIDING FLAG.<br/>";
            return_value += 32768;
        }
        if (return_value <= -16384) {
            error_string += "The piece you are trying to move is trapped. It can't leave its space right now.<br/>";
            return_value += 16384;
        }        
        if (return_value <= -8192) {
            error_string += "This is your fourth move, so the bee must be placed by this point. Please put the bee on the board.<br/>";
            return_value += 8192;
        }
        if (return_value <= -4096) {
            error_string += "When moving a piece onto the board, it can't be placed on an occupied space.<br/>";
            return_value += 4096;
        }
        if (return_value <= -2048) {
            error_string = "A piece coming onto the board must be placed touching one of your pieces.<br/>";
            return_value += 2048;
        }
        if (return_value <= -1024) {
            error_string += "A piece coming onto the board can't be placed touching an opponent's piece.<br/>"; 
            return_value += 1024;
        }
        if (return_value <= -512) {
            error_string += "The piece must move to a location touching the hive.<br/>";
            return_value += 512;
        }
        if (return_value <= -256) {
            error_string += "The move you are trying to make violates the one hive rule. When you pick up your piece to move it, the hive can't segment into two.<br/>";
            return_value += 256;
        }
        if (return_value <= -128) {
            error_string += "You can't move a piece that's on the board until the queen has been placed.<br/>";
            return_value += 128;
        }
        if (return_value <= -64) {
            error_string += "That piece may not climb on top of another piece.<br/>";
            return_value += 64;
        }
        if (return_value <= -32) {
            error_string += "The beetle can only move one space, but may move on top of another piece.<br/>";  
            return_value += 32;
        }
        if (return_value <= -16) {
            error_string += "The queen bee can only move one space.<br/>"; 
            return_value += 16;
        }
        if (return_value <= -8) {
            error_string += "The grasshopper must actually jump a piece. It can't just move one spot.<br/>";                
            return_value += 8;
        }
        if (return_value <= -4) {
            error_string += "The grasshopper must move on a diagonal and cannot skip any empty spaces while moving.<br/>"; 
            return_value += 4;
        }
        if (return_value <= -2) {
            error_string += "The spider must move three spaces around the outside edge of the hive.<br/>"; 
            return_value += 2;
        }
        if (return_value <= -1) {
            error_string += "The ant can only move around the outside edge of the hive.<br/>";       
            return_value += 1;
        } 
    }
    return error_string;
}

/**
 * Determines whether the hive stays intact (one hive rule) when a move is undertaken. 
 * @param   {String} origin
 *          Contains origin location of move in "8,9" format.
 * @return  {int}
 *          Returns 1 if hive remains intact; returns 0 if hive gets broken when piece lifted.
 */
function isOneHiveMaintained(origin, in_grid) {
    var stack = Array();
    var temp_xy = Array();
    var origin_x = parseInt(origin.substring(0, origin.indexOf(","))); 
    var origin_y = parseInt(origin.substring(origin.indexOf(",")+1));
    
    // stack will contain all coordinate sets that contain pieces
    for (var i=0; i < in_grid.length; i++)
        for (var j=0; j < in_grid[i].length; j++) 
            if (in_grid[i][j] && !((i == origin_x) && (j == origin_y)) )
                    stack.push(new Array(i,j));
    
    if (in_grid[origin_x][origin_y].indexOf(",") != -1) { // if the hex i'm moving piece from is still occupied, add it back
        stack.push(new Array(origin_x,origin_y));
    } 
        
    // starts with random value from stack. iterates through whole stack
    // each time it finds a neighbor, it pops it off the stack and recurses from the new point
     
    temp_xy = stack.pop();
    var x_value = temp_xy[0];
    var y_value = temp_xy[1];
    var flag = 0;
    var iteration = 0;
    recurseHive(x_value, y_value);
        
    function recurseHive(x_val, y_val) {
        var this_num = iteration;   
        iteration++;
        for (var i=0; i < stack.length; i++)
            if ( (stack[i][0] == x_val-1) && (stack[i][1] == y_val-1) ) {
                flag = 1;
                stack.splice(i,1);
                recurseHive(x_val-1, y_val-1);
            }   
        for (var i=0; i < stack.length; i++)
            if ( (stack[i][0] == x_val-1) && (stack[i][1] == y_val) ) {
                flag = 1;
                stack.splice(i,1);
                recurseHive(x_val-1, y_val);
            }
        for (var i=0; i < stack.length; i++)
            if ( (stack[i][0] == x_val) && (stack[i][1] == y_val-1) ) {
                flag = 1;
                stack.splice(i,1);
                recurseHive(x_val, y_val-1);
            }
        for (var i=0; i < stack.length; i++)
            if ( (stack[i][0] == x_val) && (stack[i][1] == y_val+1) ) {
                flag = 1;
                stack.splice(i,1);
                recurseHive(x_val, y_val+1);
            }
        for (var i=0; i < stack.length; i++)
            if ( (stack[i][0] == x_val+1) && (stack[i][1] == y_val) ) {
                flag = 1;
                stack.splice(i,1);
                recurseHive(x_val+1, y_val);
            }
        for (var i=0; i < stack.length; i++)
            if ( (stack[i][0] == x_val+1) && (stack[i][1] == y_val+1) ) {
                flag = 1;
                stack.splice(i,1);
                recurseHive(x_val+1, y_val+1);
            }       
    }
    if (stack.length) {
        return 0;
    }       
    else {
        return 1;    
    } 
}   

/**
 * Determines whether or not a certain color's queen bee is surrounded.
 * @return  {int}
 *          Returns 1 if xxx; Returns 0 if xxx.
 * 
 */
function isBeeSurrounded(in_grid) { 
    var white_bee_surrounded = 0;
    var black_bee_surrounded = 0;
    var msg = "";
    var returncode;
    
    if ( (PIECE_ARRAY["white_bee1"] != "") && (getEmptyHexesSurroundingPiece("white_bee1", in_grid) == 0) ) {
        white_bee_surrounded++;
    }
    
    if ( (PIECE_ARRAY["black_bee1"] != "") && (getEmptyHexesSurroundingPiece("black_bee1", in_grid) == 0) ) {
        black_bee_surrounded++;
    }    
    
    if (black_bee_surrounded && white_bee_surrounded) {
        msg = "Both players queen bees are surrounded.<br />Game is a draw.";
        Logger(msg);
        returncode = 3;
    }
    else if (black_bee_surrounded) {         
        msg = WHITE_PLAYER_NAME + " has surrounded " + BLACK_PLAYER_NAME + "'s queen bee.<br />" + WHITE_PLAYER_NAME + " wins.";
        Logger(msg);
        returncode = 2;
    }
    else if (white_bee_surrounded) {
        msg = BLACK_PLAYER_NAME + " has surrounded " + WHITE_PLAYER_NAME + "'s queen bee.<br />" + BLACK_PLAYER_NAME + " wins."
        Logger(msg);
        returncode = 1;
    }
    else {
        returncode = 0;
    }
    
    $("#game_over_text").html(msg);
    return returncode;    
}

/**
 * Determines whether or not a possible spider path exists between origin and destination.
 * @param   {Array} in_hive 
 *          Array containing current board.
 * @param   {String} in_origin 
 *          String representing origin hex in format "8,3"
 * @param   {String} in_dest 
 *          String representing destination hex in format "8,3"
 * @return  {int} 
 *          Returns 1 if possible path exists, 0 if it doesn't.
 */
function isSpiderPathValid(in_origin, in_dest, in_grid) {
    
    var skip_index = 0;
    var skip_index_2 = 0;
    
    var origin_x = in_origin.substring(0, in_origin.indexOf(","));
    var origin_y = in_origin.substring(in_origin.indexOf(",") + 1);
    
    var outside_hive = getHexesOutsideHiveWithoutPiece(in_origin, in_grid);
    
    var h1 = "";
    var h2 = "";
    var h3 = "";
    var h4 = "";
        
    for (var i in outside_hive) {
        h1 = origin_x + "," + origin_y;
        h2 = outside_hive[i];
        
        if ( (getDistanceBetweenHexes(h1, h2) == 1) ) {
            skip_index = i;
            
            for (var j in outside_hive) {
                h3 = outside_hive[j];
                
                if (j != skip_index) {
                   
                    if (getDistanceBetweenHexes(h2, h3) == 1) {
                        skip_index_2 = j;
                     
                        for (var k in outside_hive) {
                            h4 = outside_hive[k];
                        
                            if ( (k != skip_index) && (k != skip_index_2) ) {
                        
                                if (getDistanceBetweenHexes(h3, h4) == 1) {
                        
                                    if (h4 == in_dest) {
                                        return 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }   
        }
    }
    return 0;
}

/**
 * Determines whether or not a possible grasshopper path exists between origin and destination.
 * @param   {String} in_origin
 *          String representing origin hex in format "8,3"
 * @param   {String} in_dest
 *          String representing destination hex in format "8,3"
 * @return  {int} 
 *          Returns 1 if valid move; -1 if it skips an empty space; -2 if it doesn't move on a diagonal; -3 if it only moves one space.
 */
function isGrasshopperPathValid(in_origin, in_dest, in_grid) {   
    var origin_x = parseInt(in_origin.substring(0, in_origin.indexOf(","))); 
    var origin_y = parseInt(in_origin.substring(in_origin.indexOf(",")+1));
    var dest_x = in_dest.substring(0, in_dest.indexOf(",")); 
    var dest_y = in_dest.substring(in_dest.indexOf(",")+1);
    
    var invalid_jump_flag = 1;
        
    if (getDistanceBetweenHexes(in_origin, in_dest) == 1 ) {
        invalid_jump_flag = -3;
    }
    else if (  (dest_y == origin_y) && (dest_x > origin_x) ) { // if y is same and x gets bigger
        for (var i=origin_x + 1; i < dest_x; i++) {
            if (in_grid[i][origin_y] == 0) {
                invalid_jump_flag = -1;
                empty_space = "(" + i + "," + origin_y + ")";
                break;
            }
        }
    }
    else if (  (dest_y == origin_y) && (origin_x > dest_x) ) { // if y is same and x gets smaller
        for (var i=origin_x - 1; i > dest_x; i--) {
            if (in_grid[i][origin_y] == 0) {
                invalid_jump_flag = -1;
                empty_space = "(" + i + "," + origin_y + ")";
                break;
            }
        }
    }
    else if (  (dest_y > origin_y) && (dest_x > origin_x) && ((dest_x - origin_x) == (dest_y - origin_y)) ) { // y gets bigger, x gets bigger, diagonal
        for (var i=origin_x + 1; i < dest_x; i++) {
            if (in_grid[i][origin_y-origin_x+i] == 0) {
                invalid_jump_flag = -1;
                empty_space = "(" + i + "," + origin_y + ")";
                break;
            }
        }
    }
    else if (  (origin_y > origin_x) && (origin_x > dest_x) && ((dest_x-origin_x) == (dest_y - origin_y)) ) { // x gets smaller, y gets smaller, diagonal
        // quadrant 2
        for (var i=origin_x-1; i > dest_x; i--) {
            if (in_grid[i][origin_y - origin_x + i] == 0) {
                invalid_jump_flag = -1;
                empty_space = "(" + i + "," + origin_y + ")";
                break;
            }
        }
    }
    else if (  (dest_x == origin_x) && (dest_y > origin_y) ) { // if x is the same and y gets bigger
        for (var i=origin_y + 1; i < dest_y; i++) {
            if (in_grid[origin_x][i] == 0) {
                invalid_jump_flag = -1;
                empty_space = "(" + origin_x + "," + i + ")";
                break;
            }
        }
    }    
    else if (  (dest_x == origin_x) && (origin_y > dest_y) ) { // if x is the same and y gets smaller
        for (var i=origin_y - 1; i > dest_y; i--) {
            if (in_grid[origin_x][i] == 0) {
                invalid_jump_flag = -1;
                empty_space = "(" + origin_x + "," + i + ")";
                break;
            }
        }
    }
    else { // ILLEGAL MOVE NOT ON DIAGONAL
        invalid_jump_flag = -2;
    }
    
    return invalid_jump_flag;    
}

function isPieceTrapped(in_origin, in_piece_id, in_grid) {
    var origin_x = parseInt(in_origin.substring(0, in_origin.indexOf(","))); 
    var origin_y = parseInt(in_origin.substring(in_origin.indexOf(",")+1));
    
    if (in_origin == "") {
        return 0;
    }
    
    if ( isPiecePinned(in_piece_id, in_grid) == 1 ) {
        return 1;
    }
    // Grasshoppers and beetles can't be trapped
    if ( (in_piece_id.indexOf("beetle") != -1) || (in_piece_id.indexOf("grasshopper") != -1) ) {
        return 0;
    }
    
    // Compare each set of adjacent points around hex. If both are empty, piece can't be trapped. 
    if ( (in_grid[origin_x-1][origin_y-1] == "") && (in_grid[origin_x-1][origin_y] == "") ) {
        return 0;
    }
    if ( (in_grid[origin_x-1][origin_y] == "") && (in_grid[origin_x][origin_y+1] == "") ) {
        return 0;
    }
    if ( (in_grid[origin_x][origin_y-1] == "") && (in_grid[origin_x-1][origin_y-1] == "") ) {
        return 0;
    }
    if ( (in_grid[origin_x][origin_y+1] == "") && (in_grid[origin_x+1][origin_y+1] == "") ) {
        return 0;
    }
    if ( (in_grid[origin_x+1][origin_y] == "") && (in_grid[origin_x][origin_y-1] == "") ) {
        return 0;
    }
    if ( (in_grid[origin_x+1][origin_y+1] == "") && (in_grid[origin_x+1][origin_y] == "") ) {
        return 0;
    }
    
    return 1;
}

function getTouchingHexesBetweenTwoPieces(in_one, in_two) {
    var touch_array = new Array();
    if ( getDistanceBetweenHexes(in_one, in_two) == 1 ) {
       var one_array = getSurroundingHexes(in_one);
       var two_array = getSurroundingHexes(in_two);
       for (var i in one_array) {
           for (var j in two_array) {
               if (one_array[i] == two_array[j]) {
                   touch_array.push(one_array[i]);
               }
           }
       }
       return touch_array;
    }

    return touch_array;
}

/**
 * Gets black or white's pieces that are on the board.
 * @param   {String} in_color
 * @return  {Array}
 *          Contains DOM IDs of pieces on board for a specific color 
 */
function getPiecesOnBoardByColor(in_color) {
    var myArray = new Array();
    if (in_color == "white") {
        for (var key in PIECE_ARRAY) {
            if ( (key.indexOf("white") != -1) && (PIECE_ARRAY[key] != "") ) {
                myArray.push(key);
            }
        }
    }
    else {
        for (var key in PIECE_ARRAY) {
            if ( (key.indexOf("black") != -1) && (PIECE_ARRAY[key] != "") ) {
                myArray.push(key);
            }
        }       
    }
    
    return myArray;
}

/**
 * Gets black or white's pieces that are on the side.
 * @param   {String} in_color
 * @return  {Array} 
 *          Contains DOM IDs of unplayed pieces on side for a specific color
 */
function getPiecesOnSideByColor(in_color) {
    var myArray = new Array();
    if (in_color == "white") {
        for (var key in PIECE_ARRAY) { 
            if ( (key.indexOf("white") != -1) && (PIECE_ARRAY[key] == "") ) {
                myArray.push(key);
            }
        }
    }
    else {
        for (var key in PIECE_ARRAY) {
            if ( (key.indexOf("black") != -1) && (PIECE_ARRAY[key] == "") ) {
                myArray.push(key);
            }
        }
    }                
    return myArray;
}

/**
 * 
 */
function isPiecePinned(in_piece_id, in_grid) {
    var the_hex = PIECE_ARRAY[in_piece_id];
    var surroundingArray = getSurroundingHexes(the_hex);
    var x_val = 0; 
    var y_val = 0;
    
    for (var i in surroundingArray) {
        x_val = surroundingArray[i].substr(0, surroundingArray[i].indexOf(","));
        y_val = surroundingArray[i].substr(surroundingArray[i].indexOf(",")+1);
        if ((in_grid[x_val][y_val] != "") && (getNumberOfPiecesSurroundingHex(surroundingArray[i], in_grid) == 1))
            return 1;
    }
    return 0;    
}

/**
 * 
 * @param {String} in_hex
 */
function getSurroundingHexes(in_hex) {
    
    if (in_hex == "") {
        return Array();
    }
    var returnArray = new Array();
    var x_val = parseInt(in_hex.substr(0, in_hex.indexOf(",")));
    var y_val = parseInt(in_hex.substr(in_hex.indexOf(",")+1));
    returnArray.push((x_val-1) + "," + (y_val-1));
    returnArray.push((x_val-1) + "," + y_val);
    returnArray.push(x_val + "," + (y_val-1));
    returnArray.push(x_val + "," + (y_val+1));
    returnArray.push((x_val+1) + "," + y_val);
    returnArray.push((x_val+1) + "," + (y_val+1));
    
    return returnArray;
}

/**
 * 
 */
function getPinHexes(in_piece_id, in_grid) {
    var tempArray = new Array();
    var pinArray = new Array();
    var the_hex = PIECE_ARRAY[in_piece_id];
    var surroundingArray = getSurroundingHexes(the_hex);
    var x_val = 0; 
    var y_val = 0;
    for (var i in surroundingArray) {
        var x_val = surroundingArray[i].substr(0, surroundingArray[i].indexOf(","));
        var y_val = surroundingArray[i].substr(surroundingArray[i].indexOf(",")+1);
        if (!in_grid[x_val][y_val]) {
            tempArray.push(surroundingArray[i]);
        }
    }
    for (var i in tempArray) {
        if (getNumberOfPiecesSurroundingHex(tempArray[i], in_grid) == 1) {
            pinArray.push(tempArray[i]);
        }
    }
    return pinArray;
}

/**
 * 
 * @param   {String} in_piece_id
 * @param   {Array} in_grid
 * @return  {Array}
 *          Return an array of string representations of locations in "8,9" format
 */
function getEmptyHexesSurroundingPiece(in_piece_id, in_grid) {
    var in_hex = PIECE_ARRAY[in_piece_id];
    var x_val = parseInt(in_hex.substr(0, in_hex.indexOf(",")));
    var y_val = parseInt(in_hex.substr(in_hex.indexOf(",")+1));
    var empty_array = new Array();
    if (!in_grid[x_val-1][y_val-1])
        empty_array.push((x_val-1).toString() + "," + (y_val-1).toString());
    if (!in_grid[x_val-1][y_val])
        empty_array.push((x_val-1).toString() + "," + (y_val).toString());
    if (!in_grid[x_val][y_val-1])
        empty_array.push((x_val).toString() + "," + (y_val-1).toString());
    if (!in_grid[x_val][y_val+1])
        empty_array.push((x_val).toString() + "," + (y_val+1).toString());
    if (!in_grid[x_val+1][y_val])
        empty_array.push((x_val+1).toString() + "," + (y_val).toString());
    if (!in_grid[x_val+1][y_val+1])
        empty_array.push((x_val+1).toString() + "," + (y_val+1).toString());
   
    return empty_array;
}

/**
 * 
 * @param   {String} in_hex
 * 
 * @param   {Array} in_grid
 * 
 * @return  {int}
 *          Returns -1 if in_hex empty, otherwise 0 through 6.
 */
function getNumberOfPiecesSurroundingHex(in_hex, in_grid) {   
    if (in_hex == "") {
        return -1;
    }
    
    var x_val = parseInt(in_hex.substr(0, in_hex.indexOf(",")));
    var y_val = parseInt(in_hex.substr(in_hex.indexOf(",")+1));
    var counter = 0;
    
    if (in_grid[x_val-1][y_val-1] != "") {
        counter++;
    }       
    if (in_grid[x_val-1][y_val] != "") {
        counter++;
    }  
    if (in_grid[x_val][y_val-1] != "") {
        counter++;
    }  
    if (in_grid[x_val][y_val+1] != "") {
        counter++;
    }  
    if (in_grid[x_val+1][y_val] != "") {
        counter++;
    }  
    if (in_grid[x_val+1][y_val+1] != "") {
        counter++;
    }  
   
    return counter;
}

function getAllSurroundingPieces(in_hex, in_grid) {
    var x_val = parseInt(in_hex.substr(0, in_hex.indexOf(",")));
    var y_val = parseInt(in_hex.substr(in_hex.indexOf(",")+1));
    var counter = 0;
    var the_array = new Array();
    
    if (in_grid[x_val-1][y_val-1] != "") {
            the_array.push((x_val-1).toString() + "," + (y_val-1).toString());
    }
    if (in_grid[x_val-1][y_val] != "") {
            the_array.push((x_val-1).toString() + "," + (y_val).toString());
    } 
    if (in_grid[x_val][y_val-1] != "") {
            the_array.push((x_val).toString() + "," + (y_val-1).toString()); 
    }
    if (in_grid[x_val][y_val+1] != "") {
            the_array.push((x_val).toString() + "," + (y_val+1).toString());
    } 
    if (in_grid[x_val+1][y_val] != "") {
            the_array.push((x_val+1).toString() + "," + (y_val).toString());
    }    
    if (in_grid[x_val+1][y_val+1] != "") {
            the_array.push((x_val+1).toString() + "," + (y_val+1).toString());
    }
          
    return the_array;   
}

/**
 * 
 * @param
 * @param
 * @return  {Array}
 *          Contains locations where pieces exist in "8,9" format
 */
function getSurroundingPiecesByColor(in_color, in_piece_id, in_grid) {
    var in_hex = PIECE_ARRAY[in_piece_id]
    var x_val = parseInt(in_hex.substr(0, in_hex.indexOf(",")));
    var y_val = parseInt(in_hex.substr(in_hex.indexOf(",")+1));
    var counter = 0;
    var the_array = new Array();
    
    if (in_grid[x_val-1][y_val-1] != "") {
        if (getTopPieceFromGridArrayCell(x_val-1, y_val-1).indexOf(in_color) != -1)
            the_array.push((x_val-1).toString() + "," + (y_val-1).toString());
    }
    if (in_grid[x_val-1][y_val] != "") {
        if (getTopPieceFromGridArrayCell(x_val-1, y_val).indexOf(in_color) != -1)
            the_array.push((x_val-1).toString() + "," + (y_val).toString());
    } 
    if (in_grid[x_val][y_val-1] != "") {
        if (getTopPieceFromGridArrayCell(x_val, y_val-1).indexOf(in_color) != -1)
            the_array.push((x_val).toString() + "," + (y_val-1).toString()); 
    }
    if (in_grid[x_val][y_val+1] != "") {
        if (getTopPieceFromGridArrayCell(x_val, y_val+1).indexOf(in_color) != -1)
            the_array.push((x_val).toString() + "," + (y_val+1).toString());
    } 
    if (in_grid[x_val+1][y_val] != "") {
        if (getTopPieceFromGridArrayCell(x_val+1, y_val).indexOf(in_color) != -1)
            the_array.push((x_val+1).toString() + "," + (y_val).toString());
    }    
    if (in_grid[x_val+1][y_val+1] != "") {
        if (getTopPieceFromGridArrayCell(x_val+1, y_val+1).indexOf(in_color) != -1)
            the_array.push((x_val+1).toString() + "," + (y_val+1).toString());
    }
          
    return the_array;
}

/**
 * There's a violation of the one hive rule that's difficult to detect. This takes care of it.
 */
function isMoveTrickyViolation(in_origin, in_dest, in_grid_array) {
    var fake_grid = arrayCloner(in_grid_array);
    removePieceFromGenericGridArray(fake_grid, in_origin);
    var surround_a = getAllSurroundingPieces(in_origin, fake_grid);
    var surround_b = getAllSurroundingPieces(in_dest, fake_grid);
    if ( (getNumberOfPiecesSurroundingHex(in_origin, fake_grid) == 1) && (getNumberOfPiecesSurroundingHex(in_dest, fake_grid) == 1) ) {
        if (surround_a[0] != surround_b[0]) {
            return 1;
        }    
    }
    return 0;    
}






/**
 * ONLT USED ONCE - WE SHOULD BE ABLE TO DO AWAY WITH THIS
 * @param {Object} stringArray
 */
function convertHexStringArrayTo2DArray(stringArray) {
    var returnArray = new Array();
    for (var i in stringArray) {
        returnArray.push(stringArray[i].split(","));
    }
    return returnArray;
}
