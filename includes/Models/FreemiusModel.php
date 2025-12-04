<?php

namespace Yalogica\MediaCommander\Models;

defined( 'ABSPATH' ) || exit;
class FreemiusModel {
    public static function getTicket() {
        global $mediacommander_fs;
        return false;
    }

    public static function getUpgradeUrl() {
        return MEDIACOMMANDER_PLUGIN_UPGRADE_URL;
    }

    public static function getAccountUrl() {
        global $mediacommander_fs;
        return $mediacommander_fs->get_account_url();
    }

    public static function isAnonymous() {
        global $mediacommander_fs;
        return $mediacommander_fs->is_anonymous();
    }

}
