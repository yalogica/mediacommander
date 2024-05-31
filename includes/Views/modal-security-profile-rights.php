<?php
defined( 'ABSPATH' ) || exit;
?>
<div class="mcmd-modal">
    <div class="mcmd-dialog">
        <div class="mcmd-header">
            <div class="mcmd-title" al-if="!Modal.data.item.id"><?php esc_html_e("New Security Rights", 'mediacommander'); ?></div>
            <div class="mcmd-title" al-if="Modal.data.item.id"><?php esc_html_e("Edit Security Rights", 'mediacommander'); ?></div>
            <div class="mcmd-cancel" al-on.click="Modal.fn.close()"><i data-feather="x"></i></div>
        </div>
        <div class="mcmd-data">
            <div class="mcmd-loader" al-attr.class.mcmd-active="Modal.loading"></div>
            <div class="mcmd-input-group">
                <input class="mcmd-input mcmd-has-changer" type="text" readonly="readonly" al-value="Modal.data.item.owner.title" placeholder="<?php esc_html_e("Select user or role", 'mediacommander'); ?>">
                <div class="mcmd-changer mcmd-icon" al-attr.class.mcmd-active="Modal.data.item.owner.type == 'user'" al-on.click="Modal.fn.selectUser()" title="<?php esc_html_e("Select user", 'mediacommander'); ?>"> <i data-feather="user"></i></div>
                <div class="mcmd-changer mcmd-icon" al-attr.class.mcmd-active="Modal.data.item.owner.type == 'role'" al-on.click="Modal.fn.selectRole()" title="<?php esc_html_e("Select role", 'mediacommander'); ?>"> <i data-feather="users"></i></div>
            </div>

            <select class="mcmd-select" al-select="Modal.data.item.access_type">
                <option al-option="Modal.data.access_types.none"><?php esc_html_e("None", 'mediacommander'); ?></option>
                <option al-repeat="item in Modal.data.access_types.items" al-option="item">{{item.title}}</option>
            </select>
            <div class="mcmd-checklist">
                <label><input type="checkbox" al-checked="Modal.data.item.actions.create"><?php esc_html_e("Create", 'mediacommander'); ?><span title="<?php esc_html_e("users can create folders and subfolders, don't forget to give the view permission too", 'mediacommander'); ?>"><i data-feather="help-circle"></i></span></label>
                <label><input type="checkbox" al-checked="Modal.data.item.actions.view"><?php esc_html_e("View", 'mediacommander'); ?><span title="<?php esc_html_e("users can view the folder tree", 'mediacommander'); ?>"><i data-feather="help-circle"></i></span></label>
                <label><input type="checkbox" al-checked="Modal.data.item.actions.edit"><?php esc_html_e("Edit", 'mediacommander'); ?><span title="<?php esc_html_e("users can edit folders (rename, drag & drop)", 'mediacommander'); ?>"><i data-feather="help-circle"></i></span></label>
                <label><input type="checkbox" al-checked="Modal.data.item.actions.delete"><?php esc_html_e("Delete", 'mediacommander'); ?><span title="<?php esc_html_e("users can delete folders", 'mediacommander'); ?>"><i data-feather="help-circle"></i></span></label>
                <label><input type="checkbox" al-checked="Modal.data.item.actions.attach"><?php esc_html_e("Attach", 'mediacommander'); ?><span title="<?php esc_html_e("users can attach items to folders, like media files, posts, pages, etc.", 'mediacommander'); ?>"><i data-feather="help-circle"></i></span></label>
            </div>
        </div>
        <div class="mcmd-footer">
            <div class="mcmd-btn mcmd-cancel" al-on.click="Modal.fn.close()"><?php esc_html_e("Close", 'mediacommander'); ?></div>
            <div class="mcmd-btn mcmd-submit" al-on.click="Modal.fn.submit()" al-if="Modal.data.changed"><?php esc_html_e("Submit", 'mediacommander'); ?></div>
        </div>
    </div>
</div>
