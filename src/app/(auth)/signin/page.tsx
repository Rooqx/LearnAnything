// app/signin/page.tsx
"use client";

import { ChevronRight, Mail, Lock } from "lucide-react";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import { useAuthFormStore } from "@/src/lib/stores/auth_store";
import SideDiv from "@/src/components/auth_components/left-section";
import GoogleButton from "@/src/components/auth_components/google-button";
import { useForm } from "react-hook-form";
import { LoginInput, LoginSchema } from "@/src/lib/zod_schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/src/hooks/use_auth_hook";

export default function SignInPage() {
  /*/ const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  */
  const { mutate, isPending, data } = useLogin(); // the mutation function
  const { error, setError } = useAuthFormStore();
  console.log("error:", error);

  // This is the form hook from RHF
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema), // this is the solve from zod_schemas file and it important to avoid injections
    defaultValues: { email: "", password: "" },
  });

  //The supmit function
  const onSubmit = (values: LoginInput) => {
    setError(""); // Clearing the errors it the store so we can update to a new one and if ther is ntn there would be no error
    mutate(values);
  };

  //console.log("data:", data);
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* Left: Features */}
      <SideDiv />
      {/* Right: Sign In Form */}
      <div className="flex-1 bg-white flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in to your XAM account to continue.
          </p>

          {/* Google Button */}
          <GoogleButton />

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">or</span>
            </div>
          </div>

          {/* Error */}
          {error !== "" && (
            <div className="mb-6 p-4 bg-red-50 flex justify-center items-center border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Input
              type="email"
              placeholder="Email address"
              {...form.register("email")}
              error={form.formState.errors.email?.message}
              icon
              required
              IconChildren={<Mail className="w-4.5 h-4.5" color="#71717b" />}
            />

            <div className="relative">
              <Input
                type={"password"}
                placeholder="Password"
                {...form.register("password")}
                passwordVisibility={true}
                icon
                IconChildren={<Lock className="w-4 h-4" color="#71717b" />}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-gray-900 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" disabled={isPending} className="mt-8">
              {isPending ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-gray-900 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
