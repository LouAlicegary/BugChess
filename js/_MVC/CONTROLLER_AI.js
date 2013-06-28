var starting_array = Array("_bee1", "_ant1", "_beetle1", "_spider1");
//TODO: This can be rewritten without global array...otherwise we can't change colors.

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
    var in_grid = new Array();
    in_grid = MODEL_GRIDARRAY_getGridArray();   
    
    var computer_color = in_color;
    var opponent_color;
    if (computer_color == "white") {
        opponent_color = "black";    
    }        
    else {
        opponent_color = "white"; 
    }
        
    setTimeout(function(){            
        //MOVE 1 - Randomly choose between beetle and spider...no bee or ant.
        if (NUM_MOVES == 0) { // THIS DOESNT WORK YET -- TRYING TO MAKE IT SO COMPUTER CAN BE FIRST AS WELL
            the_index = Math.floor((Math.random()*2)+2);
            the_piece = computer_color + starting_array[the_index];
            starting_array.splice(the_index,1); // pops placed piece from starting_array 
            dest_hex = ORIGIN;
            Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (OPENING): " + the_piece + ": " + origin_hex + " -> " + dest_hex);
        }
        else if (NUM_MOVES == 1) {
            the_index = Math.floor((Math.random()*2)+2);
            the_piece = computer_color + starting_array[the_index];
            starting_array.splice(the_index,1);  
            dest_array = getPotentialDestinations(the_piece, in_grid);
            dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];
            Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (OPENING): " + the_piece + ": " + origin_hex + " -> " + dest_hex);             
        }
        // MOVE 2 - Randomly choose between leftovers among ant, beetle, and spider
        else if (NUM_MOVES < 4) {
            the_index = Math.floor((Math.random()*2)+1);
            the_piece = computer_color + starting_array[the_index];
            starting_array.splice(the_index,1); // pops placed piece from starting_array
            dest_array = getPotentialDestinations(the_piece, in_grid);
            dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];
            Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (OPENING): " + the_piece + ": " + origin_hex + " -> " + dest_hex);             
        }
        // MOVE 3 - Randomly choose between leftover among bee, ant, beetle, and spider
        else if (NUM_MOVES < 6) {
            the_index = Math.floor(Math.random()*2);
            the_piece = computer_color + starting_array[the_index];
            starting_array.splice(the_index,1); // pops placed piece from starting_array
            dest_array = getPotentialDestinations(the_piece, in_grid);
            dest_hex = getVSpot(dest_array, in_grid);
            if (dest_hex == "")
                dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];                        
            Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (OPENING): " + the_piece + ": " + origin_hex + " -> " + dest_hex);
        }
        // MOVE 4 - Choose leftover one between bee, grasshopper, beetle, and spider
        else if (NUM_MOVES < 8) {        
            the_index = 0;
            the_piece = computer_color + starting_array[the_index];
            starting_array.splice(the_index,1); // pops placed piece from starting_array
            dest_array = getPotentialDestinations(the_piece, in_grid);
            dest_hex = getVSpot(dest_array, in_grid); 
            if (dest_hex == "")
                dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];                              
            Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (OPENING): " + the_piece + ": " + origin_hex + " -> " + dest_hex);
        }
           
           /*      
        // MOVE 5 - Move ant (try to pin opponent's queen) or place another if it can't be moved
        // TODO: This can be folded into the main part of the game
        else if (NUM_MOVES < 10) {               
            var breakflag = 0;                   
            var pinners = getPinHexes(opponent_color + "_bee1", in_grid);
            var empties = getEmptyHexesSurroundingPiece(opponent_color + "_bee1", in_grid); 
            the_piece = computer_color + "_ant1";
            origin_hex = MODEL_PIECEARRAY_getPieceLocation(the_piece);          
            // If the ant is pinned in, move another onto board
            if (isPieceTrapped(origin_hex, the_piece, in_grid)) {
                the_piece = computer_color + "_ant2";
                origin_hex = ""; 
                dest_array = getPotentialDestinations(the_piece, in_grid);
                dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];
            }
            // Otherwise move ant that's on the board
            else {
                // If queen can be pinned
                if (pinners.length > 0) {
                    for (var i in pinners) {
                        if (isMoveValid(origin_hex, pinners[i], the_piece, in_grid) == 1) {
                            dest_array.push(pinners[i]);
                            breakflag++;
                        } 
                    }
                    dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];                
                }
                // If queen can be touched
                if ( (empties.length > 0) && (breakflag == 0) ) {
                    for (var i in empties) {
                        if (isMoveValid(origin_hex, empties[i], the_piece, in_grid) == 1) {
                            dest_array.push(empties[i]);
                            breakflag++;
                        } 
                    }
                    dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];                
                }
                // If queen can't be pinned or touched, move ant to a random place (this should never happen)            
                if (breakflag == 0)  {
                    dest_array = getPotentialDestinations(the_piece, in_grid);
                    dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];
                }                
            }
            Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (OPENING): " + the_piece + ": " + origin_hex + " -> " + dest_hex);
        } */
       
        // MOVES 6 -> END  - Follows a single strategy                 
        else {
            var touching_my_queen = getMySurroundingPieces(computer_color + "_bee1", in_grid);
            var empties = getEmptyHexesSurroundingPiece(opponent_color + "_bee1", in_grid);
            var pinnables = getPinHexes(opponent_color + "_bee1", in_grid);
            var my_board_pieces = getPlayerPiecesOnBoard(computer_color);
            var the_piece = "";
            var distance = 0;
            var return_value = 0;
            var xy_val = new Array();
            var breakflag = 0;

            var is_opp_queen_trapped = isPieceTrapped(PIECE_ARRAY[opponent_color + "_bee1"], opponent_color + "_bee1", in_grid);
            var is_my_queen_trapped = isPieceTrapped(PIECE_ARRAY[computer_color + "_bee1"], computer_color + "_bee1", in_grid);            
            var pieces_around_my_queen = getNumberOfPiecesSurroundingHex(PIECE_ARRAY[computer_color + '_bee1'], in_grid);
            var pieces_around_opponent_queen = getNumberOfPiecesSurroundingHex(PIECE_ARRAY[opponent_color + '_bee1'], in_grid);
            
            // STRATEGY O/D-1: Test if I can move a piece from my queen to the opponent's queen and PIN IT.
            if (!breakflag) {
                Logger("Attempting Strategy O/D-1");
                for (var i in touching_my_queen) {
                    for (var j in pinnables) {
                        xy_val = hexStringToArray(touching_my_queen[i]);
                        the_piece = getTopPieceFromGridArrayCell(xy_val[0], xy_val[1]);
                        // If move is valid and not touching both queens already, do it. 
                        if ( (isMoveValid(touching_my_queen[i], pinnables[j], the_piece, in_grid) == 1) && (getDistanceBetweenHexes(touching_my_queen[i], PIECE_ARRAY[opponent_color + '_bee1']) != 1) ) {
                            origin_hex = touching_my_queen[i];
                            dest_hex = pinnables[j];
                            Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (STRATEGY O/D-1): " + the_piece + ": " + origin_hex + " -> " + dest_hex); 
                            breakflag++;
                            break;
                        }
                    }
                    if (breakflag) {
                        break;
                    }
                }
            }  
            
            // STRATEGY O/D-2: Test if I can move a piece from my queen to the opponent's queen, but NOT PIN IT.            
            if (!breakflag) {
                Logger("Attempting Strategy O/D-2");
                for (var i in touching_my_queen) {
                    for (var j in empties) {
                        xy_val = hexStringToArray(touching_my_queen[i]);
                        the_piece = getTopPieceFromGridArrayCell(xy_val[0], xy_val[1]);
                        // If move is valid and not touching both queens already, do it. 
                        if ( (isMoveValid(touching_my_queen[i], empties[j], the_piece, in_grid) == 1) && (getDistanceBetweenHexes(touching_my_queen[i], PIECE_ARRAY[opponent_color + '_bee1']) != 1) ) {
                            origin_hex = touching_my_queen[i];
                            dest_array
                            dest_hex = empties[j];
                            Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (STRATEGY O/D-2): " + the_piece + ": " + origin_hex + " -> " + dest_hex); 
                            breakflag++;
                            break;
                        }
                    }
                    if (breakflag) {
                        break;
                    }
                }
            }            

            // STRATEGY D-1: If my queen isn't trapped and three or more pieces around it, move the queen
            if (!breakflag) { 
                if ( (pieces_around_my_queen > 2) && (pieces_around_my_queen >= pieces_around_opponent_queen) ) {
                    Logger("Attempting Strategy D-1");
                    var temp_array = Array();
                    dest_array = Array();
                    the_piece = computer_color + "_bee1";
                    origin_hex = PIECE_ARRAY[the_piece];
                    if ( is_my_queen_trapped == 0 ) {
                        dest_array = getEmptyHexesSurroundingPiece(the_piece, in_grid);
                        for (var i in dest_array) {
                            if (isMoveValid(origin_hex, dest_array[i], the_piece, in_grid) == 1) {
                                dest_hex = dest_array[0];
                                Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (STRATEGY D-1): " + the_piece + ": " + origin_hex + " -> " + dest_hex);                                                            
                                breakflag++;
                                break;
                            }
                        }
                    }
                }            
            }

            // STRATEGY D-2: Moves first piece possible that's touching my queen into future attack position
            if (!breakflag) { 
                if ( (pieces_around_my_queen > 2) && (pieces_around_my_queen > pieces_around_opponent_queen) ) {
                    Logger("Attempting Strategy D-2");
                    dest_array = Array();
                    var first_move_locs = new Array();
                    var second_move_locs = new Array();
                    var queen_spaces = new Array();
                    var second_grid = new Array();
                    second_grid = arrayCloner(in_grid);
                    // Checks every piece touching own queen
                    for (var i in touching_my_queen) {
                        the_piece = getTopPieceAtLocation(touching_my_queen[i], in_grid);
                        origin_hex = PIECE_ARRAY[the_piece]
                        first_move_locs = getPotentialDestinations(the_piece, in_grid);
                        Logger("pre J - " + the_piece);
                        for (var j in first_move_locs) {
                            addPieceToGenericGridArray(first_move_locs[j], the_piece, second_grid);
                            second_move_locs = getPotentialDestinations(the_piece, second_grid);
                            Logger("pre K - " + origin_hex + "->" + first_move_locs[j] );
                            for (var k in second_move_locs) {
                                queen_spaces = getEmptyHexesSurroundingPiece(the_piece, in_grid);
                                Logger("pre L - " + first_move_locs[j] + " -> " + second_move_locs[k]);
                                for (var l in queen_spaces) {
                                    if (queen_spaces[l] == second_move_locs[k]) {
                                        dest_hex = first_move_locs[j];
                                        Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (STRATEGY O-3): " + the_piece + ": " + origin_hex + " -> " + dest_hex + " (eventually going to " + queen_spaces[k] + ")");           
                                        breakflag++;
                                        break;
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
                                    
            // STRATEGY D-3: Moves first piece possible that's touching my queen -- COULD MOVE IT ANYWHERE
            if (!breakflag) { 
                if ( (pieces_around_my_queen >= 4) && (pieces_around_my_queen > pieces_around_opponent_queen) ) {
                    Logger("Attempting Strategy D-3");
                    dest_array = Array();
                    origin_hex = "";
                    // Checks every piece touching own queen
                    for (var i in touching_my_queen) {
                        the_piece = getTopPieceAtLocation(touching_my_queen[i], in_grid);
                        origin_hex = PIECE_ARRAY[the_piece];
                        dest_array = getPotentialDestinations(the_piece, in_grid);
                        // If destination isn't touching queen, do move
                        for (var i in dest_array) {
                            if (getDistanceBetweenHexes(dest_array[i], PIECE_ARRAY[computer_color + "_bee1"]) != 1) {
                                dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];
                                Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (STRATEGY D-3): " + the_piece + ": " + origin_hex + " -> " + dest_hex); 
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
            
            // STRATEGY O-1: If opponent's queen isn't pinned yet, try to pin it in one move
            if (!breakflag) {
                Logger("Attempting Strategy O-1");
                if (is_opp_queen_trapped == 0) {
                    var the_queen = opponent_color + "_bee1";
                    var my_board_pieces = getPlayerPiecesOnBoard(computer_color);
                    var pin_hexes = getPinHexes(the_queen, in_grid);
                    for (var i in my_board_pieces) {
                        for (var j in pin_hexes) {
                            the_piece = getTopPieceAtLocation(PIECE_ARRAY[my_board_pieces[i]], in_grid);
                            Logger("O-1: Testing " + the_piece + " [" + PIECE_ARRAY[my_board_pieces[i]] + "] -> [" + pin_hexes[j] + "]");
                            if (isMoveValid(PIECE_ARRAY[my_board_pieces[i]], pin_hexes[j], the_piece, in_grid) == 1) {
                                origin_hex = PIECE_ARRAY[my_board_pieces[i]];
                                dest_hex = pin_hexes[j];
                                Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (STRATEGY O-1): " + the_piece + ": " + origin_hex + " -> " + dest_hex); 
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
            
            // STRATEGY O-2: Try to move anything to opponent's queen
            if (!breakflag) { 
                Logger("Attempting Strategy O-2");
                for (var i in my_board_pieces) {
                    for (var j in empties) {
                        xy_val = hexStringToArray(PIECE_ARRAY[my_board_pieces[i]]);
                        the_piece = getTopPieceFromGridArrayCell(xy_val[0], xy_val[1]);
                        distance = getDistanceBetweenHexes(PIECE_ARRAY[my_board_pieces[i]], PIECE_ARRAY[opponent_color + '_bee1']);
                        // If move is valid and not touching queen already, do it. 
                        if ( (isMoveValid(PIECE_ARRAY[my_board_pieces[i]], empties[j], the_piece, in_grid) == 1) && (distance != 1) ) {
                            origin_hex = PIECE_ARRAY[my_board_pieces[i]];
                            dest_hex = empties[j];
                            Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (STRATEGY O-2): " + the_piece + ": " + origin_hex + " -> " + dest_hex); 
                            breakflag++;
                            break;
                        }
                    }
                    if (breakflag) {
                        break;
                    }
                }            
            }

            // STRATEGY O-3: Get piece into attack position from off board
            if (!breakflag) {
                Logger("Attempting Strategy O-3");
                var first_dest_array = getPotentialFirstDestinations(computer_color, in_grid);
                var side_pieces = getPlayerPiecesOnSide(computer_color);
                var queen_spaces = getEmptyHexesSurroundingPiece(opponent_color + "_bee1", in_grid);
                var my_grid_array = new Array();
                origin_hex = "";

                // Pieces sorted in array in ascending order of strength, so weaker pieces placed first.
                for (var i in side_pieces) { 
                    for (var j in first_dest_array) {
                        for (var k in queen_spaces) {
                            my_grid_array = MODEL_GRIDARRAY_getGridArray();
                            addPieceToGenericGridArray(first_dest_array[j], side_pieces[i], my_grid_array);
                            if (isMoveValid(first_dest_array[j], queen_spaces[k], side_pieces[i], my_grid_array) == 1) {
                                if ( !((side_pieces[i].indexOf("beetle") != -1) && (getTopPieceAtLocation(queen_spaces[k], my_grid_array).indexOf(computer_color) != -1))) {  
                                    dest_hex = first_dest_array[j];
                                    the_piece = side_pieces[i];
                                    Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (STRATEGY O-3): " + the_piece + ": " + origin_hex + " -> " + dest_hex + " (eventually going to " + queen_spaces[k] + ")");           
                                    breakflag++;
                                    break;
                                }
                            }
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

            // STRATEGY O-4: Get piece into attack position from on board
            if (!breakflag) {
                Logger("Attempting Strategy O-4");
                var board_pieces = getPlayerPiecesOnBoard(computer_color);
                var first_step_array = new Array();
                var queen_spaces = getEmptyHexesSurroundingPiece(opponent_color + "_bee1", in_grid);
                var test_grid = new Array();
                origin_hex = "";
                
                for (var i in board_pieces) {
                    first_step_array = getPotentialDestinations(board_pieces[i], in_grid);
                    for (var j in first_step_array) {
                        for (var k in queen_spaces) {
                            test_grid = arrayCloner(in_grid);
                            addPieceToGenericGridArray(queen_spaces[k], board_pieces[i], test_grid);
                            if (isValidMove(first_step_array[j], queen_spaces[k], board_pieces[i]), test_grid) {
                                dest_hex = first_step_array[i];
                                Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (STRATEGY O-4): " + the_piece + ": " + origin_hex + " -> " + dest_hex);           
                                breakflag++;
                                break;                                
                            }  
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
             
            // STRATEGY O-5: Move piece from off board
            if (!breakflag) {
                Logger("Attempting Strategy O-5");
                dest_array = {};
                origin_hex = "";
                the_piece = getRandomPiece(computer_color, "side");
                dest_array = getPotentialDestinations(the_piece, in_grid);                
                if (dest_array.length) {
                    breakflag++;
                    dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];
                    Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (STRATEGY O-5): " + the_piece + ": " + origin_hex + " -> " + dest_hex);           
                }  
            } 
            
            // STRATEGY O-6: Move piece on board (no moving ones touching queen) 
            if (!breakflag) {
                Logger("Attempting Strategy O-6");
                dest_array = {};
                origin_hex = "";
                do {
                    the_piece = getRandomPiece(computer_color, "board");
                    origin_hex = PIECE_ARRAY[the_piece];
                    dest_array = getPotentialDestinations(the_piece, in_grid);
                    Logger("--move attempt " + the_piece + ": " + printNiceArray(dest_array));                
                } 
                while (!dest_array.length || getDistanceBetweenHexes(origin_hex, PIECE_ARRAY[opponent_color + "_bee1"]) == 1 );
                
                dest_hex = dest_array[Math.floor(Math.random()*dest_array.length)];
                Logger("MOVE " + Math.ceil((NUM_MOVES+1)/2) + " (STRATEGY O-6): " + the_piece + ": " + origin_hex + " -> " + dest_hex);
            }            
        } // end of else
        
        //Logger("MOVE "+ Math.ceil((NUM_MOVES+1)/2) + " BEING ATTEMPTED. PIECE = (" + the_piece + ") MOVE = (" + origin_hex + ") -> (" + dest_hex + ")");
        CONTROLLER_EVENT_attemptMove(origin_hex, dest_hex, the_piece);
      
        setTimeout(function(){
            $('#in_game_header').html("COMPUTER HAS MOVED");
            if (origin_hex == "") {
                origin_hex = "off the board"
            }
            else {
                origin_hex = "[" + origin_hex + "]";
            }
                
            $('#in_game_text').html("A " + the_piece.substr(0, 5) + " " + the_piece.substring(6, the_piece.length-1) + " was moved from " + origin_hex + " to [" + dest_hex + "]");
            //$('#in_game_popup').show();
            
            setTimeout(function(){
                $('#in_game_popup').hide();
            }, 3500); 
        }, 50);             
    
    }, thinking_time);   
                     
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
 * @param {Object} in_array
 */
function getVSpot(in_array, in_grid) {
    var the_hive = getHive(in_grid);
    var potential_hex = "";
    var hex_string = "";
    var counter = 0;
    for (var i=0; i < in_array.length; i++) {
        counter = 0;
        potential_hex = in_array[i];
        for (var j=0; j < the_hive.length; j++) {
            hive_hex = the_hive[j][0] + "," + the_hive[j][1];
            if (getDistanceBetweenHexes(potential_hex, hive_hex) == 1) {
                counter++;               
            }
        }
        if (counter > 1) {
            return potential_hex; // just returns the first V it finds...
        }
    }
    return "";    
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

function getNumberOfPiecesSurroundingHex(in_hex, in_grid) {   
    if (in_hex == "") {
        return -1;
    }
    
    var x_val = parseInt(in_hex.substr(0, in_hex.indexOf(",")));
    var y_val = parseInt(in_hex.substr(in_hex.indexOf(",")+1));
    var counter = 0;
    
    if (in_grid[x_val-1][y_val-1] != "") {
        //Logger("PIECE SURROUNDING HEX FOUND -1/-1");
        counter++;
    }       
    if (in_grid[x_val-1][y_val] != "") {
        //Logger("PIECE SURROUNDING HEX FOUND -1/0");
        counter++;
    }  
    if (in_grid[x_val][y_val-1] != "") {
        //Logger("PIECE SURROUNDING HEX FOUND 0/-1");
        counter++;
    }  
    if (in_grid[x_val][y_val+1] != "") {
        //Logger("PIECE SURROUNDING HEX FOUND 0/1");
        counter++;
    }  
    if (in_grid[x_val+1][y_val] != "") {
        //Logger("PIECE SURROUNDING HEX FOUND 1/0");
        counter++;
    }  
    if (in_grid[x_val+1][y_val+1] != "") {
        //Logger("PIECE SURROUNDING HEX FOUND 1/1");
        counter++;
    }  
   
    return counter;
}

/**
 * 
 * @param
 * @param
 * @return  {Array}
 *          Contains locations where pieces exist in "8,9" format
 */
function getMySurroundingPieces(in_piece_id, in_grid) {
    var in_hex = PIECE_ARRAY[in_piece_id]
    var x_val = parseInt(in_hex.substr(0, in_hex.indexOf(",")));
    var y_val = parseInt(in_hex.substr(in_hex.indexOf(",")+1));
    var counter = 0;
    var the_array = new Array();
    
    var computer_color = "";
    if (in_piece_id.indexOf("white") != -1)
        computer_color = "white";
    else
        computer_color = "black";
    
    if (in_grid[x_val-1][y_val-1]) {
        if (getTopPieceFromGridArrayCell(x_val-1, y_val-1).indexOf(computer_color) != -1)
            the_array.push((x_val-1).toString() + "," + (y_val-1).toString());
    }
    if (in_grid[x_val-1][y_val]) {
        if (getTopPieceFromGridArrayCell(x_val-1, y_val).indexOf(computer_color) != -1)
            the_array.push((x_val-1).toString() + "," + (y_val).toString());
    } 
    if (in_grid[x_val][y_val-1]) {
        if (getTopPieceFromGridArrayCell(x_val, y_val-1).indexOf(computer_color) != -1)
            the_array.push((x_val).toString() + "," + (y_val-1).toString()); 
    }
    if (in_grid[x_val][y_val+1]) {
        if (getTopPieceFromGridArrayCell(x_val, y_val+1).indexOf(computer_color) != -1)
            the_array.push((x_val).toString() + "," + (y_val+1).toString());
    } 
    if (in_grid[x_val+1][y_val]) {
        if (getTopPieceFromGridArrayCell(x_val+1, y_val).indexOf(computer_color) != -1)
            the_array.push((x_val+1).toString() + "," + (y_val).toString());
    }    
    if (in_grid[x_val+1][y_val+1]) {
        if (getTopPieceFromGridArrayCell(x_val+1, y_val+1).indexOf(computer_color) != -1)
            the_array.push((x_val+1).toString() + "," + (y_val+1).toString());
    }
          
    return the_array;
}

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
 * Gets black or white's pieces that are on the board.
 * @param   {String} in_color
 * @return  {Array}
 *          Contains DOM IDs of pieces on board for a specific color 
 */
function getPlayerPiecesOnBoard(in_color) {
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
 *          Contains coordinates in "8,9" form of pieces on board.
 */
function getPlayerPiecesOnSide(in_color) {
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
    var tempArray = new Array();
    var pinArray = new Array();
    var the_hex = PIECE_ARRAY[in_piece_id];
    var surroundingArray = getSurroundingHexes(the_hex);
    var x_val = 0; 
    var y_val = 0;
    
    for (var i in surroundingArray) {
        x_val = surroundingArray[i].substr(0, surroundingArray[i].indexOf(","));
        y_val = surroundingArray[i].substr(surroundingArray[i].indexOf(",")+1);
        if ((in_grid[x_val][y_val]) && (getNumberOfPiecesSurroundingHex(surroundingArray[i], in_grid) == 1))
            return 1;
    }
    return 0;    
}

/**
 * 
 */
function hexStringToArray(in_string) {
    var x_val = in_string.substr(0, in_string.indexOf(","));
    var y_val = in_string.substr(in_string.indexOf(",")+1);
    return Array(x_val, y_val);    
}

/**
 * 
 * @param {Object} in_array
 */
function hexArrayToString(in_array) {
    return String(in_array[0].toString() + "," + in_array[1].toString());
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
    
    var color = "";
    if (in_piece_id.indexOf("white") != -1)
        color = "white";
    else
        color = "black";
    
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
        // If piece is already on board
        if (origin) {
            if (!isPieceTrapped(origin, in_piece_id, in_grid)) {
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
    //var poppedHive = getHive(in_grid);
    var x_val = in_origin.substr(0, in_origin.indexOf(","));
    var y_val = in_origin.substr(in_origin.indexOf(",")+1);
    var string_array = new Array();
    var temp_array = getHexesOutsideHiveWithoutPiece(in_origin);
    var dest_x;
    var dest_y;
    var loc_string;
    
    for (var i in temp_array) {
        dest_x = temp_array[i][0];
        dest_y = temp_array[i][1];
        loc_string = dest_x + "," + dest_y;
        if (isMoveValid(in_origin, loc_string, in_piece_id, in_grid) == 1) {
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
        //Logger("BEETLE FLAGS FOR " + i + " " + around_hexes[i] + " = " + adj_flag + ":" + hive_flag);
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
    var x_val;
    var y_val;
    var loc_string = "";
    
    if ( isPieceTrapped(in_origin, in_piece_id, in_grid) == 1 ) {
        return potential_moves;
    }
    for (var i in dest_array) {
        x_val = dest_array[i][0];
        y_val = dest_array[i][1];
        loc_string = x_val + "," + y_val;
        if (isMoveValid(in_origin, loc_string, in_piece_id, in_grid) == 1) {
            potential_moves.push(loc_string);
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