import * as authRepository from "./auth.repository.js";
import { generateAuthToken, hashPassword } from "./auth.utils.js";

const getRegisterNameFields = ({ firstName, lastName, displayName }) => {
  const cleanFirstName = firstName?.trim();
  const cleanLastName = lastName?.trim();

  if (cleanFirstName && cleanLastName) {
    return {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      displayName: `${cleanFirstName} ${cleanLastName}`,
    };
  }

  const cleanDisplayName = displayName?.trim();
  if (!cleanDisplayName) {
    const error = new Error("First name and last name are required");
    error.statusCode = 400;
    throw error;
  }

  const [derivedFirstName, ...derivedLastNameParts] =
    cleanDisplayName.split(/\s+/);
  const derivedLastName = derivedLastNameParts.join(" ") || derivedFirstName;

  return {
    firstName: derivedFirstName,
    lastName: derivedLastName,
    displayName: cleanDisplayName,
  };
};

export const register = async (registerData) => {
  const { email, password } = registerData;
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    const error = new Error("Email already in use");
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await hashPassword(password);
  const { firstName, lastName, displayName } =
    getRegisterNameFields(registerData);

  const newUser = await authRepository.createUser({
    email,
    passwordHash,
    authProvider: "local",
    firstName,
    lastName,
  });

  const token = generateAuthToken(newUser._id);

  return {
    token,
    user: {
      _id: newUser._id,
      email: newUser.email,
      displayName,
      token,
    },
  };
};
