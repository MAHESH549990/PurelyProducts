const joi=require("joi");
module.exports.productSchema=joi.object({
  name:joi.string().required(),
  description:joi.string().required(),
  price:joi.number().required().min(0),
  costPrice:joi.number().required().min(0),
  stock:joi.number().integer().min(0).default(100),
  image:joi.object({
     url:joi.string().required()
  }).required(),
  rating:joi.number().required().min(1).max(5),
  category:joi.string().allow("").optional()
});

module.exports.reviewScheam=joi.object({
  review:joi.object({
    comment:joi.string().required(),
    rating:joi.number().required().min(1).max(5),
    image:joi.object({
       url:joi.string().allow("",null)
    }).allow(null)
  }).required()
});


const username=joi.string().trim().min(2).max(40).required();
module.exports.signupSchema=joi.object({
  username,
  email:joi.string().trim().email().max(254).required(),
  password:joi.string().min(8).max(72).required()
}).required();
module.exports.loginSchema=joi.object({
  username:joi.string().trim().min(2).max(100).required(),
  password:joi.string().min(1).max(72).required()
}).required();
module.exports.addressSchema=joi.object({
  state:joi.string().trim().min(2).max(80).required(),
  city:joi.string().trim().min(2).max(100).required(),
  location:joi.string().trim().min(4).max(300).required()
}).required();
module.exports.cartQuantitySchema=joi.object({quantity:joi.number().integer().min(1).max(100).required()}).required();
module.exports.demoPaymentSchema=joi.object({
  demoSessionId:joi.string().guid({version:['uuidv4']}).required(),
  cardholderName:joi.string().trim().min(2).max(80).required()
}).required();
module.exports.deliveryApplicationSchema=joi.object({
  phone:joi.string().trim().pattern(/^[+0-9()\s-]{8,20}$/).required(),
  experience:joi.string().valid('Fresher','Less than 1 year','1-3 years','3+ years').required(),
  address:joi.string().trim().min(4).max(300).required(),
  vehicleNumber:joi.string().trim().min(4).max(24).required(),
  licenseNumber:joi.string().trim().min(4).max(40).required()
}).required();
module.exports.stockSchema=joi.object({stock:joi.number().integer().min(0).max(1000000).required()}).required();
module.exports.assignDeliverySchema=joi.object({deliveryPartnerId:joi.string().pattern(/^[a-f\d]{24}$/i).required()}).required();
