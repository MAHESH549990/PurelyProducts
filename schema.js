const joi=require("joi");
const validateProduct=joi.object({
  name:joi.string().required(),
  description:joi.string().required(),
  price:joi.number().required().min(0),
  image:joi.string().allow("",null),
  rating:joi.number().required().min(1).max(5)
});

module.exports=validateProduct;