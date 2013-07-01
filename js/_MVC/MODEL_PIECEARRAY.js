var PIECE_ARRAY; 

function MODEL_PIECEARRAY_initialize() {
    PIECE_ARRAY = new Array();
    
    for (var i=0; i < NUM_BEES; i++) {
        PIECE_ARRAY["white_bee" + (i+1)] = "";
        PIECE_ARRAY["black_bee" + (i+1)] = "";
    }
    for (var i=0; i < NUM_BEETLES; i++) {
        PIECE_ARRAY["white_beetle" + (i+1)] = "";
        PIECE_ARRAY["black_beetle" + (i+1)] = "";
    }
    for (var i=0; i < NUM_SPIDERS; i++) {
        PIECE_ARRAY["white_spider" + (i+1)] = "";
        PIECE_ARRAY["black_spider" + (i+1)] = "";
    }
    for (var i=0; i < NUM_LADYBUGS; i++) {
        PIECE_ARRAY["white_ladybug" + (i+1)] = "";
        PIECE_ARRAY["black_ladybug" + (i+1)] = "";
    }
    for (var i=0; i < NUM_MOSQUITOES; i++) {
        PIECE_ARRAY["white_mosquito" + (i+1)] = "";
        PIECE_ARRAY["black_mosquito" + (i+1)] = "";
    }
    for (var i=0; i < NUM_GRASSHOPPERS; i++) {
        PIECE_ARRAY["white_grasshopper" + (i+1)] = "";
        PIECE_ARRAY["black_grasshopper" + (i+1)] = "";
    }
    for (var i=0; i < NUM_ANTS; i++) {
        PIECE_ARRAY["white_ant" + (i+1)] = "";
        PIECE_ARRAY["black_ant" + (i+1)] = "";
    }
    for (var key in PIECE_ARRAY) {
    }              
}
  

/**
 * Insert function description here. 
 * @param   {String} destination_string
 * @param   {String} piece_id
 */
function MODEL_PIECEARRAY_addPiece(destination_string, piece_id)
{
    PIECE_ARRAY[piece_id] = destination_string;
}
    
/**
 * Removes top piece from cell in PIECE_ARRAY.
 * @param   {String} source_point
 *          String in "x,y" format containing grid location to remove top piece from.
 */
function MODEL_PIECEARRAY_removePiece(piece_id)
{
    PIECE_ARRAY[piece_id] = "";
}

/**
 * 
 * @param {Object} in_piece
 */
function MODEL_PIECEARRAY_getPieceLocation(in_piece) {
    return PIECE_ARRAY[in_piece];
}

/**
 * 
 */
function MODEL_PIECE_ARRAY_print() {
    var returnval = "";
    for (var key in PIECE_ARRAY)
        if (PIECE_ARRAY[key] != "")
            returnval += key + ": " + PIECE_ARRAY[key] + "    ";
    
    return returnval;
}
