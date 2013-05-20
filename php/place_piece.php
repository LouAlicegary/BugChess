<?php
if(isset($_POST['piece']) && !empty($_POST['piece'])) {

	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    	
	$game_id = $_POST['game_id'];	
    $piece = $_POST['piece'];
	$destination = $_POST['destination'];
	$origin = $_POST['origin'];
	
	
	$data = mysql_query("INSERT INTO moves (game_id, piece, origin, destination) VALUES ('" . $game_id . "','" . $piece . "','" . $origin . "','" . $destination . "')") or die(mysql_error());               
}
?> 