import { LineChart, Target, Zap } from "lucide-react";
import FeatureCard from "../ui/FeatureCard";

export default function SideDiv() {
  return (
    <div
      className="hidden lg:flex lg:w-5/12 xl:w-1/2 text-white flex-col justify-center px-12 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/images/signup-bg.png')`,
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-md">
        <h1 className="text-4xl font-bold mb-12">Welcome to XAM</h1>

        <div className="space-y-6">
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-white" />}
            title="Lightning Fast Examinations"
            description="Create hundreds of questions in minutes with AI-powered automation"
          />
          <FeatureCard
            icon={<Target className="w-6 h-6 text-white" />}
            title="Smart Proctoring"
            description="AI-driven integrity monitoring with human review for fair, flexible exams"
          />
          <FeatureCard
            icon={<LineChart className="w-6 h-6 text-white" />}
            title="Track Your Progress"
            description="Monitor examinations all in one dashboard"
          />
        </div>
      </div>
    </div>
  );
}
