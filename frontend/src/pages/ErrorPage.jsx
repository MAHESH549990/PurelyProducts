import React from 'react';
import {Empty} from './ui';
export default function ErrorPage({data={}}) { const login=data.status===401||data.status===403;return <main className="section access-error"><div className="error-code">{data.status||'Oops'}</div><Empty title={login?'Access needed':'We couldn’t open that page'} copy={data.message||'Please try again or return to the shop.'} link={login?'/users/login':'/product'}/></main>; }
