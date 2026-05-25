<?php
// *************************************************************
// Destruye la sesión del usuario y redirige a la landing
// *************************************************************
session_start();
session_unset();
session_destroy();

header("Location: ../index.html");
exit;