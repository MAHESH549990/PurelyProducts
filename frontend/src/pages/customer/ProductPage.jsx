import React from 'react';
import ProductDetails from '../ProductDetails';
export default function ProductPage({data={},...props}) { return <ProductDetails {...props} item={data.item} canReview={data.canReview}/>; }
