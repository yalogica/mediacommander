<?php

defined( 'ABSPATH' ) || exit;

$options = [
    'mediacommander_dismiss_first_use_notification',
    'mediacommander_settings',
    'mediacommander_state'
];

foreach( $options as $option ) {
    delete_option( $option );
}

delete_metadata( 'user', 0, 'mediacommander_states', '', true );

global $wpdb;
$tables = [
    $wpdb->prefix . 'mediacommander_folders',
    $wpdb->prefix . 'mediacommander_attachments'
];

foreach($tables as $table) {
    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange
    $wpdb->query( "DROP TABLE IF EXISTS {$table}" );
}