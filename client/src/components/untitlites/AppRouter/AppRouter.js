import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import LoginPage from "../../../pages/LoginPage/LoginPage";
import Dashboard from "../../../pages/Dashboard";

const AppRouter = () => {
    const isAuth = true;
    return (
        <Router>
            <Routes>
                <Route element={<ProtectedRoute allowed={isAuth} redirect={"/login"}/>}>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                </Route>
                <Route element={<ProtectedRoute allowed={!isAuth} redirect="/dashboard"/>}>
                    <Route element={<LoginPage/>} path="/login"/>
                </Route>
                <Route path="*" element={<Navigate to="/dashboard"/>}/>
            </Routes>
        </Router>
    );
};

export default AppRouter;