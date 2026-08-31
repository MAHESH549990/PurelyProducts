const joi=require("joi");
module.exports.productSchema=joi.object({
  name:joi.string().required(),
  description:joi.string().required(),
  price:joi.number().required().min(0),
  image:joi.object({
     url:joi.string().allow("",null)
  }).allow(null),
  rating:joi.number().required().min(1).max(5)
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