<?php

declare(strict_types=1);

$source = file_get_contents(__DIR__ . '/../src/index.php');
if ($source === false) {
    fwrite(STDERR, "Unable to read index.php\n");
    exit(1);
}

if (strpos($source, 'Hello world!') === false) {
    fwrite(STDERR, "Expected hello world output marker not found\n");
    exit(1);
}

if (strpos($source, 'phpinfo(INFO_ALL)') === false) {
    fwrite(STDERR, "Expected phpinfo marker not found\n");
    exit(1);
}

echo "php-client-server smoke test passed\n";
