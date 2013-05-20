<?php
	$game_id = $_POST['gameid'];

	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    
	$data = mysql_query("DELETE FROM moves WHERE game_id = " + $game_id) or die(mysql_error()); 
?>