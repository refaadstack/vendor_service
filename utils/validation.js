import Joi from 'joi';

export const validateVendor = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required().messages({
      'string.empty': 'Nama Vendor wajib diisi.',
      'any.required': 'Nama Vendor wajib diisi.'
    }),
    address: Joi.string().min(1).required().messages({
      'string.empty': 'Alamat wajib diisi.',
      'any.required': 'Alamat wajib diisi.'
    }),
    phone: Joi.string().min(1).required().messages({
      'string.empty': 'Telepon wajib diisi.',
      'any.required': 'Telepon wajib diisi.'
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateUpdateVendor = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).optional().messages({
      'string.empty': 'Nama Vendor wajib diisi.',
    }),
    address: Joi.string().min(1).optional().messages({
      'string.empty': 'Alamat wajib diisi.',
    }),
    phone: Joi.string().min(1).optional().messages({
      'string.empty': 'Telepon wajib diisi.',
    }),
  });

  return schema.validate(data, { abortEarly: false });
};
