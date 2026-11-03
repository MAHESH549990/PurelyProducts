import React from 'react';
import OrderDetailsPage from '../OrderDetailsPage';
export default function OrderDetailsRoutePage({data={}}) { return <OrderDetailsPage order={data.orders}/>; }
