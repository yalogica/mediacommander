<?php
namespace Yalogica\MediaCommander\System;

defined( 'ABSPATH' ) || exit;

use Yalogica\MediaCommander\Models\SecurityProfilesModel;
use Yalogica\MediaCommander\Models\FoldersModel;
use Yalogica\MediaCommander\Models\HelperModel;
use Yalogica\MediaCommander\Models\ConfigModel;
use Yalogica\MediaCommander\Models\FreemiusModel;
use Yalogica\MediaCommander\Models\UserModel;

class Folders {
    private $access = false;

    public function __construct() {
        add_action( 'init', [ $this, 'init' ] );
    }

    public function init() {
        $config = ConfigModel::get();
        if ( array_key_exists( 'infinite_scrolling', $config ) && $config['infinite_scrolling'] ) {
            add_filter( 'media_library_infinite_scrolling', '__return_true' );
        }

        if ( array_key_exists( 'replace_media', $config ) && $config['replace_media'] ) {
            add_action( 'edit_attachment', [ $this, 'replaceMediaEditAttachment' ] );
            add_filter( 'attachment_fields_to_edit', [ $this, 'replaceMediaAttachmentFields' ], null, 2 );
        }

        if ( array_key_exists( 'media_hover_details', $config ) && $config['media_hover_details'] ) {
            add_filter( 'wp_prepare_attachment_for_js', [ $this, 'prepareAttachment' ], 99, 5 );
        }

        add_action( 'admin_enqueue_scripts', [ $this, 'sidebarScripts' ] );
        if ( defined( 'AVADA_VERSION' ) ) {
            add_action( 'fusion_enqueue_live_scripts', [ $this, 'sidebarScripts' ] );
        } else if ( defined( 'ELEMENTOR_VERSION' ) ) {
            add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'sidebarScripts' ] );
        } else if ( defined( 'BRIZY_VERSION' ) ) {
            add_action( 'brizy_editor_enqueue_scripts', [ $this, 'sidebarScripts' ] );
        } else {
            add_action( 'wp_enqueue_scripts', [ $this, 'sidebarScripts' ] );
        }

        add_action( 'pre_get_posts', [ $this, 'redirectToMain' ] );
        add_action( 'delete_post', [ $this, 'deletePost' ] );
        add_action( 'add_attachment', [ $this, 'addAttachment' ] );
        add_filter( 'posts_clauses', [ $this, 'postsСlauses' ], 10, 2 );
        add_filter( 'pre_user_query', [ $this, 'preUserQuery'] );
    }

    public function replaceMediaEditAttachment() {
    }

    public function replaceMediaAttachmentFields( $fields, $post ) {
        $screen = get_current_screen();
        if ( $screen && $screen->id === 'attachment' ) {
            return $fields;
        }

        $fields['mediacommander-replace-media'] = [
            'label' => '',
            'input' => 'html',
            'html'  => "
                <button type='button' class='button-secondary button-large' onclick='MEDIACOMMANDER.APP.fn.replacemedia.open(this)' data-attachment-id='{$post->ID}'>Replace Image</button>
                <p><strong>Warning:</strong> Replacing this image with another will permanently delete the current file and overwrite it with the new one. It is also recommended to use the same image size for the new image as the image being replaced, otherwise the recreated thumbnails will have different sizes and names, which may cause links to the old thumbnails to become broken.</p>"
        ];
        return $fields;
    }

    public function sidebarScripts() {
        if ( UserModel::hasAccess() ) {
            add_action( 'admin_head', [ $this, 'adminHead' ] );

            wp_enqueue_script( 'mediacommander-cookie', MEDIACOMMANDER_PLUGIN_URL . 'assets/vendor/cookie/cookie.js', [], MEDIACOMMANDER_PLUGIN_VERSION, false );
            wp_enqueue_script( 'mediacommander-url', MEDIACOMMANDER_PLUGIN_URL . 'assets/vendor/url/url.js', [], MEDIACOMMANDER_PLUGIN_VERSION, false );

            wp_enqueue_style( 'mediacommander-colorpicker', MEDIACOMMANDER_PLUGIN_URL . 'assets/css/colorpicker.css', [], MEDIACOMMANDER_PLUGIN_VERSION );
            wp_enqueue_script( 'mediacommander-colorpicker', MEDIACOMMANDER_PLUGIN_URL . 'assets/js/colorpicker.js', ['jquery'], MEDIACOMMANDER_PLUGIN_VERSION, false );

            wp_enqueue_style( 'mediacommander-notify', MEDIACOMMANDER_PLUGIN_URL . 'assets/css/notify.css', [], MEDIACOMMANDER_PLUGIN_VERSION );
            wp_enqueue_script( 'mediacommander-notify', MEDIACOMMANDER_PLUGIN_URL . 'assets/js/notify.js', ['jquery'], MEDIACOMMANDER_PLUGIN_VERSION, false );

            wp_enqueue_script( 'mediacommander-tree', MEDIACOMMANDER_PLUGIN_URL . 'assets/js/tree.js', ['jquery'], MEDIACOMMANDER_PLUGIN_VERSION, false );

            wp_enqueue_style( 'mediacommander-sidebar', MEDIACOMMANDER_PLUGIN_URL . 'assets/css/sidebar.css', [], MEDIACOMMANDER_PLUGIN_VERSION );
            wp_enqueue_script( 'mediacommander-sidebar', MEDIACOMMANDER_PLUGIN_URL . 'assets/js/sidebar.js', ['jquery'], MEDIACOMMANDER_PLUGIN_VERSION, false );
            wp_localize_script( 'mediacommander-sidebar', 'mediacommander_sidebar_globals', $this->getGlobals() );
        }
    }

    public function redirectToMain() {
        $this->access = UserModel::hasAccess();
    }

    public function postsСlauses( $clauses, $query ) {
        if ( !$this->access ) {
            return $clauses;
        }

        $type = FoldersModel::getCurrentType();
        if ( $query->get( 'post_type' ) == $type && strpos( $clauses['where'], $type ) ) {
            $action = sanitize_key( filter_input( INPUT_POST, 'action', FILTER_DEFAULT ) );
            $mode = sanitize_key( filter_input( INPUT_POST, 'mediacommander_mode', FILTER_DEFAULT ) );
            if ( $action === 'query-attachments' && $mode !== 'grid' ) {
                return $clauses;
            }

            global $wpdb;
            $tableFolders = HelperModel::getTableName( HelperModel::FOLDERS );
            $tableAttachments = HelperModel::getTableName( HelperModel::ATTACHMENTS );

            $rights = UserModel::getRights( $type );
            $meta = UserModel::getMeta( $type );
            $folder = $meta['folder'];

            if ($folder > 0) {
                $clauses['join'] .= " LEFT JOIN {$tableAttachments} AS ATTACHMENTS ON ({$wpdb->posts}.ID = ATTACHMENTS.attachment_id)";
                $clauses['where'] = " AND (ATTACHMENTS.folder_id = $folder) " . $clauses['where'];
            } else if ($folder == -2) { // uncategorized
                switch( $rights['access_type'] ) {
                    case SecurityProfilesModel::COMMON_FOLDERS: {
                        $clauses['where'] .= " AND ({$wpdb->posts}.ID NOT IN (SELECT ATTACHMENTS.attachment_id FROM {$tableAttachments} AS ATTACHMENTS LEFT JOIN {$tableFolders} AS FOLDERS ON FOLDERS.id=ATTACHMENTS.folder_id WHERE FOLDERS.owner=0))";
                    } break;
                    case SecurityProfilesModel::PERSONAL_FOLDERS: {
                        $user_id = get_current_user_id();
                        $clauses['where'] .= " AND ({$wpdb->posts}.ID NOT IN (SELECT ATTACHMENTS.attachment_id FROM {$tableAttachments} AS ATTACHMENTS LEFT JOIN {$tableFolders} AS FOLDERS ON FOLDERS.id=ATTACHMENTS.folder_id WHERE FOLDERS.owner={$user_id}))";
                    } break;
                }
            }

            switch( $meta['sort']['items'] ) {
                case 'name-asc': {
                    $clauses['orderby'] = " {$wpdb->posts}.post_title ASC, " . $clauses['orderby'];
                } break;
                case 'name-desc': {
                    $clauses['orderby'] = " {$wpdb->posts}.post_title DESC, " . $clauses['orderby'];
                } break;
                case 'date-asc': {
                    $clauses['orderby'] = " {$wpdb->posts}.post_date ASC, " . $clauses['orderby'];
                } break;
                case 'date-desc': {
                    $clauses['orderby'] = " {$wpdb->posts}.post_date DESC, " . $clauses['orderby'];
                } break;
                case 'mod-asc': {
                    $clauses['orderby'] = " {$wpdb->posts}.post_modified ASC, " . $clauses['orderby'];
                } break;
                case 'mod-desc': {
                    $clauses['orderby'] = " {$wpdb->posts}.post_modified DESC, " . $clauses['orderby'];
                } break;
                case 'author-asc': {
                    $clauses['orderby'] = " {$wpdb->posts}.post_author ASC, " . $clauses['orderby'];
                } break;
                case 'author-desc': {
                    $clauses['orderby'] = " {$wpdb->posts}.post_author DESC, " . $clauses['orderby'];
                } break;
            }
        }

        return $clauses;
    }

    public function preUserQuery( $query ) {
        if ( !$this->access ) {
            return $query;
        }

        global $wpdb;
        $tableFolders = esc_sql( HelperModel::getTableName( HelperModel::FOLDERS ) );
        $tableAttachments = esc_sql( HelperModel::getTableName( HelperModel::ATTACHMENTS ) );

        $type = FoldersModel::getCurrentType();
        $rights = UserModel::getRights( $type );
        $meta = UserModel::getMeta( $type );
        $folder = $meta['folder'];

        if ( $folder > 0 ) {
            $query->query_from .= " LEFT JOIN {$tableAttachments} AS ATTACHMENTS ON ({$wpdb->users}.ID = ATTACHMENTS.attachment_id)";
            $query->query_where .= " AND (ATTACHMENTS.folder_id = $folder)";
        } else if($folder == -2) { // uncategorized
            switch( $rights['access_type'] ) {
                case SecurityProfilesModel::COMMON_FOLDERS: {
                    $query->query_where .= " AND ($wpdb->users.ID NOT IN (SELECT ATTACHMENTS.attachment_id FROM {$tableAttachments} AS ATTACHMENTS LEFT JOIN {$tableFolders} AS FOLDERS ON FOLDERS.id=ATTACHMENTS.folder_id WHERE FOLDERS.owner=0))";
                } break;
                case SecurityProfilesModel::PERSONAL_FOLDERS: {
                    $user_id = get_current_user_id();
                    $query->query_where .= " AND ($wpdb->users.ID NOT IN (SELECT ATTACHMENTS.attachment_id FROM {$tableAttachments} AS ATTACHMENTS LEFT JOIN {$tableFolders} AS FOLDERS ON FOLDERS.id=ATTACHMENTS.folder_id WHERE FOLDERS.owner={$user_id}))";
                } break;
            }
        }

        return $query;
    }

    public function deletePost( $post_id ) {
        global $wpdb;
        $tableFolders = esc_sql( HelperModel::getTableName( HelperModel::FOLDERS ) );
        $tableAttachments = esc_sql( HelperModel::getTableName( HelperModel::ATTACHMENTS ) );

        // folders to refresh after the update
        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $sql = $wpdb->prepare( "SELECT DISTINCT folder_id as id FROM {$tableAttachments} WHERE attachment_id=%d", $post_id );
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
        $folders_to_edit = array_column( $wpdb->get_results( $sql, 'ARRAY_A' ), 'id' );

        // remove a post from the attachments table
        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $sql = $wpdb->prepare("DELETE FROM {$tableAttachments} WHERE attachment_id=%d", $post_id);
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
        $wpdb->query( $sql );

        // update the attachment count
        if ( !empty( $folders_to_edit ) ) {
            $ids = implode( ',', array_map( 'intval', $folders_to_edit ) );

            // phpcs:disable WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnquotedComplexPlaceholder, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $sql = $wpdb->prepare("
                UPDATE {$tableFolders} AS F
                SET count = (SELECT COUNT(folder_id) FROM {$tableAttachments} AS A WHERE A.folder_id = F.id)
                WHERE id IN(%1s)",
                $ids
            );
            $wpdb->query( $sql );
            // phpcs:enable
        }
    }

    public function addAttachment( $attachment_id ) {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if ( isset( $_REQUEST['folder'] ) ) {
            // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            $folder_id = intval( $_REQUEST['folder'] );

            global $wpdb;
            $tableFolders = esc_sql( HelperModel::getTableName( HelperModel::FOLDERS ) );
            $tableAttachments = esc_sql( HelperModel::getTableName( HelperModel::ATTACHMENTS ) );

            // add new attachments
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
            $wpdb->insert(
                $tableAttachments,
                [
                    'folder_id' => $folder_id,
                    'attachment_id' => $attachment_id
                ]
            );

            // update the attachment count
            // phpcs:disable WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            $sql = $wpdb->prepare("
                UPDATE {$tableFolders} AS F
                SET count = (SELECT COUNT(folder_id) FROM {$tableAttachments} AS A WHERE A.folder_id = F.id)
                WHERE id=%d",
                $folder_id
            );
            $wpdb->query( $sql );
            // phpcs:enable
        }
    }

    public function prepareAttachment( $response, $attachment ) {
        if ( !isset( $attachment->ID ) && !isset( $attachment->id ) ) {
            return $response;
        }

        $attachment_id = isset($attachment->ID) ? $attachment->ID : $attachment->id;

        $config = ConfigModel::get();
        if ( array_key_exists( 'media_hover_details', $config ) && $config['media_hover_details'] ) {
            $list = $config['media_hover_details_list'] && count( (array)$config['media_hover_details_list'] ) > 0 ? $config['media_hover_details_list'] : [];

            if ( count( $list ) > 0 ) {
                $preview_details = '<div class="mcmd-preview-details">';

                if ( in_array( 'title', $list ) ) {
                    $preview_details .= '<p>' . esc_html__( "Title", 'mediacommander' ) . ': ' . $attachment->post_title . '</p>';
                }
                if ( in_array( 'alternative_text', $list ) ) {
                    $preview_details .= '<p>' . esc_html__( "Alternative text", 'mediacommander' ) . ': ' . get_post_meta( $attachment_id , '_wp_attachment_image_alt', true ) . '</p>';
                }

                if ( in_array( 'file_url', $list ) ) {
                    $preview_details .= '<p>' . esc_html__( "File URL", 'mediacommander' ) .': ' . $attachment->guid . '</p>';
                }

                if ( in_array( 'dimension', $list ) ) {
                    $attachment_meta = wp_get_attachment_metadata( $attachment_id );
                    if ( isset( $attachment_meta ) && !empty( $attachment_meta ) && array_key_exists( 'width', $attachment_meta ) ) {
                        $preview_details .= '<p>' . esc_html__( "Dimension", 'mediacommander' ) . ': ' . $attachment_meta['width'] . ' x ' . $attachment_meta['height'] . '</p>';
                    }
                }

                if ( in_array( 'size', $list ) ) {
                    $preview_details .= '<p>' . esc_html__( "Size", 'mediacommander' ) . ': ' . size_format( filesize( get_attached_file( $attachment->ID ) ), 0) . '</p>';
                }

                if ( in_array( 'filename', $list ) ) {
                    $preview_details .= '<p>' . esc_html__( "Filename", 'mediacommander' ) . ': ' . $attachment->post_name . '</p>';
                }

                if ( in_array( 'type', $list ) ) {
                    $preview_details .= '<p>' . esc_html__( "Type", 'mediacommander' ) . ': ' . $attachment->post_mime_type . '</p>';
                }

                if ( in_array( 'date', $list ) ) {
                    $preview_details .= '<p>' . esc_html__( "Date", 'mediacommander' ) . ': ' . date_i18n( get_option( 'date_format' ), strtotime( $attachment->post_date ) ) . '</p>';
                }

                if ( in_array( 'uploaded_by', $list ) ) {
                    $preview_details .= '<p>' . esc_html__( "Uploaded by", 'mediacommander' ) . ': ' . get_the_author_meta('display_name', $attachment->post_author) . '</p>';
                }

                $preview_details .= '</div>';

                $response['preview_details'] = $preview_details;
            }
        }

        return $response;
    }

    public function adminHead() {
        echo '<style>#screen-meta-links {position: absolute; right: 0;} .wrap {margin-top: 15px;}</style>';
    }

    private function getGlobals() {
        $type = FoldersModel::getCurrentType();
        $meta = UserModel::getMeta( $type );
        $rights = UserModel::getRights( $type );
        $rights = $rights ? array_diff_key( $rights, ['access_type' => null] ) : null;
        $config = ConfigModel::get();

        $globals = [
            'data' => [
                'version' => MEDIACOMMANDER_PLUGIN_VERSION,
                'type' => $type,
                'meta' => $meta,
                'rights' => $rights,
                'default_color' => $config['default_color'],
                'disable_counter' => $config['disable_counter'],
                'disable_ajax' => $config['disable_ajax'],
                'disable_search_bar' => $config['disable_search_bar'],
                'media_hover_details' => $config['media_hover_details'],
                'ticket' => (bool) FreemiusModel::getTicket(),
                'max_upload_size' => size_format( wp_max_upload_size() ),
                'url' => [
                    'upgrade' => FreemiusModel::getUpgradeUrl(),
                    'docs' => MEDIACOMMANDER_PLUGIN_DOCS_URL
                ]
            ],
            'api' => [
                'nonce' => wp_create_nonce( 'wp_rest' ),
                'url' => esc_url_raw( rest_url( MEDIACOMMANDER_PLUGIN_REST_URL ) )
            ],
            'msg' => HelperModel::getMessagesForSidebar()
        ];

        return $globals;
    }
}