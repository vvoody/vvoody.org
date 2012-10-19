<?php
//get value of parameter URL
$URL = $_GET['url'];
if (! empty($URL)) {
    //meta jump
    echo '<html><head><meta http-equiv="refresh" content="1;url='.$URL.'"></head><body></body></html>';
} else {
    echo "don't fool me.";
}
?>
