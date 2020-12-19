import intl from 'react-intl-universal';
// custom
import ZhCn from './zh-CN';
import EnUs from './en-US';
import ZhTw from './zh-TW';


// merge
const locales = {
    zhCN: ZhCn,
    enUS: EnUs,
    zhTW: ZhTw
};

// initialize
const loadLocales = (lang = 'zhTW') => {
    intl.init({
        urlLocaleKey: lang,
        cookieLocaleKey: lang,
        currentLocale: lang, // TODO: determine locale here
        locales
    });
};

export default loadLocales;