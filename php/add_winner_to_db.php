<?php
if(isset($_POST['winner']) && !empty($_POST['winner'])) {

	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    	
	$winner = $_POST['winner'];
	$game_id = $_POST['game_id'];

	$data = mysql_query("UPDATE games SET finished = 1, winner = '" . $winner. "' WHERE game_id = '" . $game_id . "'" ) or die(mysql_error());
}
?> 