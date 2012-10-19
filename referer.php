<?php

echo "HTTP Referer: ";
if (isset($_SERVER['HTTP_REFERER'])) {
        echo $_SERVER['HTTP_REFERER'];
}
else {
        echo "null";
}

?>
