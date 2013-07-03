//TODO: This can be rewritten without global array.

/**
 * Computer is always black right now...
 */
function CONTROLLER_doComputerMove(in_color) {
    var thinking_time = 2000;
    var origin_hex = "";
    var dest_array = new Array();
    var dest_hex;
    var the_piece = "";
    var the_index = 0;
    var random_move_index = 0;
    var in_grid = MODEL_GRIDARRAY_getGridArray();      
    var computer_color = in_color;
    var opponent_color = (computer_color == "white") ? ("black") : ("white");
    
    // This takes care of iterating through strategies and choosing a successful move       
    setTimeout(function(){            
        if (NUM_MOVES < 8)
            doOpening();    
        else
            doEndgame();                         
        CONTROLLER_EVENT_attemptMove(origin_hex, dest_hex, the_piece);        
        //origin_hex = (origin_hex == "") ? ("off the board") : (PIECE_ARRAY[the_piece] != "");                
        //var message = "A " + the_piece.substr(0, 5) + " " + the_piece.substring(6, the_piece.length-1) + " was moved from " + origin_hex + " to [" + dest_hex + "]";            
        //VIEW_showInGamePopup("COMPUTER HAS MOVED", message, 3500),                             
    }, thinking_time);   
                    

    function doOpening() {
        do {
            //MOVE 1 - Randomly choose between beetle and spider...no bee or ant.
            if (NUM_MOVES == 0) { // THIS DOESNT WORK YET -- TRYING TO MAKE IT SO COMPUTER CAN BE FIRST AS WELL
                var starting_array = Array("_bee1", "_ant1", "_beetle1", "_spider1");
                the_index = Math.floor((Math.random()*2)+2);
                the_piece = computer_color + starting_array[the_index];
                dest_hex = HIVE_ORIGIN;
            }
            else if (NUM_MOVES == 1) {
                var starting_array = Array("_bee1", "_ant1", "_beetle1", "_spider1");
                the_index = Math.floor((Math.random()*2)+2);
                the_piece = computer_color + starting_array[the_index];  
                dest_array = getPotentialDestinations(the_piece, in_grid);
                dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];             
            }
            
            // MOVE 2 - Randomly choose between leftovers among bee, ant, beetle, and spider
            else if (NUM_MOVES < 4) {
                var starting_array = Array("_bee1", "_ant1", "_beetle1", "_spider1");
                do {
                    the_index = Math.floor((Math.random()*4));
                    the_piece = computer_color + starting_array[the_index];
                    dest_array = getPotentialDestinations(the_piece, in_grid);
                    dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)]; }
                while (PIECE_ARRAY[the_piece] != "");            
            }
            
            // MOVE 3 - Randomly choose between leftover among bee, ant, beetle, and spider
            else if (NUM_MOVES < 6) {
                var starting_array = Array("_bee1", "_ant1", "_beetle1", "_spider1");
                // Loop runs again if piece already on board or if no potential destination hexes for it
                do {
                    the_index = Math.floor(Math.random()*4);
                    the_piece = computer_color + starting_array[the_index];
                    dest_array = getPotentialDestinations(the_piece, in_grid);               
                    dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)]; }                        
                while ((PIECE_ARRAY[the_piece] != "") || (dest_array.length == 0));
            }
            
            // MOVE 4 - Choose leftover one between bee, grasshopper, beetle, and spider
            else if (NUM_MOVES < 8) {        
                var starting_array = Array("_bee1", "_ant1", "_beetle1", "_spider1");
                // Loop runs again if piece already on board or if no potential destination hexes for it
                do {
                    the_index = Math.floor(Math.random()*4);
                    the_piece = computer_color + starting_array[the_index];
                    dest_array = getPotentialDestinations(the_piece, in_grid);
                    dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)]; }
                while ((PIECE_ARRAY[the_piece] != "") || (dest_array.length == 0));                                    
            }
        } while ( isMoveValid("", dest_hex, the_piece, in_grid) != 1 );
        
        Logger("**Move " + Math.ceil((NUM_MOVES+1)/2) + " for " + getCurrentColorByMove(NUM_MOVES) + " (opening strategy): " + the_piece + ": [" + origin_hex + "] -> [" + dest_hex + "]");
    }
    
    function doEndgame() {
                  
        // MOVES 5 -> END  - Follows a single strategy                 
        var touching_my_queen = getSurroundingPiecesByColor(computer_color, computer_color + "_bee1", in_grid);
        var empties = getEmptyHexesSurroundingPiece(opponent_color + "_bee1", in_grid);
        var pinnables = getPinHexes(opponent_color + "_bee1", in_grid);
        var my_board_pieces = getPiecesOnBoardByColor(computer_color);
        var distance = 0;
        var return_value = 0;
        var xy_val = new Array();
        var breakflag = 0;
        var extra = "";
        var strategy_string = "Strategy ("
        var is_opp_queen_trapped = isPieceTrapped(PIECE_ARRAY[opponent_color + "_bee1"], opponent_color + "_bee1", in_grid);
        var is_my_queen_trapped = isPieceTrapped(PIECE_ARRAY[computer_color + "_bee1"], computer_color + "_bee1", in_grid);            
        var pieces_around_my_queen = getNumberOfPiecesSurroundingHex(PIECE_ARRAY[computer_color + '_bee1'], in_grid);
        var pieces_around_opponent_queen = getNumberOfPiecesSurroundingHex(PIECE_ARRAY[opponent_color + '_bee1'], in_grid);
        
        // strategy A-1: Test if I can move a piece from my queen to the opponent's queen and PIN IT.
        if (!breakflag) {
            strategy_string += ("A1->");
            for (var i in touching_my_queen) {
                for (var j in pinnables) {
                    xy_val = touching_my_queen[i].split(",");
                    the_piece = getTopPieceFromGridArrayCell(xy_val[0], xy_val[1]);
                    // If move is valid and not touching both queens already, do it. 
                    if ( (isMoveValid(touching_my_queen[i], pinnables[j], the_piece, in_grid) == 1) && (getDistanceBetweenHexes(touching_my_queen[i], PIECE_ARRAY[opponent_color + '_bee1']) != 1) ) {
                        origin_hex = touching_my_queen[i];
                        dest_hex = pinnables[j];
                        breakflag++;
                        break;
                    }
                }
                if (breakflag) {
                    break;
                }
            }
        }  
        
        // strategy A-2: Test if I can move a piece from my queen to the opponent's queen, but NOT PIN IT.            
        if (!breakflag) {
            strategy_string += ("A2->");
            for (var i in touching_my_queen) {
                for (var j in empties) {
                    xy_val = touching_my_queen[i].split(",");
                    the_piece = getTopPieceFromGridArrayCell(xy_val[0], xy_val[1]);
                    // If move is valid and not touching both queens already, do it. 
                    if ( (isMoveValid(touching_my_queen[i], empties[j], the_piece, in_grid) == 1) && (getDistanceBetweenHexes(touching_my_queen[i], PIECE_ARRAY[opponent_color + '_bee1']) != 1) ) {
                        origin_hex = touching_my_queen[i];
                        dest_array
                        dest_hex = empties[j]; 
                        breakflag++;
                        break;
                    }
                }
                if (breakflag) {
                    break;
                }
            }
        }            
    
        // strategy D-1: If my queen isn't trapped and three or more pieces around it, move the queen - UNLESS DESTINATION BAD TOO
        if (!breakflag) { 
            if ( (pieces_around_my_queen > 2) && (pieces_around_my_queen >= pieces_around_opponent_queen) ) {
                strategy_string += ("D1->");
                var temp_array = Array();
                dest_array = Array();
                the_piece = computer_color + "_bee1";
                origin_hex = PIECE_ARRAY[the_piece];
                if ( is_my_queen_trapped == 0 ) {
                    dest_array = getEmptyHexesSurroundingPiece(the_piece, in_grid);
                    for (var i in dest_array) {
                        if (isMoveValid(origin_hex, dest_array[i], the_piece, in_grid) == 1) {
                            if (getNumberOfPiecesSurroundingHex(dest_array[i], in_grid) < pieces_around_my_queen) {
                                dest_hex = dest_array[i];                                                           
                                breakflag++;
                                break;
                            }
                        }
                    }
                }
            }            
        }
    
        // strategy D-2: Moves first piece possible that's touching my queen into future attack position
        if (!breakflag) { 
            if ( (pieces_around_my_queen > 2) && (pieces_around_my_queen > pieces_around_opponent_queen) ) {
                strategy_string += ("D2->");
                dest_array = Array();
                var first_move_locs = new Array();
                var second_move_locs = new Array();
                var queen_spaces = new Array();
                var second_grid = arrayCloner(in_grid);
                // Checks every piece touching own queen
                for (var i in touching_my_queen) {
                    the_piece = MODEL_GRIDARRAY_getTopPieceAtLocation(touching_my_queen[i], in_grid);
                    origin_hex = PIECE_ARRAY[the_piece]
                    first_move_locs = getPotentialDestinations(the_piece, in_grid);
                    for (var j in first_move_locs) {
                        addPieceToGenericGridArray(first_move_locs[j], the_piece, second_grid);
                        second_move_locs = getPotentialDestinations(the_piece, second_grid);
                        for (var k in second_move_locs) {
                            queen_spaces = getEmptyHexesSurroundingPiece(the_piece, in_grid);
                            for (var l in queen_spaces) {
                                if (queen_spaces[l] == second_move_locs[k]) {
                                    if ( isMoveValid(origin_hex, first_move_locs[j], the_piece, in_grid) == 1 ) {
                                        dest_hex = first_move_locs[j];
                                        extra = " (eventually going to " + queen_spaces[l] + ")";           
                                        breakflag++;
                                        break;
                                    }
                                }
                            } // END L
                            if (breakflag) {
                                break;
                            }
                        } // END K
                        if (breakflag) {
                            break;
                        }
                    } // END J
                    if (breakflag) {
                        break;
                    }          
                } // END I
            }            
        }
                                
        // strategy D-3: Moves first piece possible that's touching my queen -- COULD MOVE IT ANYWHERE
        if (!breakflag) { 
            if ( (pieces_around_my_queen >= 4) && (pieces_around_my_queen > pieces_around_opponent_queen) ) {
                strategy_string += ("D3->");
                dest_array = Array();
                origin_hex = "";
                // Checks every piece touching own queen
                for (var i in touching_my_queen) {
                    the_piece = MODEL_GRIDARRAY_getTopPieceAtLocation(touching_my_queen[i], in_grid);
                    origin_hex = PIECE_ARRAY[the_piece];
                    dest_array = getPotentialDestinations(the_piece, in_grid);
                    // If destination isn't touching queen, do move
                    for (var i in dest_array) {
                        if (getDistanceBetweenHexes(dest_array[i], PIECE_ARRAY[computer_color + "_bee1"]) != 1) {
                            if (isMoveValid(origin_hex, dest_array[i], the_piece, in_grid) == 1) {
                                dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];
                                breakflag++;
                                break;
                            }
                        }
                    }
                    if (breakflag) {
                        break;
                    }                       
                }
            }            
        }
        
        // strategy O-1: If opponent's queen isn't pinned yet, try to pin it in one move
        if (!breakflag) {
            strategy_string += ("O1->");
            if (is_opp_queen_trapped == 0) {
                var the_queen = opponent_color + "_bee1";
                var my_board_pieces = getPiecesOnBoardByColor(computer_color);
                var pin_hexes = getPinHexes(the_queen, in_grid);
                for (var i in my_board_pieces) {
                    for (var j in pin_hexes) {
                        the_piece = MODEL_GRIDARRAY_getTopPieceAtLocation(PIECE_ARRAY[my_board_pieces[i]], in_grid);
                        if (isMoveValid(PIECE_ARRAY[my_board_pieces[i]], pin_hexes[j], the_piece, in_grid) == 1) {
                            origin_hex = PIECE_ARRAY[my_board_pieces[i]];
                            dest_hex = pin_hexes[j];
                            breakflag++;
                            break;
                        }
                    }
                    if (breakflag) {
                        break;
                    }
                }
            }    
        }
        
        // strategy O-2: Try to move anything to opponent's queen
        if (!breakflag) { 
            strategy_string += ("O2->");
            for (var i in my_board_pieces) {
                for (var j in empties) {
                    xy_val = PIECE_ARRAY[my_board_pieces[i]].split(",");
                    the_piece = getTopPieceFromGridArrayCell(xy_val[0], xy_val[1]);
                    distance = getDistanceBetweenHexes(PIECE_ARRAY[my_board_pieces[i]], PIECE_ARRAY[opponent_color + '_bee1']);
                    // If move is valid and not touching queen already, do it. 
                    if ( (isMoveValid(PIECE_ARRAY[my_board_pieces[i]], empties[j], the_piece, in_grid) == 1) && (distance != 1) ) {
                        origin_hex = PIECE_ARRAY[my_board_pieces[i]];
                        dest_hex = empties[j];
                        breakflag++;
                        break;
                    }
                }
                if (breakflag) {
                    break;
                }
            }            
        }
    
        // strategy O-3: Get piece into attack position from side of board
        if (!breakflag) {
            //Logger("03");
            strategy_string += ("O3->");
            var first_dest_array = getPotentialFirstDestinations(computer_color, in_grid);
            var side_pieces = getPiecesOnSideByColor(computer_color);
            var queen_spaces = getEmptyHexesSurroundingPiece(opponent_color + "_bee1", in_grid);
            var my_grid_array = MODEL_GRIDARRAY_getGridArray();
            origin_hex = "";
            // Pieces sorted in array in ascending order of strength, so weaker pieces placed first.
            for (var i in side_pieces) {
                the_piece = side_pieces[i]; 
                for (var j in first_dest_array) {
                    for (var k in queen_spaces) {                        
                        addPieceToGenericGridArray(first_dest_array[j], the_piece, my_grid_array);
                        if ( (isMoveValid(origin_hex, first_dest_array[j], the_piece, my_grid_array) == 1) && (isMoveValid(first_dest_array[j], queen_spaces[k], side_pieces[i], my_grid_array) == 1) ) {
                            //TODO: Why am I not allowing beetles below? 
                            if ( !( (the_piece.indexOf("beetle") != -1) && (MODEL_GRIDARRAY_getTopPieceAtLocation(queen_spaces[k], my_grid_array).indexOf(computer_color) != -1) ) ) {  
                                dest_hex = first_dest_array[j];
                                extra = " (eventually going to " + queen_spaces[k] + ")";           
                                Logger(the_piece + " to " + first_dest_array[j] + " (eventually going to " + queen_spaces[k] + ")");
                                breakflag++;
                                break;
                            }
                        }
                        //Logger("my_grid_array / first_dest_array = " + my_grid_array.length + " " + first_dest_array[j]);
                        removePieceFromGenericGridArray(my_grid_array, first_dest_array[j]);
                    }
                    if (breakflag) {
                        break;
                    }
                }
                if (breakflag) {
                    break;
                }        
            }
        }
    
        // strategy O-4: Get piece into attack position from on board
        if (!breakflag) {
            //Logger("04");
            strategy_string += ("O4->");
            var board_pieces = getPiecesOnBoardByColor(computer_color); // contains piece IDs
            var first_step_array = new Array();
            var queen_spaces = getEmptyHexesSurroundingPiece(opponent_color + "_bee1", in_grid);
            var test_grid = arrayCloner(in_grid);

            for (var i in board_pieces) {
                if ( getDistanceBetweenHexes(PIECE_ARRAY[board_pieces[i]], PIECE_ARRAY[opponent_color + "_bee1"]) != 1) {
                    first_step_array = getPotentialDestinations(board_pieces[i], in_grid);
                    the_piece = board_pieces[i];
                    origin_hex = PIECE_ARRAY[board_pieces[i]];
                    for (var j in first_step_array) {
                        if ( isMoveValid(origin_hex, first_step_array[j], the_piece, in_grid) == 1) {
                            for (var k in queen_spaces) {
                                addPieceToGenericGridArray(queen_spaces[k], the_piece, test_grid);
                                if ( isMoveValid(first_step_array[j], queen_spaces[k], the_piece, test_grid) == 1) {
                                    dest_hex = first_step_array[j];          
                                    breakflag++;
                                    break;                                
                                }
                                removePieceFromGenericGridArray(test_grid, queen_spaces[k]);
                            }
                            if (breakflag) {
                                break;
                            }
                        }
                    }
                    if (breakflag) {
                        break;
                    }                    
                }

            }
        }
         
        // strategy O-5: Move piece from side of board
        if (!breakflag) {
            //Logger("05");
            strategy_string += ("O5->");
            var priority_list = new Array("bee1", "beetle", "spider", "grasshopper", "ant");
            var side_pieces = getPiecesOnSideByColor(computer_color); // contains piece IDs
            var temp_array = new Array();
            dest_array = new Array();
                  
            for (var h in priority_list) {               
                for (var i in side_pieces) {
                    the_piece = side_pieces[i];
                    if (the_piece.indexOf(priority_list[h]) != -1) {
                        origin_hex = "";
                        temp_array = getPotentialDestinations(the_piece, in_grid);
                        for (var j in temp_array) {
                            if ( isMoveValid(origin_hex, temp_array[j], the_piece, in_grid) == 1) {
                                dest_array.push(temp_array[j]);
                            }                    
                        }
                        if (dest_array.length) {
                            dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];
                            breakflag++;
                            break;
                        }
                    }
                }
                if (breakflag) {
                    break;
                }
            }
        }
        
        
        // strategy O-6: Move piece on board (but not one that's already touching opponent's queen)
        if (!breakflag) {
            //Logger("O6");
            strategy_string += ("O6->");
            var priority_list = new Array("bee1", "beetle", "spider", "grasshopper", "ant");
            priority_list = randomizeArray(priority_list); // algorithm was looping otherwise
            var board_pieces = getPiecesOnBoardByColor(computer_color); // contains piece IDs
            var temp_array = new Array();
            dest_array = [];
            origin_hex = "";
            
            for (var h in priority_list) {               
                for (var i in board_pieces) {
                    if ( getDistanceBetweenHexes(PIECE_ARRAY[board_pieces[i]], PIECE_ARRAY[opponent_color + "_bee1"]) != 1) {
                        if (board_pieces[i].indexOf(priority_list[h]) != -1) {
                            the_piece = board_pieces[i];
                            origin_hex = PIECE_ARRAY[board_pieces[i]];
                            temp_array = getPotentialDestinations(the_piece, in_grid);
                            for (var j in temp_array) {
                                if ( isMoveValid(origin_hex, temp_array[j], the_piece, in_grid) == 1) {
                                    dest_array.push(temp_array[j]);
                                }                    
                            }
                            if (dest_array.length) {
                                dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];
                                breakflag++;
                                break;
                            }
                        }
                    }
                }
                if (breakflag) {
                    break;
                }
            }
        }

        // strategy O-7: Move piece on board
        if (!breakflag) {
            //Logger("O7");
            strategy_string += ("O7->");
            var priority_list = new Array("bee1", "beetle", "spider", "grasshopper", "ant");
            priority_list = randomizeArray(priority_list); // algorithm was looping otherwise
            var board_pieces = getPiecesOnBoardByColor(computer_color); // contains piece IDs
            var temp_array = new Array();
            dest_array = new Array();
            origin_hex = "";
            
            for (var h in priority_list) {               
                for (var i in board_pieces) {
                    if (board_pieces[i].indexOf(priority_list[h]) != -1) {
                        the_piece = board_pieces[i];
                        origin_hex = PIECE_ARRAY[board_pieces[i]];
                        dest_array = getPotentialDestinations(the_piece, in_grid);
                        for (var j in dest_array) {
                            if ( isMoveValid(origin_hex, dest_array[j], the_piece, in_grid) == 1) {
                                dest_hex = dest_array[j];
                                breakflag++;
                                break;
                            }                    
                        }
                        if (breakflag) {
                            break;
                        }
                    }
                }
                if (breakflag) {
                    break;
                }
            }
        }
        
        if (!breakflag) {
            Logger("NO MOVES POSSIBLE. COMPUTER MUST RESIGN.");
            CONTROLLER_EVENT_resignGame("Computer");
        }
        else {
            strategy_string = strategy_string.substr(0, strategy_string.length-2) + (")");
            Logger("**Move " + Math.ceil((NUM_MOVES+1)/2) + " for " + getCurrentColorByMove(NUM_MOVES) + " " + strategy_string + " = " + the_piece + ": [" + origin_hex + "] -> [" + dest_hex + "]"); 
                       
        }
        
    
    } 

}














/**
 * Gets hexes around the hive that are being touched by two or more pieces.
 * @param   {Array} in_array
 * @param   {Array} in_grid
 * @return  {Array}
 */
function getVSpots(in_array, in_grid) {
    var the_hive = getHive(in_grid);
    var returnArray = new Array();
    var potential_hex = "";
    var hex_string = "";
    var counter = 0;
    for (var i in in_array) {
        counter = 0;
        potential_hex = in_array[i];
        for (var j in the_hive) {
            hive_hex = the_hive[j][0] + "," + the_hive[j][1];
            if (getDistanceBetweenHexes(potential_hex, hive_hex) == 1) {
                returnArray.push(potential_hex);               
            }
        }
    }
    return returnArray;    
}

/**
 * 
 */
function getRandomPiece(piece_color, in_source) {
    var dest_array = arrayCloner(PIECE_ARRAY);
    var counter;
    var index;
    var rand;
    var randomPiece;
    var piece_source;
    var sideflag = 0;
    var boardflag = 0;
    
    for (var piece in PIECE_ARRAY) {
        if (PIECE_ARRAY[piece] == "") {
            sideflag++;
        }
        else {
            boardflag++;
        }
    }  
    if ( (in_source == "side") && (!sideflag) )
        return "";
    else if ( (in_source == "board") && (!boardflag) )
        return "";
    
    
    do {
        randomPiece = "";
        piece_source = "";
        rand = Math.random();
        index = Math.floor(rand * NUM_PIECES * 2);
        counter = 0;
        for (var piece in PIECE_ARRAY) {
            if (counter == index) { 
                if (PIECE_ARRAY[piece] == "")
                    piece_source = "side";
                else
                    piece_source = "board";
                randomPiece = piece;
                break; 
            }
            else {
                counter++; 
            }
        }       
    } 
    while ( (randomPiece.indexOf(piece_color) == -1) || (in_source != piece_source) );
    
    return randomPiece;    
}

/**
 * 
 * @param   {String} in_piece_id
 *          The DOM ID of piece being moved
 * @return  {Array} destArray
 *          An array containing string representations of all potential destination hexes for a piece
 */
function getPotentialDestinations(in_piece_id, in_grid) {
    
    var destArray = new Array();
    
    if (in_piece_id == "") {
        return destArray;
    }

    var breakflag;
    var the_hive = getHive(in_grid);
    var origin = PIECE_ARRAY[in_piece_id];
    
    var color = (in_piece_id.indexOf("white") != -1) ? ("white") : ("black");

    
    // If first move, put piece in middle of board.
    if (NUM_MOVES == 0) {
        destArray.push(HIVE_ORIGIN); 
    }   
    // If second move, put piece somewhere touching opponent's.
    else if (NUM_MOVES == 1) {
        destArray = getSurroundingHexes(HIVE_ORIGIN);
    }
    // If third move or later...
    else { 
        // If piece is already on board and not trapped
        if ((origin != "") && (isPieceTrapped(origin, in_piece_id, in_grid) == 0)) {
            if (in_piece_id.indexOf("ant") != -1) {
                destArray = getPotentialAntMoves(origin, in_piece_id, in_grid);   
            }                
            else if (in_piece_id.indexOf("grasshopper") != -1) {
                destArray = getPotentialGrasshopperMoves(origin, in_piece_id, in_grid); 
            }                    
            else if (in_piece_id.indexOf("spider") != -1) {
                destArray = getPotentialSpiderMoves(origin, in_piece_id, in_grid);  
            }                                       
            else if (in_piece_id.indexOf("beetle") != -1) {
                destArray = getPotentialBeetleMoves(origin, in_piece_id, in_grid);  
            }    
            else if (in_piece_id.indexOf("bee1") != -1) {
                destArray = getPotentialBeeMoves(origin, in_piece_id, in_grid);    
            }
            else if (in_piece_id.indexOf("mosquito") != -1) {
                destArray = getPotentialMosquitoMoves(origin, in_piece_id, in_grid);   
            }
            else if (in_piece_id.indexOf("ladybug") != -1) {
                destArray = getPotentialLadybugMoves(origin, in_piece_id, in_grid);  
            }                     
        }
        // If piece hasn't been put into play yet.
        else {
            destArray = getPotentialFirstDestinations(color, in_grid);     
        }
    }
    
    return destArray;
}

/**
 * 
 */
function getPotentialFirstDestinations(in_color, in_grid) {
    var breakflag;
    var the_hive = getHive(in_grid);
    var outside_hive = getAllHexesOutsideHive(in_grid);
    var destArray = new Array();
    
    for (var i in outside_hive) {
        breakflag = 0;
        for (var j in the_hive) {
            var hivePieceString = the_hive[j][0] + "," + the_hive[j][1];
            var outsideHexString = outside_hive[i][0] + "," + outside_hive[i][1];
            // If outside space is touching opponent hex in hive, break loop and move onto new outside hex
            if (getDistanceBetweenHexes(hivePieceString, outsideHexString) == 1) {
                var topPiece = getTopPieceFromGridArrayCell(the_hive[j][0], the_hive[j][1]);
                if (topPiece.indexOf(in_color) == -1) {
                    breakflag++;
                    break; 
                }
            }
        }
        if (!breakflag)
            destArray.push(outsideHexString);
    }      
    
    return destArray;
}

/**
 * 
 * @param   {String} in_origin
 * @param   {String} in_hive
 * @return  {Array}
 */
function getPotentialAntMoves(in_origin, in_piece_id, in_grid) {
    var string_array = new Array();
    var temp_array = getHexesOutsideHiveWithoutPiece(in_origin, in_grid);   
    for (var i in temp_array) {
        if (isMoveValid(in_origin, temp_array[i], in_piece_id, in_grid) == 1) {
            string_array.push(temp_array[i]);
        }
    } 
         
    return string_array;           
}

/**
 * 
 * @param   {String} in_origin
 * @return  {Array}
 */
function getPotentialBeetleMoves(in_origin, in_piece_id, in_grid) {
    var around_hexes = getSurroundingHexes(in_origin);
    var possible_dest = new Array();
    var adj_flag;
    var hive_flag;
    for (var i in around_hexes) {
        adj_flag = isHexAdjacentToHive(getHive(in_grid), around_hexes[i]);
        hive_flag = isHexInStack(around_hexes[i], getHive(in_grid));
        if ( isMoveValid(in_origin, around_hexes[i], in_piece_id, in_grid) == 1 ) {
            possible_dest.push(around_hexes[i]);
        }
        
    }
    return possible_dest;
}

/**
 * 
 * @param   {String} in_origin
 * @param   {String} in_hive
 * @return  {Array}
 */
function getPotentialBeeMoves(in_origin, in_piece_id, in_grid) {
    var around_hexes = getSurroundingHexes(in_origin);
    var possible_dest = new Array();
    for (var i in around_hexes) {
        if ( isMoveValid(in_origin, around_hexes[i], in_piece_id, in_grid) == 1 ) {
            possible_dest.push(around_hexes[i]);
        }
    }
    return possible_dest;
}

/**
 * 
 * @param   {String} in_origin
 * @param   {String} in_hive
 * @return  {Array}
 */
function getPotentialSpiderMoves(in_origin, in_piece_id, in_grid) {
    var dest_array = getHexesOutsideHiveWithoutPiece(in_origin, in_grid);
    var potential_moves = new Array();
    
    if ( isPieceTrapped(in_origin, in_piece_id, in_grid) == 1 ) {
        return potential_moves;
    }
    for (var i in dest_array) {
        if (isMoveValid(in_origin, dest_array[i], in_piece_id, in_grid) == 1) {
            potential_moves.push(dest_array[i]);
        }
    }
          
    return potential_moves;
}

/**
 * 
 * @param   {String} in_origin
 * @param   {String} in_hive
 * @return  {Array}
 */
function getPotentialGrasshopperMoves(in_origin, in_piece_id, in_grid) {
    var dest_array = getAllHexesOutsideHive(in_grid);
    var potential_moves = new Array();
    var string_loc = "";
    
    for (var i in dest_array) {
        string_loc = dest_array[i][0] + "," + dest_array[i][1];
        if (isMoveValid(in_origin, string_loc, in_piece_id, in_grid) == 1) {
            potential_moves.push(string_loc);
        }
    }
    
    return potential_moves;
}

/**
 * 
 * @param   {String} in_origin
 * @param   {String} in_hive
 * @return  {Array}
 */
function getPotentialMosquitoMoves(in_origin, in_grid) {
    // NOT IMPLEMENTED YET
}

/**
 * 
 * @param   {String} in_origin
 * @param   {String} in_hive
 * @return  {Array}
 */
function getPotentialLadybugMoves(in_origin, in_grid) {
    // NOT IMPLEMENTED YET
}