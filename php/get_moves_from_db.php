<?php 
    require_once('../../../../db_access.php');

	$a = array(array(0)); // array of columns
	
	mysql_connect(BUG_HOSTNAME, BUG_USERNAME, BUG_PASSWORD) or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    
	$the_game_id = mysql_real_escape_string($_POST['game_id']);
	
	$data = mysql_query("SELECT * FROM moves WHERE game_id = '" . $the_game_id . "' ORDER BY move_id ASC") or die(mysql_error()); 
	$counter = 0;
		
	header('Content-type: application/json');
	
	while($info = mysql_fetch_array( $data )) 
	{
		$move_id = $info['move_id'];	 
		$game_id = $info['game_id'];
		$piece = $info['piece'];
		$origin = $info['origin'];
		$destination = $info['destination'];
		
		$a[$counter] = array($move_id, $game_id, $piece, $origin, $destination);
		$counter++;
 	}
	//$c = array(array(1,2,3));
	print json_encode($a);
?>	