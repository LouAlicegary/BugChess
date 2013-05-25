<?php
if(isset($_POST['piece']) && !empty($_POST['piece'])) {

	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    	
	$game_id = mysql_real_escape_string($_POST['game_id']);	
    $piece = mysql_real_escape_string($_POST['piece']);
	$destination = mysql_real_escape_string($_POST['destination']);
	$origin = mysql_real_escape_string($_POST['origin']);
	
	$data = mysql_query("INSERT INTO moves (game_id, piece, origin, destination) VALUES ('" . $game_id . "','" . $piece . "','" . $origin . "','" . $destination . "')") or die(mysql_error());               
}
?> 