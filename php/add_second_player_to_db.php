<?php
require_once('../../../../db_access.php');

if(isset($_POST['name']) && !empty($_POST['name'])) {

	mysql_connect(BUG_HOSTNAME, BUG_USERNAME, BUG_PASSWORD) or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    	
	$name = mysql_real_escape_string($_POST['name']);
	$game_id = $_POST['gameid'];
	
	$data = mysql_query("UPDATE games SET black_player = '" . $name . "' WHERE game_id = '" . $game_id . "'" ) or die(mysql_error());
}
?> 