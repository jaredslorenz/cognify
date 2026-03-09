"use client";

import React, { useEffect } from "react";
import { Authenticator, View, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter, usePathname } from "next/navigation";

// Custom Authenticator components
const components = {
  Header() {
    return (
      <View style={{ marginTop: "16px", marginBottom: "28px" }}>
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "28px",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "#1A1612",
          }}
        >
          cogni<em style={{ fontStyle: "italic", color: "#3D3580" }}>fy</em>
        </div>
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#8A7D6A",
            marginTop: "8px",
          }}
        >
          Sign in to continue
        </p>
      </View>
    );
  },

  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator();
      return (
        <View style={{ textAlign: "center", marginTop: "8px" }}>
          <p style={{ color: "#1A1612", fontSize: "14px" }}>
            Don&apos;t have an account?{" "}
            <button
              onClick={toSignUp}
              style={{
                color: "#3D3580",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textDecoration: "underline",
              }}
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
        <View style={{ textAlign: "center", marginTop: "8px" }}>
          <p style={{ color: "#1A1612", fontSize: "14px" }}>
            Already have an account?{" "}
            <button
              onClick={toSignIn}
              style={{
                color: "#3D3580",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textDecoration: "underline",
              }}
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
  const { user } = useAuthenticator((ctx) => [ctx.user]);

  const isAuthPage = pathname.match(/^\/(signin|signup)$/);

  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, isAuthPage, router]);

  if (!isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F4EFE4] flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-xl">
        <Authenticator
          initialState={pathname.includes("signup") ? "signUp" : "signIn"}
          components={components}
          formFields={formFields}
          className="border-none"
        />

        {/* Continue without account */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => router.push("/")}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#8A7D6A",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            Continue without an account →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
