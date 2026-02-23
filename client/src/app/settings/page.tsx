"use client";

import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import {
  useGetAuthUserQuery,
  useUpdateEmailMutation,
  useConfirmEmailUpdateMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
} from "@/api/authApi";

// ── SECTION WRAPPER ───────────────────────────────────────────
const SettingsSection = ({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div
    className="grid grid-cols-[64px_1fr] border-b-[1.5px] border-[#CEC4AE]"
    style={{ padding: "40px 0" }}
  >
    <div className="pt-1">
      <span
        className="text-[11px] tracking-[0.1em] text-[#3D3580]"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {number}
      </span>
    </div>
    <div>
      <h2
        className="font-light text-[#1A1612] mb-6"
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "22px",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  </div>
);

// ── INPUT ─────────────────────────────────────────────────────
const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-2 mb-4">
    <label
      className="text-[10px] tracking-[0.15em] uppercase text-[#8A7D6A]"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-[#FEFAF2] border-[1.5px] border-[#CEC4AE] px-4 py-3 text-[13px] text-[#1A1612] outline-none focus:border-[#3D3580] transition-colors"
      style={{ fontFamily: "'DM Mono', monospace" }}
    />
  </div>
);

// ── STATUS MESSAGE ────────────────────────────────────────────
const StatusMsg = ({ msg, isError }: { msg: string; isError?: boolean }) => (
  <AnimatePresence>
    {msg && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-[11px] mt-3"
        style={{
          fontFamily: "'DM Mono', monospace",
          color: isError ? "#c0392b" : "#3D3580",
        }}
      >
        {msg}
      </motion.p>
    )}
  </AnimatePresence>
);

// ── SUBMIT BUTTON ─────────────────────────────────────────────
const SubmitBtn = ({
  label,
  onClick,
  loading,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  loading?: boolean;
  danger?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`px-7 py-3 text-[10px] tracking-[0.14em] uppercase transition-colors disabled:opacity-40 cursor-pointer border-[1.5px] ${
      danger
        ? "text-[#c0392b] border-[#c0392b] bg-transparent hover:bg-[#c0392b] hover:text-white"
        : "text-[#F4EFE4] bg-[#1A1612] border-[#1A1612] hover:bg-[#3D3580] hover:border-[#3D3580]"
    }`}
    style={{ fontFamily: "'DM Mono', monospace" }}
  >
    {loading ? "Please wait..." : label}
  </button>
);

// ── SETTINGS CONTENT ──────────────────────────────────────────
const SettingsContent = () => {
  const router = useRouter();
  const { data: user, isLoading } = useGetAuthUserQuery();

  // Email state
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailStep, setEmailStep] = useState<"form" | "verify">("form");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailErr, setEmailErr] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState(false);

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteErr, setDeleteErr] = useState(false);

  const [updateEmail, { isLoading: emailLoading }] = useUpdateEmailMutation();
  const [confirmEmailUpdate, { isLoading: confirmLoading }] =
    useConfirmEmailUpdateMutation();
  const [updatePassword, { isLoading: passwordLoading }] =
    useUpdatePasswordMutation();
  const [deleteAccount, { isLoading: deleteLoading }] =
    useDeleteAccountMutation();

  // ── handlers ──
  const handleUpdateEmail = async () => {
    if (!newEmail) return;
    setEmailMsg("");
    setEmailErr(false);
    const res = await updateEmail({ newEmail });
    if ("error" in res) {
      setEmailErr(true);
      setEmailMsg((res.error as any)?.error ?? "Failed to update email.");
    } else {
      setEmailStep("verify");
      setEmailMsg("Verification code sent to your new email.");
    }
  };

  const handleConfirmEmail = async () => {
    if (!emailCode) return;
    setEmailMsg("");
    setEmailErr(false);
    const res = await confirmEmailUpdate({ code: emailCode });
    if ("error" in res) {
      setEmailErr(true);
      setEmailMsg((res.error as any)?.error ?? "Invalid code.");
    } else {
      setEmailMsg("Email updated successfully.");
      setEmailStep("form");
      setNewEmail("");
      setEmailCode("");
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) return;
    setPasswordMsg("");
    setPasswordErr(false);
    if (newPassword !== confirmPassword) {
      setPasswordErr(true);
      setPasswordMsg("New passwords don't match.");
      return;
    }
    const res = await updatePassword({ oldPassword, newPassword });
    if ("error" in res) {
      setPasswordErr(true);
      setPasswordMsg((res.error as any)?.error ?? "Failed to update password.");
    } else {
      setPasswordMsg("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      setDeleteErr(true);
      setDeleteMsg("Type DELETE to confirm.");
      return;
    }
    setDeleteMsg("");
    setDeleteErr(false);
    const res = await deleteAccount();
    if ("error" in res) {
      setDeleteErr(true);
      setDeleteMsg((res.error as any)?.error ?? "Failed to delete account.");
    } else {
      await signOut();
      router.push("/");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span
          className="text-[11px] tracking-[0.15em] uppercase text-[#8A7D6A]"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Loading...
        </span>
      </div>
    );
  }

  if (!user) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="w-full" style={{ padding: "88px 56px" }}>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="block w-7 h-[1.5px] bg-[#3D3580]" />
          <span
            className="text-[10px] tracking-[0.22em] uppercase text-[#3D3580]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Account
          </span>
        </div>
        <h1
          className="font-light text-[#1A1612]"
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(36px, 4vw, 52px)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          Settings
        </h1>
      </motion.div>

      <div className="max-w-2xl">
        {/* ── ACCOUNT INFO ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <SettingsSection number="01" title="Account info">
            <div className="flex flex-col gap-3">
              {[
                { label: "Username", value: user.username },
                { label: "Email", value: user.email ?? "—" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-[1.5px] border-[#CEC4AE] px-5 py-3 bg-[#FEFAF2]"
                >
                  <span
                    className="text-[10px] tracking-[0.15em] uppercase text-[#8A7D6A]"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-[13px] text-[#1A1612]"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <p
              className="text-[11px] text-[#8A7D6A] mt-4"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Username cannot be changed after account creation.
            </p>
          </SettingsSection>
        </motion.div>

        {/* ── UPDATE EMAIL ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <SettingsSection number="02" title="Change email">
            {emailStep === "form" ? (
              <>
                <Input
                  label="New email address"
                  type="email"
                  value={newEmail}
                  onChange={setNewEmail}
                  placeholder="new@email.com"
                />
                <SubmitBtn
                  label="Send verification code"
                  onClick={handleUpdateEmail}
                  loading={emailLoading}
                />
              </>
            ) : (
              <>
                <p
                  className="text-[12px] text-[#4A4035] mb-4"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  A verification code was sent to {newEmail}. Enter it below to
                  confirm the change.
                </p>
                <Input
                  label="Verification code"
                  value={emailCode}
                  onChange={setEmailCode}
                  placeholder="123456"
                />
                <div className="flex gap-3">
                  <SubmitBtn
                    label="Confirm change"
                    onClick={handleConfirmEmail}
                    loading={confirmLoading}
                  />
                  <SubmitBtn
                    label="Cancel"
                    onClick={() => {
                      setEmailStep("form");
                      setEmailMsg("");
                    }}
                  />
                </div>
              </>
            )}
            <StatusMsg msg={emailMsg} isError={emailErr} />
          </SettingsSection>
        </motion.div>

        {/* ── UPDATE PASSWORD ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <SettingsSection number="03" title="Change password">
            <Input
              label="Current password"
              type="password"
              value={oldPassword}
              onChange={setOldPassword}
            />
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <SubmitBtn
              label="Update password"
              onClick={handleUpdatePassword}
              loading={passwordLoading}
            />
            <StatusMsg msg={passwordMsg} isError={passwordErr} />
          </SettingsSection>
        </motion.div>

        {/* ── SIGN OUT ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <SettingsSection number="04" title="Sign out">
            <p
              className="text-[12px] leading-loose text-[#4A4035] mb-6"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              You'll be signed out of your account on this device.
            </p>
            <SubmitBtn label="Sign out" onClick={handleSignOut} />
          </SettingsSection>
        </motion.div>

        {/* ── DELETE ACCOUNT ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <SettingsSection number="05" title="Delete account">
            <p
              className="text-[12px] leading-loose text-[#4A4035] mb-6"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              This permanently deletes your account and all your data — solved
              problems, practice history, and stats. This cannot be undone.
            </p>
            <Input
              label="Type DELETE to confirm"
              value={deleteConfirm}
              onChange={setDeleteConfirm}
              placeholder="DELETE"
            />
            <SubmitBtn
              label="Delete my account"
              onClick={handleDeleteAccount}
              loading={deleteLoading}
              danger
            />
            <StatusMsg msg={deleteMsg} isError={deleteErr} />
          </SettingsSection>
        </motion.div>
      </div>
    </div>
  );
};

// ── PAGE ─────────────────────────────────────────────────────
const SettingsPage = () => (
  <Provider store={store}>
    <div
      className="w-full flex flex-col min-h-screen"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      <Header />
      <main className="flex-1 w-full border-b-[1.5px] border-[#1A1612]">
        <SettingsContent />
      </main>
      <Footer />
    </div>
  </Provider>
);

export default SettingsPage;
