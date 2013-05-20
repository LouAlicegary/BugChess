<?php
if(isset($_POST['name']) && !empty($_POST['name'])) {

	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    	
	$name = $_POST['name'];
	$game_id = $_POST['gameid'];
	
	$data = mysql_query("UPDATE games SET black_player = '" . $name . "' WHERE game_id = '" . $game_id . "'" ) or die(mysql_error());
}
?> 