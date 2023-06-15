import {Modal} from "antd";

import React from "react";
import {useDialog} from "contexts/Dialog";
import {useMutation} from "@apollo/client";
import {DELETE_TASK} from "../apollo/mutations";
import {GET_TASKS} from "../apollo/queries";

const InfoDialog = ({id}) => {
    const {closeDialog} = useDialog();
    const [deleteTask] = useMutation(DELETE_TASK, {refetchQueries: [GET_TASKS]});

    return (
        <Modal
            title="Delete dialog"
            centered
            open
            onOk={() => deleteTask({variables: {id}}).then(closeDialog)}
            onCancel={closeDialog}
        >

        </Modal>
    );
}

export default InfoDialog;