// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
const configureAccount = (sa: any, isProd: boolean) => {
  const configAcc = sa;
  let parsedPK;
  try {
    parsedPK = isProd
      ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY as string)
      : JSON.parse(process.env.FIREBASE_DEV_PRIVATE_KEY as string);
  } catch (err) {
    parsedPK = isProd ? process.env.FIREBASE_PRIVATE_KEY : process.env.FIREBASE_DEV_PRIVATE_KEY;
  }
  configAcc.private_key = parsedPK;
  configAcc.private_key_id = isProd
    ? process.env.FIREBASE_PRIVATE_KEY_ID
    : process.env.FIREBASE_DEV_PRIVATE_KEY_ID;
  return configAcc;
};

export default configureAccount;
