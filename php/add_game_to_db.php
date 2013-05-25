<?php
	require_once('../../../db_access.php');
    
	mysql_connect($bug_host, $bug_user, $bug_pass) or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
	
	$name = mysql_real_escape_string($_POST['name']);
    
	$data = mysql_query("INSERT INTO games VALUES (DEFAULT, '" . $name . "', '', DEFAULT, 0, NULL) ") or die(mysql_error());
	$id = mysql_insert_id();
	
	print $id; 
	               
?>