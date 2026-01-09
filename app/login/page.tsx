import { LoginForm } from "@/components/features/auth/LoginForm";
import { PublicRoute } from "@/components/auth";
import Link from "next/link";

export default function LoginPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
          </div>
          <LoginForm />
          <div className="text-center text-sm">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
