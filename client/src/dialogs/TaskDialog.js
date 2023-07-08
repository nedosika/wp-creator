import {Collapse, Modal} from "antd";
import Content from "components/Accordion/Content";
import Categories from "components/Accordion/Categories";
import React, {createContext, useCallback, useContext, useMemo} from "react";
import {useDialog} from "contexts/Dialog";
import WordpressSettings from "components/Accordion/WordpressSettings";
import {useMutation} from "@apollo/client";
import {CREATE_TASK} from "apollo/mutations";
import {useState} from "react";
import {GET_TASKS} from "apollo/queries";

const {Panel} = Collapse;

export const TASK_OPTIONS = {
    endpoint: 'endpoint',
    endpointSuffix: "endpointSuffix",
    dateSelector: "dateSelector",
    dateParser: 'dateParser',
    dateLocale: "dateLocale",
    username: 'login',
    password: 'password',
    headerSelector: 'headerSelector',
    contentSelector: 'contentSelector',
    contentReplacers: "contentReplacers",
    isAddCategories: 'isAddCategories',
    isLoading: 'isLoading',
    progress: 'progress',
    timeout: 'timeout',
    logs: 'logs',
    urls: 'urls',
    isStrongSearch: 'isStrongSearch',
    onlyHtml: 'onlyHtml',
    sortBy: 'sortBy',
    order: 'order',
    posts: 'posts'
}

export const SEARCH_SORTS = {
    title: 'title',
    date: 'date'
}

export const SEARCH_ORDERS = {
    asc: 'asc',
    desc: 'desc'
}

const initialState = {
    [TASK_OPTIONS.endpoint]: 'https://userpk.ru/0',
    [TASK_OPTIONS.endpointSuffix]: '/wp-json',
    [TASK_OPTIONS.username]: 'admin55',
    [TASK_OPTIONS.password]: '',
    [TASK_OPTIONS.headerSelector]: 'h1',
    [TASK_OPTIONS.contentSelector]: '.post_content',
    [TASK_OPTIONS.contentReplacers]: ['class="[^"]*"', 'style="[^"]*"', 'id="[^"]*"'],
    [TASK_OPTIONS.dateSelector]: ".post-date",
    [TASK_OPTIONS.dateParser]: "MMM DD, YYYY",
    [TASK_OPTIONS.dateLocale]: "ru",
    [TASK_OPTIONS.isAddCategories]: true,
    [TASK_OPTIONS.progress]: 0,
    [TASK_OPTIONS.timeout]: 1000,
    [TASK_OPTIONS.logs]: [],
    [TASK_OPTIONS.urls]: [],
    [TASK_OPTIONS.isStrongSearch]: false,
    [TASK_OPTIONS.isLoading]: false,
    [TASK_OPTIONS.onlyHtml]: true,
    [TASK_OPTIONS.order]: SEARCH_ORDERS.asc,
    [TASK_OPTIONS.sortBy]: SEARCH_SORTS.title,
    [TASK_OPTIONS.posts]: []
}

const TaskContext = createContext({});

const TaskDialog = ({urls}) => {
    const [task, setTask] = useState({...initialState, [TASK_OPTIONS.urls]: urls});
    const [createTask] = useMutation(CREATE_TASK, {refetchQueries: [GET_TASKS]});
    const {closeDialog} = useDialog();

    const variables = useMemo(() => ({
        data: {
            name: task[TASK_OPTIONS.endpoint],
            isAddCategories: task[TASK_OPTIONS.isAddCategories],
            onlyHtml: task[TASK_OPTIONS.onlyHtml],
            urls: task[TASK_OPTIONS.urls],
            headerSelector: task[TASK_OPTIONS.headerSelector],
            contentSelector: task[TASK_OPTIONS.contentSelector],
            contentReplacers: task[TASK_OPTIONS.contentReplacers],
            dateParser: task[TASK_OPTIONS.dateParser],
            dateLocale: task[TASK_OPTIONS.dateLocale],
            dateSelector: task[TASK_OPTIONS.dateSelector],
            isStrongSearch: task[TASK_OPTIONS.isStrongSearch],
            sortBy: task[TASK_OPTIONS.sortBy],
            order: task[TASK_OPTIONS.order],
            username: task[TASK_OPTIONS.username],
            password: task[TASK_OPTIONS.password],
            endpoint: `${task[TASK_OPTIONS.endpoint]}${task[TASK_OPTIONS.endpointSuffix]}`,
            timeout: task[TASK_OPTIONS.timeout]
        }
    }), [task]);

    const updateTask = useCallback((newTask) => setTask((prevTask) => ({...prevTask, ...newTask})), []);

    const handleCreateTask = useCallback(() => {
        console.log({variables})
        return createTask({variables}).then(closeDialog);
    }, [closeDialog, createTask, variables]);

    return (
        <TaskContext.Provider value={[task, updateTask]}>
            <Modal
                title="Create task dialog"
                centered
                open
                onOk={handleCreateTask}
                onCancel={closeDialog}
            >
                <Collapse accordion>
                    <Panel header="Content" key="1">
                        <Content/>
                    </Panel>
                    <Panel header="Categories" key="2">
                        <Categories/>
                    </Panel>
                    <Panel header="Wordpress settings" key="3">
                        <WordpressSettings/>
                    </Panel>
                </Collapse>
            </Modal>
        </TaskContext.Provider>
    );
};

export const useTask = () => useContext(TaskContext);
export default TaskDialog;