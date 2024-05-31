<?php
defined( 'ABSPATH' ) || exit;
?>
<div class="mcmd-modal">
    <div class="mcmd-dialog">
        <div class="mcmd-header">
            <div class="mcmd-title" al-if="!Modal.data.item.id"><?php esc_html_e("New Folder Type", 'mediacommander'); ?></div>
            <div class="mcmd-title" al-if="Modal.data.item.id"><?php esc_html_e("Edit Folder Type", 'mediacommander'); ?></div>
            <div class="mcmd-cancel" al-on.click="Modal.fn.close()"><i data-feather="x"></i></div>
        </div>
        <div class="mcmd-data">
            <div class="mcmd-loader" al-attr.class.mcmd-active="Modal.loading"></div>
            <div class="mcmd-input-group">
                <input class="mcmd-input" al-value="Modal.data.item.title" type="text" placeholder="<?php esc_html_e("Title", 'mediacommander'); ?>">
            </div>
            <select class="mcmd-select" al-select="Modal.data.item.security_profile">
                <option al-option="Modal.data.securityprofiles.none"><?php esc_html_e("None", 'mediacommander'); ?></option>
                <option al-repeat="item in Modal.data.securityprofiles.items" al-option="item">{{item.title}}</option>
            </select>
            <div al-toggle="Modal.data.item.enabled"></div>
        </div>
        <div class="mcmd-footer">
            <div class="mcmd-btn mcmd-cancel" al-on.click="Modal.fn.close()"><?php esc_html_e("Close", 'mediacommander'); ?></div>
            <div class="mcmd-btn mcmd-submit" al-on.click="Modal.fn.submit()" al-if="Modal.data.changed"><?php esc_html_e("Submit", 'mediacommander'); ?></div>
        </div>
    </div>
</div>