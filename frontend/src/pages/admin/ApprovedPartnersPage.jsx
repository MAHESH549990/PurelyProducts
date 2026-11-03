import React from 'react';
import AdminPage from '../AdminPage';
export default function ApprovedPartnersPage(props) { return <AdminPage {...props} titleOverride={props.data?.order?'Assign a delivery partner':'Approved delivery partners'}/>; }
