import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import './styles2.css';
import './styles3.css';
import './styles4.css';
import {pageRegistry} from './pages/PageRegistry';
import './styles5.css';
import './styles6.css';
import './styles7.css';
import './styles8.css';
import './styles9.css';
import ShopAssistant from './components/ShopAssistant';

const productCategories=['Groceries','Premium Fruits','Home & Kitchen','Fashion','Electronics','Beauty','Home Improvement','Sports, Toys & Luggage'];
function App(){
 const [path,setPath]=useState(location.pathname+location.search),[page,setPage]=useState(null),[loading,setLoading]=useState(true),[notice,setNotice]=useState(''),[selectedCategory,setSelectedCategory]=useState('All');const skipNextLoad=useRef(false);
 async function load(to=path){setLoading(true);setNotice('');try{let target=to==='/'?'/product':to;let r=await fetch(target,{headers:{Accept:'application/json'},credentials:'same-origin',cache:'no-store'});if(r.redirected){const u=new URL(r.url),dest=u.pathname+u.search;if(dest!==target){history.replaceState({},'',dest);setPath(dest);return}}let type=r.headers.get('content-type')||'';if(type.includes('application/json')){let d=await r.json();if(d.redirect){go(d.redirect);return}setPage(d);setNotice(d.data?.error?.[0]||d.data?.success?.[0]||'')}else if(target==='/product'){let d=await fetch('/api/products').then(x=>x.json());setPage({view:'routes/home.ejs',data:{allProducts:d.products||[]}})}else setPage({view:'routes/error.ejs',data:{message:'This page could not be loaded.'}})}catch{setPage({view:'routes/error.ejs',data:{message:'Could not load this page. Please try again.'}})}finally{setLoading(false)}}
 useEffect(()=>{
  const appRoot=document.getElementById('root');
  const enableBootstrapValidation=()=>appRoot?.querySelectorAll('form').forEach(form=>{form.noValidate=true;form.classList.add('needs-validation');});
  enableBootstrapValidation();
  const observer=new MutationObserver(enableBootstrapValidation);
  if(appRoot)observer.observe(appRoot,{childList:true,subtree:true});
  return()=>observer.disconnect();
 },[]);
 useEffect(()=>{if(skipNextLoad.current){skipNextLoad.current=false;return}load(path)},[path]);
 useEffect(()=>{const pop=()=>setPath(location.pathname+location.search);const click=e=>{const a=e.target.closest('a');if(!a||a.target||a.origin!==location.origin||a.pathname.startsWith('/app/')||a.pathname.endsWith('/license'))return;e.preventDefault();go(a.pathname+a.search+a.hash)};addEventListener('popstate',pop);document.addEventListener('click',click);return()=>{removeEventListener('popstate',pop);document.removeEventListener('click',click)}},[]);
 function go(to){const [p,h]=to.split('#');history.pushState({},'',p||'/');setPath(p||'/');scrollTo({top:0,behavior:'smooth'});if(h)setTimeout(()=>document.getElementById(h)?.scrollIntoView({behavior:'smooth'}),120)}
 async function submit(e){
  e.preventDefault();
  const form=e.currentTarget;
  form.classList.add('was-validated');
  if(!form.checkValidity()){e.stopPropagation();form.querySelector(':invalid')?.focus();return;}
  const hasFile=[...form.elements].some(element=>element.type==='file'&&element.files?.length);
  const method=(form.dataset.method||form.method||'post').toUpperCase();
  const body=hasFile?new FormData(form):new URLSearchParams(new FormData(form));
  try{
   const response=await fetch(form.action||path,{method,body,credentials:'same-origin',headers:{Accept:'application/json'}});
   const contentType=response.headers.get('content-type')||'';
   if(response.redirected){
    const targetUrl=new URL(response.url);
    if(targetUrl.origin!==location.origin){location.assign(response.url);return}
    const destination=targetUrl.pathname+targetUrl.search;
    const redirectedPage=contentType.includes('application/json')?await response.json():null;
    if(destination!==path){
     skipNextLoad.current=true;
     history.pushState({},'',destination);
     setPath(destination);
    }
    await load(destination);
    const flash=redirectedPage?.data?.success?.[0]||redirectedPage?.data?.error?.[0];
    if(flash)setNotice(flash);
    return;
   }
   if(contentType.includes('application/json')){
    const result=await response.json();
    if(result.redirect){
     const destination=result.redirect;
     const flash=result.success||result.data?.success?.[0]||result.data?.error?.[0]||'';
     if(destination===path)await load(destination);
     else go(destination);
     if(flash)setNotice(flash);
     return;
    }
    if(result.view){
     setPage(result);
     setNotice(result.data?.error?.[0]||result.data?.success?.[0]||'');
     return;
    }
   }
   if(!response.ok)setNotice(await response.text());
   else await load(path);
  }catch{
   setNotice('That action could not be completed. Please try again.');
  }
 }
 const data=page?.data||{},view=page?.view||'',user=data.currUser,auth=/userLogin\/(login|signup|forgetPass)/.test(view)||/\/users\/(login|signup|updatePassword)/.test(path);
 if(auth){const AuthPage=pageRegistry[view];return AuthPage?<AuthPage submit={submit} notice={notice}/>:null;}
 return <div className={`app-shell ${user?.role==='admin'?'admin-shell':user?.role==='delivery'?'delivery-shell':'customer-shell'}`}><Header user={user} path={path} onCategory={setSelectedCategory} selectedCategory={selectedCategory}/>{notice&&<div className="toast">{notice}<button onClick={()=>setNotice('')}>×</button></div>}<div className="app-content">{loading?<div className="loading">Loading your page…</div>:<Screen data={data} view={view} path={path} user={user} submit={submit} selectedCategory={selectedCategory} onCategory={setSelectedCategory}/>}</div><Footer/>{user?.role!=='admin'&&user?.role!=='delivery'&&<ShopAssistant/>}</div>
}

function Header({user,path,onCategory,selectedCategory}){
 const admin=user?.role==='admin',delivery=user?.role==='delivery',consoleNav=admin||delivery;
 const links=admin?[
  ['Overview','/admin'],['Products','/admin/products'],['Inventory','/admin/inventory'],['Earnings','/admin/earnings'],
  ['Pending orders','/admin/users/orders/pending'],['Confirmed orders','/admin/users/orders/accepted'],['Customers','/admin/users/details'],
  ['Delivery requests','/admin/delivery/requests'],['Partners','/admin/delivery/approved'],['Profile','/admin/profile']
 ]:delivery?[
  ['Overview','/delivery'],['Assigned orders','/delivery/orders/assign'],['On route','/delivery/orders/assign/out-for-delivery'],['History','/delivery/orders/assign/delivered'],['Earnings','/delivery/earnings'],['Profile','/delivery/person/profile']
 ]:[['Shop','/product'],['Cart','/product/cart'],['Orders','/orders/ordered'],['Profile','/users/profile']];
 const profileHref=admin?'/admin/profile':delivery?'/delivery/person/profile':'/users/profile';
 const logoutHref=delivery?'/delivery/person/logout':'/users/logout';
 const currentPath=path.split('?')[0];
 const activeHref=links.map(([,href])=>href)
  .filter(href=>currentPath===href||currentPath.startsWith(href+'/'))
  .sort((a,b)=>b.length-a.length)[0];
 return <>
  <header className={`topbar ${consoleNav?'topbar-console':''}`}>
   <div className={`nav ${consoleNav?'nav-console':''}`}>
    <a href="/product" className="brand"><b>p</b> Purely<span>Products</span></a>
    {consoleNav&&<span className="admin-console-label">{admin?'ADMIN CONSOLE':'DELIVERY CONSOLE'}</span>}
    <nav className={consoleNav?'console-nav':''} aria-label={admin?'Admin navigation':delivery?'Delivery navigation':'Shop navigation'}>
     {links.map(([name,href])=>{
      const active=href===activeHref;
      return <a className={active?'active':''} href={href} key={href} aria-current={active?'page':undefined} title={name}>{name}</a>;
     })}
    </nav>
    <div className="nav-user">
     {user?<><a className="user-dot" href={profileHref} aria-label="Account profile">{(user.username||'U')[0].toUpperCase()}</a><a href={logoutHref}>Sign out</a></>:<><a href="/users/login">Sign in</a><a className="join" href="/users/signup">Create account ↗</a></>}
    </div>
   </div>
  </header>
  {!admin&&!delivery&&<div className="category-bar"><div>{productCategories.map((category,index)=><button className={category===selectedCategory?'category-selected':''} type="button" onClick={()=>{onCategory(category);document.getElementById('collection')?.scrollIntoView({behavior:'smooth'})}} key={category}>{category}<span>{[0,2,4,5].includes(index)?'⌄':''}</span></button>)}</div></div>}
 </>;
}
function Footer(){return <footer className="footer"><div className="footer-main"><div><a href="/product" className="brand inverse"><b>p</b> purely<span>products</span></a><p>Thoughtful finds for everyday living.</p></div><div><b>Explore</b><a href="/product">Shop the collection</a><a href="/users/dashboard">Our story</a></div><div><b>Your account</b><a href="/users/profile">Profile</a><a href="/orders/ordered">Orders</a></div><div className="motto">GOOD THINGS, DELIVERED.<p>Useful. Lovely. Made for the everyday.</p></div></div><div className="legal"><span>© {new Date().getFullYear()} PurelyProducts</span><span>Made with care, for everyday.</span></div></footer>}

function Screen({data,view,path,user,submit,selectedCategory,onCategory}) {
 const Page=pageRegistry[view];
 if(Page)return <Page data={data} view={view} path={path} user={user} submit={submit} selectedCategory={selectedCategory} onCategory={onCategory}/>;
 return <main className="section"><div className="empty"><span>✳</span><h3>We couldn’t open that page</h3><p>{data.message||'This page is not available.'}</p><a className="btn outline" href="/product">Explore the shop ↗</a></div></main>;
}

createRoot(document.getElementById('root')).render(<App/>);
