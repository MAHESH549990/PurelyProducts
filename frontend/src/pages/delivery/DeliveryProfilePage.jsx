import React from 'react';
import DeliveryPage from '../DeliveryPage';
export default function DeliveryProfilePage(props) { return <DeliveryPage {...props} path={props.path||'/delivery/person/profile'} titleOverride="Delivery profile"/>; }
