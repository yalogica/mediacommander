<?php
defined( 'ABSPATH' ) || exit;
?>
<div class="mcmd-modal">
    <div class="mcmd-dialog">
        <div class="mcmd-header">
            <div class="mcmd-title" al-if="!Modal.data.item.id"><?php esc_html_e("New Security Profile", 'mediacommander'); ?></div>
            <div class="mcmd-title" al-if="Modal.data.item.id"><?php esc_html_e("Edit Security Profile", 'mediacommander'); ?></div>
            <div class="mcmd-cancel" al-on.click="Modal.fn.close()"><i data-feather="x"></i></div>
        </div>
        <div class="mcmd-data">
            <div class="mcmd-loader" al-attr.class.mcmd-active="Modal.loading"></div>
            <div class="mcmd-input-group">
                <input class="mcmd-input" al-value="Modal.data.item.title" type="text" placeholder="<?php esc_html_e("Title", 'mediacommander'); ?>">
            </div>
            <textarea class="mcmd-textarea" al-value="Modal.data.item.description" placeholder="<?php esc_html_e("Description", 'mediacommander'); ?>"></textarea>
            <div class="mcmd-table">
                <div class="mcmd-table-header">
                    <div class="mcmd-left-group">
                        <div class="mcmd-btn" al-on.click="Modal.fn.create()" title="<?php esc_html_e("Add new profile", 'mediacommander'); ?>">
                            <i data-feather="plus"></i>
                        </div>
                        <div class="mcmd-btn" al-attr.class.mcmd-lock="!Modal.data.item.rights.selected" al-on.click="Modal.fn.edit()" title="<?php esc_html_e("Edit rights", 'mediacommander'); ?>">
                            <i data-feather="edit-3"></i>
                        </div>
                        <div class="mcmd-btn mcmd-red" al-attr.class.mcmd-lock="!Modal.data.item.rights.checked" al-on.click="Modal.fn.delete()" title="<?php esc_html_e("Delete selected rights", 'mediacommander'); ?>">
                            <i data-feather="trash-2"></i>
                        </div>
                    </div>
                    <div class="mcmd-right-group">
                    </div>
                </div>
                <div class="mcmd-table-body">
                    <table>
                        <colgroup>
                            <col class="mcmd-field-check"/>
                            <col class="mcmd-field-user-role"/>
                            <col class="mcmd-field-access-type"/>
                            <col class="mcmd-field-action"/>
                            <col class="mcmd-field-action"/>
                            <col class="mcmd-field-action"/>
                            <col class="mcmd-field-action"/>
                            <col class="mcmd-field-action"/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th><input type="checkbox" al-checked="Modal.data.item.rights.checked" al-on.change="App.fn.selectAll($event, Modal.data.item.rights.checked, Modal.data.item.rights, Modal.scope)"></th>
                            <th><?php esc_html_e("User / Role", 'mediacommander'); ?></th>
                            <th><?php esc_html_e("Access Type", 'mediacommander'); ?></th>
                            <th class="mcmd-center"><?php esc_html_e("Create", 'mediacommander'); ?></th>
                            <th class="mcmd-center"><?php esc_html_e("View", 'mediacommander'); ?></th>
                            <th class="mcmd-center"><?php esc_html_e("Edit", 'mediacommander'); ?></th>
                            <th class="mcmd-center"><?php esc_html_e("Delete", 'mediacommander'); ?></th>
                            <th class="mcmd-center"><?php esc_html_e("Attach", 'mediacommander'); ?></th>
                        </tr>
                        </thead>
                        <tbody al-if="Modal.data.item.rights.items.length">
                        <tr al-repeat="item in Modal.data.item.rights.items" al-attr.class.mcmd-selected="Modal.data.item.rights.selected == item.id" al-on.click.noprevent="Modal.fn.select(item)" al-on.dblclick="Modal.fn.dblclick(item)">
                            <td><input type="checkbox" al-checked="item.checked" al-on.change="App.fn.selectOne($event, item.checked, Modal.data.item.rights, Modal.scope)"></td>
                            <td><div class="mcmd-icon" al-if="item.owner.id" al-attr.class.mcmd-user="item.owner.type=='user'" al-attr.class.mcmd-role="item.owner.type=='role'"></div><span>{{item.owner.title}}</span></td>
                            <td><div class="mcmd-label" al-if="item.access_type.id">{{item.access_type.title}}</div></td>
                            <td><input type="checkbox" al-checked="item.actions.create"></td>
                            <td><input type="checkbox" al-checked="item.actions.view"></td>
                            <td><input type="checkbox" al-checked="item.actions.edit"></td>
                            <td><input type="checkbox" al-checked="item.actions.delete"></td>
                            <td><input type="checkbox" al-checked="item.actions.attach"></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mcmd-table-footer">
                    <div class="mcmd-info mcmd-left" al-if="!Modal.data.item.rights.items.length"><?php esc_html_e("The table is empty", 'mediacommander'); ?></div>
                </div>
            </div>
        </div>
        <div class="mcmd-footer">
            <div class="mcmd-btn mcmd-cancel" al-on.click="Modal.fn.close()"><?php esc_html_e("Close", 'mediacommander'); ?></div>
            <div class="mcmd-btn mcmd-submit" al-on.click="Modal.fn.submit()" al-if="Modal.data.changed"><?php esc_html_e("Submit", 'mediacommander'); ?></div>
        </div>
    </div>
</div>
