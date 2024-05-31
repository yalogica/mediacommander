<?php
namespace MediaCommander;

defined( 'ABSPATH' ) || exit;

class Plugin {
    public static function run() {
        add_action( 'plugins_loaded', [ 'MediaCommander\\Plugin', 'pluginsLoaded' ] );
    }

    public static function activate() {
        new System\Installer();
    }

    public static function deactivate() {
    }

    public static function pluginsLoaded() {
        load_plugin_textdomain( 'mediacommander', false, dirname( MEDIACOMMANDER_PLUGIN_BASE_NAME) . '/languages/' );

        new Rest\Routes();
        new System\Notice();
        new System\Folders();
        new System\Settings();
    }
}