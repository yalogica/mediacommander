<?php
defined( 'ABSPATH' ) || exit;
?>
<div class="mcmd-modal">
    <div class="mcmd-dialog">
        <div class="mcmd-header">
            <div class="mcmd-title"><?php esc_html_e("Select User", 'mediacommander'); ?></div>
            <div class="mcmd-cancel" al-on.click="Modal.fn.close()"><i data-feather="x"></i></div>
        </div>
        <div class="mcmd-data">
            <div class="mcmd-loader" al-attr.class.mcmd-active="Modal.loading"></div>
            <p><?php esc_html_e("To create a new profile entry, select a registered WordPress user from the list below.", 'mediacommander'); ?></p>
            <select class="mcmd-select" al-select="Modal.data.selected">
                <option al-option="null"><?php esc_html_e("None", 'mediacommander'); ?></option>
                <option al-repeat="item in Modal.data.items" al-option="item">{{item.title}}</option>
            </select>
        </div>
        <div class="mcmd-footer">
            <div class="mcmd-btn mcmd-cancel" al-on.click="Modal.fn.close()"><?php esc_html_e("Close", 'mediacommander'); ?></div>
            <div class="mcmd-btn mcmd-submit" al-on.click="Modal.fn.submit()"><?php esc_html_e("Select", 'mediacommander'); ?></div>
        </div>
    </div>
</div>
