import React from "react";
import {message} from "antd";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidMount() {
        window.onerror = (msg) => {
            message.error(msg)
        }
    }

    componentDidCatch(error, errorInfo) {
        message.error(error.message)
    }

    render() {
        if (this.state.hasError) {
            // Можно отрендерить запасной UI произвольного вида
            //return <h1>Что-то пошло не так.</h1>;
            // variant could be success, error, warning, info, or default
            message.error('Something went wrong!')
        }

        return this.props.children;
    }
}