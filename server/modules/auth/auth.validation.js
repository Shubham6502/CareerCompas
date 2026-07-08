import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("firstName")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("First name must be at most 60 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("Last name must be at most 60 characters"),
  body("displayName").optional().trim(),
  body().custom((_, { req }) => {
    const hasDisplayName = Boolean(req.body.displayName?.trim());
    const hasFirstName = Boolean(req.body.firstName?.trim());
    const hasLastName = Boolean(req.body.lastName?.trim());

    if (!hasDisplayName && !(hasFirstName && hasLastName)) {
      throw new Error("First name and last name are required");
    }

    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];
