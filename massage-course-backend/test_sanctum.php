<?php

require_once 'vendor/autoload.php';

// Test if HasApiTokens trait exists
if (trait_exists('Laravel\Sanctum\HasApiTokens')) {
    echo "HasApiTokens trait found!\n";
} else {
    echo "HasApiTokens trait NOT found!\n";
}

// Test if we can use reflection to check the trait
try {
    $reflection = new ReflectionClass('Laravel\Sanctum\HasApiTokens');
    echo "Trait reflection successful: " . $reflection->getName() . "\n";
} catch (Exception $e) {
    echo "Trait reflection failed: " . $e->getMessage() . "\n";
}
