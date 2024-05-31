<?php

/**
 * Plugin Name: MediaCommander
 * Plugin URI: https://yalogica.com/mediacommander/
 * Description: Improve your WordPress media library with a more intuitive way. Simply drag & drop items into folders for effortless accessibility.
 * Version: 2.1.0
 * Requires at least: 4.6
 * Requires PHP: 7.4
 * Author: Yalogica
 * Author URI: https://yalogica.com/
 * License: GPLv3
 * Text Domain: mediacommander
 * Domain Path: /languages
 */
namespace MediaCommander;

defined( 'ABSPATH' ) || exit;
if ( class_exists( 'MediaCommander\\Plugin' ) ) {
    require_once plugin_dir_path( __FILE__ ) . 'includes/Fallbacks/plugin-exist.php';
    add_action( 'admin_init', function () {
        deactivate_plugins( plugin_basename( __FILE__ ) );
    } );
    return;
}
if ( get_option( 'mediacommander_state' ) ) {
    if ( isset( $_GET['mediacommander_delete_old_plugin_data'] ) ) {
        require_once plugin_dir_path( __FILE__ ) . 'includes/Fallbacks/delete-old-plugin-data.php';
    } else {
        require_once plugin_dir_path( __FILE__ ) . 'includes/Fallbacks/plugin-incompatible.php';
        add_action( 'admin_init', function () {
            deactivate_plugins( plugin_basename( __FILE__ ) );
        } );
        return;
    }
}
define( 'MEDIACOMMANDER_PLUGIN_NAME', 'mediacommander' );
define( 'MEDIACOMMANDER_PLUGIN_VERSION', '2.1.0' );
define( 'MEDIACOMMANDER_PLUGIN_DB_VERSION', '2.0' );
define( 'MEDIACOMMANDER_PLUGIN_DB_TABLE_PREFIX', 'mediacommander' );
define( "MEDIACOMMANDER_PLUGIN_SHORTCODE_NAME", 'mediacommander' );
define( 'MEDIACOMMANDER_PLUGIN_BASE_NAME', plugin_basename( __FILE__ ) );
define( 'MEDIACOMMANDER_PLUGIN_PATH', __DIR__ );
define( 'MEDIACOMMANDER_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'MEDIACOMMANDER_PLUGIN_REST_URL', 'mediacommander/v1' );
define( 'MEDIACOMMANDER_PLUGIN_SITE_URL', 'https://yalogica.com/mediacommander/' );
define( 'MEDIACOMMANDER_PLUGIN_DOCS_URL', 'https://yalogica.com/docs/mediacommander/' );
if ( !function_exists( 'mediacommander_fs' ) ) {
    function mediacommander_fs() {
        global $mediacommander_fs;
        if ( !isset( $mediacommander_fs ) ) {
            require_once dirname( __FILE__ ) . '/freemius/start.php';
            $mediacommander_fs = fs_dynamic_init( [
                'id'               => '15460',
                'slug'             => 'mediacommander',
                'type'             => 'plugin',
                "public_key"       => 'pk_80981d4f69df2825ab7a9651b6d77',
                'is_premium'       => false,
                'has_addons'       => false,
                'has_paid_plans'   => true,
                'is_org_compliant' => true,
                'menu'             => [
                    'slug'    => 'mediacommander-settings',
                    'parent'  => [
                        'slug' => 'options-general.php',
                    ],
                    'account' => false,
                    'contact' => false,
                    'support' => false,
                    'pricing' => false,
                ],
                'is_live'          => true,
            ] );
        }
        return $mediacommander_fs;
    }

    // Init Freemius.
    mediacommander_fs();
    // Signal that SDK was initiated.
    do_action( 'mediacommander_fs_loaded' );
}
register_activation_hook( __FILE__, ['MediaCommander\\Plugin', 'activate'] );
register_deactivation_hook( __FILE__, ['MediaCommander\\Plugin', 'deactivate'] );
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/includes/autoload.php';
Plugin::run();