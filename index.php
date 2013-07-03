<?php
    
    /* THIS WHOLE THING CAN BE CHANGED INTO A STATIC PHP FILE NOW. */
    
    showLoginHeader();
    showLoginBody();
    //showLoginScript();
    showLoginFooter();

    function showLoginHeader() {
        echo "<!DOCTYPE html>\n";
        echo "<html>\n";
        echo "<head>\n"; 
        echo "  <meta name=\"viewport\" content=\"target-densitydpi=device-dpi, width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0\">\n"; 
        echo "  \n"; 
        echo "  <title>loualicegary.com / Bug Chess (alpha)</title>\n"; 
        echo "  \n"; 
        echo "  <!-- jQuery + jQuery Touch Punch -->\n"; 
        echo "  <script src=\"js/jquery/jquery-1.9.1.min.js\"></script>\n"; 
        echo "  <script src=\"js/jquery/jquery-ui-1.10.3.min.js\"></script>\n"; 
        echo "  <script src=\"js/jquery/jquery.ui.touch-punch.min.js\"></script>\n"; 
        echo "  \n";
        echo "  <!-- MVC Architecture -->\n";
        echo "  <script src='js/_MVC/VIEW_LOGIN.js'></script>\n";    
        echo "  \n"; 
        echo "  <!-- Logger -->\n"; 
        echo "  <script src=\"js/logger/logger.js\"></script>\n"; 
        echo "  \n"; 
        echo "  <!-- CSS -->\n"; 
        echo "  <link href='js/jquery/jquery-ui.css' rel='stylesheet' type='text/css'>\n"; 
        echo "  <link href='http://fonts.googleapis.com/css?family=Pacifico|Droid+Sans:bold|Open+Sans:bold|Oswald:bold' rel='stylesheet' type='text/css'>\n"; 
        echo "    <link media=\"(orientation:landscape)\" href='css/login_landscape.css' rel='stylesheet' type='text/css'>\n"; 
        echo "    <link media=\"(orientation:portrait)\" href='css/login_portrait.css' rel='stylesheet' type='text/css'>\n"; 
        echo "</head>\n";       
    }

    function showLoginBody() {
        echo "<body>\n"; 
        echo "  <div id=\"wrapper\">    \n"; 
        echo "      <div id=\"game_title\">Bug Chess</div>\n"; 
        echo "      <div id=\"directions\">type your name:</div>\n"; 
        echo "      <input id=\"name_input\" type=\"text\" autocomplete=\"off\" autocorrect=\"off\" spellcheck=\"false\">\n"; 
        echo "      <div id=\"submit_button\">enter game</div>\n"; 
        echo "  </div>\n";        
    }
    
    function showLoginScript() {
        echo "  <script type=\"text/javascript\">\n"; 
        echo "     $(document).ready(function(){VIEW_LOGIN_showLoginPage();});\n"; 
        echo "  </script>\n";        
    }
    
    function showLoginFooter() {
        echo "</body>\n"; 
        echo "\n"; 
        echo "</html>\n";       
    }

?>