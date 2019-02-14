<?php
require_once('../model/netmex.php');
session_start();
if (isset($_SESSION['id'])) {
  $filter = isset($_GET) && isset($_GET["filter"]) ? $_GET["filter"] : False;
  $records = new modelNetmex();
  $data = $_SESSION['rol'] == "admin" ? $records::get_works(False,$filter) : $records::get_works($_SESSION['id'],$filter);
  require_once("../view/listado.phtml");
}
?>
