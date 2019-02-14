<?php

/**
 *
 */
class DbConect
{

  public static function conexion()
  {
    $user = 'root';
    $password = '';
    $server = '127.0.0.1';
    $database = 'netmex';

    $conexion = new mysqli($server,$user,$password,$database);
    $conexion->query("SET NAMES 'utf8'");
    return $conexion;
  }

}

?>
