<?php
namespace Yalogica\MediaCommander;

defined( 'ABSPATH' ) || exit;

class Plugin {
    public static function run() {
        add_action( 'plugins_loaded', [ 'Yalogica\\MediaCommander\\Plugin', 'pluginsLoaded' ] );
    }

    public static function activate() {
        new System\Installer();
    }

    public static function deactivate() {
    }

    public static function pluginsLoaded() {
        new Rest\Routes();
        new Blocks\GalleryBlock();
        new System\Notice();
        new System\Folders();
        new System\Settings();
    }
}