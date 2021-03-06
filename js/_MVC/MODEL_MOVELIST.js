var MOVELIST;

function MODEL_MOVELIST_initialize() {
    MOVELIST = new Array();
}

function MODEL_MOVELIST_getNumberOfMoves() {
    return MOVELIST.length;
}
function MODEL_MOVELIST_getMovelist() {
    var movelist = arrayCloner(MOVELIST);
    return movelist;
}

function MODEL_MOVELIST_addMove(piece_id, origin_string, destination_string) {
    MOVELIST.push(new Array(piece_id, origin_string, destination_string));
}
    
function MODEL_MOVELIST_getLastMove() {
    return MOVELIST[MOVELIST.length-1];
}

function MODEL_MOVELIST_removeLastMove() {
    return MOVELIST.pop();
}
