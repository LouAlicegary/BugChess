<!DOCTYPE html>
<html>
<head> 
    <meta name='viewport' content='target-densitydpi=device-dpi, width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0'> 
   
    <title>loualicegary.com / Bug Chess (alpha)</title> 
   
    <!-- jQuery + jQuery Touch Punch --> 
    <script src='js/jquery/jquery-1.9.1.min.js'></script> 
    <script src='js/jquery/jquery-ui-1.10.3.min.js'></script> 
    <script src='js/jquery/jquery.ui.touch-punch.min.js'></script> 
  
    <!-- MVC Architecture -->
    <script src='js/_MVC/VIEW_LOGIN.js'></script>    
   
    <!-- Logger --> 
    <script src='js/logger/logger.js'></script> 
   
    <!-- CSS --> 
    <link href='js/jquery/jquery-ui.css' rel='stylesheet' type='text/css'> 
    <link href='http://fonts.googleapis.com/css?family=Pacifico|Droid+Sans:bold|Open+Sans:bold|Oswald:bold' rel='stylesheet' type='text/css'> 
    <link media='(orientation:landscape)' href='css/login_landscape.css' rel='stylesheet' type='text/css'> 
    <link media='(orientation:portrait)' href='css/login_portrait.css' rel='stylesheet' type='text/css'> 
</head>       

<body> 
    <div id='wrapper'>     
        <div id='game_title'>Bug Chess</div> 
        <div id='directions'>type your name:</div> 
        <input id='name_input' type='text' autocomplete='off' autocorrect='off' spellcheck='false'> 
        <div id='submit_button'>enter game</div> 
    </div>        

    <script type='text/javascript'> 
        $(document).ready(function() {
            VIEW_LOGIN_showLoginPage();
        }); 
    </script>        

</body> 
 
</html>       
