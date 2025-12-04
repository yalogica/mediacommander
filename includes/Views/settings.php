<?php
defined( 'ABSPATH' ) || exit;
?>
<div class="mcmd-wrap">
    <div class="mcmd-app-settings" id="mcmd-app-settings" style="display:none">
        <div class="mcmd-main-header">
            <div class="mcmd-title">MediaCommander<sup al-if="!App.data.ticket">lite</sup><sup al-if="App.data.ticket">PRO</sup></div>
            <div class="mcmd-tabs">
                <div class="mcmd-tab" al-attr.class.mcmd-active="App.ui.tabs.fn.is('general')" al-on.click="App.ui.tabs.fn.click($element, 'general')"><span><?php esc_html_e("General", 'mediacommander'); ?></span></div>
                <div class="mcmd-tab" al-attr.class.mcmd-active="App.ui.tabs.fn.is('permissions')" al-on.click="App.ui.tabs.fn.click($element, 'permissions')"><span><?php esc_html_e("Permissions", 'mediacommander'); ?></span></div>
                <div class="mcmd-tab" al-attr.class.mcmd-active="App.ui.tabs.fn.is('tools')" al-on.click="App.ui.tabs.fn.click($element, 'tools')"><span><?php esc_html_e("Tools", 'mediacommander'); ?></span></div>
                <div class="mcmd-tab" al-attr.class.mcmd-active="App.ui.tabs.fn.is('gopro')" al-on.click="App.ui.tabs.fn.click($element, 'gopro')" al-if="!App.data.ticket"><span><?php esc_html_e("Go Pro", 'mediacommander'); ?></span></div>
            </div>
        </div>
        <div class="mcmd-main-container">
            <div class="mcmd-content">
                <div class="mcmd-loader mcmd-active" id="mcmd-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="mcmd-ph-panel">
                    <div class="mcmd-ph-option">
                        <div class="mcmd-ph-description">
                            <div class="mcmd-ph-title"></div>
                            <div class="mcmd-ph-text"></div>
                        </div>
                        <div class="mcmd-ph-data">
                            <div class="mcmd-ph-control"></div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-ph-option">
                        <div class="mcmd-ph-description">
                            <div class="mcmd-ph-title"></div>
                            <div class="mcmd-ph-text"></div>
                        </div>
                        <div class="mcmd-ph-data">
                            <div class="mcmd-ph-control"></div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-ph-option">
                        <div class="mcmd-ph-description">
                            <div class="mcmd-ph-title"></div>
                            <div class="mcmd-ph-text"></div>
                        </div>
                        <div class="mcmd-ph-data">
                            <div class="mcmd-ph-control"></div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-ph-option">
                        <div class="mcmd-ph-description">
                            <div class="mcmd-ph-title"></div>
                            <div class="mcmd-ph-text"></div>
                        </div>
                        <div class="mcmd-ph-data">
                            <div class="mcmd-ph-control"></div>
                        </div>
                    </div>
                </div>
                <div class="mcmd-panel" al-attr.class.mcmd-active="App.ui.tabs.fn.is('general')">
                    <div class="mcmd-option" al-attr.class.mcmd-lock="!App.data.ticket">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Default folder color", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("Set the default color for all folders that don't have their own colors.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div class="mcmd-color-picker-wrap"><div id="mcmd-default-folder-color" class="mcmd-color-picker" al-on.click="App.fn.config.onColorClick($event)"></div></div>
                            <div class="mcmd-upgrade"><i class="mcmd-icon"></i><div al-html="App.globals.msg.upgrade"></div></div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-option" al-attr.class.mcmd-lock="!App.data.ticket">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Disable folder counter", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("Disable the display of the number of items attached to each folder.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div al-toggle="App.data.config.disable_counter" al-on.click.stop="App.fn.config.onCheckboxChange($event)"></div>
                            <div class="mcmd-upgrade"><i class="mcmd-icon"></i><div al-html="App.globals.msg.upgrade"></div></div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-option" al-attr.class.mcmd-lock="!App.data.ticket">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Disable ajax refresh", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("Disable ajax refresh in list view. Set when there are problems with using plugins along with MediaCommander that change the media library list view.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div al-toggle="App.data.config.disable_ajax" al-on.click.stop="App.fn.config.onCheckboxChange($event)"></div>
                            <div class="mcmd-upgrade"><i class="mcmd-icon"></i><div al-html="App.globals.msg.upgrade"></div></div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-option" al-attr.class.mcmd-lock="!App.data.ticket">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Infinite scrolling", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("Enable infinite media library scrolling instead of the 'Load More' button.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div al-toggle="App.data.config.infinite_scrolling" al-on.click.stop="App.fn.config.onCheckboxChange($event)"></div>
                            <div class="mcmd-upgrade"><i class="mcmd-icon"></i><div al-html="App.globals.msg.upgrade"></div></div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-option" al-attr.class.mcmd-lock="!App.data.ticket">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Show media details on hover", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("View essential metadata, including title, size, type, date, and dimensions, by simply hovering your cursor over an image.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div al-toggle="App.data.config.media_hover_details" al-on.click.stop="App.fn.config.onCheckboxChange($event)"></div>
                            <div class="mcmd-checklist mcmd-margin-top" al-if="App.data.config.media_hover_details">
                                <label al-repeat="detail in App.data.media_hover_details"><input type="checkbox" value="{{detail.id}}" al-on.change="App.fn.config.onMediaDetailsChange($event, detail)" al-attr.checked="App.fn.config.isMediaDetailsChecked(detail)">{{detail.title}}</label>
                            </div>
                            <div class="mcmd-upgrade"><i class="mcmd-icon"></i><div al-html="App.globals.msg.upgrade"></div></div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-option" al-attr.class.mcmd-lock="!App.data.ticket">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Disable search bar", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("Disable the display of the folder search bar.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div al-toggle="App.data.config.disable_search_bar" al-on.click.stop="App.fn.config.onCheckboxChange($event)"></div>
                            <div class="mcmd-upgrade"><i class="mcmd-icon"></i><div al-html="App.globals.msg.upgrade"></div></div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-option">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Replace media", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("Adds tools to the 'Attachment details' screen that can be used to select or upload an image to replace the current image while preserving its URL and properties.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div al-toggle="App.data.config.replace_media"></div>
                            <div class="mcmd-note" al-if="App.data.config.replace_media">
                                <?php esc_html_e("Note: Disable your browser cache and any WordPress caching plugins before use. Otherwise, you may find that this feature is not working properly.", 'mediacommander'); ?>
                            </div>
                        </div>
                    </div>
                    <br>
                    <br>
                    <br>
                    <div class="mcmd-button mcmd-select" al-on.click="App.fn.config.save()"><?php esc_html_e("Save", 'mediacommander'); ?></div>
                </div>
                <div class="mcmd-panel" al-attr.class.mcmd-active="App.ui.tabs.fn.is('permissions')">
                    <div class="mcmd-description">
                        <div class="mcmd-title"><?php esc_html_e("Description", 'mediacommander'); ?></div>
                        <div class="mcmd-text"><?php esc_html_e("Use this section to control who can view and edit folders. Simply create specific permissions for users and roles, then select a security profile for each folder type and apply it.", 'mediacommander'); ?></div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-option" al-attr.class.mcmd-lock="!App.data.ticket">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Access roles", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("Only selected user roles have access to folders. These are general settings, use the permissions tab to grant users additional personal or general permissions.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div class="mcmd-checklist">
                                <label al-repeat="role in App.data.roles"><input type="checkbox" value="{{role.id}}" al-on.change="App.fn.accessroles.onChange($event, role)" al-attr.checked="App.fn.accessroles.isChecked(role)">{{role.title}}</label>
                            </div>
                            <div class="mcmd-upgrade"><i class="mcmd-icon"></i><div al-html="App.globals.msg.upgrade"></div></div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-option">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Folder Types", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("This table shows the types of folders (media, pages, posts, etc.) supported by the plugin. To allow a user to create and edit folders of a specific folder type, you must select a security profile for that type from the list. If you don't find the desired folder type, try adding it manually.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div class="mcmd-table">
                                <div class="mcmd-table-header">
                                    <div class="mcmd-left-group">
                                        <div class="mcmd-btn" al-on.click="App.fn.foldertypes.create()" title="<?php esc_html_e("Add new folder type", 'mediacommander'); ?>">
                                            <i data-feather="plus"></i>
                                        </div>
                                        <div class="mcmd-btn" al-attr.class.mcmd-lock="!App.data.foldertypes.selected" al-on.click="App.fn.foldertypes.edit()" title="<?php esc_html_e("Edit folder type", 'mediacommander'); ?>">
                                            <i data-feather="edit-3"></i>
                                        </div>
                                        <div class="mcmd-btn mcmd-red" al-attr.class.mcmd-lock="!App.data.foldertypes.checked" al-on.click="App.fn.foldertypes.delete()" title="<?php esc_html_e("Delete selected folder types", 'mediacommander'); ?>">
                                            <i data-feather="trash-2"></i>
                                        </div>
                                    </div>
                                    <div class="mcmd-right-group">
                                        <div class="mcmd-btn" al-attr.class.mcmd-lock="App.data.foldertypes.view.prev == null" al-on.click="App.fn.foldertypes.prev()">
                                            <i data-feather="chevron-left"></i>
                                        </div>
                                        <div class="mcmd-btn" al-attr.class.mcmd-lock="App.data.foldertypes.view.next == null" al-on.click="App.fn.foldertypes.next()">
                                            <i data-feather="chevron-right"></i>
                                        </div>
                                        <div class="mcmd-btn" al-on.click="App.fn.foldertypes.load()" title="<?php esc_html_e("Refresh", 'mediacommander'); ?>">
                                            <i data-feather="refresh-cw"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="mcmd-table-body">
                                    <table>
                                        <colgroup>
                                            <col class="mcmd-field-check"/>
                                            <col class="mcmd-field-title"/>
                                            <col class="mcmd-field-security-profile"/>
                                            <col class="mcmd-field-status"/>
                                        </colgroup>
                                        <thead>
                                        <tr>
                                            <th><input type="checkbox" al-checked="App.data.foldertypes.checked" al-on.change="App.fn.selectAll($event, App.data.foldertypes.checked, App.data.foldertypes, App.scope)"></th>
                                            <th><?php esc_html_e("Folder type", 'mediacommander'); ?></th>
                                            <th><?php esc_html_e("Security profile", 'mediacommander'); ?></th>
                                            <th><?php esc_html_e("Status", 'mediacommander'); ?></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr al-attr.class.mcmd-lock="App.fn.foldertypes.isLock(item)" al-repeat="item in App.data.foldertypes.items" al-attr.class.mcmd-selected="App.data.foldertypes.selected == item.id" al-on.click.noprevent="App.fn.foldertypes.select(item)" al-on.dblclick="App.fn.foldertypes.dblclick(item)">
                                            <td><input type="checkbox" al-checked="item.checked" al-on.change="App.fn.selectOne($event, item.checked, App.data.foldertypes, App.scope)"></td>
                                            <td>{{item.title}}</td>
                                            <td><div class="mcmd-label" al-attr.class.mcmd-custom="item.security_profile.id > 0" al-if="item.security_profile.id">{{item.security_profile.title}}</div></td>
                                            <td><div class="mcmd-status" al-attr.class.mcmd-active="item.enabled">{{item.enabled ? '<?php esc_html_e("enabled", 'mediacommander'); ?>' : '<?php esc_html_e("disabled", 'mediacommander'); ?>'}}</div></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="mcmd-table-footer">
                                    <div class="mcmd-info mcmd-left" al-if="!App.data.foldertypes.items.length"><?php esc_html_e("The table is empty", 'mediacommander'); ?></div>
                                    <div class="mcmd-info" al-if="App.data.foldertypes.items.length">{{App.data.foldertypes.view.first}} - {{App.data.foldertypes.view.last}} of {{App.data.foldertypes.view.total}}</div>
                                </div>
                                <div class="mcmd-loader" al-attr.class.mcmd-active="App.data.foldertypes.loading"></div>
                            </div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-option" al-attr.class.mcmd-lock="!App.data.ticket">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Security profiles", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("This table is used to create and manage security profiles that can be selected and linked in the table above. Custom security profiles allow you to set permissions for each user or role to work with folders, including creating, viewing, editing, deleting, and attaching items to a folder.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div class="mcmd-table">
                                <div class="mcmd-table-header">
                                    <div class="mcmd-left-group">
                                        <div class="mcmd-btn" al-on.click="App.fn.securityprofiles.create()" title="<?php esc_html_e("Add new security profile", 'mediacommander'); ?>">
                                            <i data-feather="plus"></i>
                                        </div>
                                        <div class="mcmd-btn" al-attr.class.mcmd-lock="!App.data.securityprofiles.selected" al-on.click="App.fn.securityprofiles.edit()" title="<?php esc_html_e("Edit security profile", 'mediacommander'); ?>">
                                            <i data-feather="edit-3"></i>
                                        </div>
                                        <div class="mcmd-btn mcmd-red" al-attr.class.mcmd-lock="!App.data.securityprofiles.checked" al-on.click="App.fn.securityprofiles.delete()" title="<?php esc_html_e("Delete selected security profiles", 'mediacommander'); ?>">
                                            <i data-feather="trash-2"></i>
                                        </div>
                                    </div>
                                    <div class="mcmd-right-group">
                                        <div class="mcmd-btn" al-attr.class.mcmd-lock="App.data.securityprofiles.view.prev == null" al-on.click="App.fn.securityprofiles.prev()">
                                            <i data-feather="chevron-left"></i>
                                        </div>
                                        <div class="mcmd-btn" al-attr.class.mcmd-lock="App.data.securityprofiles.view.next == null" al-on.click="App.fn.securityprofiles.next()">
                                            <i data-feather="chevron-right"></i>
                                        </div>
                                        <div class="mcmd-btn" al-on.click="App.fn.securityprofiles.load()" title="<?php esc_html_e("Refresh", 'mediacommander'); ?>">
                                            <i data-feather="refresh-cw"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="mcmd-table-body">
                                    <table>
                                        <colgroup>
                                            <col class="mcmd-field-check"/>
                                            <col class="mcmd-field-title"/>
                                            <col class="mcmd-field-description"/>
                                        </colgroup>
                                        <thead>
                                        <tr>
                                            <th><input type="checkbox" al-checked="App.data.securityprofiles.checked" al-on.change="App.fn.selectAll($event, App.data.securityprofiles.checked, App.data.securityprofiles, App.scope)"></th>
                                            <th><?php esc_html_e("Security profile", 'mediacommander'); ?></th>
                                            <th><?php esc_html_e("Description", 'mediacommander'); ?></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr al-attr.class.mcmd-lock="App.fn.securityprofiles.isLock(item)" al-repeat="item in App.data.securityprofiles.items" al-attr.class.mcmd-selected="App.data.securityprofiles.selected == item.id" al-on.click.noprevent="App.fn.securityprofiles.select(item)" al-on.dblclick="App.fn.securityprofiles.dblclick(item)">
                                                <td><input type="checkbox" al-checked="item.checked" al-on.change="App.fn.selectOne($event, item.checked, App.data.securityprofiles, App.scope)"></td>
                                                <td>{{item.title}}</td>
                                                <td>{{item.description}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="mcmd-table-footer">
                                    <div class="mcmd-info mcmd-left" al-if="!App.data.securityprofiles.items.length"><?php esc_html_e("The table is empty", 'mediacommander'); ?></div>
                                    <div class="mcmd-info" al-if="App.data.securityprofiles.items.length">{{App.data.securityprofiles.view.first}} - {{App.data.securityprofiles.view.last}} of {{App.data.securityprofiles.view.total}}</div>
                                </div>
                                <div class="mcmd-loader" al-attr.class.mcmd-active="App.data.securityprofiles.loading"></div>
                            </div>
                            <div class="mcmd-upgrade"><i class="mcmd-icon"></i><div al-html="App.globals.msg.upgrade"></div></div>
                        </div>
                    </div>
                </div>
                <div class="mcmd-panel" al-attr.class.mcmd-active="App.ui.tabs.fn.is('tools')">
                    <div class="mcmd-option" al-if="App.data.import.plugins">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Import from other plugins", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("Import folders and attachments from third-party plugins for the media library.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div class="mcmd-importlist">
                                <div class="mcmd-importlist-item" al-repeat="plugin in App.data.import.plugins" al-attr.class.mcmd-lock="plugin.lock">
                                    <div>
                                        <div class="mcmd-title">{{plugin.name}} (by {{plugin.author}})</div>
                                        <div class="mcmd-description">{{plugin.folders}} folders to import</div>
                                    </div>
                                    <button class="mcmd-btn-import" al-on.click="App.fn.tools.importFromPlugin(plugin.key)"><?php esc_html_e("Import now", 'mediacommander'); ?></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mcmd-spacer" al-if="App.data.import.plugins"></div>
                    <div class="mcmd-option">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Export", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("The current folder structure with attachments will be exported to a CSV file.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div class="mcmd-button mcmd-export" al-on.click="App.fn.tools.export()"><?php esc_html_e("Export Now", 'mediacommander'); ?></div>
                            <a class="mcmd-download-file" download="{{App.data.export.filename}}" href="{{App.data.export.url}}" al-if="App.data.export.url"><?php esc_html_e("Download file", 'mediacommander'); ?></a>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-option">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Import", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("Select a CSV file with the folder structure and attachments to import.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <input class="mcmd-button" type="file" accept=".csv" al-on.change="App.fn.tools.onFileToImportChange($element)">
                            <div al-if="App.data.import.file">
                                <div class="mcmd-checklist">
                                    <label><input type="checkbox" al-checked="App.data.import.clear"><?php esc_html_e("Clearing all existing folders before import", 'mediacommander'); ?></label>
                                    <label><input type="checkbox" al-checked="App.data.import.attachments"><?php esc_html_e("Import attachments", 'mediacommander'); ?></label>
                                </div>
                                <div class="mcmd-button mcmd-import" al-on.click="App.fn.tools.import()"><?php esc_html_e("Import Now", 'mediacommander'); ?></div>
                            </div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-option">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Folder counters recalculation", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("This action will completely recalculate all item counters that are attached to folders.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div class="mcmd-button mcmd-export" al-on.click="App.fn.tools.recalculate()"><?php esc_html_e("Recalculate", 'mediacommander'); ?></div>
                        </div>
                    </div>
                    <div class="mcmd-spacer"></div>
                    <div class="mcmd-option">
                        <div class="mcmd-description">
                            <div class="mcmd-title"><?php esc_html_e("Clear data", 'mediacommander'); ?></div>
                            <div class="mcmd-text"><?php esc_html_e("This action will deactivate the plugin MediaCommander and delete all its data and settings and return you to the default WordPress state before installing the plugin.", 'mediacommander'); ?></div>
                        </div>
                        <div class="mcmd-data">
                            <div class="mcmd-button mcmd-deactivate" al-on.click="App.fn.tools.clear()"><?php esc_html_e("Clear now", 'mediacommander'); ?></div>
                        </div>
                    </div>
                </div>
                <div class="mcmd-panel" al-attr.class.mcmd-active="App.ui.tabs.fn.is('gopro')">
                    <div class="mcmd-option">
                        <div class="mcmd-description">
                            <div class="mcmd-robo"></div>
                        </div>
                        <div class="mcmd-data">
                            <div class="mcmd-features">
                                <h2><?php esc_html_e("Get MediaCommander Pro", 'mediacommander'); ?></h2>
                                <p><?php esc_html_e("Unlock all features and premium support", 'mediacommander'); ?></p>
                                <ul>
                                    <li><div class="mcmd-icon"></div><?php esc_html_e("Sort Options", 'mediacommander'); ?></li>
                                    <li><div class="mcmd-icon"></div><?php esc_html_e("Advanced User Rights", 'mediacommander'); ?></li>
                                    <li><div class="mcmd-icon"></div><?php esc_html_e("Organize Pages, Posts and Custom Post Types", 'mediacommander'); ?></li>
                                    <li><div class="mcmd-icon"></div><?php esc_html_e("Page Builders: Elementor, Beaver, Divi, Brizy etc.", 'mediacommander'); ?></li>
                                    <li><div class="mcmd-icon"></div><?php esc_html_e("VIP Support", 'mediacommander'); ?></li>
                                </ul>
                            </div>
                            <a class="mcmd-button mcmd-buy" href="{{App.globals.data.url.upgrade}}" target="_self"><?php esc_html_e("Buy Now", 'mediacommander'); ?></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mcmd-sidebar">
                <a class="mcmd-panel" href="{{App.globals.data.url.docs}}" target="_blank" style="--order:1;">
                    <div class="mcmd-icon mcmd-docs"></div>
                    <div class="mcmd-description">
                        <div class="mcmd-title"><?php esc_html_e("Documentation", 'mediacommander'); ?></div>
                        <div class="mcmd-text"><?php esc_html_e("Check out our extensive knowledge base, allowing users to easily navigate and master the plugin's features.", 'mediacommander'); ?></div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>