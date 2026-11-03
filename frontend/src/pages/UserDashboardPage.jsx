import React from 'react';
import DashboardPage from './DashboardPage';
export default function UserDashboardPage(props) { return <DashboardPage {...props} path={props.path||'/users/dashboard'}/>; }
