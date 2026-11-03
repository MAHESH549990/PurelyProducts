import React from 'react';
import ProfilePage from './ProfilePage';
export default function AddressEditPage(props) { return <ProfilePage {...props} path={props.path||'/users/profile/address/update'}/>; }
