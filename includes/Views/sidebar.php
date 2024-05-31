<?php
defined( 'ABSPATH' ) || exit;
?>
<div id="mcmd-toolbar" class="mcmd-toolbar">
    <div class="mcmd-left-group">
        <div id="mcmd-btn-create" class="mcmd-btn mcmd-active" title="<?php esc_html_e("create folder", 'mediacommander'); ?>">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d=" M 21 7 L 10.393 7 C 10.176 7 9.921 6.842 9.824 6.648 L 9 5 L 3.098 4.991 L 3 19 L 21 19 L 21 7 L 21 7 L 21 7 Z  M 1.786 21 L 22.214 21 C 22.648 21 23 20.648 23 20.214 L 23 5.786 C 23 5.352 22.648 5 22.214 5 L 11 5 L 10.176 3.361 C 10.079 3.167 9.824 3.009 9.607 3.009 L 1.786 3.001 C 1.352 3 1 3.352 1 3.786 L 1 20.214 C 1 20.648 1.352 21 1.786 21 L 1.786 21 Z  M 13 12 L 13 9 L 11 9 L 11 12 L 8 12 L 8 14 L 11 14 L 11 17 L 13 17 L 13 14 L 16 14 L 16 12 L 13 12 L 13 12 Z " fill-rule="evenodd"/>
            </svg>
        </div>
    </div>
    <div class="mcmd-right-group">
        <div id="mcmd-btn-sort" class="mcmd-btn mcmd-active" title="<?php esc_html_e("sort folder items", 'mediacommander'); ?>">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d=" M 5.151 2.731 L 4.971 3.272 L 3.375 7.674 L 3.349 7.674 L 3.349 7.726 L 2.576 9.863 L 2.525 9.992 L 2.525 10.97 L 4.173 10.97 L 4.173 10.275 L 4.508 9.322 L 7.134 9.322 L 7.468 10.275 L 7.468 10.97 L 9.116 10.97 L 9.116 9.992 L 9.065 9.863 L 8.292 7.726 L 8.292 7.674 L 8.267 7.674 L 6.67 3.272 L 6.49 2.731 L 5.151 2.731 Z  M 16.532 2.731 L 16.532 18.128 L 14.394 15.991 L 13.236 17.149 L 16.763 20.703 L 17.355 21.269 L 17.948 20.703 L 21.475 17.149 L 20.316 15.991 L 18.179 18.128 L 18.179 2.731 L 16.532 2.731 Z  M 5.821 5.743 L 6.516 7.674 L 5.125 7.674 L 5.821 5.743 Z  M 2.525 12.618 L 2.525 14.266 L 7.108 14.266 L 2.757 18.617 L 2.525 18.875 L 2.525 20.857 L 9.116 20.857 L 9.116 19.209 L 4.533 19.209 L 8.885 14.858 L 9.116 14.6 L 9.116 12.618 L 2.525 12.618 Z "/>
            </svg>
        </div>
    </div>
</div>

<div id="mcmd-notice-create" class="mcmd-notice">
    <?php esc_html_e("Click the 'Create' button above to add your first folder, then start drag & drop items.", 'mediacommander'); ?>
</div>

<div id="mcmd-form-create" class="mcmd-form">
    <div class="mcmd-header">
        <div class="mcmd-title"><?php esc_html_e("Add New Folders", 'mediacommander'); ?></div>
        <div class="mcmd-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d=" M 7.734 6.281 L 6.328 7.688 L 10.609 11.969 L 6.266 16.313 L 7.672 17.719 L 12.016 13.375 L 16.328 17.688 L 17.734 16.281 L 13.422 11.969 L 17.672 7.719 L 16.266 6.313 L 12.016 10.563 L 7.734 6.281 Z " />
            </svg>
        </div>
    </div>
    <div class="mcmd-data">
        <div class="mcmd-row">
            <input id="mcmd-folder-name" class="mcmd-text" type="text" placeholder="Folder 1, Folder 2, etc." value="">
            <div class="mcmd-color-picker-wrap"><div id="mcmd-folder-color" class="mcmd-color-picker"></div></div>
        </div>
        <div class="mcmd-row">
            <select id="mcmd-folder-parent" class="mcmd-select"></select>
        </div>
    </div>
    <div class="mcmd-footer">
        <div class="mcmd-btn mcmd-close"><?php esc_html_e("Cancel", 'mediacommander'); ?></div>
        <div class="mcmd-btn mcmd-submit"><?php esc_html_e("Create", 'mediacommander'); ?></div>
    </div>
</div>

<div id="mcmd-form-delete" class="mcmd-form">
    <div class="mcmd-header">
        <div class="mcmd-title"><?php esc_html_e("Delete Folders", 'mediacommander'); ?></div>
        <div class="mcmd-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d=" M 7.734 6.281 L 6.328 7.688 L 10.609 11.969 L 6.266 16.313 L 7.672 17.719 L 12.016 13.375 L 16.328 17.688 L 17.734 16.281 L 13.422 11.969 L 17.672 7.719 L 16.266 6.313 L 12.016 10.563 L 7.734 6.281 Z " />
            </svg>
        </div>
    </div>
    <div class="mcmd-data">
        <div class="mcmd-row">
            <p><?php esc_html_e("Are you sure you want to delete selected folders and all subfolders?", 'mediacommander'); ?></p>
            <p><?php esc_html_e("Note: all items inside those folders will not be deleted.", 'mediacommander'); ?></p>
        </div>
    </div>
    <div class="mcmd-footer">
        <div class="mcmd-btn mcmd-close"><?php esc_html_e("Cancel", 'mediacommander'); ?></div>
        <div class="mcmd-btn mcmd-submit mcmd-red"><?php esc_html_e("Delete", 'mediacommander'); ?></div>
    </div>
</div>

<div id="mcmd-form-replace-media" class="mcmd-form">
    <div class="mcmd-loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
    <div class="mcmd-header">
        <div class="mcmd-title"><?php esc_html_e("Upload a new file", 'mediacommander'); ?></div>
        <div class="mcmd-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d=" M 7.734 6.281 L 6.328 7.688 L 10.609 11.969 L 6.266 16.313 L 7.672 17.719 L 12.016 13.375 L 16.328 17.688 L 17.734 16.281 L 13.422 11.969 L 17.672 7.719 L 16.266 6.313 L 12.016 10.563 L 7.734 6.281 Z " />
            </svg>
        </div>
    </div>
    <div class="mcmd-data">
        <div class="mcmd-row">
            <form class="mcmd-file-drop-zone">
                <input class="mcmd-file-upload" type="file" name="file" accept="image/*" />
                <div class="mcmd-image-preview-wrap">
                    <img src="#" class="mcmd-image-preview">
                </div>
                <div class="mcmd-start">
                    <p><strong><?php esc_html_e("Drop file here", 'mediacommander'); ?></strong></p>
                    <p><?php esc_html_e("or", 'mediacommander'); ?></p>
                    <button type="button" class="button-primary mcmd-file-select"><?php esc_html_e("Select file", 'mediacommander'); ?></button><br>
                </div>
            </form>
        </div>
    </div>
    <div class="mcmd-footer">
        <div class="mcmd-btn mcmd-close"><?php esc_html_e("Cancel", 'mediacommander'); ?></div>
        <div class="mcmd-btn mcmd-submit mcmd-hidden"><?php esc_html_e("Replace", 'mediacommander'); ?></div>
    </div>
</div>

<div id="mcmd-form-sort" class="mcmd-form">
    <div class="mcmd-header">
        <div class="mcmd-title"><?php esc_html_e("Sort Folder Items", 'mediacommander'); ?></div>
        <div class="mcmd-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d=" M 7.734 6.281 L 6.328 7.688 L 10.609 11.969 L 6.266 16.313 L 7.672 17.719 L 12.016 13.375 L 16.328 17.688 L 17.734 16.281 L 13.422 11.969 L 17.672 7.719 L 16.266 6.313 L 12.016 10.563 L 7.734 6.281 Z " />
            </svg>
        </div>
    </div>
    <div class="mcmd-data">
        <ul class="mcmd-sort-list">
            <li>
                <div class="mcmd-sort-title"><?php esc_html_e("By Name", 'mediacommander'); ?></div>
                <div class="mcmd-sort-types">
                    <div class="mcmd-sort-type" data="name-asc" title="sort by ascending"><span class="dashicons dashicons-arrow-up"></span></div>
                    <div class="mcmd-sort-type" data="name-desc" title="sort by descending"><span class="dashicons dashicons-arrow-down"></span></div>
                </div>
            </li>
            <li>
                <div class="mcmd-sort-title"><?php esc_html_e("By Date", 'mediacommander'); ?></div>
                <div class="mcmd-sort-types">
                    <div class="mcmd-sort-type" data="date-asc" title="sort by ascending"><span class="dashicons dashicons-arrow-up"></span></div>
                    <div class="mcmd-sort-type" data="date-desc" title="sort by descending"><span class="dashicons dashicons-arrow-down"></span></div>
                </div>
            </li>
            <li>
                <div class="mcmd-sort-title"><?php esc_html_e("By Modified", 'mediacommander'); ?></div>
                <div class="mcmd-sort-types">
                    <div class="mcmd-sort-type" data="mod-asc" title="sort by ascending"><span class="dashicons dashicons-arrow-up"></span></div>
                    <div class="mcmd-sort-type" data="mod-desc" title="sort by descending"><span class="dashicons dashicons-arrow-down"></span></div>
                </div>
            </li>
            <li>
                <div class="mcmd-sort-title"><?php esc_html_e("By Author", 'mediacommander'); ?></div>
                <div class="mcmd-sort-types">
                    <div class="mcmd-sort-type" data="author-asc" title="sort by ascending"><span class="dashicons dashicons-arrow-up"></span></div>
                    <div class="mcmd-sort-type" data="author-desc" title="sort by descending"><span class="dashicons dashicons-arrow-down"></span></div>
                </div>
            </li>
        </ul>
    </div>
</div>

<div id="mcmd-panel" class="mcmd-panel">
    <div id="mcmd-predefined-tree" class="mcmd-predefined-tree">
        <div class="mcmd-tree-nodes">
            <div class="mcmd-tree-node">
                <div class="mcmd-tree-item mcmd-folder" data-id="-1">
                    <div class="mcmd-tree-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="m1.786 21h20.428c0.434 0 0.786-0.352 0.786-0.786v-14.428c0-0.434-0.352-0.786-0.786-0.786h-11.214l-0.824-1.639c-0.097-0.194-0.352-0.352-0.569-0.352l-7.821-8e-3c-0.434-1e-3 -0.786 0.351-0.786 0.785v16.428c0 0.434 0.352 0.786 0.786 0.786z" fill="currentColor" filter="invert(0.05) brightness(0.8)"/>
                            <path d="M 1.786,21 H 22.214 C 22.648,21 23,20.648 23,20.214 V 7 H 1 V 20.214 C 1,20.648 1.352,21 1.786,21 Z" fill="currentColor" style="filter:invert(0.05)"/>
                        </svg>
                    </div>
                    <div class="mcmd-tree-title"><?php esc_html_e("All items", 'mediacommander'); ?></div>
                    <div class="mcmd-tree-label">0</div>
                </div>
            </div>
            <div class="mcmd-tree-node">
                <div class="mcmd-tree-item mcmd-folder" data-id="-2">
                    <div class="mcmd-tree-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="m1.786 21h20.428c0.434 0 0.786-0.352 0.786-0.786v-14.428c0-0.434-0.352-0.786-0.786-0.786h-11.214l-0.824-1.639c-0.097-0.194-0.352-0.352-0.569-0.352l-7.821-8e-3c-0.434-1e-3 -0.786 0.351-0.786 0.785v16.428c0 0.434 0.352 0.786 0.786 0.786z" fill="currentColor" filter="invert(0.05) brightness(0.8)"/>
                            <path d="M 1.786,21 H 22.214 C 22.648,21 23,20.648 23,20.214 V 7 H 1 V 20.214 C 1,20.648 1.352,21 1.786,21 Z" fill="currentColor" style="filter:invert(0.05)"/>
                        </svg>
                    </div>
                    <div class="mcmd-tree-title"><?php esc_html_e("Uncategorized", 'mediacommander'); ?></div>
                    <div class="mcmd-tree-label">0</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="mcmd-panel-tree" class="mcmd-panel-tree">
    <div id="mcmd-search" class="mcmd-search">
        <input id="mcmd-search-input" class="mcmd-search-input" placeholder="<?php esc_html_e("Search folders...", 'mediacommander'); ?>" type="text">
        <div class="mcmd-search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d=" M 18.341 15.876 L 22.138 19.69 L 20.676 21.041 L 20.676 21.041 L 16.941 17.29 C 15.58 18.361 13.864 19 12 19 C 7.585 19 4 15.415 4 11 L 4 11 C 4 6.585 7.585 3 12 3 C 16.415 3 20 6.585 20 11 C 20 12.835 19.381 14.526 18.341 15.876 Z  M 6 11 C 6 7.689 8.689 5 12 5 C 15.311 5 18 7.689 18 11 C 18 14.311 15.311 17 12 17 C 8.689 17 6 14.311 6 11 L 6 11 Z " fill-rule="evenodd" fill="currentColor"/>
            </svg>
        </div>
        <div id="mcmd-search-clear" class="mcmd-search-clear">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d=" M 7.734 6.281 L 6.328 7.688 L 10.609 11.969 L 6.266 16.313 L 7.672 17.719 L 12.016 13.375 L 16.328 17.688 L 17.734 16.281 L 13.422 11.969 L 17.672 7.719 L 16.266 6.313 L 12.016 10.563 L 7.734 6.281 Z " fill="currentColor" />
            </svg>
        </div>
    </div>
    <div id="mcmd-tree" class="mcmd-tree"></div>
</div>
