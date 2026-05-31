import { Router } from "express";
import { userService } from "../services/userService.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

router.get(
  "/",
  (req, res, next) => {
    try {
      const data = userService.getAll();
      res.data = data;
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware,
);

router.get(
  "/:id",
  (req, res, next) => {
    try {
      const { id } = req.params;
      const data = userService.search({ id });
      if (!data) {
        throw new Error(`User wasn't found`);
      }
      res.data = data;
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware,
);

router.post(
  "/",
  createUserValid,
  (req, res, next) => {
    try {
      const user = req.body;
      const data = userService.add(user);
      res.data = data;
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware,
);

router.patch(
  "/:id",
  updateUserValid,
  (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const data = userService.update(id, updateData);
      res.data = data;
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware,
);

router.delete(
  "/:id",
  (req, res, next) => {
    try {
      const { id } = req.params;
      const data = userService.delete(id);
      res.data = data;
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware,
);

export { router };
