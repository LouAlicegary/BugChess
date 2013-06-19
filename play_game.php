<?php
    showGameHeader();
    showGameBody();
	showGameScript();
	showGameFooter();
    
    function showGameHeader() {
        echo "<!DOCTYPE html>\n"; 
        echo "<html>\n"; 
        echo "\n"; 
        echo "<head>\n"; 
        echo "    <meta name=\"viewport\" content=\"target-densitydpi=device-dpi, width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0\">\n"; 
        echo "    \n"; 
        echo "    <title>loualicegary.com / Bug Chess (alpha)</title>\n"; 
        echo "    \n"; 
        echo "    <!-- jQuery + jQuery Touch Punch -->\n"; 
        echo "    <script src=\"js/jquery/jquery-1.9.1.min.js\"></script>\n"; 
        echo "    <script src=\"js/jquery/jquery-ui-1.10.3.min.js\"></script>\n"; 
        echo "    <script src=\"js/jquery/jquery.ui.touch-punch.min.js\"></script>\n"; 
        echo "\n"; 
        echo "    <!-- Logging Wrapper -->\n"; 
        echo "    <script src=\"js/logger/logger.js\"></script>\n"; 
        echo "        \n"; 
        echo "    <!-- MVC Architecture -->\n"; 
        echo "    <script src=\"js/_MVC/MODEL.js\"></script>\n"; 
        echo "    <script src=\"js/_MVC/MODEL_DB.js\"></script>\n"; 
        echo "    <script src=\"js/_MVC/MODEL_ARRAY.js\"></script>\n";
        echo "    <script src=\"js/_MVC/MODEL_MOVELIST.js\"></script>\n"; 
        echo "    <script src=\"js/_MVC/VIEW_GAME.js\"></script>\n"; 
        echo "    <script src=\"js/_MVC/VIEW_SUPPORT.js\"></script>\n"; 
        echo "    <script src=\"js/_MVC/VIEW_LOBBY.js\"></script>\n"; 
        echo "    <script src=\"js/_MVC/CONTROLLER.js\"></script>\n"; 
        echo "    \n"; 
        echo "    <!-- Hex -->    \n"; 
        echo "    <script src=\"js/hex/HexagonTools.js\"></script>\n"; 
        echo "    <script src=\"js/hex/Grid.js\"></script>\n"; 
        echo "    \n"; 
        echo "    <!-- Scroller -->\n"; 
        echo "    <script src=\"js/scroller/Animate.js\"></script>\n"; 
        echo "    <script src=\"js/scroller/Scroller.js\"></script>\n"; 
        echo "    <script src=\"js/scroller/EasyScroller.js\"></script>\n"; 
        echo "    \n"; 
        echo "    <!-- CSS -->\n"; 
        echo "    <link href='js/jquery/jquery-ui.css' rel='stylesheet' type='text/css'>\n"; 
        echo "    <link href='http://fonts.googleapis.com/css?family=Pacifico|Droid+Sans:bold|Open+Sans:bold|Oswald:bold' rel='stylesheet' type='text/css'>\n"; 
        echo "    <link media=\"all and (orientation:landscape)\" href='css/game_landscape.css' rel='stylesheet' type='text/css'>\n"; 
        echo "    <link media=\"all and (orientation:portrait)\"href='css/game_portrait.css' rel='stylesheet' type='text/css'>\n"; 
        echo "\n"; 
        echo "</head>\n";    
    }
    
    function showGameBody() {
        echo "<body>\n"; 
        echo "  <div id=\"wrapper\">\n"; 
        echo "        \n"; 
        echo "        <div id=\"white_piece_box\" class=\"piece_box\"></div>\n"; 
        echo "        <div id=\"black_piece_box\" class=\"piece_box\"></div>\n"; 
        echo "        \n"; 
        echo "        <div id=\"white_mask_box\" class=\"mask_box\"></div>\n"; 
        echo "        <div id=\"black_mask_box\" class=\"mask_box\"></div>\n"; 
        echo "        \n"; 
        echo "             \n"; 
        echo "        <div id=\"middle_area\">\n"; 
        echo "            \n"; 
        echo "            <div id=\"white_player_name\" class=\"player_name\"></div>\n"; 
        echo "            <div id=\"game_title\">Bug Chess</div>\n"; 
        echo "            <div id=\"black_player_name\" class=\"player_name\"></div>\n"; 
        echo "            \n"; 
        echo "            <div id=\"container\">\n"; 
        echo "                <div id=\"content\" data-scrollable=\"true\">\n"; 
        echo "                    <canvas id=\"hexCanvas\"></canvas>\n"; 
        echo "                </div>\n"; 
        echo "            </div>   \n"; 
        echo "            \n"; 
        echo "            <div id=\"bottom_bar\">\n"; 
        echo "                <div id=\"undo_move_button\" class=\"game_button ui-corner-all\">undo move</div>\n"; 
        echo "                <div id=\"cancel_game_button\" class=\"game_button ui-corner-all\">cancel game</div>\n"; 
        echo "                <div id=\"lobby_button\" class=\"game_button ui-corner-all\">visit lobby</div>\n"; 
        echo "                <div id=\"resign_button\" class=\"game_button ui-corner-all\">resign game</div> \n"; 
        echo "                <!--<div id=\"rematch_button\" class=\"game_button ui-corner-all\">play rematch</div>-->\n"; 
        echo "                <div id=\"clear_board_button\" class=\"game_button ui-corner-all\">clear board</div>\n"; 
        echo "            </div>\n"; 
        echo "            \n"; 
        echo "        </div>\n"; 
        echo "\n"; 
        echo "        <!-- WHITE PIECES -->\n"; 
        echo "        <div id=\"white_ant3\" class=\"game_piece white_ant\"><img src=\"pieces/white_ant.png\"></div>\n"; 
        echo "        <div id=\"white_ant2\" class=\"game_piece white_ant\"><img src=\"pieces/white_ant.png\"></div>\n"; 
        echo "        <div id=\"white_ant1\" class=\"game_piece white_ant\"><img src=\"pieces/white_ant.png\"></div>\n"; 
        echo "        <div id=\"white_grasshopper3\" class=\"game_piece white_grasshopper\"><img src=\"pieces/white_grasshopper.png\"></div>\n"; 
        echo "        <div id=\"white_grasshopper2\" class=\"game_piece white_grasshopper\"><img src=\"pieces/white_grasshopper.png\"></div>\n"; 
        echo "        <div id=\"white_grasshopper1\" class=\"game_piece white_grasshopper\"><img src=\"pieces/white_grasshopper.png\"></div>\n"; 
        echo "        <div id=\"white_spider2\" class=\"game_piece white_spider\"><img src=\"pieces/white_spider.png\"></div>\n"; 
        echo "        <div id=\"white_spider1\" class=\"game_piece white_spider\"><img src=\"pieces/white_spider.png\"></div>\n"; 
        echo "        <div id=\"white_beetle2\" class=\"game_piece white_beetle\"><img src=\"pieces/white_beetle.png\"></div>\n"; 
        echo "        <div id=\"white_beetle1\" class=\"game_piece white_beetle\"><img src=\"pieces/white_beetle.png\"></div>\n"; 
        echo "        <div id=\"white_bee1\" class=\"game_piece white_bee\"><img src=\"pieces/white_bee.png\"></div>          \n"; 
        echo "\n"; 
        echo "        <!-- BLACK PIECES -->   \n"; 
        echo "        <div id=\"black_ant3\" class=\"game_piece black_ant\"><img src=\"pieces/black_ant.png\"></div>\n"; 
        echo "        <div id=\"black_ant2\" class=\"game_piece black_ant\"><img src=\"pieces/black_ant.png\"></div>\n"; 
        echo "        <div id=\"black_ant1\" class=\"game_piece black_ant\"><img src=\"pieces/black_ant.png\"></div>\n"; 
        echo "        <div id=\"black_grasshopper3\" class=\"game_piece black_grasshopper\"><img src=\"pieces/black_grasshopper.png\"></div>\n"; 
        echo "        <div id=\"black_grasshopper2\" class=\"game_piece black_grasshopper\"><img src=\"pieces/black_grasshopper.png\"></div>\n"; 
        echo "        <div id=\"black_grasshopper1\" class=\"game_piece black_grasshopper\"><img src=\"pieces/black_grasshopper.png\"></div>\n"; 
        echo "        <div id=\"black_spider2\" class=\"game_piece black_spider\"><img src=\"pieces/black_spider.png\"></div>\n"; 
        echo "        <div id=\"black_spider1\" class=\"game_piece black_spider\"><img src=\"pieces/black_spider.png\"></div>\n"; 
        echo "        <div id=\"black_beetle2\" class=\"game_piece black_beetle\"><img src=\"pieces/black_beetle.png\"></div>\n"; 
        echo "        <div id=\"black_beetle1\" class=\"game_piece black_beetle\"><img src=\"pieces/black_beetle.png\"></div>\n"; 
        echo "        <div id=\"black_bee1\" class=\"game_piece black_bee\"><img src=\"pieces/black_bee.png\"></div>   \n"; 
        echo "                     \n"; 
        echo "        </div>            \n"; 
        echo "              \n"; 
        echo "        <div id=\"game_over_popup\">\n"; 
        echo "            <div id=\"game_over_text\">\n"; 
        echo "            </div>\n"; 
        echo "            <div id=\"game_over_button_bar\">\n"; 
        echo "                <div id=\"game_over_return_button\" class=\"game_button ui-corner-all\">return to lobby</div> \n"; 
        echo "                <!--<div id=\"game_over_rematch_button\" class=\"game_button ui-corner-all\">play rematch</div>-->\n"; 
        echo "            </div>\n"; 
        echo "        </div>    \n"; 
        echo "        <div id='in_game_popup'>\n";
        echo "              <div id='in_game_header'></div>\n"; 
        echo "              <div id='in_game_text'></div>\n";  
        echo "        </div>    \n";     
        echo "          \n"; 
        echo "  </div>\n";    
    }
    
    function showGameScript() {
        echo "<script type=\"text/javascript\">\n";
        if(isset($_GET['name']) && !empty($_GET['name']) && isset($_GET['gameid']) && isset($_GET['white_player']) && isset($_GET['white_player']) ) {
            echo "NAME = '" . $_GET['name'] . "';\n";
            echo "GAME_ID = " . $_GET['gameid'] . ";\n";
            if ( !empty($_GET['white_player']) ) {
                echo "WHITE_PLAYER_NAME = '" . $_GET['white_player'] . "';\n";
            }
            else {
                echo "WHITE_PLAYER_NAME = '(none)';\n";
            } 
            if ( !empty($_GET['black_player']) ) {
                echo "BLACK_PLAYER_NAME = '" . $_GET['black_player'] . "';\n";
            }
            else {
                echo "BLACK_PLAYER_NAME = '(none)';\n";
            }       
            echo "var SOLO_GAME = 0;";
            echo "if (!GAME_ID) {SOLO_GAME = 1; BLACK_PLAYER_NAME = 'Black'; WHITE_PLAYER_NAME = 'White';}";
            echo "$(document).ready(CONTROLLER_MAIN);\n";
        }
        else {
            echo "window.location = 'index.php';\n";
        }
        echo "</script>";       
    }
    
    function showGameFooter() {
        echo "</body>\n";
        echo "</html>";    
    }    
?>			

