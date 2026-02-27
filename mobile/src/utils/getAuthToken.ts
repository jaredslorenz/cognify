import { CognitoUserPool } from "amazon-cognito-identity-js";

const getUserPool = () =>
  new CognitoUserPool({
    UserPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID ?? "",
    ClientId: process.env.EXPO_PUBLIC_USER_POOL_CLIENT_ID ?? "",
  });

/**
 * Returns the current user's Cognito idToken string,
 * or null if not signed in / session invalid.
 */
export async function getAuthToken(): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const pool = getUserPool();
      const cognitoUser = pool.getCurrentUser();
      if (!cognitoUser) return resolve(null);

      cognitoUser.getSession((err: any, session: any) => {
        if (err || !session?.isValid()) return resolve(null);
        resolve(session.getIdToken().getJwtToken());
      });
    } catch {
      resolve(null);
    }
  });
}
