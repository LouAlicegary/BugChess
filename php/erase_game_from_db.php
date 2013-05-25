<?php
	
	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
	
    $name = mysql_real_escape_string($_POST['name']);
	$game_id = $_POST['gameid'];
	
	$data = mysql_query("DELETE FROM moves WHERE game_id = '" . $game_id . "'") or die(mysql_error()); 
	
	$data2 = mysql_query("DELETE FROM games WHERE game_id = '" . $game_id . "'") or die(mysql_error()); 
	
	echo $game_id;
?>