<?php

declare(strict_types=1);

$button = file_get_contents(__DIR__ . '/../src/button.php');
$database = file_get_contents(__DIR__ . '/../src/database.php');

if ($button === false || $database === false) {
    fwrite(STDERR, "Unable to read PHP source files\n");
    exit(1);
}

if (strpos($button, "I got your message - Name is:") === false) {
    fwrite(STDERR, "Expected button response marker not found\n");
    exit(1);
}

if (strpos($database, "SELECT * FROM `table1`") === false) {
    fwrite(STDERR, "Expected DB SELECT marker not found\n");
    exit(1);
}

if (strpos($database, "DELETE FROM `table1`") === false) {
    fwrite(STDERR, "Expected DB DELETE marker not found\n");
    exit(1);
}

echo "php-client-server-with-database smoke test passed\n";
