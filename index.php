<?php include_once("index.html"); 

// Set a same-site cookie for first-party contexts
setcookie('cookie1', 'value1', ['samesite' => 'Lax']);
// Set a cross-site cookie for third-party contexts
setcookie('cookie2', 'value2', ['samesite' => 'None', 'secure' => true]);




if (PHP_VERSION_ID >= 70300) { 
session_set_cookie_params([
    'lifetime' => $cookie_timeout,
    'path' => '/',
    'domain' => $cookie_domain,
    'secure' => $session_secure,
    'httponly' => $cookie_httponly,
    'samesite' => 'Lax'
]);
} else { 
session_set_cookie_params(
    $cookie_timeout,
    '/; samesite=Lax',
    $cookie_domain,
    $session_secure,
    $cookie_httponly
);
}


?>


