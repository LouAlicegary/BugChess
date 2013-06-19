<?php
require_once('../../../../db_access.php');

if(isset($_POST['winner']) && !empty($_POST['winner'])) {

	mysql_connect(BUG_HOSTNAME, BUG_USERNAME, BUG_PASSWORD) or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    	
	$winner = mysql_real_escape_string($_POST['winner']);
	$game_id = mysql_real_escape_string($_POST['game_id']);
	$finished = mysql_real_escape_string($_POST['finished']);

	$data = mysql_query("UPDATE games SET finished = '" . $finished . "', winner = '" . $winner. "' WHERE game_id = '" . $game_id . "'" ) or die(mysql_error());
}
?> 