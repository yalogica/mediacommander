;(function($) {
    'use strict';

    if(mediacommander_notice_globals) {
        const globals = mediacommander_notice_globals;

        $(document).on('click', '#mediacommander-first-use-notification .notice-dismiss', () => {
            $.ajax({
                url: globals.api.url + '/noticeoff',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                headers: { 'X-WP-Nonce': globals.api.nonce }
            });
        });
    }
})(jQuery);