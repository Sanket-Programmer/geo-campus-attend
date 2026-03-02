import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Shield, User, BookOpen, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const roles = [
  { id: "student", label: "Student", icon: User, path: "/student" },
  { id: "teacher", label: "Teacher", icon: BookOpen, path: "/teacher" },
  { id: "exam-controller", label: "Exam Controller", icon: Shield, path: "/exam-controller" },
  { id: "academic", label: "Academic Section", icon: Building2, path: "/academic" },
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const role = roles.find((r) => r.id === selectedRole);
    if (role) navigate(role.path);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-primary-foreground/20"
              style={{
                width: `${200 + i * 120}px`,
                height: `${200 + i * 120}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
        <div className="relative text-center z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-8">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary-foreground mb-4">
            University Attendance
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-md">
            Smart geo-location based attendance management for modern universities
          </p>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md animate-slide-in">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-serif font-bold text-foreground">University Attendance</h1>
          </div>

          <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to your dashboard</p>

          {/* Role selection */}
          <div className="grid grid-cols-2 gap-2 mb-8">
            {roles.map((role) => {
              const Icon = role.icon;
              const active = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    active
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-card text-muted-foreground hover:border-accent/40"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {role.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
