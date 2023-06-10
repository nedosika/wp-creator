import {Collapse, Modal} from "antd";
import {encode as base64_encode} from 'base-64';
import SiteMap from "../components/Accordion/SiteMap";
import Title from "../components/Accordion/Title";
import Categories from "../components/Accordion/Categories";
import React from "react";
import {TASK_FIELDS, useTasksContext} from "../contexts/TasksContext";
import {useDialogContext} from "../contexts/DialogsContext";
import WordpressSettings from "../components/Accordion/WordpressSettings";
import {useMutation} from "@apollo/client";
import {CREATE_TASK} from "../apollo/mutations";

const { Panel } = Collapse;

const TaskDialog = () => {
    const {task} = useTasksContext();
    const [createTask, {data, loading, error}] = useMutation(CREATE_TASK);
    const {closeDialog} = useDialogContext();

    const variables = {
        task: {
            name: task[TASK_FIELDS.wordpressApiUrl],
            categories: {
                isAdd: task[TASK_FIELDS.isAddCategories]
            },
            siteMap: {
                filter: {
                    onlyHtml: task[TASK_FIELDS.onlyHtml]
                },
                urls: task[TASK_FIELDS.urls]
            },
            title: {
                parser: {
                    regExp: task[TASK_FIELDS.tagTitle],
                    index: task[TASK_FIELDS.arraysIndex]
                },
                search: {
                    isStrong: task[TASK_FIELDS.isStrongSearch],
                    sortBy: task[TASK_FIELDS.orderBy],
                    order: task[TASK_FIELDS.order]
                }
            },
            wordpress: {
                auth: base64_encode(`${task[TASK_FIELDS.username]}:${task[TASK_FIELDS.password]}`),
                url: task[TASK_FIELDS.wordpressApiUrl]
            },
            timeout: task[TASK_FIELDS.timeout]
        },
    };

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
                    <SiteMap/>
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