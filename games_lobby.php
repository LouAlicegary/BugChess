<?php
    require_once('../../../db_access.php');
    $bug_pass = "sweetlou_bc";

    showLobbyHeader();
    showLobbyBody();    
    showLobbyFooter();   
        
    function showLobbyHeader() {
        echo "<!DOCTYPE html>\n"; 
        echo "\n"; 
        echo "<html>\n"; 
        echo "\n"; 
        echo "<head>\n"; 
        echo "  <meta name='viewport' content='target-densitydpi=device-dpi, width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0'>\n"; 
        echo "  \n"; 
        echo "  <title>loualicegary.com / Bug Chess (alpha)</title>\n"; 
        echo "  \n"; 
        echo "  <!-- jQuery + jQuery Touch Punch -->\n"; 
        echo "  <script src='js/jquery/jquery-1.9.1.min.js'></script>\n"; 
        echo "  <script src='js/jquery/jquery-ui-1.10.3.min.js'></script>\n"; 
        echo "  <script src='js/jquery/jquery.ui.touch-punch.min.js'></script>\n"; 
        echo "  \n";
        echo "  <!-- MVC Architecture -->\n";
        echo "  <script src='js/_MVC/MODEL_DB.js'></script>\n";
        echo "  <script src='js/_MVC/VIEW_LOBBY.js'></script>\n";    
        echo "  \n"; 
        echo "  <!-- Logger -->\n"; 
        echo "  <script src='js/logger/logger.js'></script>\n"; 
        echo "  \n"; 
        echo "  <!-- CSS -->\n"; 
        echo "  <link href='js/jquery/jquery-ui.css' rel='stylesheet' type='text/css'>\n"; 
        echo "  <link href='http://fonts.googleapis.com/css?family=Pacifico|Droid+Sans:bold|Open+Sans:bold|Oswald:bold' rel='stylesheet' type='text/css'>\n"; 
        echo "  <link media='(orientation:landscape)' href='css/lobby_landscape.css' rel='stylesheet' type='text/css'>\n"; 
        echo "  <link media='(orientation:portrait)' href='css/lobby_portrait.css' rel='stylesheet' type='text/css'>\n"; 
        echo "\n"; 
        echo "</head>\n";  
    }
    
    function showLobbyBody() {
                
        // MAKES SURE A NAME WAS PASSED TO THE LOBBY SCRIPT. NO NAME = NO VIEW
        if ( (isset($_GET['name']) && !empty($_GET['name'])) || (isset($_POST['name']) && !empty($_POST['name'])) ) {
                
            $name = "";
            if(isset($_POST['name']))
                $name = $_POST['name'];
            else
                $name = $_GET['name'];
            
            echo "<script type='text/javascript'>var NAME = '" . $name . "';</script>\n";
            
            showLobbyTopOfBody($name);           
            showMyGamesBox($name); // games that user currently in
            showOpponentsLookingBox($name); // games started by others awaiting opponent
            showNewGameBox(); // buttons for solo / vs game
            showLobbyBodyScript($name); // script that calls main                             
        }
        else {
            echo "<script type='text/javascript'>";    
            echo "    window.location = 'index.php';";
            echo "</script>";
        }      
    }
    
    function showLobbyTopOfBody($name) {
        
        echo "<body>\n"; 
        echo "    \n"; 
        echo "    <div id='wrapper'>\n"; 
        echo "        <div id='game_title'>Bug Chess</div>\n"; 
        echo "        <div id='play_alone_button' class='mini_menu_div row1_button'>Play Solo Game</div>\n"; 
        echo "        <div id='play_someone_button' class='mini_menu_div row2_button'>Play Online Opponent</div>\n";
        echo "        <div id='learn_to_play_button' class='mini_menu_div row3_button'>Learn How to Play</div>\n";       
       
        // BUILD ANDROID BUTTONS FOR MY GAMES - (SUBSECTION 2)    
        mysql_connect(BUG_HOSTNAME, BUG_USERNAME, BUG_PASSWORD) or die(mysql_error());
        mysql_select_db("sweetlou_bugchess") or die(mysql_error());
        $name = mysql_real_escape_string($name);
        $data = mysql_query("SELECT * FROM games WHERE (white_player = '" . $name . "' OR black_player = '" . $name . "') AND finished = 0 ORDER BY game_id DESC LIMIT 3") or die(mysql_error()); 
            
        $counter = 1;
        while ($info = mysql_fetch_array( $data )) {
            // Get game information     
            $game_id = $info['game_id'];
            $white_player = $info['white_player'];
            $black_player = $info['black_player'];
            
            // Get game time information
            $time_diff = mysql_query("SELECT TIMEDIFF(NOW(), time_created) AS DIFF FROM moves WHERE game_id = '" . $game_id . "' ORDER BY move_id DESC LIMIT 1");
            $the_diff = mysql_fetch_array($time_diff);
            $time_array = explode(":", $the_diff[0]);
            $time_string = getTimeString($time_array);
            $time_since_last = "";
    
            // Get number of moves
            $count = mysql_query("SELECT COUNT(*) FROM moves WHERE game_id =" . $game_id ) or die(mysql_error()); 
            $the_info = mysql_fetch_array( $count );
            $num_moves = $the_info[0];
            
            // Fill $time_string and $time_since_last
            if ($num_moves == 0) {
                $game_time = mysql_query("SELECT TIMEDIFF(NOW(), time_created) AS DIFF FROM games WHERE game_id = '" . $game_id . "'");
                $the_gt = mysql_fetch_array($game_time);
                $time_array = explode(":", $the_gt[0]);
                $time_string = getTimeString($time_array);
                $time_since_last = "started " . $time_string;
            }
            else {
                $time_since_last = "last move " . $time_string;
            }
            
            // Fill $turn_string
            if ( (($name == $white_player) && ($num_moves%2 == 0)) || (($name == $black_player) && ($num_moves%2 == 1)) ) {
                $turn_string = "::: YOUR TURN :::";
            } 
            else {
                $turn_string = "(you moved " . $time_string . ")";
            }          
            
            echo "        <div id='" . $game_id . "' class='mini_menu_div my_game_button row" . $counter . "_button'><div class='match_name'>" . $white_player . " vs " . $black_player . "</div><div class='match_move'>" . $turn_string . "</div></div>\n";        
            $counter++;
        }
        
        // BUILD ANDROID BUTTONS FOR WAITING OPPONENTS - (SUBSECTION 2)
        $data = mysql_query("SELECT * FROM games WHERE white_player LIKE '' OR black_player LIKE '' AND white_player NOT LIKE '" . $name . "' AND black_player NOT LIKE '" . $name . "' ORDER BY game_id DESC LIMIT 3") or die(mysql_error()); 
        $counter2 = 1;
        while($info = mysql_fetch_array( $data )) 
        { 
            $game_id = $info['game_id'];
            $white_player = $info['white_player'];
            $black_player = $info['black_player'];
            $last_move_string = "3 days ago";
            echo "        <div id='" . $game_id . "' class='mini_menu_div open_game_button row" . $counter2 . "_button'>" . $white_player . " - started " . $last_move_string . "</div>\n"; 
            $counter2++;
        }
        $counter--;
        $counter2--;
        
        // BUILD MAIN ANDROID BUTTONS (LAST BECAUSE THEY NEED INFO FROM PREVIOUS TWO SUBSECTIONS)
        echo "        <div id='show_my_games_button' class='mini_menu_div row1_button'>Your Current Games (" . $counter . ")</div>\n"; 
        echo "        <div id='show_opponents_button' class='mini_menu_div row2_button'>Opponents Waiting (" . $counter2 . ")</div>\n";  
        echo "        <div id='make_new_game_button' class='mini_menu_div row3_button'>Make New Game</div>\n";
        echo "        <div id='back_to_lobby_button' class='mini_menu_div row4_button'>Back to Lobby</div>\n";
        echo "        <div id='back_to_games_button' class='mini_menu_div row4_button'>Back to Games Menu</div>\n";
                  
    }
    
    function showMyGamesBox($name) {    
        
        mysql_connect(BUG_HOSTNAME, BUG_USERNAME, BUG_PASSWORD) or die(mysql_error());
        mysql_select_db("sweetlou_bugchess") or die(mysql_error());
                    
        echo "<div id='current_games_div' class='fullsize_menu_div'><div class='header_text'>games you're currently in: </div><br />";
        
        $name = mysql_real_escape_string($name);
        $data = mysql_query("SELECT * FROM games WHERE (white_player = '" . $name . "' OR black_player = '" . $name . "') AND finished = 0 ORDER BY game_id DESC LIMIT 3") or die(mysql_error()); 
        
        $counter = 1;
        while ($info = mysql_fetch_array( $data )) { 
            $game_id = $info['game_id'];
            $white_player = $info['white_player'];
            $black_player = $info['black_player'];
            
            if ($white_player === "") {
                $white_player = "(?)";
            }
            else if ($black_player === "") {
                $black_player = "(waiting)";
            }
            
            $time_diff = mysql_query("SELECT TIMEDIFF(NOW(), time_created) AS DIFF FROM moves WHERE game_id = '" . $game_id . "' ORDER BY move_id DESC LIMIT 1");
            $the_diff = mysql_fetch_array($time_diff);
            $time_array = explode(":", $the_diff[0]);
            $time_string = getTimeString($time_array);
    
            $count = mysql_query("SELECT COUNT(*) FROM moves WHERE game_id =" . $game_id ) or die(mysql_error()); 
            $the_info = mysql_fetch_array( $count );
            $num_moves = $the_info[0];
            
            if ($num_moves == 0) {
                $game_time = mysql_query("SELECT TIMEDIFF(NOW(), time_created) AS DIFF FROM games WHERE game_id = '" . $game_id . "'");
                $the_gt = mysql_fetch_array($game_time);
                $time_array = explode(":", $the_gt[0]);
                $time_string = getTimeString($time_array);
                $time_since_last = "started " . $time_string;
            }
            else {
                $time_since_last = "last move " . $time_string;
            }
    
            echo "<div id='" . $game_id . "' class='regular_text current_game row" . $counter . "'><div class='column1'> " . $white_player . " vs. " . $black_player . "</div><div class='column2'>[" . $time_since_last . "]</div>";
            echo "<div class='column3'> ::: ";
            
            if ( (($name == $white_player) && ($num_moves%2 == 0)) || (($name == $black_player) && ($num_moves%2 == 1)) ) {
                echo "YOUR TURN :::";
            } 
            else {
                echo "OPPONENT'S TURN :::";
            }
            echo "</div></div>"; 
            $counter ++;
        }   
        
        echo  "</div>";
    }
    
    function showOpponentsLookingBox($name) {
    
        echo "<div id='opponents_looking_div' class='fullsize_menu_div'><div class='header_text'>opponents looking for players: </div><br />";
        
        $data = mysql_query("SELECT * FROM games WHERE white_player LIKE '' OR black_player LIKE '' AND white_player NOT LIKE '" . $name . "' AND black_player NOT LIKE '" . $name . "' ORDER BY game_id DESC LIMIT 3") or die(mysql_error()); 
        
        $counter = 1;
        while($info = mysql_fetch_array( $data )) 
        { 
            $game_id = $info['game_id'];
            $white_player = $info['white_player'];
            $black_player = $info['black_player'];
            
            $time_diff = mysql_query("SELECT TIMEDIFF(NOW(), time_created) as diff FROM games WHERE game_id = '" . $game_id . "' LIMIT 1");
            $the_diff = mysql_fetch_array($time_diff);
            $time_array = explode(":", $the_diff[0]);
            $time_string = getTimeString($time_array);      
            
            echo "<div id='" . $game_id . "' class='regular_text open_game row" . $counter . "'><div class='column1'> " . $white_player . "</div><div class='column2'>[started " . $time_string . "]</div></div>";
            $counter++;
        }
        
        echo "</div>";    
    }
    
    function showNewGameBox() {
        echo "<div id='new_game_div' class='fullsize_menu_div'>";
        echo "<div class='header_text'>start a new game:</div>";
        echo "<div id='solo_game'>solo practice mode</div>";
        echo "<div id='vs_game'>vs. online opponent</div>";
        echo "</div>";
        echo "</div>";      
    }
    
    function showLobbyBodyScript($name) {
        echo "<script>            \n";
        echo "    $(document).ready(function(){\n"; 
        echo "        VIEW_LOBBY_showGamesLobby();\n";
        echo "    });\n"; 
        echo "</script>\n\n";     
    }
    
    function showLobbyFooter() {
        echo "</body>\n"; 
        echo "\n"; 
        echo "</html>\n";
    }
    
    function getTimeString($in_time_array) {
        $time_hours = $in_time_array[0];
        $time_minutes = $in_time_array[1];
        $time_seconds = $in_time_array[2];
        $time_string = "";
        
        if ($time_hours > 23) {
            $time_days = floor($time_hours / 24);
            $time_string = strval($time_days) . "d ago";    
            return $time_string;
        }
        else if ($time_hours > 0) {   
            $time_string = strval($time_hours) . "h ago";    
            return $time_string;                      
        }
        else if ($time_minutes > 0) {    
            $time_string = strval($time_minutes) . "m ago";    
            return $time_string;                      
        }
        else {  
            $time_string = strval($time_seconds) . "s ago";    
            return $time_string;    
        }
    }    
             
?>	
	