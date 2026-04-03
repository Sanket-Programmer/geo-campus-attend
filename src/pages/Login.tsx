import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, Shield, User, BookOpen, Building2, 
  Eye, EyeOff, Lock, Mail, ArrowRight, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthContext";

const roles = [
  { id: "student", label: "Student", icon: User, path: "/student" },
  { id: "teacher", label: "Teacher", icon: BookOpen, path: "/teacher" },
  { id: "exam_controller", label: "Exam Controller", icon: Shield, path: "/exam-controller" },
  { id: "academic_section", label: "Academic", icon: Building2, path: "/academic" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(email, password);
      const role = roles.find(
        (r) => r.id.toLowerCase() === data.role.toLowerCase(),
      );

      if (role) {
        navigate(role.path);
      } else {
        setError("Invalid role configuration");
      }
    } catch (error) {
      setError(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-0 sm:p-6 font-sans">
      <div className="w-full max-w-5xl bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-screen sm:min-h-[750px]">
        <div className="w-full md:w-[42%] bg-primary p-8 md:p-12 text-primary-foreground flex flex-col relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="bg-white p-2.5 rounded-2xl inline-block mb-6 shadow-xl">
              <img src="../image.png" alt="Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
              SAMS <br className="hidden md:block" />
              <span className="text-primary-foreground/60 font-light">Attendance</span>
            </h1>
            <p className="hidden md:block mt-4 text-primary-foreground/60 text-sm md:text-base font-medium max-w-xs">
                Secure geo-location attendance tracking for the university ecosystem.
              </p>
          </div>
          <div className="relative z-10 mt-6 md:mt-auto hidden md:block">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/50 mb-4">
              Secure Access For
            </p>
            
            <div className="flex md:grid md:grid-cols-2 gap-2 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
              {roles.map((role) => (
                <div 
                  key={role.id} 
                  className="flex items-center gap-3 px-4 py-3 md:p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md shrink-0 md:shrink"
                >
                  <role.icon className="w-4 h-4 text-primary-foreground/80" />
                  <span className="text-xs md:text-sm font-semibold whitespace-nowrap">{role.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Sign In</h2>
              <p className="text-slate-500 font-medium">Enter your details to access the portal.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="id@outr.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all rounded-2xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-slate-700 font-bold text-xs uppercase">Password</Label>
                  <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all rounded-2xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <Shield className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl text-base font-bold shadow-2xl shadow-primary/30 hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Continue to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-slate-400 text-xs">
                Need help? <span className="text-primary font-bold cursor-pointer hover:underline">Support Center</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;