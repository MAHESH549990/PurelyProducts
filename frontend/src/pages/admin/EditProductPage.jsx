import React from 'react';
import ProductEditorPage from './ProductEditorPage';
export default function EditProductPage({data={},...props}) { return <ProductEditorPage {...props} item={data.item}/>; }
