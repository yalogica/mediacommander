<?php
namespace Yalogica\MediaCommander\System;

defined( 'ABSPATH' ) || exit;

class Notice {
    public function __construct() {
        add_action( 'init', [ $this, 'init' ] );
    }

    public function init() {
        add_action( 'admin_notices', [ $this, 'adminNotices' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueueScripts' ] );
    }

    public function adminNotices() {
        if ( get_option( 'mediacommander_dismiss_first_use_notification', false ) || ( get_current_screen() && get_current_screen()->base === 'upload' ) ) {
            return;
        }

        $classes = [
            'notice',
            'notice-info',
            'is-dismissible',
        ];
        $msg = '<span>' . esc_html__( "Thanks for start using the plugin MediaCommander. Let's create first folders.", 'mediacommander' ) . ' <a href="' . esc_url( admin_url('/upload.php') ) . '">' . esc_html__( "Go to WordPress Media Library.", 'mediacommander' ) . '</a></span>';

        printf( '<div id="mediacommander-first-use-notification" class="%s"><p>%s</p></div>', esc_html( trim( implode( ' ', $classes ) ) ), wp_kses_post ( $msg ) );
    }

    public function enqueueScripts() {
        wp_enqueue_style( 'mediacommander-notice', MEDIACOMMANDER_PLUGIN_URL . 'assets/css/notice.css', [], MEDIACOMMANDER_PLUGIN_VERSION );
        wp_enqueue_script( 'mediacommander-notice', MEDIACOMMANDER_PLUGIN_URL . 'assets/js/notice.js', ['jquery'], MEDIACOMMANDER_PLUGIN_VERSION, false );
        wp_localize_script( 'mediacommander-notice', 'mediacommander_notice_globals', $this->getGlobals() );
    }

    private function getGlobals() {
        $globals = [
            'api' => [
                'nonce' => wp_create_nonce( 'wp_rest' ),
                'url' => esc_url_raw( rest_url( MEDIACOMMANDER_PLUGIN_REST_URL ) )
            ]
        ];
        return $globals;
    }
}