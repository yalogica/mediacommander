<?php
namespace MediaCommander\Rest\Controllers;

defined( 'ABSPATH' ) || exit;

use MediaCommander\Models\FoldersModel;
use MediaCommander\Models\HelperModel;
use MediaCommander\Models\UserModel;

class FoldersController {
    public function registerRestRoutes() {
        register_rest_route(
            MEDIACOMMANDER_PLUGIN_REST_URL,
            '/foldertypes/unregistered',
            [
                [
                    'methods' => \WP_REST_Server::READABLE,
                    'callback' => [ $this, 'getUnregisteredFolderTypes' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ],
            ]
        );

        register_rest_route(
            MEDIACOMMANDER_PLUGIN_REST_URL,
            '/meta',
            [
                [
                    'methods' => \WP_REST_Server::READABLE,
                    'callback' => [ $this, 'getMeta' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ],
                [
                    'methods' => \WP_REST_Server::EDITABLE,
                    'callback' => [ $this, 'updateMeta' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ]
            ]
        );

        register_rest_route(
            MEDIACOMMANDER_PLUGIN_REST_URL,
            '/folders',
            [
                [
                    'methods' => \WP_REST_Server::READABLE,
                    'callback' => [ $this, 'getFolders' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ],
                [
                    'methods' => \WP_REST_Server::CREATABLE,
                    'callback' => [ $this, 'createFolders' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ],
                [
                    'methods' => \WP_REST_Server::EDITABLE,
                    'callback' => [ $this, 'updateFolders' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ],
                [
                    'methods' => \WP_REST_Server::DELETABLE,
                    'callback' => [ $this, 'deleteFolders' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ]
            ]
        );

        register_rest_route(
            MEDIACOMMANDER_PLUGIN_REST_URL,
            '/copyfolder',
            [
                [
                    'methods' => \WP_REST_Server::CREATABLE,
                    'callback' => [ $this, 'copyFolder' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ]
            ]
        );

        register_rest_route(
            MEDIACOMMANDER_PLUGIN_REST_URL,
            '/attach',
            [
                [
                    'methods' => \WP_REST_Server::EDITABLE,
                    'callback' => [ $this, 'attachToFolder' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ]
            ]
        );

        register_rest_route(
            MEDIACOMMANDER_PLUGIN_REST_URL,
            '/attachment/counters',
            [
                [
                    'methods' => \WP_REST_Server::READABLE,
                    'callback' => [ $this, 'getAttachmentCounters' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ],
                [
                    'methods' => \WP_REST_Server::EDITABLE,
                    'callback' => [ $this, 'updateAttachmentCounters' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ]
            ]
        );

        register_rest_route(
            MEDIACOMMANDER_PLUGIN_REST_URL,
            '/export-csv',
            [
                [
                    'methods' => \WP_REST_Server::READABLE,
                    'callback' => [ $this, 'exportCSV' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ]
            ]
        );

        register_rest_route(
            MEDIACOMMANDER_PLUGIN_REST_URL,
            '/import-csv',
            [
                'methods' => \WP_REST_Server::CREATABLE,
                'callback' => [ $this, 'importCSV' ],
                'permission_callback' => [ $this, 'canUploadFiles' ]
            ]
        );

        register_rest_route(
            MEDIACOMMANDER_PLUGIN_REST_URL,
            '/replace-media',
            [
                'methods' => \WP_REST_Server::CREATABLE,
                'callback' => [ $this, 'replaceMedia' ],
                'permission_callback' => [ $this, 'canUploadFiles' ]
            ]
        );

        register_rest_route(
            MEDIACOMMANDER_PLUGIN_REST_URL,
            '/folders/download/url',
            [
                [
                    'methods' => \WP_REST_Server::READABLE,
                    'callback' => [ $this, 'getDownloadFoldersUrl' ],
                    'permission_callback' => [ $this, 'canUploadFiles' ]
                ]
            ]
        );

        register_rest_route(
            MEDIACOMMANDER_PLUGIN_REST_URL,
            '/folders/download/(?P<id>[A-Za-z0-9]{13})',
            [
                [
                    'methods' => \WP_REST_Server::READABLE,
                    'callback' => [ $this, 'downloadFolders' ],
                    'permission_callback' => '__return_true'
                ]
            ]
        );
    }

    public function canUploadFiles() {
        return current_user_can( 'upload_files' );
    }

    public function getUnregisteredFolderTypes( \WP_REST_Request $request ) {
        $data = FoldersModel::getUnregisteredTypes();
        $response = [ 'success' => true, 'data' => $data ];

        return new \WP_REST_Response( $response );
    }

    public function getMeta( \WP_REST_Request $request ) {
        $type  = sanitize_key( $request->get_param( 'type' ) );

        $data = UserModel::getMeta( $type );
        $response = isset( $data ) ? [ 'success' => true, 'data' => $data ] : [ 'success' => false ];

        return new \WP_REST_Response( $response );
    }

    public function updateMeta( \WP_REST_Request $request ) {
        $type  = sanitize_key( $request->get_param( 'type' ) );
        $meta  = $request->get_param( 'meta' );

        $data = UserModel::updateMeta( $type, $meta );
        $response = isset( $data ) ? [ 'success' => true ] : [ 'success' => false ];

        return new \WP_REST_Response( $response );
    }

    public function getFolders( \WP_REST_Request $request ) {
        $type  = sanitize_key( $request->get_param( 'type' ) );

        $data = FoldersModel::getFolders( $type );
        $response = isset( $data ) ? [ 'success' => true, 'data' => $data ] : [ 'success' => false ];

        return new \WP_REST_Response( $response );
    }

    public function createFolders( \WP_REST_Request $request ) {
        $type  = sanitize_key( $request->get_param( 'type' ) );
        $parent = intval( $request->get_param( 'parent' ) );
        $names = array_map( 'sanitize_text_field', $request->get_param( 'names' ) ? $request->get_param( 'names' ) : [] );
        $color = HelperModel::filterColor( $request->get_param( 'color' ) );

        $data = FoldersModel::createFolders( $type, $parent, $names, $color );
        $response = isset( $data ) ? [ 'success' => true, 'data' => $data ] : [ 'success' => false ];

        return new \WP_REST_Response( $response );
    }

    public function updateFolders( \WP_REST_Request $request ) {
        $type  = sanitize_key( $request->get_param( 'type' ) );
        $action  = sanitize_key( $request->get_param( 'action' ) );
        $ids = $request->has_param( 'folders' ) ? array_map( 'intval', $request->get_param( 'folders' ) ) : [];
        $attrs = [
            'name' => sanitize_text_field( $request->get_param( 'name' ) ),
            'color' => HelperModel::filterColor( $request->get_param( 'color' ) ),
            'parent' => intval( $request->get_param( 'parent' ) ),
            'sorting' => $request->has_param( 'sorting' ) ? array_map( 'intval', $request->get_param( 'sorting' ) ) : []
        ];

        $data = FoldersModel::updateFolders( $type, $action, $ids, $attrs );
        $response = isset( $data ) ? [ 'success' => true, 'data' => $data ] : [ 'success' => false ];

        return new \WP_REST_Response( $response );
    }

    public function copyFolder( \WP_REST_Request $request ) {
        $type  = sanitize_key( $request->get_param( 'type' ) );
        $src = intval( $request->get_param( 'src' ) );
        $dst = intval( $request->get_param( 'dst' ) );

        $data = FoldersModel::copyFolder( $type, $src, $dst );
        $response = isset( $data ) ? [ 'success' => true, 'data' => $data ] : [ 'success' => false ];

        return new \WP_REST_Response( $response );
    }

    public function deleteFolders( \WP_REST_Request $request ) {
        $type  = sanitize_key( $request->get_param( 'type' ) );
        $ids = $request->has_param( 'folders' ) ? array_map( 'intval', $request->get_param( 'folders' ) ) : [];

        $data = FoldersModel::deleteFolders( $type, $ids );
        $response = isset( $data ) ? [ 'success' => true, 'data' => $data ] : [ 'success' => false ];

        return new \WP_REST_Response( $response );
    }

    public function attachToFolder( \WP_REST_Request $request ) {
        $type  = sanitize_key( $request->get_param( 'type' ) );
        $id  = sanitize_key( $request->get_param( 'folder' ) );
        $attachments = $request->has_param( 'attachments' ) ? array_map( 'intval', $request->get_param( 'attachments' ) ) : [];

        $data = FoldersModel::attachToFolder( $type, $id, $attachments );
        $response = isset( $data ) ? [ 'success' => true, 'data' => $data ] : [ 'success' => false ];

        return new \WP_REST_Response( $response );
    }

    public function getAttachmentCounters( \WP_REST_Request $request ) {
        $type  = sanitize_key( $request->get_param( 'type' ) );
        $ids = array_map( 'intval', $request->get_param( 'folders' ) ? $request->get_param( 'folders' ) : [] );

        $data = FoldersModel::getAttachmentCounters( $type, $ids );
        $response = isset( $data ) ? [ 'success' => true, 'data' => $data ] : [ 'success' => false ];

        return new \WP_REST_Response( $response );
    }

    public function updateAttachmentCounters( \WP_REST_Request $request ) {
        $response = [ 'success' => FoldersModel::updateAttachmentCounters() ];
        return new \WP_REST_Response( $response );
    }

    public function exportCSV( \WP_REST_Request $request ) {
        $data = FoldersModel::exportCSV();
        $response = isset( $data ) ? [ 'success' => true, 'data' => $data ] : [ 'success' => false ];

        return new \WP_REST_Response( $response );
    }

    public function importCSV( \WP_REST_Request $request ) {
        $params  = $request->get_file_params();
        $file = $params['file']['tmp_name'];
        $clear  = filter_var( $request->get_param( 'clear' ), FILTER_VALIDATE_BOOLEAN );
        $attachments  = filter_var( $request->get_param( 'attachments' ), FILTER_VALIDATE_BOOLEAN );

        $data = FoldersModel::importCSV( $file, $clear, $attachments );
        $response = isset( $data ) ? [ 'success' => true, 'data' => $data ] : [ 'success' => false ];

        return new \WP_REST_Response( $response );
    }

    public function replaceMedia( \WP_REST_Request $request ) {
        $params  = $request->get_file_params();
        $file = $params['file']['tmp_name'];
        $attachment = intval( $request->get_param( 'attachment' ) );

        $response = [ 'success' => FoldersModel::replaceMedia( $file, $attachment ) ];
        return new \WP_REST_Response( $response );
    }

    public function getDownloadFoldersUrl( \WP_REST_Request $request ) {
        $type = sanitize_key( $request->get_param( 'type' ) );
        $ids = $request->has_param( 'folders' ) ? array_map( 'intval', $request->get_param( 'folders' ) ) : [];

        $data = FoldersModel::getDownloadFoldersUrl( $type, $ids  );
        $response = isset( $data ) ? [ 'success' => true, 'data' => $data ] : [ 'success' => false ];

        return new \WP_REST_Response( $response );
    }

    public function downloadFolders( \WP_REST_Request $request ) {
        $id = sanitize_key( $request->get_param( 'id' ) );
        FoldersModel::downloadFolders( $id  );
        return new \WP_REST_Response( null, 404 );
    }
}