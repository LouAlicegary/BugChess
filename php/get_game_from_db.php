<?php 

	$game_id = $_POST['gameid'];
	
	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    
	$data = mysql_query("SELECT * FROM games WHERE game_id = '" . $game_id . "'") or die(mysql_error()); 

	$info = mysql_fetch_array($data);  
	
	$game_id = $info['game_id'];
	$white_player = $info['white_player'];
	$black_player = $info['black_player'];
	$time_created = $info['time_created'];
	$finished = $info['finished'];
	$winner = $info['winner'];
	
	$a = array($game_id, $white_player, $black_player, $time_created, $finished, $winner);

	print json_encode($a); //(object)
?>