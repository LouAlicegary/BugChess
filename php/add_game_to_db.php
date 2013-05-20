<?php
	
	$name = $_POST['name'];

	mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    
	$data = mysql_query("INSERT INTO games VALUES (DEFAULT, 'Lou', '', DEFAULT, 0, NULL) ") or die(mysql_error());
	//$data = mysql_query("SELECT * FROM games") or die(mysql_error());
	$id = mysql_insert_id();
	//$info = mysql_fetch_array($data);
	
	//print $data;
	 print $id; 
	               
?>