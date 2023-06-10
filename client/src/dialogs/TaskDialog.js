import {Collapse, Modal} from "antd";
import {encode as base64_encode} from 'base-64';
import SiteMap from "components/Accordion/SiteMap";
import Title from "components/Accordion/Title";
import Categories from "components/Accordion/Categories";
import React from "react";
import {SETTINGS, useSettings} from "contexts/Settings";
import {useDialog} from "contexts/Dialog";
import WordpressSettings from "components/Accordion/WordpressSettings";
import {useMutation} from "@apollo/client";
import {CREATE_TASK} from "apollo/mutations";

const { Panel } = Collapse;

const TaskDialog = () => {
    const [settings] = useSettings();
    const [createTask, {data, loading, error}] = useMutation(CREATE_TASK);
    const {closeDialog} = useDialog();

    const variables = {
        task: {
            name: settings[SETTINGS.wordpressApiUrl],
            categories: {
                isAdd: settings[SETTINGS.isAddCategories]
            },
            siteMap: {
                filter: {
                    onlyHtml: settings[SETTINGS.onlyHtml]
                },
                urls: settings[SETTINGS.urls]
            },
            title: {
                parser: {
                    regExp: settings[SETTINGS.tagTitle],
                    index: settings[SETTINGS.arraysIndex]
                },
                search: {
                    isStrong: settings[SETTINGS.isStrongSearch],
                    sortBy: settings[SETTINGS.orderBy],
                    order: settings[SETTINGS.order]
                }
            },
            wordpress: {
                auth: base64_encode(`${settings[SETTINGS.username]}:${settings[SETTINGS.password]}`),
                url: settings[SETTINGS.wordpressApiUrl]
            },
            timeout: settings[SETTINGS.timeout]
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