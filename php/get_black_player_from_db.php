<?php 
    require_once('../../../../db_access.php');

	$game_id = $_POST['gameid']; 
	
	mysql_connect(BUG_HOSTNAME, BUG_USERNAME, BUG_PASSWORD) or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    
	$data = mysql_query("SELECT * FROM games WHERE game_id = '" . $game_id . "'") or die(mysql_error()); 
	$info = mysql_fetch_array($data);  

	$black_player = $info['black_player'];
	
	print $black_player;
?>