<?php 

	$a = array(array(0)); // array of columns
	
	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    
	$data = mysql_query("SELECT * FROM moves ORDER BY move_id") or die(mysql_error()); 
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