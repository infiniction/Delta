const Joi =require('joi');//yeh schema ko validate krta hai server side me 

module.exports.listingSchema =Joi.object({
   listing :Joi.object ({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null)
   }).required()
})


module.exports.reviewSchema = Joi.object({
   review: Joi.object({
rating: Joi.number().required().min(1).max(5),//means rating ki min and max valeue 1 se 5 hogi
comment: Joi.string().required(),
   }).required()
});