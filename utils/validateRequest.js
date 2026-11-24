const ExpressError=require("./ExpressError.js");

module.exports=(schema,source="body")=>(req,res,next)=>{
  const {error,value}=schema.validate(req[source]||{},{abortEarly:false,stripUnknown:true,convert:true});
  if(error){
    const message=error.details.map(detail=>detail.message.replaceAll('"','')).join(". ");
    if((req.get("accept")||"").toLowerCase().includes("application/json")){
      return res.status(400).json({error:message,details:error.details.map(detail=>({field:detail.path.join("."),message:detail.message}))});
    }
    req.flash("error",message);
    const referer=req.get("referer");
    const back=referer&&new URL(referer,`${req.protocol}://${req.get("host")}`).origin===`${req.protocol}://${req.get("host")}`?new URL(referer).pathname+new URL(referer).search:req.originalUrl;
    return res.redirect(back.startsWith("/")?back:"/");
  }
  req[source]=value;
  next();
};
