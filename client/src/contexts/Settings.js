import {createContext, useContext, useState} from "react";

export const SETTINGS = {
    wordpressApiUrl: 'wordpressApiUrl',
    username: 'login',
    password: 'password',
    errorsLogs: 'errorsLogs',
    infoLogs: 'infoLogs',
    consoleLogs: 'consoleLogs',
    tagTitle: 'tagTitle',
    arraysIndex: 'arraysIndex',
    isAddCategories: 'isAddCategories',
    isLoading: 'isLoading',
    progress: 'progress',
    timeout: 'timeout',
    logs: 'logs',
    urls: 'urls',
    isStrongSearch: 'isStrongSearch',
    onlyHtml: 'onlyHtml',
    orderBy: 'orderBy',
    order: 'order',
    posts: 'posts'
}

export const orderByList = {
    title: 'title',
    date: 'date'
}

export const order = {
    asc: 'asc',
    desc: 'desc'
}

const initialState = {
    [SETTINGS.wordpressApiUrl]: '',
    [SETTINGS.username]: '',
    [SETTINGS.password]: '',
    [SETTINGS.tagTitle]: '(?<=>)(.*)(?=<)',
    [SETTINGS.arraysIndex]: 0,
    [SETTINGS.isAddCategories]: true,
    [SETTINGS.progress]: 0,
    [SETTINGS.timeout]: 0,
    [SETTINGS.logs]: [],
    [SETTINGS.urls]: [],
    [SETTINGS.isStrongSearch]: false,
    [SETTINGS.isLoading]: false,
    [SETTINGS.onlyHtml]: true,
    [SETTINGS.order]: order.asc,
    [SETTINGS.orderBy]: orderByList.title,
    [SETTINGS.posts]: []
}

const SettingsContext = createContext({});

export const useSettings = () => useContext(SettingsContext);

const SettingsProvider = ({children}) => {
    const [settings, setSettings] = useState(initialState);

    return <SettingsContext.Provider value={[
        settings,
        (field) => setSettings((prevState) => ({...prevState, ...field}))
    ]}>
        {children}
    </SettingsContext.Provider>
}

export default SettingsProvider;