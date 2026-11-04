import React from 'react';
import {id,Intro,Status} from './ui';
import LocationMap from './LocationMap';
import IndianAddressForm from './IndianAddressForm';

export default function ProfilePage({data={},path='/users/profile',submit}) {
 const user=data.user||data.currUser,addresses=data.Useraddress||user?.address||[],applying=path.includes('request/delivery'),addressForm=path.endsWith('location')||path.includes('/update'),partner=data.deliveryPartner;
 return <main className="section"><Intro title={applying?'Become a delivery partner':addressForm?'Delivery address':'Your account'} copy="Keep your details and delivery preferences close."/>
  {!applying&&!addressForm&&<><div className="account-grid"><section className="panel"><small>YOUR DETAILS</small><h2>{user?.username||'Your profile'}</h2><p>{user?.email}</p><h3>Saved addresses</h3>{addresses.length?addresses.map(address=><div className="address-row" key={id(address)}><span>{address.location}, {address.city}, {address.state}</span><a href={`/users/profile/${id(address)}/update`}>Edit ↗</a></div>):<p>No saved addresses yet.</p>}{addresses.length===0&&<a className="btn outline" href="/users/profile/location">Add an address ↗</a>}</section>
   <section className="panel"><small>{partner?'DELIVERY PARTNER DETAILS':'YOUR NEXT STEP'}</small><h2>{partner?'Your delivery profile':'Make it yours.'}</h2>{partner?<><p>{partner.phone} · {partner.vehicleNumber}</p><Status value={partner.applicationStatus}/></>:<><p>Keep an address ready for your next order, or apply to deliver with us.</p><a className="btn outline" href="/users/profile/request/delivery">Apply as delivery partner ↗</a></>}</section></div>
   {addresses.length>0&&<div className="profile-location-map"><LocationMap address={addresses[addresses.length-1]} token={data.mapToken}/></div>}</>}
  {addressForm&&<IndianAddressForm action={path.includes('/update')?path:'/users/profile'} method={path.includes('/update')?'PUT':'POST'} submit={submit} address={data.user||{}}/>}
  {applying&&<form className="panel form-stack narrow" action="/users/profile/request/delivery" method="post" encType="multipart/form-data" onSubmit={submit}><label className="field"><span>Phone</span><input name="phone" required/></label><label className="field"><span>Experience</span><select name="experience" required><option value="">Select experience</option>{['Fresher','Less than 1 year','1-3 years','3+ years'].map(value=><option key={value}>{value}</option>)}</select></label><label className="field"><span>Address</span><input name="address" required/></label><label className="field"><span>Vehicle number</span><input name="vehicleNumber" required/></label><label className="field"><span>Licence number</span><input name="licenseNumber" required/></label><label className="field"><span>Licence document</span><input name="licenseImage" type="file" required/></label><button className="btn primary">Submit application ↗</button></form>}
 </main>;
}
