"use client";

import { AuthProvider } from "@/context/AuthContext";
import React from "react";

export default function Provider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
