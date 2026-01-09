import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { PublicRoute } from "@/components/auth";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">Sign up for a new account</p>
          </div>
          <RegisterForm />
          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
