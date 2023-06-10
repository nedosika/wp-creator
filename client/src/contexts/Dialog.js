import {createContext, createElement, useContext, useState} from "react";
import TaskDialog from "dialogs/TaskDialog";

export const DIALOGS = {
    TaskDialog
}

const DialogContext = createContext({});

export const useDialog = () => useContext(DialogContext);

export const DialogProvider = ({children}) => {
    const [dialogs, setDialogs] = useState([]);

    const openDialog = ({dialog, props = {}}) => {
        setDialogs((prevState) => [...prevState, {dialog, props}]);
    }

    const closeDialog = () => {
        setDialogs((prevState) => prevState.slice(0, dialogs.length - 1));
    }

    return <DialogContext.Provider value={{
        openDialog,
        closeDialog
    }}>
        {children}
        {
            dialogs.map(({dialog, props}, index) =>
                createElement(dialog, {...props, key: index})
            )
        }
    </DialogContext.Provider>
}

export default DialogProvider;
