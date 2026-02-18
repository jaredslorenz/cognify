// Providers.tsx
"use client";

//import "@/utils/amplifyClient";
import { Authenticator } from "@aws-amplify/ui-react";
import Auth from "./authProvider";
import { Amplify } from "aws-amplify";
import { Provider } from "react-redux";
import { store } from "../store";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId:
        process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
    },
  },
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Authenticator.Provider>
      <Provider store={store}>
        <Auth>{children}</Auth>
      </Provider>
    </Authenticator.Provider>
  );
};

export default Providers;
