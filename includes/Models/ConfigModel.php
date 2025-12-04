<?php
namespace Yalogica\MediaCommander\Models;

defined( 'ABSPATH' ) || exit;

class ConfigModel {
    const OPTION_KEY = 'mediacommander_config';
    const DEFAULT_CONFIG = [
        'roles' => [ 'administrator' ],
        'default_color' => NULL,
        'disable_counter' => false,
        'disable_ajax' => false,
        'infinite_scrolling' => false,
        'disable_search_bar' => false,
        'replace_media' => false,
        'uninstall_fully' => false,
        'media_hover_details' => true,
        'media_hover_details_list' => [ 'title', 'size', 'dimension' ] // 'alternative_text', 'file_url', 'filename', 'type', 'date', 'uploaded_by'
    ];

    public static function init() {
        self::set();
    }

    public static function get( $option = null ) {
        $data = get_option( self::OPTION_KEY );

        if( $data == false ) {
            $data = self::DEFAULT_CONFIG;
        } else {
            foreach ( self::DEFAULT_CONFIG as $key => $default ) {
                if ( !array_key_exists( $key, $data ) ) {
                    $data[$key] = $default;
                }
            }
        }

        if ( $data && $option != null ) {
            return $data[ $option ];
        }

        return $data ? $data : null;
    }

    public static function set( $data = null ) {
        $current_data = self::get();
        $current_data = $current_data ? $current_data : [];

        foreach ( self::DEFAULT_CONFIG as $key => $option ) {
            if ( !array_key_exists( $key, $current_data ) ) {
                $current_data[ $key ] = $option;
            }
        }

        foreach ( $current_data as $key => $option ) {
            if ( !array_key_exists( $key, self::DEFAULT_CONFIG ) ) {
                unset( $current_data[ $key ] );
            }
        }

        if ( $data ) {
            foreach ( $current_data as $key => $option) {
                if ( !array_key_exists( $key, $data ) ) {
                    $data[ $key ] = $option;
                }
            }

            foreach ( $data as $key => $option ) {
                if ( !array_key_exists( $key, self::DEFAULT_CONFIG ) ) {
                    unset( $data[$key] );
                }
            }
        } else {
            $data = $current_data;
        }


        if ( get_option( self::OPTION_KEY ) == false ) {
            $autoload = 'no';
            return add_option( self::OPTION_KEY, $data, '', $autoload );
        } else {
            $old_value = get_option( self::OPTION_KEY );
            if ( $old_value === $data ) {
                return true;
            } else {
                return update_option( self::OPTION_KEY, $data );
            }
        }
    }
}
