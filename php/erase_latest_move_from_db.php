<?php
    require_once('../../../../db_access.php');
    
    mysql_connect(BUG_HOSTNAME, BUG_USERNAME, BUG_PASSWORD) or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    
    $game_id = mysql_real_escape_string($_POST['gameid']);
    
    $data = mysql_query("SELECT move_id FROM moves WHERE game_id = '" . $game_id . "' ORDER BY move_id DESC LIMIT 1") or die(mysql_error()); 
    //ABOVE LINE WORKS
    //$data = mysql_query("DELETE FROM moves WHERE move_id = (SELECT move_id FROM moves WHERE game_id = '" . $game_id . "' ORDER BY move_id DESC LIMIT 1)") or die(mysql_error()); 
    $info = mysql_fetch_array($data); 
    $move_id = $info['move_id'];
    $data = mysql_query("DELETE FROM moves WHERE move_id = '" . $move_id . "'") or die(mysql_error()); 
    
    echo $move_id;
?>