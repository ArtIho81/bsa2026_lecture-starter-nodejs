import { USER } from "../models/user.js";
import { userService } from "../services/userService.js";
import { responseMiddleware } from "./response.middleware.js";

const valuesToValidate = {
  email: "email",
  password: "password",
  phone: "phone",
};

const validators = {
  email: (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim()),
  phone: (phone) => /^\+380[\d]{9}$/.test(phone.trim()),
  password: (password) => password.trim().length >= 3,
};

const checkUniqueValue = (field, value, id) => {
  const isValueExist = userService.search({ [field]: value.toLowerCase() });
  const unique = !isValueExist || isValueExist.id === id;
  return unique;
};

const validateUniqueValue = (field, value, id) => {
  let valid;
  if (field === valuesToValidate.email) {
    valid = validators.email(value);
  } else if (field === valuesToValidate.phone) {
    valid = validators.phone(value);
  }
  if (!valid) {
    return `${field} isn't valid`;
  }
  const unique = checkUniqueValue(field, value, id);
  if (!unique) {
    return `${field} already exist`;
  }
  return null;
};

const createUserValid = (req, res, next) => {
  const candidate = req.body;
  const errors = [];

  Object.keys(USER).forEach((field) => {
    if (field !== "id" && !candidate[field]?.trim()) {
      errors.push(`${field} is required`);
    } else if (
      field === valuesToValidate.password &&
      !validators.password(candidate[field])
    ) {
      errors.push(`${field} isn't valid`);
    } else if (
      field === valuesToValidate.email ||
      field === valuesToValidate.phone
    ) {
      const error = validateUniqueValue(field, candidate[field]);
      if (error) {
        errors.push(error);
      }
    }
  });

  if ("id" in candidate) {
    errors.push("Id is present in the request body");
  }

  if (errors.length > 0) {
    res.err = errors;
    return responseMiddleware(req, res, next);
  }
  next();
};

const updateUserValid = (req, res, next) => {
  const updatedData = req.body;
  const { id } = req.params;
  const user = userService.search({ id });
  if (!user) {
    res.err = new Error(`User wasn't found`);
    return responseMiddleware(req, res, next);
  }

  const errors = [];
  const updatedFields = Object.keys(USER).filter(
    (field) => field !== "id" && updatedData[field] !== 0,
  );
  if (updatedFields.length === 0) {
    errors.push("No data to update");
  } else {
    updatedFields.forEach((update) => {
      if (
        update === valuesToValidate.password &&
        !validators.password(updatedData[update])
      ) {
        errors.push(`${field} isn't valid`);
      } else if (
        update === valuesToValidate.email ||
        update === valuesToValidate.phone
      ) {
        const error = validateUniqueValue(update, updatedData[update], id);
        if (error) {
          errors.push(error);
        }
      }
    });
  }
  if ("id" in updatedData) {
    errors.push("Id is present in the request body");
  }

  if (errors.length > 0) {
    res.err = errors;
    return responseMiddleware(req, res, next);
  }
  next();
};

export { createUserValid, updateUserValid };
