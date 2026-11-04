import React,{useEffect,useRef,useState} from 'react';

const textOf=address=>typeof address==='string'?address.trim():[address?.location,address?.city,address?.state].filter(Boolean).join(', ').trim();
let mapboxPromise;

function loadMapbox(){
 if(typeof window==='undefined')return Promise.reject(new Error('Map is unavailable.'));
 if(window.mapboxgl)return Promise.resolve(window.mapboxgl);
 if(!mapboxPromise){
  mapboxPromise=new Promise((resolve,reject)=>{
   const cssHref='https://api.mapbox.com/mapbox-gl-js/v3.33.0/mapbox-gl.css';
   if(!document.querySelector(`link[href="${cssHref}"]`)){const link=document.createElement('link');link.rel='stylesheet';link.href=cssHref;document.head.appendChild(link);}
   let script=document.querySelector('script[data-mapbox-gl]');
   if(!script){script=document.createElement('script');script.src='https://api.mapbox.com/mapbox-gl-js/v3.33.0/mapbox-gl.js';script.dataset.mapboxGl='true';document.head.appendChild(script);}
   script.addEventListener('load',()=>window.mapboxgl?resolve(window.mapboxgl):reject(new Error('Map controls could not be loaded.')),{once:true});
   script.addEventListener('error',()=>reject(new Error('Map controls could not be loaded.')),{once:true});
  }).catch(error=>{mapboxPromise=null;throw error;});
 }
 return mapboxPromise;
}

export default function LocationMap({address,token}){
 const label=textOf(address),container=useRef(null),mapRef=useRef(null),[place,setPlace]=useState(null),[loading,setLoading]=useState(false),[error,setError]=useState('');

 useEffect(()=>{
  if(!label||!token){setPlace(null);setLoading(false);setError(token?'':'Map is not configured.');return;}
  const controller=new AbortController();setLoading(true);setError('');setPlace(null);
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(label)}.json?access_token=${encodeURIComponent(token)}&limit=1`,{signal:controller.signal})
   .then(response=>{if(!response.ok)throw new Error('Could not look up this address.');return response.json();})
   .then(result=>{const feature=result.features?.[0];if(!feature?.center)throw new Error('Could not find this address on the map.');setPlace({longitude:feature.center[0],latitude:feature.center[1],name:feature.place_name||label});})
   .catch(err=>{if(err.name!=='AbortError')setError(err.message||'Map could not be loaded.');})
   .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return ()=>controller.abort();
 },[label,token]);

 useEffect(()=>{
  if(!place||!token||!container.current)return;
  let cancelled=false,mapbox;
  loadMapbox().then(lib=>{
   if(cancelled||!container.current)return;
   mapbox=lib;
   const map=new lib.Map({container:container.current,accessToken:token,style:'mapbox://styles/mapbox/streets-v12',center:[place.longitude,place.latitude],zoom:14,scrollZoom:true,dragPan:true,touchZoomRotate:true,cooperativeGestures:false,attributionControl:true});
   mapRef.current=map;
   map.addControl(new lib.NavigationControl({showCompass:true,visualizePitch:true}),'top-right');
   map.addControl(new lib.FullscreenControl(),'top-right');
   new lib.Marker({color:'#078bb8',scale:1.15}).setLngLat([place.longitude,place.latitude]).setPopup(new lib.Popup({offset:24}).setText(place.name)).addTo(map).togglePopup();
   map.once('load',()=>map.resize());
   map.on('error',event=>{if(event?.error&&!cancelled)setError('Some map tiles could not be loaded. Check your connection or Mapbox token.');});
  }).catch(err=>{if(!cancelled)setError(err.message||'Map controls could not be loaded.');});
  return ()=>{cancelled=true;mapRef.current?.remove();mapRef.current=null;};
 },[place,token]);

 if(!label)return null;
 const directions=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place?`${place.latitude},${place.longitude}`:label)}`;
 return <section className="location-map-card"><header className="location-map-header"><div><small>YOUR LOCATION</small><h2>Explore your area</h2><p>{place?.name||label}</p></div><span className="location-map-symbol" aria-hidden="true">⌖</span></header><div className={`location-map-canvas ${place?'has-map':''}`}>
  {place?<><div className="interactive-location-map" ref={container} aria-label={`Interactive map showing ${place.name}`}/>{error&&<div className="location-map-error">{error}</div>}</>:<div className="location-map-message"><span>{loading?'⌖':'!'}</span><b>{loading?'Finding your location…':error||'Map is unavailable.'}</b><small>{loading?'Looking up your saved address.':'Your saved address is shown above.'}</small></div>}
 </div><footer className="location-map-footer"><span><i/>{place?'Drag to pan · Scroll or use +/− to zoom':'Saved address'}</span><a href={directions} target="_blank" rel="noreferrer">Open in Maps ↗</a></footer></section>;
}
