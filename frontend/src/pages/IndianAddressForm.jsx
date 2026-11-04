import React,{useState} from 'react';
import {indiaStates} from './indiaLocations';

export default function IndianAddressForm({action,method='POST',submit,address={}}){
 const [state,setState]=useState(address.state||''),[city,setCity]=useState(address.city||'');
 const cities=indiaStates[state]||[];
 return <form className="panel form-stack narrow indian-address-form" action={action} data-method={method} onSubmit={submit}>
  <div className="address-country"><span aria-hidden="true">🇮🇳</span><label><small>COUNTRY</small><b>India</b></label><em>Fixed for this address</em></div>
  <label className="field"><span>State or union territory</span><select name="state" value={state} required onChange={event=>{setState(event.target.value);setCity('');}}><option value="">Choose your state</option>{Object.keys(indiaStates).sort().map(name=><option key={name} value={name}>{name}</option>)}</select></label>
  <label className="field"><span>City</span><select name="city" value={city} required disabled={!state} onChange={event=>setCity(event.target.value)}><option value="">{state?'Choose your city':'Select a state first'}</option>{city&&!cities.includes(city)&&<option value={city}>{city} (saved)</option>}{cities.map(name=><option key={name} value={name}>{name}</option>)}</select></label>
  <label className="field"><span>Street address / location</span><textarea name="location" rows="3" required defaultValue={address.location||''} placeholder="House number, street, area, landmark"/></label>
  <button className="btn primary">Save address ↗</button>
 </form>;
}
