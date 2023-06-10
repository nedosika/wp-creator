import {Collapse, Modal} from "antd";
import {encode as base64_encode} from 'base-64';
import SiteMap from "components/Accordion/SiteMap";
import Title from "components/Accordion/Title";
import Categories from "components/Accordion/Categories";
import React from "react";
import {useDialog} from "contexts/Dialog";
import WordpressSettings from "components/Accordion/WordpressSettings";
import {useMutation} from "@apollo/client";
import {CREATE_TASK} from "apollo/mutations";
import {useState} from "react";

const { Panel } = Collapse;

export const TASK_OPTIONS = {
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
    [TASK_OPTIONS.wordpressApiUrl]: '',
    [TASK_OPTIONS.username]: '',
    [TASK_OPTIONS.password]: '',
    [TASK_OPTIONS.tagTitle]: '(?<=>)(.*)(?=<)',
    [TASK_OPTIONS.arraysIndex]: 0,
    [TASK_OPTIONS.isAddCategories]: true,
    [TASK_OPTIONS.progress]: 0,
    [TASK_OPTIONS.timeout]: 0,
    [TASK_OPTIONS.logs]: [],
    [TASK_OPTIONS.urls]: [],
    [TASK_OPTIONS.isStrongSearch]: false,
    [TASK_OPTIONS.isLoading]: false,
    [TASK_OPTIONS.onlyHtml]: true,
    [TASK_OPTIONS.order]: SEARCH_ORDERS.asc,
    [TASK_OPTIONS.sortBy]: SEARCH_SORTS.title,
    [TASK_OPTIONS.posts]: []
}

const TaskDialog = () => {
    const [task, setTask] = useState(initialState);
    const [createTask, {data, loading, error}] = useMutation(CREATE_TASK);
    const {closeDialog} = useDialog();

    const variables = {
        task: {
            name: task[TASK_OPTIONS.wordpressApiUrl],
            categories: {
                isAdd: task[TASK_OPTIONS.isAddCategories]
            },
            siteMap: {
                filter: {
                    onlyHtml: task[TASK_OPTIONS.onlyHtml]
                },
                urls: task[TASK_OPTIONS.urls]
            },
            title: {
                parser: {
                    regExp: task[TASK_OPTIONS.tagTitle],
                    index: task[TASK_OPTIONS.arraysIndex]
                },
                search: {
                    isStrong: task[TASK_OPTIONS.isStrongSearch],
                    sortBy: task[TASK_OPTIONS.sortBy],
                    order: task[TASK_OPTIONS.order]
                }
            },
            wordpress: {
                auth: base64_encode(`${task[TASK_OPTIONS.username]}:${task[TASK_OPTIONS.password]}`),
                url: task[TASK_OPTIONS.wordpressApiUrl]
            },
            timeout: task[TASK_OPTIONS.timeout]
        },
    };

    const handleChangeTask = (newTask) => {
        setTask((prevTask) => ({...prevTask, ...newTask}))
    }

    const handleCreateTask = () => {
        createTask({
            variables
        }).then(closeDialog);
    }

    return (
        <Modal
            title="Create task dialog"
            centered
            open
            onOk={handleCreateTask}
            onCancel={closeDialog}
        >
            <Collapse accordion>
                <Panel header="Sitemap" key="1">
                    <SiteMap
                        onlyHtml={task[TASK_OPTIONS.onlyHtml]}
                        onChange={handleChangeTask}
                    />
                </Panel>
                <Panel header="Title" key="2">
                    <Title/>
                </Panel>
                <Panel header="Categories" key="3">
                    <Categories/>
                </Panel>
                <Panel header="Wordpress settings" key="4">
                    <WordpressSettings/>
                </Panel>
            </Collapse>
        </Modal>
    );
};

export default TaskDialog;