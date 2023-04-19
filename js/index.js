import {keyLanguage} from "./translateKey.js";

const LINK_APPSTORE_MOBILE = 'https://vigtek.page.link/?link=https://tictop.app/apn=vig.tictop.app&ibi=vig.tictop.app01&isi=1582398478';
const LINK_GOOGLE_PLAY_MOBILE = 'https://vigtek.page.link/?link=https://tictop.app/ibi=vig.tictop.app01&isi=1582398478&apn=vig.tictop.app';
const LINK_APPSTORE_WEB = 'https://apps.apple.com/vn/app/tictop/id1582398478';
const LINK_GOOGLE_PLAY_WEB = 'https://play.google.com/store/apps/details?id=vig.tictop.app';


// Setting href button register
const setLinkToButtonRegister = () => {
    const md = new MobileDetect(window.navigator.userAgent);
    const btn_appStore = document.getElementById('tictop-btn__appstore');
    const btn_googleplay = document.getElementById('tictop-btn__googleplay');

    btn_appStore.href = LINK_APPSTORE_MOBILE;
    btn_googleplay.href = LINK_GOOGLE_PLAY_MOBILE;

    if (md.mobile()) {
        if (md.os() === 'iOS') {
            btn_googleplay.style.display = 'none';
        } else {
            btn_appStore.style.display = 'none';
        }
    } else {
        btn_appStore.href = LINK_APPSTORE_WEB;
        btn_googleplay.href = LINK_GOOGLE_PLAY_WEB;
    }
};

// Get Language
const detectLanguage = () => {
// 1. Get from local storage
    const userSelectedLanguage = localStorage.getItem('LANGUAGE');
    if (userSelectedLanguage && systemSupportLanguage(userSelectedLanguage)) {
        return userSelectedLanguage;
    }

// 2. Get browser's language
    const browserLanguage = window.navigator.language;
    if (systemSupportLanguage(browserLanguage)) {
        localStorage.setItem('LANGUAGE', getLanguageByCountryCode(browserLanguage));
        return browserLanguage;
    }

// 3. Get location via IP
    const ipInfoData = getIpInfo();
    const langFromIp = getLanguageByCountryCode(ipInfoData?.countryCode);
    if (systemSupportLanguage(langFromIp)) {
        localStorage.setItem('LANGUAGE', langFromIp);
        return langFromIp;
    }

// 4. By default
    return 'vi';

};

const getIpInfo = () => {
    let locationData;
    $(function () {
        $.ajax({
            url: "https://api.tictop.app/api/web/Setting/GetIpInfo",
            success: function (data) {
                locationData = data['result'];
                return locationData;
            },
            error: function (error) {
                console.log('error', error);
            }
        });
    });
    return 'vi';
};

const getLanguageByCountryCode = (countryCode) => {
    let defaultLanguage = 'en';
    switch (countryCode) {
        case 'EU', 'en-US':
            defaultLanguage = 'en';
            break;
        case 'VN':
            defaultLanguage = 'vi';
            break;

        default:
            defaultLanguage = 'en';
            break;
    }
    return defaultLanguage;
};

const systemSupportLanguage = (lang) => {
    if (!lang) return false;
    const convertLang = lang.slice(0, 2).toLowerCase();
    return ['en', 'vi', 'fr'].some((o) => o === convertLang);
};

const translate = () => {
    const language = detectLanguage() || 'vi';
    const languageData = keyLanguage;
    document.querySelectorAll('[data-translate]').forEach((el) => {
        let key = el.attributes['data-translate']?.value;
        el.innerHTML = languageData[key][language] || ' ';
    });
};

// Link Website In Footer
const onSetLinkRedirectWeb = () => {
    const language = detectLanguage() || 'vi';
    const els = document.querySelectorAll('.link_website');
    els.forEach(el => {
        if (language !== 'fr') el.href = 'https://tictop.vn';
        else el.href = 'https://tictop.eu';
    });
};

// On change Language
const initSelectElement = () => {
    const language = detectLanguage() || 'vi';
    const selectEl = document.getElementById('select_change_language');
    document.querySelectorAll('#select_change_language option[data-key]').forEach(opt => {
        let key = opt.attributes['data-key']?.value;
        if (key === language) opt.selected = true;
    });
    selectEl.addEventListener('change', () => {
        // const optionSelected = selectEl?.options[selectEl?.selectedIndex];
        onChangeLanguage(selectEl.value);
    })

}

const onChangeLanguage = (language) => {
    localStorage.setItem('LANGUAGE', language);
    translate();
}

const checkInstallApp = async (language) => {
    const installedApps = await navigator.getInstalledRelatedApps();
    const nativeApp = installedApps.find(app => app.id === 'vig.tictop.app');

    if (nativeApp) {
        alert(JSON.stringify(nativeApp))
    }
}

// Init
const init = () => {
    translate();
    setLinkToButtonRegister();
    onSetLinkRedirectWeb();
    initSelectElement();
    checkInstallApp();
}

window.onload = () => {
    init();
}
addEventListener('DOMContentLoaded', (event) => {
    init();
});





