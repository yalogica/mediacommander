<?php
defined( 'ABSPATH' ) || exit;
?>
<div class="mcmd-modal">
    <div class="mcmd-dialog">
        <div class="mcmd-header">
            <div class="mcmd-title"><?php esc_html_e("Confirm", 'mediacommander'); ?></div>
            <div class="mcmd-cancel" al-on.click="Modal.fn.close()"><i data-feather="x"></i></div>
        </div>
        <div class="mcmd-data">
            <div class="mcmd-loader" al-attr.class.mcmd-active="Modal.loading"></div>
            <p><?php esc_html_e("Are you sure you want to delete {{Modal.data.count}} items?", 'mediacommander'); ?></p>
        </div>
        <div class="mcmd-footer">
            <div class="mcmd-btn mcmd-cancel" al-on.click="Modal.fn.close()"><?php esc_html_e("Cancel", 'mediacommander'); ?></div>
            <div class="mcmd-btn mcmd-delete" al-on.click="Modal.fn.submit()"><?php esc_html_e("Delete", 'mediacommander'); ?></div>
        </div>
    </div>
</div>