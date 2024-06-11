<?php
namespace MediaCommander\Blocks;

defined( 'ABSPATH' ) || exit;

use MediaCommander\Models\FoldersModel;

class GalleryBlock {
    public function __construct() {
        add_action( 'init', [ $this, 'init' ] );
    }

    public function init() {
        register_block_type( MEDIACOMMANDER_PLUGIN_PATH . '/assets/blocks/galleryblock/block.json', [ 'render_callback' => [ $this, 'renderBlock' ] ] );

        $globals = [
            'data' => [
                'imageSizes' => [
                    'thumbnail' => esc_html__( 'Thumbnail', 'mediacommander' ),
                    'medium' => esc_html__( 'Medium', 'mediacommander' ),
                    'large' => esc_html__( 'Large', 'mediacommander' ),
                    'full' => esc_html__( 'Full size', 'mediacommander' )
                ],
            ],
            'api' => [
                'nonce' => wp_create_nonce( 'wp_rest' ),
                'url' => esc_url_raw( rest_url( MEDIACOMMANDER_PLUGIN_REST_URL ) )
            ]
        ];

        wp_localize_script( 'mediacommander-image-gallery-editor-script', 'MediaCommanderGalleryBlock', $globals);
    }

    public function renderBlock( $attributes = [] ) {
        $folder = null;
        $columns = 4;
        $max = 8;
        $imageSize = 'thumbnail';
        $className = null;

        if ( !is_array( $attributes ) ) {
            $attributes = [];
        }

        foreach ( $attributes as $key => $value ) {
            if ( !$key || $value === '') {
                continue;
            }

            $key = strtolower( $key );

            switch ( $key ) {
                case 'folder': {
                    $folder = intval( $value );
                } break;
                case 'columns': {
                    $columns = intval( $value );
                } break;
                case 'max': {
                    $max = intval( $value );
                } break;
                case 'imagesize': {
                    $imageSize = $value;
                } break;
                case 'classname': {
                    $className = sanitize_html_class( $value );
                } break;
            }
        }

        if ( empty( $folder ) ) {
            return '<div class="components-notice is-warning"><div class="components-notice__content"><p>' . esc_html__( 'No folder selected.', 'mediacommander' ) . '</p></div></div>';
        }

        $attachment_ids = FoldersModel::getAttachments( $folder, $max );

        if ( !count( $attachment_ids ) ) {
            return '<div class="components-notice is-warning"><div class="components-notice__content"><p>' . esc_html__( 'The selected folder has no items.', 'mediacommander' ) . '</p></div></div>';
        }

        ob_start();

        $classes = ['mediacommander-gallery-block'];
        if ( !empty( $className ) ) {
            $classes[] = $className;
        }

        echo '<div class="' . implode( ' ', $classes ) . '">';
        for ($column = 1; $column <= $columns; $column++) {
            echo '<div class="mediacommander-gallery-block__column">';

            $attachment_column_key = $column;
            foreach ( $attachment_ids as $attachment_key => $attachment_id ) {
                if ( ($attachment_key + 1) == $attachment_column_key ) {
                    $imageUrl = wp_get_attachment_url( $attachment_id );

                    if ( $imageUrl ) {
                        echo '<figure class="mediacommander-gallery-block__item">';
                        echo wp_get_attachment_image( $attachment_id, $imageSize, false );
                        echo '</figure>';
                    }

                    $attachment_column_key += $columns;
                }
            }

            echo '</div>';
        }
        echo '</div>';

        return ob_get_clean();
    }
}