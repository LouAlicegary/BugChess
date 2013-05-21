<?php
	$move_id = $_POST['moveid'];

	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    
	$data = mysql_query("DELETE FROM moves WHERE move_id = '" . $move_id . "'") or die(mysql_error()); 
	
	echo $move_id;
?>