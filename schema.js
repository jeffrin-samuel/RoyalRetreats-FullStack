const Joi = require('joi');

// Listing Schema Validation
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().uri().required(),
            filename: Joi.string().required()
        }).optional(),
        category: Joi.string().required()
    }).required()
});

// Review Schema Validation
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

// Sign-Up Schema Validation
module.exports.signUpSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// Reset Password Schema Validation
module.exports.resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword'))
        .messages({ 'any.only': 'Passwords do not match' })
});
