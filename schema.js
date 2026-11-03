const joi=require("joi");
module.exports.productSchema=joi.object({
  name:joi.string().required(),
  description:joi.string().required(),
  price:joi.number().required().min(0),
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
