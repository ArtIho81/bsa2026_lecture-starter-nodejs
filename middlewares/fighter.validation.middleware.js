import { FIGHTER } from "../models/fighter.js";
import { responseMiddleware } from "./response.middleware.js";
import { fighterService } from "../services/fighterService.js";

const valuesToValidate = {
  name: {
    value: "name",
    required: true,
  },
  power: {
    value: "power",
    range: [1, 100],
    required: true,
  },
  defense: {
    value: "defense",
    range: [1, 10],
    required: true,
  },
  health: {
    value: "health",
    range: [80, 120],
    required: false,
  },
};

const checkUniqueValue = (field, value, id) => {
  const isValueExist = fighterService.search({ [field]: value.toLowerCase() });
  const unique = !isValueExist || isValueExist.id === id;
  return unique;
};

const validateProperty = (value = 85, field) => {
  const [min, max] = valuesToValidate[field].range;
  return value >= min && value <= max;
};

const isEmptyValue = (data) =>
  !(typeof data === "number" ? true : data?.length);

const createFighterValid = (req, res, next) => {
  const candidate = req.body;
  const errors = [];

  Object.keys(FIGHTER).forEach((field) => {
    if (
      field !== "id" &&
      valuesToValidate[field].required &&
      isEmptyValue(candidate[field])
    ) {
      errors.push(`${field} is required`);
    } else if (field === valuesToValidate.name.value) {
      const unique = checkUniqueValue(field, candidate[field]);
      if (!unique) {
        errors.push(`${field} already exist`);
      }
    } else if (
      (field === valuesToValidate.power.value ||
        field === valuesToValidate.defense.value ||
        field === valuesToValidate.health.value) &&
      !validateProperty(candidate[field], field)
    ) {
      errors.push(`${field} isn't valid`);
    }
  });

  if ("id" in candidate) {
    errors.push("Id in the request body is present");
  }

  if (errors.length > 0) {
    res.err = errors;
    return responseMiddleware(req, res, next);
  }

  next();
};

const updateFighterValid = (req, res, next) => {
  const updatedData = req.body;
  const { id } = req.params;
  const fighter = fighterService.search({ id });
  if (!fighter) {
    res.err = new Error(`Fighter wasn't found`);
    return responseMiddleware(req, res, next);
  }

  const errors = [];
  const updatedFieldsNumber = Object.keys(FIGHTER).filter(
    (field) => field !== "id" && !isEmptyValue(updatedData[field]),
  );
  if (updatedFieldsNumber.length === 0) {
    errors.push("No data to update");
  } else {
    updatedFieldsNumber.forEach((update) => {
      if (
        (field === valuesToValidate.power.value ||
          field === valuesToValidate.defense.value ||
          field === valuesToValidate.health.value) &&
        !validateProperty(updatedData[field], field)
      ) {
        errors.push(`${update} isn't valid`);
      } else if (update === valuesToValidate.name.value) {
        const unique = checkUniqueValue(update, updatedData[update], id);
        if (!unique) {
          errors.push(`${update} already exist`);
        }
      }
    });
  }
  if ("id" in updatedData) {
    errors.push("Id in the request body is present");
  }
  if (errors.length > 0) {
    res.err = errors;
    return responseMiddleware(req, res, next);
  }

  next();
};

export { createFighterValid, updateFighterValid };
