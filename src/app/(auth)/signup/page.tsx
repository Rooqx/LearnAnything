"use client";

import { ChevronRight, Mail, Lock } from "lucide-react";

import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import { useAuthFormStore } from "@/src/lib/stores/auth_store";
import { useRegister } from "@/src/hooks/use_auth_hook";
import { RegisterInput, RegisterSchema } from "@/src/lib/zod_schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SideDiv from "@/src/components/auth_components/left-section";
import GoogleButton from "@/src/components/auth_components/google-button";

export default function SignupPage() {
  // const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending, data: serverResponse } = useRegister();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (values: RegisterInput) => {
    console.log("sumbit btn clicked");
    mutate(values);
  };

  console.log("serverResponse:", serverResponse);
  //console.log("form:", form);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* Left Section - Features Sidebar */}
      <SideDiv />

      {/* Right Section - Form */}
      <div className="flex-1 bg-white flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Create Your Account
          </h2>
          <p className="text-gray-600 mb-8">
            The future of examination starts here.
          </p>

          {/* Google SSO Button */}
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

          {/* Form */}
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <Input
              type="email"
              placeholder="Email address"
              labelFor="email"
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
                labelFor="password"
                {...form.register("password")}
                error={form.formState.errors.password?.message}
                passwordVisibility={true}
                icon
                IconChildren={<Lock className="w-4 h-4" color="#71717b" />}
                required
              />
            </div>
            <Input
              type={"password"}
              placeholder="Confirm Password"
              labelFor="confirmPassword"
              {...form.register("confirmPassword")}
              error={form.formState.errors.confirmPassword?.message}
              passwordVisibility={true}
              icon
              IconChildren={<Lock className="w-4 h-4" color="#71717b" />}
            />
            <Button
              className="mt-5 cursor-pointer w-full"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Creating account..." : "Create account"}
              {!isPending && <ChevronRight className="w-5 h-5 ml-2" />}
            </Button>

            {/* <Button asChild className="mt-5">
              <Link href="/verify-email">
                Create account
                <ChevronRight className="w-5 h-5" />
              </Link>
          </Button> */}
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/signin"
              className="font-medium text-gray-900 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
