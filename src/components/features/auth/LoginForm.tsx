"use client";

import { useState, FormEvent } from "react";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { Button } from "@/components/common";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(login({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" isLoading={loading} className="w-full">
        Login
      </Button>
    </form>
  );
}
