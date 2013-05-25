<?php
	
	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
	
	$name = mysql_real_escape_string($_POST['name']);
    
	$data = mysql_query("INSERT INTO games VALUES (DEFAULT, '" . $name . "', '', DEFAULT, 0, NULL) ") or die(mysql_error());
	$id = mysql_insert_id();
	
	print $id; 
	               
?>