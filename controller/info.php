<?php
require_once('../model/netmex.php');

if (isset($_POST) && $_POST['idTarea']) {
  $records = new modelNetmex();
  $info = $records::get_info($_POST['idTarea']);
  die(json_encode($info));
}
?>
