<?php
$tables = ['purchases', 'sales', 'purchase_vouchers', 'bills', 'expenses'];
foreach ($tables as $table) {
    echo "--- $table ---\n";
    $indexes = Schema::getConnection()->getDoctrineSchemaManager()->listTableIndexes($table);
    foreach ($indexes as $index) {
        echo $index->getName() . "\n";
    }
}
