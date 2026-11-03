import React from 'react';
import ProfilePage from './ProfilePage';
export default function DeliveryRequestPage(props) { return <ProfilePage {...props} path={props.path||'/users/profile/request/delivery'}/>; }
