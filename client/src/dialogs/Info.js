import {Modal} from "antd";
import { ObjectView } from 'react-object-view'

import React from "react";
import {useDialog} from "contexts/Dialog";
import {useQuery} from "@apollo/client";
import {GET_TASK} from "../apollo/queries";

const InfoDialog = () => {
    const { data = {}} = useQuery(GET_TASK, {
        variables: { id: "27" },
    });
    const {closeDialog} = useDialog();

    return (
        <Modal
            title="Urls information"
            centered
            open
            onOk={closeDialog}
            onCancel={closeDialog}
        >
            <ObjectView data={data}/>
        </Modal>
    );
}

export default InfoDialog;