import React from 'react';
import StorefrontPage from '../Storefront';
export default function HomePage({data={},...props}) { return <StorefrontPage {...props} products={data.allProducts||[]}/>; }
