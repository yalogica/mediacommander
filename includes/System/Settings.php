<?php
namespace MediaCommander\System;

defined( 'ABSPATH' ) || exit;

use MediaCommander\Models\HelperModel;
use MediaCommander\Models\ConfigModel;
use MediaCommander\Models\ImportModel;
use MediaCommander\Models\SecurityProfilesModel;

class Settings {
    public function __construct() {
        add_action( 'init', [ $this, 'init' ] );
    }

    public function init() {
        add_action( 'admin_menu', [ $this, 'adminMenu' ] );
        add_action( 'in_admin_header', [ $this, 'removeNotices' ] );
    }

    public function adminMenu() {
       add_submenu_page(
            'options-general.php',
            'MediaCommander Settings',
            'MediaCommander',
            'manage_options',
            'mediacommander-settings',
            [ $this, 'adminMenuPageSettings' ]
        );
    }

    public function adminMenuPageSettings() {
        $page = sanitize_key( filter_input( INPUT_GET, 'page', FILTER_DEFAULT ) );
        if ( $page === 'mediacommander-settings' ) {
            $globals = [
                'data' => [
                    'version' => MEDIACOMMANDER_PLUGIN_VERSION,
                    'accesstypes' => [
                        'commonfolders' => [
                            'id' => SecurityProfilesModel::COMMON_FOLDERS,
                            'title' => SecurityProfilesModel::getPredefinedTitle( SecurityProfilesModel::COMMON_FOLDERS )
                        ],
                        'personalfolders' => [
                            'id' => SecurityProfilesModel::PERSONAL_FOLDERS,
                            'title' => SecurityProfilesModel::getPredefinedTitle( SecurityProfilesModel::PERSONAL_FOLDERS )
                        ],
                    ],
                    'plugins_to_import' => ImportModel::getPluginsToImport(),
                    'ticket' => ConfigModel::getTicket(),
                    'anonymous' => ConfigModel::isAnonymous(),
                    'url' => [
                        'upgrade' => ConfigModel::getUpgradeUrl(),
                        'support' => ConfigModel::getSupportUrl(),
                        'docs' => MEDIACOMMANDER_PLUGIN_DOCS_URL,
                        'account' => ConfigModel::getAccountUrl()
                    ]
                ],
                'msg' => HelperModel::getMessagesForSettings(),
                'api' => [
                    'nonce' => wp_create_nonce( 'wp_rest' ),
                    'url' => esc_url_raw( rest_url( MEDIACOMMANDER_PLUGIN_REST_URL ) )
                ]
            ];

            wp_enqueue_script( 'mediacommander-feather-icons', MEDIACOMMANDER_PLUGIN_URL . 'assets/vendor/feather-icons/feather.js', [], MEDIACOMMANDER_PLUGIN_VERSION, false );
            wp_enqueue_script( 'mediacommander-angular-light', MEDIACOMMANDER_PLUGIN_URL . 'assets/vendor/angular-light/angular-light.js', [], MEDIACOMMANDER_PLUGIN_VERSION, false );
            wp_enqueue_script( 'mediacommander-cookies', MEDIACOMMANDER_PLUGIN_URL . 'assets/vendor/cookie/cookie.js', [], MEDIACOMMANDER_PLUGIN_VERSION, false );

            wp_enqueue_style( 'mediacommander-notify', MEDIACOMMANDER_PLUGIN_URL . 'assets/css/notify.css', [], MEDIACOMMANDER_PLUGIN_VERSION );
            wp_enqueue_script( 'mediacommander-notify', MEDIACOMMANDER_PLUGIN_URL . 'assets/js/notify.js', ['jquery'], MEDIACOMMANDER_PLUGIN_VERSION, false );

            wp_enqueue_style( 'mediacommander-colorpicker', MEDIACOMMANDER_PLUGIN_URL . 'assets/css/colorpicker.css', [], MEDIACOMMANDER_PLUGIN_VERSION );
            wp_enqueue_script( 'mediacommander-colorpicker', MEDIACOMMANDER_PLUGIN_URL . 'assets/js/colorpicker.js', ['jquery'], MEDIACOMMANDER_PLUGIN_VERSION, false );

            wp_enqueue_style( 'mediacommander-settings', MEDIACOMMANDER_PLUGIN_URL . 'assets/css/settings.css', [], MEDIACOMMANDER_PLUGIN_VERSION );
            wp_enqueue_script( 'mediacommander-settings', MEDIACOMMANDER_PLUGIN_URL . 'assets/js/settings.js', ['jquery'], MEDIACOMMANDER_PLUGIN_VERSION, false );
            wp_localize_script( 'mediacommander-settings', 'mediacommander_settings_globals', $globals);

            require_once( MEDIACOMMANDER_PLUGIN_PATH . '/includes/Views/settings.php' );
        }
    }

    public function removeNotices() {
        $page = sanitize_key( filter_input( INPUT_GET, 'page', FILTER_DEFAULT ) );
        if ( $page === 'mediacommander-settings' ) {
            remove_all_actions( 'admin_notices' );
            remove_all_actions( 'all_admin_notices' );
        }
    }
}
