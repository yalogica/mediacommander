<?php

defined( 'ABSPATH' ) || exit;

add_action(
    'admin_notices',
    function() {
        if ( !current_user_can( 'activate_plugins' ) ) {
            return;
        }

        ?>
        <div class="notice notice-error is-dismissible">
            <p><?php esc_html_e( "It looks like you have another version of MediaCommander installed, please uninstall it before activating this new version.", 'mediacommander' ); ?></p>
        </div>
        <?php
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if ( isset( $_GET['activate'] ) ) {
            unset( $_GET['activate'] );
        }
    }
);