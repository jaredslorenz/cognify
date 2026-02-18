"use client";

import React, { useEffect } from "react";
import {
  Authenticator,
  Heading,
  View,
  useAuthenticator,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter, usePathname } from "next/navigation";

// Custom Authenticator components
const components = {
  Header() {
    return (
      <View className="mt-4 mb-7">
        <Heading
          level={3}
          className="!text-2xl bg-white !text-black !font-bold"
        >
          Cognify
        </Heading>
        <p className="text-zinc-600 mt-2">
          <span className="font-bold">Welcome! </span>
          Please sign in to continue
        </p>
      </View>
    );
  },

  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-black">
            Don&apos;t have an account?{" "}
            <button
              onClick={toSignUp}
              className="text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Sign up here
            </button>
          </p>
        </View>
      );
    },
  },

  SignUp: {
    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-black">
            Already have an account?{" "}
            <button
              onClick={toSignIn}
              className="text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </View>
      );
    },
  },
};

// Form fields
const formFields = {
  signIn: {
    username: {
      placeholder: "Enter your email",
      label: "Email",
      isRequired: true,
    },
    password: {
      placeholder: "Enter your password",
      label: "Password",
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: "Enter your email address",
      label: "Email",
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: "Create a password",
      label: "Password",
      isRequired: true,
    },
  },
};

const Auth = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthenticator((ctx) => [ctx.user]); // top-level hook

  const isAuthPage = pathname.match(/^\/(signin|signup)$/);

  // Redirect logged-in users away from auth pages
  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/"); // change redirect as needed
    }
  }, [user, isAuthPage, router]);

  if (!isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      {isAuthPage ? (
        <div className="min-h-screen bg-[#F4EFE4] flex justify-center items-center px-4 py-8">
          <div className="w-full max-w-xl">
            <Authenticator
              initialState={pathname.includes("signup") ? "signUp" : "signIn"}
              components={components}
              formFields={formFields}
              className="border-none"
            />
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default Auth;
