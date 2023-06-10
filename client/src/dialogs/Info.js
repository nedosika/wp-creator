import {Modal} from "antd";
import { ObjectView } from 'react-object-view'

import React from "react";
import {useDialog} from "contexts/Dialog";

const InfoDialog = () => {
    const {closeDialog} = useDialog();

    return (
        <Modal
            title="Urls information"
            centered
            open
            onOk={closeDialog}
            onCancel={closeDialog}
        >
            <ObjectView data={{}}/>
        </Modal>
    );
}

export default InfoDialog;