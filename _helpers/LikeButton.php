<?php

class LikeButtonHelper
{

    static public function choose($locale)
    {
        switch($locale) {
            case 'en' :
                return sprintf('<div class="google-plus">%s</div>', self::googlePlus());
                break;

            case 'ru' :
                return sprintf('<div class="yandex-share">%s</div>', self::yandexShare());
                break;
        }
    }

    static public function googlePlus()
    {
        return <<<CODE
<!-- Place this tag where you want the +1 button to render -->
<g:plusone></g:plusone>

<!-- Place this tag after the last plusone tag -->
<script type="text/javascript">
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
</script>
CODE;
    }

    static public function yandexShare()
    {
        return <<<CODE
<script type="text/javascript" src="//yandex.st/share/share.js" charset="utf-8"></script>
<div class="yashare-auto-init" data-yashareL10n="ru" data-yashareType="none" data-yashareQuickServices="yaru,vkontakte,odnoklassniki,moimir,lj,moikrug"></div>
CODE;
    }

}