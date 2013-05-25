<?php
	
	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    
	$move_id = mysql_real_escape_string($_POST['moveid']);
	
	$data = mysql_query("DELETE FROM moves WHERE move_id = '" . $move_id . "'") or die(mysql_error()); 
	
	echo $move_id;
?>