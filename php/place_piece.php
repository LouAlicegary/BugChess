<?php 
	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    
	$data = mysql_query("SELECT * FROM games") or die(mysql_error()); 
	while($info = mysql_fetch_array( $data )) 
	{ 
		$game_id = $info['game_id'];
 	}
?>

<?php
if(isset($_POST['piece']) && !empty($_POST['piece'])) {

	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    	
    $piece = $_POST['piece'];
	$destination = $_POST['destination'];
	$origin = $_POST['origin'];
	
	
	$data = mysql_query("INSERT INTO moves (game_id, piece, origin, destination) VALUES ('" . $game_id . "','" . $piece . "','" . $origin . "','" . $destination . "')") or die(mysql_error());               
}
?> 