import React from 'react';
import {Intro,Empty} from './ui';
export default function EmptyOrdersPage() { return <main className="section orders-page"><Intro title="Your orders" copy="Your order history will live here."/><Empty title="No orders yet" copy="Once you place an order, you can follow its progress here." link="/product"/></main>; }
