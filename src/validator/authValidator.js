const Joi = require("joi");
const { message, regex } = require("./regex");

// Cretate Customer with phone
const createCustomerWithPhone = {
  body: Joi.object().keys({
    // fullName: Joi.string().description("Please Enter your name"),
    email: Joi.string().email().description("Please Emter your Email"),
    // role: Joi.string(),
    // phone: Joi.string().required().description("Please Enter Phone"),
    // addresses: Joi.array().items(Joi.string(), Joi.number(), Joi.any()),
  }),
};

const register = {
  body: Joi.object().keys({
    // firstName: Joi.string().required().description("Please Enter your name"),
    // lastName: Joi.string().required().description("Please Enter your name"),
    email: Joi.string().email().required(),
    // role: Joi.string(),
    password: Joi.string().required().description("Password is required"),
    // phone: Joi.string().required().description("Please Enter Phone"),
    // streetAddress: Joi.string().required(),
    // city: Joi.string().required(),
    // state: Joi.string().required(),
    // postalCode: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const loginWithPhoneNumber = {
  body: {
    phone: Joi.string().required().description("Phone number is required"),
    role: Joi.string().description("role is required"),
  },
};

const shopSchema = Joi.object().keys({
  name: Joi.string().description("Enter your shop name"),
  phone: Joi.string().description("Phone number is required"),
  numberOfEmp: Joi.number().description("Enter number of employess"),
  email: Joi.string().email().description("email is required"),
  description: Joi.string(),
  startTime: Joi.date(),
  endTime: Joi.date(),
  logos: Joi.object().description("Upload your shop LOGO"),
  shopImages: Joi.object().description("Upload your shop images"),
  operationalSince: Joi.date(),
  maintenanceSchedule: Joi.number().description("Enter maintence schedule"),
  govDetail: Joi.object().description(
    "upload govenment detail related to shop"
  ),
  certificates: Joi.object().description("upload shop certification"),
  cardFront: Joi.object().description("Upload id card front side image"),
  cardBack: Joi.object().description("Upload id card back side image"),
  rating: Joi.number().description("Rating"),
  product: Joi.object().keys({
    prod_id: Joi.string()
      .hex()
      .length(24)
      .required()
      .description("Selcte at least one product"),
    price: Joi.number()
      .required()
      .description("Enter price of your selected product"),
    quantity: Joi.number()
      .required()
      .description("Enter the quantity of product"),
    discount: Joi.number().description("Enter the dscount if have any"),
    minimumPurchase: Joi.number()
      .min(50)
      .required()
      .description("Enter any amount of minimum purchase"),
    additionalNote: Joi.string().description("Add extra notes if you have any"),
  }),
});

const update = {
  body: Joi.object().keys({
    email: Joi.string().email().description("email is required"),
    fullName: Joi.string().description("Enter your name"),
    // phone: Joi.string().description("Phone number is required"),
    // isActive: Joi.boolean().description("Pass Activation"),
    // shop: Joi.object().description("Shop is not created"),
    // addresses: Joi.array().items(Joi.string(), Joi.number(), Joi.any()),
  }),
};

const filterbyradius = {
  body: Joi.object().keys({
    longitude: Joi.number().required().description("Enter Longitude"),
    latitude: Joi.number().required().description("Enter Latitude"),
    radius: Joi.number().required().description("Enter the required radius"),
  }),
};

const merchantstatus = {
  body: Joi.object().keys({
    isActive: Joi.boolean()
      .required()
      .description("Enter the status of merchant"),
  }),
};

module.exports = {
  register,
  login,
  loginWithPhoneNumber,
  update,
  filterbyradius,
  merchantstatus,
  createCustomerWithPhone,
};
