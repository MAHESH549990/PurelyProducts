import React from 'react';
import OrdersPage from '../OrdersPage';
export default function OrdersRoutePage({data={},path,...props}) { return <OrdersPage {...props} rows={data.orders||[]} path={path}/>; }
