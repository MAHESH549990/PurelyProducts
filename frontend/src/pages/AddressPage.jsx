import React from 'react';
import ProfilePage from './ProfilePage';
export default function AddressPage(props) { return <ProfilePage {...props} path={props.path||'/users/profile/location'}/>; }
