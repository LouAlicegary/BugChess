/**
 * Determines all empty hex locations on outside edge of hive. Used to compute possible spider paths.
 * @param   {Array} in_hive
 *          2-Dimensional array (array[x][0] = x_val; array[x][1] = y_val) containing pieces making up hive.
 * @return  {Array}
 *          Contains all of the hex locations that are along the outside of the hive. 
 */
function getHexesOutsideHive(in_hive) {
    
    var outsideStack = Array();
    
    for (var i=0; i < in_hive.length; i++) {
        var x_val = parseInt(in_hive[i][0]);
        var y_val = parseInt(in_hive[i][1]); 
        
        // If a hex one space away from a hive piece is empty, its x/y coords are added to the array (stack) that's returned.
        if ( (GRID_ARRAY[x_val-1][y_val-1] == 0) && !(isHexInStack(new Array(x_val-1,y_val-1), outsideStack)) )
            outsideStack.push(new Array (x_val-1, y_val-1));
        if ( (GRID_ARRAY[x_val-1][y_val] == 0)  && !(isHexInStack(new Array(x_val-1,y_val), outsideStack)) )
            outsideStack.push(new Array (x_val-1, y_val));
        if ( (GRID_ARRAY[x_val][y_val+1] == 0 ) && !(isHexInStack(new Array(x_val,y_val+1), outsideStack)) )
            outsideStack.push(new Array (x_val, y_val+1));
        if ( (GRID_ARRAY[x_val+1][y_val+1] == 0) && !(isHexInStack(new Array(x_val+1,y_val+1), outsideStack)) )
            outsideStack.push(new Array (x_val+1, y_val+1));
        if ( (GRID_ARRAY[x_val+1][y_val] == 0) && !(isHexInStack(new Array(x_val+1,y_val), outsideStack)) )
            outsideStack.push(new Array (x_val+1, y_val));
        if ( (GRID_ARRAY[x_val][y_val-1] == 0) && !(isHexInStack(new Array(x_val,y_val-1), outsideStack)) )
            outsideStack.push(new Array (x_val, y_val-1));
    }
    
    return outsideStack;
}

/**
 * Determines the distance between two hexes.
 * @param   {String} h1
 *          First hex as string in "8,9" format.
 * @param   {String} h2
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
 * Determines xxxxxxxxxxxxxxx
 * @param   {String} origin
 *          The origin location of the move in "8,9" string format. Piece must be added back to array if space still occupied after move (i.e. beetle moved)
 * @return  {Array}
 *          An array containing the coordinates of all the locations outside the hive.
 */
function getOutsideOfHive(origin) {
    var stack = Array();
    var temp_xy = Array();
    var origin_x = parseInt(origin.substring(0, origin.indexOf(","))); 
    var origin_y = parseInt(origin.substring(origin.indexOf(",")+1));
    
    // stack will contain all coordinate sets that contain pieces
    for (var i=0; i < GRID_ARRAY.length; i++)
        for (var j=0; j < GRID_ARRAY[i].length; j++) 
            if (GRID_ARRAY[i][j] && !((i == origin_x) && (j == origin_y)) )
                    stack.push(new Array(i,j));
    
    // if the hex i'm moving piece from is still occupied, add it back
    if (GRID_ARRAY[origin_x][origin_y].indexOf(",") != -1) { 
        stack.push(new Array(origin_x,origin_y));
    } 
    
    //Logger("EARLY STACK: " + stack);
    
    var theHive = arrayCloner(stack);
    
    for (var i=0; i < stack.length; i++) {
        var x_val = parseInt(stack[i][0]);
        var y_val = parseInt(stack[i][1]); 
        //Logger("x/y: " + x_val + " " + y_val);
        
        if (isHexInternalToHive(x_val-1, y_val-1) && !(isHexInStack(new Array(x_val-1, y_val-1), theHive)) && !((origin_x == x_val-1) && (origin_y == y_val-1)) )
            theHive.push(new Array (x_val-1, y_val-1));

        if (isHexInternalToHive(x_val-1, y_val) && !(isHexInStack(new Array(x_val-1, y_val), theHive)) && !((origin_x == x_val-1) && (origin_y == y_val)) )
            theHive.push(new Array (x_val-1, y_val));

        if (isHexInternalToHive(x_val, y_val+1) && !(isHexInStack(new Array(x_val, y_val+1), theHive)) && !((origin_x == x_val) && (origin_y == y_val+1)) )
            theHive.push(new Array (x_val, y_val+1));

        if (isHexInternalToHive(x_val+1, y_val+1) && !(isHexInStack(new Array(x_val+1, y_val+1), theHive)) && !((origin_x == x_val+1) && (origin_y == y_val+1)) )
            theHive.push(new Array (x_val+1, y_val+1));

        if (isHexInternalToHive(x_val+1, y_val) && !(isHexInStack(new Array(x_val+1, y_val), theHive)) && !((origin_x == x_val+1) && (origin_y == y_val)) )
            theHive.push(new Array (x_val+1, y_val));

        if (isHexInternalToHive(x_val, y_val-1) && !(isHexInStack(new Array(x_val, y_val-1), theHive)) && !((origin_x == x_val) && (origin_y == y_val-1)) )
            theHive.push(new Array (x_val, y_val-1));

    }
    
    return theHive;      


    /**
     * Determines whether a Hex is a part of the hive.  
     * @param   {int} in_x
     *          X Value of hex coordinates.
     * @param   {int} in_y
     *          Y value of hex coordinates.
     */
    function isHexInternalToHive(in_x, in_y)
    {
        if (GRID_ARRAY[in_x][in_y] != 0) {
            return 1;
        }
        else {
            if (!GRID_ARRAY[in_x-1][in_y-1] && !GRID_ARRAY[in_x][in_y-1])
                return 0;
            if (!GRID_ARRAY[in_x-1][in_y] && !GRID_ARRAY[in_x-1][in_y-1])
                return 0;
            if (!GRID_ARRAY[in_x][in_y+1] && !GRID_ARRAY[in_x-1][in_y])
                return 0;
            if (!GRID_ARRAY[in_x+1][in_y+1] && !GRID_ARRAY[in_x][in_y+1])
                return 0;
            if (!GRID_ARRAY[in_x+1][in_y] && !GRID_ARRAY[in_x+1][in_y+1])
                return 0;
            if (!GRID_ARRAY[in_x][in_y-1] && !GRID_ARRAY[in_x+1][in_y])
                return 0;
            return 1;                      
        }
     
    }
}

/**
 * Determines who the current player is by the current move number (because players take turns).
 * @param   {int} move
 *          The move number
 * @return  {String}
 *          Either "white" or "black" is returned.
 */
function getCurrentColorByMove(move) {
    var color;
    
    if (move % 2 == 0)
        color = "white";
    else 
        color = "black";
        
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
function isHexConnectedToBoard(origin, dest) { 
    // the array hasn't been updated yet, so piece still in origin location
    var dest_x = parseInt(dest.substring(0, dest.indexOf(","))); 
    var dest_y = parseInt(dest.substring(dest.indexOf(",")+1));
    
    var temp_array = Array();
    temp_array = arrayCloner(GRID_ARRAY);
    
    if (origin) {
        var origin_x = parseInt(origin.substring(0, origin.indexOf(","))); 
        var origin_y = parseInt(origin.substring(origin.indexOf(",")+1));   
        removeTopPieceFromArrayCell(temp_array, origin_x, origin_y);
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
    
    var val_a = getTopPieceInArray(dest_x-1, dest_y-1);
    var val_b = getTopPieceInArray(dest_x-1, dest_y);
    var val_c = getTopPieceInArray(dest_x, dest_y-1);
    var val_d = getTopPieceInArray(dest_x, dest_y+1);
    var val_e = getTopPieceInArray(dest_x+1, dest_y);
    var val_f = getTopPieceInArray(dest_x+1, dest_y+1);
    
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
 * @return  {Array}
 *          Returns 2-element array. array[0] = invalid_flag; array[1] = error_string; 
 */
function isMoveInvalid(in_origin, in_dest, in_piece_id) {
    var current_color = getCurrentColorByMove(NUM_MOVES);
    var dest_x = in_dest.substring(0, in_dest.indexOf(",")); 
    var dest_y = in_dest.substring(in_dest.indexOf(",")+1);
    var invalid_flag = 0;
    var error_string = "";
    
    //alert("ORIGIN " + in_origin);
    
    if (!in_origin) { // IF PIECE BEING PLACED FOR FIRST TIME, CHECK IF MOVE FOLLOWS RULES
        
        // RULE CHECK: MAKE SURE BEE IS PLACED BY COMPLETION OF 4TH MOVE (1)   
        if ( !invalid_flag && (current_color = "white") && (NUM_MOVES == 6) && (in_piece_id.indexOf( "white_bee1")==-1) && !(WHITE_BEE_PLACED) ) {
            invalid_flag += 1;
            error_string += "This is your fourth move, so the bee must be placed by this point. Please put the bee on the board.<br/>";
        }
        else if ( !invalid_flag && (current_color = "black") && (NUM_MOVES == 7) && (in_piece_id.indexOf( "black_bee1")==-1) && !(BLACK_BEE_PLACED) ) {
            invalid_flag += 1;
            error_string += "This is your fourth move, so the bee must be placed by this point. Please put the bee on the board.<br/>";
        }
        
        // RULE CHECK: MAKE SURE HEX ISN'T ALREADY OCCUPIED WHEN FIRST PLACEING PIECE (2)
        if (!invalid_flag && GRID_ARRAY[dest_x][dest_y] && NUM_MOVES != 0) { 
            invalid_flag += 2;
            error_string += "When moving a piece onto the board, it can't be placed on an occupied space.<br/>";
        }

        // RULE CHECK: MAKE SURE DESTINATION HEX IS CONNECTED TO BOARD (4)
        if (!invalid_flag && !isHexConnectedToBoard(in_origin, in_dest) && NUM_MOVES != 0) {
            invalid_flag += 4;
            error_string += "A piece coming onto the board must be placed onto the board touching one of your pieces.<br/>";
        } 
                    
        // RULE CHECK: MAKE SURE PIECE NOT TOUCHING OPPONENT'S COLOR WHEN PLACED (8)
        if (!invalid_flag && isHexTouchingOpponent(in_piece_id, in_dest) && NUM_MOVES > 1) {
            invalid_flag += 8;
            error_string += "A piece coming onto the board can't be placed touching an opponent's piece.<br/>"; 
        }
                  

    }
    else { // IF PIECE ALREADY ON BOARD
        var origin_x = parseInt(in_origin.substring(0, in_origin.indexOf(","))); 
        var origin_y = parseInt(in_origin.substring(in_origin.indexOf(",")+1));
        
        // RULE CHECK: MAKE SURE PIECE ISN'T BEING PUT SOMEWHERE UNCONNECTED TO HIVE  (4)
        if (!invalid_flag && !isHexConnectedToBoard(in_origin, in_dest) && NUM_MOVES != 0) {
            invalid_flag += 4;
            error_string += "The piece must move to a location touching the hive.<br/>";
            $("#" + in_piece_id).hide();
        }
        
        // RULE CHECK: MAKE SURE MOVE DOESN'T VIOLATE ONE-HIVE RULE UPON PICKING UP PIECE (16)
        if (!invalid_flag && !isOneHiveMaintained(in_origin)) {
            invalid_flag += 16;
            error_string += "The move you are trying to make violates the one hive rule. When you pick up your piece to move it, the hive can't segment into two.<br/>";
            $("#" + in_piece_id).hide();
        }
                        
        // RULE CHECK: CANT MOVE PIECE ON BOARD UNTIL QUEEN PLACED (32)
        if ( !invalid_flag && (current_color == "white") && !WHITE_BEE_PLACED ) {
            invalid_flag+=32;
            error_string += "You can't move a piece that's on the board until the queen has been placed.<br/>";
            $("#" + in_piece_id).hide();
        }
        else if ( !invalid_flag && (current_color == "black") && !BLACK_BEE_PLACED ) {
            invalid_flag+=32;
            error_string += "You can't move a piece that's on the board until the queen has been placed.<br/>";
            $("#" + in_piece_id).hide();                    
        }
        
        // RULE CHECK: CANNOT CLIMB ATOP OTHER PIECE (ONLY BEETLE) (64)
        if (!invalid_flag && (in_piece_id.indexOf("beetle") == -1) ) {
            if (GRID_ARRAY[dest_x][dest_y]) {
                invalid_flag+= 64;
                error_string += "That piece may not climb on top of another piece.<br/>";
                $("#" + in_piece_id).hide();
            }
        }
        
        // RULE CHECK: INDIVIDUAL PIECE RULES
        if (!invalid_flag) {
            
            // RULE CHECK; MAKE SURE BEETLE IS ONLY MOVING ONE SPACE (128)
            if (in_piece_id.indexOf("beetle") != -1) {
                if (getDistanceBetweenHexes(in_origin, in_dest) != 1) {
                    invalid_flag += 128;
                    error_string += "The beetle can only move one space, but may move on top of another piece.<br/>";  
                }
            }
            
            // RULE CHECK: MAKE SURE QUEEN IS ONLY MOVING ONE SPACE (128)
            if (in_piece_id.indexOf("bee1") != -1) {
                if (getDistanceBetweenHexes(in_origin, in_dest) != 1) {
                    invalid_flag += 128;
                    error_string += "The queen bee can only move one space.<br/>"; 
                }                   
            }
            
            // RULE CHECK: MAKE SURE GRASSHOPPER IS ONLY MOVING DIAGONALLY AND INTO FIRST EMPTY SPACE (128)
            if (in_piece_id.indexOf("grasshopper") != -1) {
     
                var invalid_jump_flag;
                invalid_jump_flag = isGrasshopperPathInvalid(in_origin, in_dest);
                 
                if (invalid_jump_flag == 3) {
                    invalid_flag += 128;
                    error_string += "The grasshopper must actually jump a piece. It can't just move one spot.<br/>";                
                }
                else if (invalid_jump_flag == 2) {
                    invalid_flag += 128;
                    error_string += "The grasshopper must move on a diagonal and cannot skip any empty spaces while moving.<br/>"; 
                }
                else if (invalid_jump_flag == 1) {
                    invalid_flag += 128;
                    error_string += "The grasshopper must move on a diagonal and cannot skip any empty spaces while moving.\nThere was an empty space at " + empty_space + ".<br/>";
                }
            }
            
            // RULE CHECK: MAKE SURE SPIDER IS MOVING THREE MOVES AROUND OUTSIDE OF BOARD (128)
            if (in_piece_id.indexOf("spider") != -1) {
                var theHive = getOutsideOfHive(in_origin);
                if (!isSpiderPathValid(theHive, in_origin, in_dest)) {
                    invalid_flag += 128;
                    error_string += "The spider must move three spaces around the outside edge of the hive.<br/>"; 
                }
            }
            
            // MRULE CHECK: AKE SURE ANT IS ONLY MOVING ALONG OUTSIDE OF BOARD (128)
            if (in_piece_id.indexOf("ant") != -1) {
                var theHive = getOutsideOfHive(in_origin) ;
                //Logger("FINAL HIVE: " + theHive);
                if (isHexInStack(new Array(dest_x, dest_y), theHive))  {
                    invalid_flag += 128;
                    error_string += "The ant can only move around the outside edge of the hive.<br/>";       
                }
                
            }
            
        }
                
    } 
    
    return [invalid_flag, error_string];    
}

/**
 * Determines whether the hive stays intact (one hive rule) when a move is undertaken. 
 * @param   {String} origin
 *          Contains origin location of move in "8,9" format.
 * @return  {int}
 *          Returns 1 if hive remains intact; returns 0 if hive gets broken when piece lifted.
 */
function isOneHiveMaintained(origin) {
    var stack = Array();
    var temp_xy = Array();
    var origin_x = parseInt(origin.substring(0, origin.indexOf(","))); 
    var origin_y = parseInt(origin.substring(origin.indexOf(",")+1));
    
    // stack will contain all coordinate sets that contain pieces
    for (var i=0; i < GRID_ARRAY.length; i++)
        for (var j=0; j < GRID_ARRAY[i].length; j++) 
            if (GRID_ARRAY[i][j] && !((i == origin_x) && (j == origin_y)) )
                    stack.push(new Array(i,j));
    
    if (GRID_ARRAY[origin_x][origin_y].indexOf(",") != -1) { // if the hex i'm moving piece from is still occupied, add it back
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
        //Logger("ITERATION " + this_num + " STARTED. X/Y = " + x_val + "/" + y_val);
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
    if (stack.length)
        return 0;
    else 
        return 1;
    
}   

/**
 * Determines whether or not a certain color's queen bee is surrounded.
 * @return  {int}
 *          Returns 1 if xxx; Returns 0 if xxx.
 * TODO: This is the function that calls CONTROLLER_EVENT_winnerDeclared(). That's 3 view calls (show/hide popups + buttons) and a DB update. Restructure?
 */
function isBeeSurrounded() {
    //Logger("BEE CHECK STARTED"); 
    var white_bee_surrounded = 0;
    var black_bee_surrounded = 0;
    
    for (var i=1; i < GRID_ARRAY.length-1; i++) {
        for (var j=1; j < GRID_ARRAY[i].length-1; j++) {
            
            if (GRID_ARRAY[i][j]) { // IF THIS SPACE IN SEARCH IS OCCUPIED
                
                if (GRID_ARRAY[i][j].indexOf("white_bee1") != -1) { // WITH A WHITE BEE
                    
                    var a = GRID_ARRAY[i-1][j-1];
                    var b = GRID_ARRAY[i-1][j];
                    var c = GRID_ARRAY[i][j-1];
                    var d = GRID_ARRAY[i][j+1];
                    var e = GRID_ARRAY[i+1][j+1];
                    var f = GRID_ARRAY[i+1][j];
                    
                    if (a != 0 && b != 0 && c != 0 && d != 0 && e != 0 && f != 0) { // AND ALL SURROUNDING SPACES ARE OCCUPIED
                        white_bee_surrounded++;                             
                    }
                }
                if (GRID_ARRAY[i][j].indexOf("black_bee1") != -1) {
                    var a = GRID_ARRAY[i-1][j-1];
                    var b = GRID_ARRAY[i-1][j];
                    var c = GRID_ARRAY[i][j-1];
                    var d = GRID_ARRAY[i][j+1];
                    var e = GRID_ARRAY[i+1][j+1];
                    var f = GRID_ARRAY[i+1][j];
                    
                    if (a != 0 && b != 0 && c != 0 && d != 0 && e != 0 && f != 0) { // IF ALL SURROUNDING HEXES ARE OCCUPIED
                        black_bee_surrounded++;
                    }
                }
            }
        }
    }

    if (black_bee_surrounded && white_bee_surrounded) {
        $("#game_over_text").html("Both players queen bees are surrounded.<br />Game is a draw.");
        return 3;
    }
    else if (black_bee_surrounded) {  
        $("#game_over_text").html( WHITE_PLAYER_NAME + " has surrounded " + BLACK_PLAYER_NAME + "'s queen bee.<br />" + WHITE_PLAYER_NAME + " wins.");
        return 2;
    }
    else if (white_bee_surrounded) {
        $("#game_over_text").html( BLACK_PLAYER_NAME + " has surrounded " + WHITE_PLAYER_NAME + "'s queen bee.<br />" + BLACK_PLAYER_NAME + " wins.");
        return 1;
    }
    else {
        return 0;
    }
        
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
function isSpiderPathValid(in_hive, in_origin, in_dest) {
    
    var skip_index = 0;
    var skip_index_2 = 0;
    
    var origin_x = in_origin.substring(0, in_origin.indexOf(","));
    var origin_y = in_origin.substring(in_origin.indexOf(",") + 1);
    
    // right now hive only contains "hive pieces" + blocked in ones
    var outside_hive = getHexesOutsideHive(in_hive);
    
    //Logger("ORIGIN / DEST / HIVE / OUTSIDE\n" + in_origin + " / " + in_dest + "\n" + printNiceArray(in_hive) + "\n / " + printNiceArray(outside_hive) );
    
    for (var i=0; i < outside_hive.length; i++) {
        var h1 = origin_x + "," + origin_y;
        var h2 = outside_hive[i][0] + "," + outside_hive[i][1];
        
        if ( (getDistanceBetweenHexes(h1, h2) == 1) ) {
            skip_index = i;
            
            for (var j=0; j < outside_hive.length; j++) {
                var h3 = outside_hive[j][0] + "," + outside_hive[j][1];
                
                if (j != skip_index) {
                   
                    if (getDistanceBetweenHexes(h2, h3) == 1) {
                        skip_index_2 = j;
                     
                        for (var k=0; k < outside_hive.length; k++) {
                            var h4 = outside_hive[k][0] + "," + outside_hive[k][1];
                        
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
 *          Returns 0 if valid move; 1 if it skips an empty space; 2 if it doesn't move on a diagonal; 3 if it only moves one space.
 */
function isGrasshopperPathInvalid(in_origin, in_dest) {
   
    var origin_x = parseInt(in_origin.substring(0, in_origin.indexOf(","))); 
    var origin_y = parseInt(in_origin.substring(in_origin.indexOf(",")+1));
    var dest_x = in_dest.substring(0, in_dest.indexOf(",")); 
    var dest_y = in_dest.substring(in_dest.indexOf(",")+1);
    
    var invalid_jump_flag = 0;
        
    if (getDistanceBetweenHexes(in_origin, in_dest) == 1 ) {
        invalid_jump_flag = 3;
    }
    else if (  (dest_y == origin_y) && (dest_x > origin_x) ) { // if y is same and x gets bigger
        for (var i=origin_x + 1; i < dest_x; i++) {
            if (GRID_ARRAY[i][origin_y] == 0) {
                invalid_jump_flag = 1;
                empty_space = "(" + i + "," + origin_y + ")";
                break;
            }
        }
    }
    else if (  (dest_y == origin_y) && (origin_x > dest_x) ) { // if y is same and x gets smaller
        for (var i=origin_x - 1; i > dest_x; i--) {
            if (GRID_ARRAY[i][origin_y] == 0) {
                invalid_jump_flag = 1;
                empty_space = "(" + i + "," + origin_y + ")";
                break;
            }
        }
    }
    else if (  (dest_y > origin_y) && (dest_x > origin_x) && ((dest_x - origin_x) == (dest_y - origin_y)) ) { // y gets bigger, x gets bigger, diagonal
        for (var i=origin_x + 1; i < dest_x; i++) {
            if (GRID_ARRAY[i][origin_y-origin_x+i] == 0) {
                invalid_jump_flag = 1;
                empty_space = "(" + i + "," + origin_y + ")";
                break;
            }
        }
    }
    else if (  (origin_y > origin_x) && (origin_x > dest_x) && ((dest_x-origin_x) == (dest_y - origin_y)) ) { // x gets smaller, y gets smaller, diagonal
        // quadrant 2
        for (var i=origin_x-1; i > dest_x; i--) {
            if (GRID_ARRAY[i][origin_y - origin_x + i] == 0) {
                invalid_jump_flag = 1;
                empty_space = "(" + i + "," + origin_y + ")";
                break;
            }
        }
    }
    else if (  (dest_x == origin_x) && (dest_y > origin_y) ) { // if x is the same and y gets bigger
        for (var i=origin_y + 1; i < dest_y; i++) {
            if (GRID_ARRAY[origin_x][i] == 0) {
                invalid_jump_flag = 1;
                empty_space = "(" + origin_x + "," + i + ")";
                break;
            }
        }
    }    
    else if (  (dest_x == origin_x) && (origin_y > dest_y) ) { // if x is the same and y gets smaller
        for (var i=origin_y - 1; i > dest_y; i--) {
            if (GRID_ARRAY[origin_x][i] == 0) {
                invalid_jump_flag = 1;
                empty_space = "(" + origin_x + "," + i + ")";
                break;
            }
        }
    }
    else { // ILLEGAL MOVE NOT ON DIAGONAL
        invalid_jump_flag = 2;
    }
    
    return invalid_jump_flag;    
}
