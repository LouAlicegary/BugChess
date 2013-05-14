<?php 

	$a = array(); // array of columns
	$a["moves"] = array();
	for($c=0; $c<100; $c++){
	    $a[$c] = array(); // array of cells for column $c
	    for($r=0; $r<100; $r++){
	        $a[$c][$r] = 0;//"";
	    }
	}
	
	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    
	$data = mysql_query("SELECT * FROM moves ORDER BY move_id") or die(mysql_error()); 
	$counter = 0;
		
	header('Content-type: application/json');
	
	$destination_array = array(0,0);
	
	while($info = mysql_fetch_array( $data )) 
	{
		$move_id = $info['move_id'];	 
		$game_id = $info['game_id'];
		$piece = $info['piece'];
		$origin = $info['origin'];
		$destination = $info['destination'];
		$destination_array = explode(",", $destination);
		$x_index = $destination_array[0];
		$y_index = $destination_array[1];
		
		if ($origin) {
			$origin_array = explode(",", $origin);
			$or_x_index = $origin_array[0];
			$or_y_index = $origin_array[1];
			$old_stack = $a[$or_x_index][$or_y_index];
			$piece_length = strlen($piece);
			$piece_length = 0 - $piece_length - 1;
			$a[$or_x_index][$or_y_index] = substr($old_stack, 0, $piece_length);
		}
		if (strlen($a[$x_index][$y_index]) > 2){
			$a[$x_index][$y_index] = $a[$x_index][$y_index] . ',' . $piece;
		}
		else {
			$a[$x_index][$y_index] = $piece;
		}
		
		
		//echo $destination;
		//echo " ";
 	}
	//$c = array(array(1,2,3));
	print json_encode((object)$a);
?>