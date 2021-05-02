import { getGenericPassword, setGenericPassword } from "react-native-keychain";

const ENCRYPTED_PRIVATE_KEY = "ENCRYPTED_PRIVATE_KEY";

export const setPrivateKey = async (privateKey) => {
  const hasSetCredentials = await setGenericPassword(
    ENCRYPTED_PRIVATE_KEY,
    privateKey
  );

  if (!hasSetCredentials) {
    throw new Error("Error setting generic password to Keychain");
  }
};

export const getPrivateKey = async () => {
  try {
    const existingCredentials = await getGenericPassword();

    return (
      existingCredentials.username === ENCRYPTED_PRIVATE_KEY &&
      existingCredentials.password
    );
  } catch (err) {
    throw new Error(err);
  }
};
