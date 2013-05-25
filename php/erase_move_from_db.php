<?php
	require_once('../../../db_access.php');
    
	mysql_connect($bug_host, $bug_user, $bug_pass) or die(mysql_error());
    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
    
	$move_id = mysql_real_escape_string($_POST['moveid']);
	
	$data = mysql_query("DELETE FROM moves WHERE move_id = '" . $move_id . "'") or die(mysql_error()); 
	
	echo $move_id;
?>