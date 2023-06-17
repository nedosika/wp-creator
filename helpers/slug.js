import {trimChar} from "./trimChar.js";

export const getSlug = (url) => {
    const partedUrl = trimChar(url, '/').split('/');
    return partedUrl[partedUrl.length - 1].replace('.html', '');
}