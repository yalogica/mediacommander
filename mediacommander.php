<?php
/**
 * Plugin Name:       MediaCommander - Bring Folders to Media, Posts, and Pages
 * Plugin URI:        https://yalogica.com/mediacommander/
 * Description:       Improve your WordPress media library with a more intuitive way. Simply drag & drop items into folders for effortless accessibility.
 * Version:           2.7.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Yalogica
 * Author URI:        https://yalogica.com/
 * License:           GPLv3
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       mediacommander
 * Domain Path:       /languages
 */

namespace Yalogica\MediaCommander;

defined('ABSPATH') || exit;

if (class_exists('Yalogica\\MediaCommander\\Plugin')) {
  require_once(plugin_dir_path(__FILE__) . 'includes/Fallbacks/plugin-exist.php');
  add_action('admin_init', function () {
    deactivate_plugins(plugin_basename(__FILE__));
  });
  return;
}

define('MEDIACOMMANDER_PLUGIN_NAME', 'mediacommander');
define('MEDIACOMMANDER_PLUGIN_VERSION', '2.7.0');
define('MEDIACOMMANDER_PLUGIN_DB_VERSION', '3.0');
define('MEDIACOMMANDER_PLUGIN_DB_TABLE_PREFIX', 'mediacommander');
define("MEDIACOMMANDER_PLUGIN_SHORTCODE_NAME", 'mediacommander');
define('MEDIACOMMANDER_PLUGIN_BASE_NAME', plugin_basename(__FILE__));
define('MEDIACOMMANDER_PLUGIN_PATH', __DIR__);
define('MEDIACOMMANDER_PLUGIN_URL', plugin_dir_url(__FILE__));
define('MEDIACOMMANDER_PLUGIN_REST_URL', 'mediacommander/v1');
define('MEDIACOMMANDER_PLUGIN_SITE_URL', 'https://yalogica.com/mediacommander/');
define('MEDIACOMMANDER_PLUGIN_UPGRADE_URL', 'https://yalogica.com/mediacommander/');
define('MEDIACOMMANDER_PLUGIN_DOCS_URL', 'https://yalogica.com/docs/mediacommander/');

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/includes/autoload.php';

register_activation_hook(__FILE__, ['Yalogica\\MediaCommander\\Plugin', 'activate']);
register_deactivation_hook(__FILE__, ['Yalogica\\MediaCommander\\Plugin', 'deactivate']);

if (function_exists('mediacommander_fs')) {
  mediacommander_fs()->set_basename(false, __FILE__);
} else {
  function mediacommander_fs()
  {
    global $mediacommander_fs;

    if (!isset($mediacommander_fs)) {
      require_once dirname(__FILE__) . '/vendor/freemius/wordpress-sdk/start.php';
      $mediacommander_fs = fs_dynamic_init([
        'id'                  => '15460',
        'type'                => 'plugin',
        'slug'                => 'mediacommander',
        'premium_slug'        => 'mediacommander-pro',
        'public_key'          => 'pk_80981d4f69df2825ab7a9651b6d77',
        'premium_suffix'      => 'Pro',
        'is_premium'          => false,
        'has_addons'          => false,
        'has_paid_plans'      => true,
        'is_org_compliant'    => true,
        'trial' => [
          'days'               => 7,
          'is_require_payment' => false,
        ],
        'menu' => [
          'slug'   => 'mediacommander-settings',
          'support' => false,
          'contact' => true
        ],
        'is_live' => true,
      ]);
    }

    $mediacommander_fs->add_filter('pricing/show_annual_in_monthly', '__return_false');
    $mediacommander_fs->add_filter('plugin_icon', function () {
      return dirname(__FILE__) . '/assets/img/mediacommander.png';
    });

    return $mediacommander_fs;
  }

  mediacommander_fs(); // Init Freemius.
  do_action('mediacommander_fs_loaded'); // Signal that SDK was initiated.

  Plugin::run();
}