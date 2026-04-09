import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import {
  PlayCircle,
  MapPin,
  CalendarDays,
  StopCircle,
  UserCheck,
  UserX,
  CheckCircle2,
  FileText,
  BookOpen,
  Users,
  Fingerprint,
  GraduationCap,
  MousePointer2,
  AlertCircle,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "../components/AuthContext";
import { Progress } from "@/components/ui/progress";
import { authFetch } from "../../utils/authFetch";

interface SessionRecord {
  id: string;
  subject: string;
  code: string;
  date: string;
  start_time: string,
  time: string;
  class_name: string;
  present: number;
  total: number;
  geo: boolean;
  students: {
    id: string;
    attendance_id: string;
    name: string;
    status: "present" | "absent";
    time: string;
  }[];
}

const navItems = [
  { title: "Sessions History", url: "/teacher", icon: FileText },
  { title: "Eligibility Reports", url: "/teacher/reports", icon: CalendarDays },
  { title: "Attendance Console", url: "/teacher/console", icon: PlayCircle },
];

const url = "https://geo-campus.onrender.com";

function TeacherDashboardPage({
  fetchSessions,
}: {
  onSubmitSession: (session: any) => void;
  fetchSessions: () => Promise<void>;
}) {
  const { toast } = useToast();
  // ... (State variables remain exactly as in your original code)
  const [sessionActive, setSessionActive] = useState(false);
  const [geoEnabled, setGeoEnabled] = useState(true);
  const [manualAttendance, setManualAttendance] = useState<
    Record<string, boolean>
  >({});
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [liveStudents, setLiveStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // ... (All original useEffects and handlers go here - keep logic identical)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (sessionActive) {
        e.preventDefault();
        e.returnValue = "Session is active!";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sessionActive]);

  useEffect(() => {
    const saved = localStorage.getItem("activeSession");

    if (saved) {
      const parsed = JSON.parse(saved);
      setSessionId(parsed.session_id);
      setSessionActive(true);
    }
  }, []);

  const handleToggleStudent = (id: string, checked: boolean) => {
    const updated = { ...manualAttendance, [id]: checked };
    setManualAttendance(updated);
  };

  const presentCount = Object.values(manualAttendance).filter(Boolean).length;
  const geoPresentCount = liveStudents.filter(
    (s) => s.status === "present",
  ).length;

  const handleSubmitGeo = async () => {
  try {
    const res = await authFetch(
      `${url}/api/attendance/end/${sessionId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res) return;

    if (!res.ok) {
      toast({
        title: "Error",
        description: "Failed to submit attendance.",
        variant: "destructive",
      });
      return;
    }

    await fetchSessions();

    setSessionActive(false);
    localStorage.removeItem("activeSession");

    toast({
      title: "Geo-Attendance submitted successfully!",
      variant: "default",
    });
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    toast({
      title: "Error",
      description: "Failed to submit attendance.",
      variant: "destructive",
    });
  }
};

  const handleSubmitManual = async () => {
    const token = localStorage.getItem("token");

    const records = allStudents.map((student) => ({
      student_id: student.regd,
      status: manualAttendance[student.regd] ? "present" : "absent",
    }));

    const res = await authFetch(
      `${url}/api/attendance/mark-manual-bulk`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          records,
        }),
      },
    );
    if (!res) return;
    if (!res.ok) {
      toast({
        title: "Error",
        description: "Failed to submit attendance",
        variant: "destructive",
      });
      return;
    }

    await fetchSessions();

    setSessionActive(false);
    localStorage.removeItem("activeSession");
    toast({
      title: "Manual Attendance submitted successfully!",
      variant: "default",
    });
  };

  const startSession = async () => {
    const token = localStorage.getItem("token");

    if (!selectedSubject || !selectedClass) {
      toast({
        title: "Missing Fields",
        description:
          "Please select both Subject and Class before starting session.",
        variant: "destructive",
      });
      return;
    }

    if (sessionActive) {
      toast({
        title: "Session Already Active",
        description: "End current session first.",
        variant: "destructive",
      });
      return;
    }

    if (geoEnabled) {
      if (!navigator.geolocation) {
        toast({
          title: "Geolocation Not Supported",
          variant: "destructive",
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await authFetch(
              `${url}/api/attendance/start`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  subject_id: selectedSubject,
                  class_id: selectedClass,
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                  radius: 100,
                  geolocation_enabled: true,
                }),
              },
            );
            if (!res) return;
            const data = await res.json();

            localStorage.setItem(
              "activeSession",
              JSON.stringify({ session_id: data.session_id }),
            );

            setSessionId(data.session_id);
            setSessionActive(true);

            toast({ title: "Geo Session Started" });
          } catch {
            toast({ title: "Failed to start session", variant: "destructive" });
          }
        },
        () => {
          toast({
            title: "Location Required",
            description: "Enable location for geo attendance.",
            variant: "destructive",
          });
        },
      );
    } else {
      try {
        const res = await authFetch(`${url}/api/attendance/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subject_id: selectedSubject,
            class_id: selectedClass,
            latitude: null,
            longitude: null,
            radius: null,
            geolocation_enabled: false,
          }),
        });
        if (!res) return;
        const data = await res.json();

        localStorage.setItem(
          "activeSession",
          JSON.stringify({ session_id: data.session_id }),
        );

        setSessionId(data.session_id);
        setSessionActive(true);

        toast({ title: "Manual Session Started" });
      } catch {
        toast({ title: "Failed to start session", variant: "destructive" });
      }
    }
  };

const endSession = async () => {
  const token = localStorage.getItem("token");

  const res = await authFetch(
    `${url}/api/attendance/end/${sessionId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res) return; 

  if (!res.ok) {
    console.log("Failed to end session");
    return;
  }

  localStorage.removeItem("activeSession");
  setSessionActive(false);
};

  useEffect(() => {
    if (!sessionId || !sessionActive) return;

    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");

      const res = await authFetch(
        `${url}/api/attendance/session/${sessionId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res) return;
      const data = await res.json();

      setLiveStudents(data);
    }, 4000);

    return () => clearInterval(interval);
  }, [sessionId, sessionActive]);

  const fetchAllStudents = async () => {
    if (!selectedClass || !selectedSubject) return;
    const token = localStorage.getItem("token");

    const res = await authFetch(
      `${url}/api/students?class=${selectedClass}&subject=${selectedSubject}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!res) return;
    const data = await res.json();
    setAllStudents(data);
  };

  useEffect(() => {
    if (!geoEnabled && selectedClass && selectedSubject) {
      fetchAllStudents();
    }
  }, [geoEnabled, selectedClass, selectedSubject]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const token = localStorage.getItem("token");

      const res = await authFetch(
        `${url}/api/teachers/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res) return;
      const data = await res.json();
      setAssignments(data);
    };
    fetchAssignments();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Attendance Console
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage live sessions and track student participation.
          </p>
        </div>

        {sessionActive && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">
              Live Session Active
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls (Dictates the row height) */}
        <Card className="lg:col-span-4 border-none shadow-md bg-card/60 ring-1 ring-white/10 overflow-hidden h-fit lg:h-auto">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-primary" />
              Session Setup
            </CardTitle>
            <CardDescription>Configure your class parameters</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Subject
                </Label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20 transition-all">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 opacity-50" />
                      <SelectValue placeholder="Select Subject" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40 backdrop-blur-xl">
                    {Array.from(
                      new Map(assignments.map((a) => [a.subject_id, a])).values(),
                    ).map((a) => (
                      <SelectItem
                        key={a.subject_id}
                        value={a.subject_id}
                        className="rounded-lg my-1"
                      >
                        {a.subject_code} - {a.subject_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Class
                </Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20 transition-all">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 opacity-50" />
                      <SelectValue placeholder="Select Class" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40 backdrop-blur-xl">
                    {Array.from(
                      new Map(assignments.map((a) => [a.class_id, a])).values(),
                    ).map((a) => (
                      <SelectItem
                        key={a.class_id}
                        value={String(a.class_id)}
                        className="rounded-lg my-1"
                      >
                        {a.class_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {geoEnabled ? (
                    <>
                      <MapPin className="h-4 w-4 text-primary" />
                      <Label className="font-bold text-sm">
                        Geo-Verification Mode
                      </Label>
                    </>
                  ) : (
                    <>
                      <MousePointer2 className="h-4 w-4 text-warning" />
                      <Label className="font-bold text-sm">Manual Mode</Label>
                    </>
                  )}
                </div>
                <Switch
                  checked={geoEnabled}
                  onCheckedChange={setGeoEnabled}
                  disabled={!selectedSubject || !selectedClass}
                />
              </div>
              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                {geoEnabled
                  ? "Radius-based verification enabled. Students must be within 100m."
                  : "Manual attendance mode. You will verify students via the checklist."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                size="lg"
                className="rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
                disabled={!selectedSubject || !selectedClass || sessionActive}
                onClick={startSession}
              >
                <PlayCircle className="w-5 h-5 mr-2" /> Start
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-rose-500/20"
                disabled={!sessionActive}
                onClick={endSession}
              >
                <StopCircle className="w-5 h-5 mr-2" /> End
              </Button>
            </div>

            <div className="flex gap-2 p-3 bg-rose-500/5 rounded-xl border border-rose-500/10">
              <AlertCircle className="h-3 w-3 text-rose-400 shrink-0" />
              <p className="text-[10px] text-rose-400 font-bold leading-tight uppercase">
                Warning: Ensure correct subject & class pairing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Attendance Feed (Molds to Left Column's height) */}
        <Card className="lg:col-span-8 border-none shadow-md bg-card/60 ring-1 ring-white/10 flex flex-col h-[600px] lg:h-auto overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-6 shrink-0 z-20 bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">
                  Attendance Feed
                </CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold tracking-wide">
                  {geoEnabled
                    ? "Geo-Verification Mode"
                    : "Manual Override Mode"}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-background/40 p-2 rounded-xl border border-border/40">
              <div className="px-3 border-r border-border/40 text-center">
                <p className="text-[9px] font-black text-emerald-500 tracking-tighter uppercase">
                  Present
                </p>
                <p className="text-lg font-black">
                  {geoEnabled ? geoPresentCount : presentCount}
                </p>
              </div>
              <div className="px-3 text-center">
                <p className="text-[9px] font-black text-rose-500 tracking-tighter uppercase">
                  Absent
                </p>
                <p className="text-lg font-black">
                  {(geoEnabled ? liveStudents.length : allStudents.length) -
                    (geoEnabled ? geoPresentCount : presentCount)}
                </p>
              </div>
            </div>
          </CardHeader>

          {/* Absolute Wrapper Pattern for Perfect Height Matching */}
          <CardContent className="p-0 flex-1 relative min-h-[400px] lg:min-h-0">
            <div className="absolute inset-0 flex flex-col">
              
              {/* Scrollable Table Area */}
              <div className="flex-1 overflow-x-auto overflow-y-auto px-7">
                <Table className="min-w-[500px] sm:min-w-full relative">
                  {/* Sticky Header to prevent columns from scrolling away vertically */}
                  <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/10 shadow-sm">
                    <TableRow className="hover:bg-transparent border-none">
                      {!geoEnabled && (
                        <TableHead className="w-12 px-6 h-10"></TableHead>
                      )}
                      <TableHead className="text-[10px] font-black uppercase tracking-widest px-6 h-10">
                        Regd No.
                      </TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest px-6 h-10">
                        Name
                      </TableHead>
                      <TableHead className="text-right text-[10px] font-black uppercase tracking-widest px-6 h-10">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(geoEnabled ? liveStudents : allStudents).map((s) => (
                      <TableRow
                        key={s.id || s.regd}
                        className="group border-border/5"
                      >
                        {!geoEnabled && (
                          <TableCell className="px-6">
                            <Checkbox
                              checked={!!manualAttendance[s.regd]}
                              onCheckedChange={(c) =>
                                handleToggleStudent(s.regd, !!c)
                              }
                              className="h-5 w-5 rounded-md border-2"
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-mono text-[11px] font-bold text-muted-foreground px-6">
                          {s.id || s.regd}
                        </TableCell>
                        <TableCell className="font-bold text-sm px-6">
                          {s.name}
                        </TableCell>
                        <TableCell className="text-right px-6">
                          <StatusBadge
                            status={
                              geoEnabled
                                ? s.status
                                : manualAttendance[s.regd]
                                  ? "present"
                                  : "absent"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Fixed Bottom Action Bar */}
              <div className="shrink-0 p-4 sm:px-6 border-t border-border/10 bg-background/50 backdrop-blur flex justify-end z-20">
                <Button
                  onClick={geoEnabled ? handleSubmitGeo : handleSubmitManual}
                  disabled={
                    sessionActive ||
                    (geoEnabled
                      ? liveStudents.length === 0
                      : allStudents.length === 0)
                  }
                  className="w-full sm:w-auto h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Finalize Attendance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SessionsPage({
  sessions,
  onUpdateSession,
}: {
  sessions: SessionRecord[];
  onUpdateSession: (updated: SessionRecord) => void;
}) {
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editAttendance, setEditAttendance] = useState<Record<string, boolean>>(
    {},
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthSessions = sessions.filter((s) => {
    const sessionDate = new Date(s.date);
    return (
      sessionDate.getMonth() === currentMonth &&
      sessionDate.getFullYear() === currentYear
    );
  });

  // --- START: PRESERVED BACKEND LOGIC ---
  const fetchSessionDetails = async (sessionId) => {
    const token = localStorage.getItem("token");

    const res = await authFetch(
      `${url}/api/attendance/session/${sessionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!res) return;
    const data = await res.json();
    console.log(data);

    // setSelectedSession((prev) => {
    //   if (!prev) return null;

    //   return {
    //     ...prev,
    //     id: data.id,
    //     class_name: data.class_name,
    //     start_time: data.start_time,
    //     students: data.students || [],
    //   };
    // });

    setSelectedSession({
  id: data.id,
  class_name: data.class_name,
  start_time: data.start_time,
  students: data.students || [],
});
  };

  const updateAttendance = async () => {
  const token = localStorage.getItem("token");

  for (const student of selectedSession.students) {
    const res = await authFetch(`${url}/api/attendance/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        attendance_id: student.attendance_id,
        status: editAttendance[student.id] ? "present" : "absent",
      }),
    });

    if (!res) return;

    if (!res.ok) {
      console.log("Failed to update attendance for student:", student.id);
    }
  }
};
  // --- END: PRESERVED BACKEND LOGIC ---

  // Stats Logic (Unchanged)
  const totalSessions = currentMonthSessions.length;
  const totalGeoSessions = currentMonthSessions.filter((s) => s.geo).length;
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const startOfWeek = getStartOfWeek(new Date());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);
  const currentWeekSessions = currentMonthSessions.filter((s) => {
    const sessionDate = new Date(s.date);
    return sessionDate >= startOfWeek && sessionDate < endOfWeek;
  }).length;
  const subjectCountMap: Record<string, number> = {};
  currentMonthSessions.forEach((s) => {
    const subjectCode = s.code;
    subjectCountMap[subjectCode] = (subjectCountMap[subjectCode] || 0) + 1;
  });
  const highestSessionSubject =
    Object.keys(subjectCountMap).length > 0
      ? Object.keys(subjectCountMap).reduce((a, b) =>
          subjectCountMap[a] > subjectCountMap[b] ? a : b,
        )
      : "N/A";
  const DetailTile = ({ label, value, highlight = "text-foreground" }) => (
    <div className="bg-muted/30 p-3 rounded-xl border border-border/40 text-center">
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tight mb-1">
        {label}
      </p>
      <p className={`text-xs font-bold truncate ${highlight}`}>{value}</p>
    </div>
  );

  const StatCard = ({ title, value, icon, variant }: any) => {
    // Map variants to specific icon-box colors
    const variantStyles: any = {
      primary: "bg-blue-50 text-blue-600 border-blue-100",
      accent: "bg-indigo-50 text-indigo-600 border-indigo-100",
      success: "bg-emerald-50 text-emerald-600 border-emerald-100",
      warning: "bg-amber-50 text-amber-600 border-amber-100",
    };

    return (
      <Card className="shadow-sm hover:shadow-md transition-all duration-300 group relative border-border/50 overflow-hidden">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div className="mb-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                {title}
              </p>
              <div>
                <p className="text-2xl font-black tracking-tighter truncate text-foreground mt-2">
                  {value}
                </p>
              </div>
            </div>
            <div
              className={`p-2 rounded-lg border transition-transform group-hover:scale-110 duration-300 ${variantStyles[variant] || "bg-muted text-muted-foreground"}`}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Modern Bento Grid Stats */}
      <div className="grid lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Logs"
          value={String(totalSessions)}
          icon={<PlayCircle className="w-4 h-4" />}
          variant="primary"
        />
        <StatCard
          title="Geo-Fenced"
          value={String(totalGeoSessions)}
          icon={<MapPin className="w-4 h-4" />}
          variant="accent"
        />
        <StatCard
          title="Recent"
          value={String(currentWeekSessions)}
          icon={<CalendarDays className="w-4 h-4" />}
          variant="success"
        />
        <StatCard
          title="Top Track"
          value={highestSessionSubject}
          icon={<BookOpen className="w-4 h-4" />}
          variant="warning"
        />
      </div>

      {/* Modern Table Card */}
      <Card className="border-none shadow-md bg-card/60 ring-1 ring-border/50 overflow-hidden">
        <CardHeader className="border-border/50 px-6 py-4 flex flex-row items-center justify-between bg-muted/20">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Session History
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="text-[10px] font-black uppercase px-6">
                    Course Details
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase px-6">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase px-6">
                    Class
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase px-6 text-center">
                    Attendance
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase px-6 text-center">
                    Modality
                  </TableHead>
                  <TableHead className="text-right pr-6 font-black uppercase text-[10px]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMonthSessions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No session history available for this month.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentMonthSessions.map((s) => (
                    <TableRow
                      key={s.id}
                      className="group hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedSession(s);
                        fetchSessionDetails(s.id);
                      }}
                    >
                      <TableCell className="px-6 py-5">
                        <div className="font-bold text-foreground">
                          {s.subject}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">
                          {s.code}
                        </div>
                      </TableCell>
                      {/* <TableCell className="px-6">
                            {(() => {
                                const startTime = s.time.split(" - ")[0]; 
                                const dateObj = new Date(startTime);

                            return (
                                  <>
                                    <div className="text-sm font-bold">
                                      {dateObj.toLocaleDateString("en-IN", {
                                          day: "numeric",
                                          month: "long",
                                      })}
                                    </div>

                                    <div className="text-xs text-muted-foreground lowercase">
                                        {dateObj.toLocaleTimeString("en-IN", {
                                              hour: "numeric",
                                              minute: "2-digit",
                                              hour12: true,
                                          })}
                                    </div>
                                   </>
                                );
                              })()}
                      </TableCell> */}
                      <TableCell className="px-6">
                            {(() => {
                                  const startTime = s?.time?.split(" - ")?.[0];

                                  if (!startTime) return "-";

                                   const dateObj = new Date(startTime);

                              return (
                            <>
                               <div className="text-sm font-bold">
                                {dateObj.toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                  })}
                              </div>

                                <div className="text-xs text-muted-foreground lowercase">
                                {dateObj.toLocaleTimeString("en-IN", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                              </div>
                            </>
                            );
                            })()}
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="text-[11px] font-semibold text-muted-foreground">
                          {s?.class_name || "NA"}
                       </div>
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <span className="font-black text-emerald-600">
                          {s.present}
                        </span>{" "}
                        <span className="text-muted-foreground text-xs">
                          / {s.total}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${s.geo ? "bg-indigo-500/10 text-indigo-500" : "bg-orange-500/10 text-orange-500"}`}
                        >
                          {s.geo ? "GeoLocation" : "Manual"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full group-hover:bg-primary group-hover:text-white transition-all"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-border/40">
            {currentMonthSessions.map((s) => (
              <div
                key={s.id}
                className="p-4 active:bg-muted transition-colors flex items-center justify-between"
                onClick={() => {
                  setSelectedSession(s);
                  fetchSessionDetails(s.id);
                }}
              >
                <div className="space-y-1">
                  <p className="font-bold text-sm leading-none">{s.subject}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                    <span>{s?.class_name || "NA"}</span>
                    <span>•</span>
                    <span>{new Date(s.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span
                      className={s.geo ? "text-indigo-500" : "text-orange-500"}
                    >
                      {s.geo ? "Geo-Fenced" : "Manual"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">
                    {s.present}/{s.total}
                  </p>
                  <p className="text-[9px] uppercase font-bold text-muted-foreground">
                    Present
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedSession}
        onOpenChange={(o) => {
          if (!o) {
            setSelectedSession(null);
            setIsEditing(false);
          }
        }}
      >
        <DialogContent className="w-[95vw] sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-card max-h-[90vh] flex flex-col">
          <div
            className={`h-1.5 w-full shrink-0 ${selectedSession?.geo ? "bg-indigo-500" : "bg-orange-500"}`}
          />

          <div className="p-5 md:p-8 space-y-4 md:space-y-6 overflow-y-auto">
            <DialogHeader className="text-left">
              <div className="hidden md:flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Session Report
                </span>
              </div>
              <DialogTitle className="text-xl md:text-2xl font-black leading-tight">
                {selectedSession?.subject} - {selectedSession?.code}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              <DetailTile
                label="Class"
                value={selectedSession?.class_name || "N/A"}
              />
              {/* <DetailTile
                label="Date"
                value={
                  selectedSession
                    ? new Date(selectedSession.date).toLocaleDateString(
                        "en-IN",
                        { day: "2-digit", month: "short" },
                      )
                    : "-"
                }
              /> */}
              <DetailTile
                label="Date"
                value={
                    selectedSession?.start_time
                    ? new Date(selectedSession.start_time).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                    })
                    : "-"
                  }
              />
              <DetailTile
                label="Time"
                value={
                  selectedSession
                    ? new Date(
                        selectedSession.time.split(" - ")[0],
                      ).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"
                }
              />
              <DetailTile
                label="Mode"
                value={selectedSession?.geo ? "Geo" : "Manual"}
                highlight={
                  selectedSession?.geo ? "text-indigo-500" : "text-orange-500"
                }
              />
            </div>
            <div className="flex items-center justify-between px-1 py-3 border-y border-border/40">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-sm font-black text-emerald-600">
                    <span className="md:inline hidden">Present</span>{" "}
                    {isEditing
                      ? Object.values(editAttendance).filter(Boolean).length
                      : selectedSession?.present}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserX className="w-3.5 h-3.5 text-destructive" />
                  <span className="text-sm font-black text-destructive">
                    <span className="md:inline hidden">Absent</span>{" "}
                    {(selectedSession?.students.length || 0) -
                      (isEditing
                        ? Object.values(editAttendance).filter(Boolean).length
                        : selectedSession?.present || 0)}
                  </span>
                </div>
              </div>
              <div className="bg-muted/50 px-3 py-1 rounded-full">
                <span className="text-xs font-black">
                  <span className="md:inline hidden">Attendance Rate</span>{" "}
                  {selectedSession
                    ? Math.round(
                        ((isEditing
                          ? Object.values(editAttendance).filter(Boolean).length
                          : selectedSession.present) /
                          selectedSession.students.length) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>

            {/* <div className="border border-border/50 rounded-2xl overflow-hidden bg-background/50">
              <div className="max-h-[30vh] md:max-h-[35vh] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0 z-10">
                    <TableRow className="hover:bg-transparent">
                      {isEditing && (
                        <TableHead className="w-10 pl-3"></TableHead>
                      )}
                      <TableHead className="text-[9px] font-black uppercase pl-4">
                        Regd No / Name
                      </TableHead>
                      <TableHead className="hidden md:table-cell text-[10px] font-black uppercase text-center">
                        Time Marked
                      </TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-right pr-8">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSession?.students?.map((st) => (
                      <TableRow key={st.id} className="border-border/40">
                        {isEditing && (
                          <TableCell className="pl-3">
                            <Checkbox
                              checked={!!editAttendance[st.id]}
                              onCheckedChange={(val) =>
                                setEditAttendance((p) => ({
                                  ...p,
                                  [st.id]: !!val,
                                }))
                              }
                            />
                          </TableCell>
                        )}
                        <TableCell className="pl-4 py-2">
                          <p className="text-[9px] font-mono text-muted-foreground">
                            {st.id}
                          </p>
                          <p className="text-sm font-bold truncate max-w-[150px]">
                            {st.name}
                          </p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center text-xs font-medium text-muted-foreground">
                          {st.time !== "-"
                            ? new Date(st.time).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <StatusBadge
                            status={
                              isEditing
                                ? editAttendance[st.id]
                                  ? "present"
                                  : "absent"
                                : st.status
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div> */}

            <div className="border border-border/50 rounded-2xl overflow-hidden bg-background/50">
  <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
    <Table>
      <TableHeader className="bg-muted/50 sticky top-0 z-10">
        <TableRow className="hover:bg-transparent border-b border-border/40">
          {isEditing && <TableHead className="w-10 pl-3"></TableHead>}
          <TableHead className="text-[9px] font-black uppercase pl-4">
            Regd No / Name
          </TableHead>
          <TableHead className="hidden md:table-cell text-[10px] font-black uppercase text-center">
            Time Marked
          </TableHead>
          <TableHead className="text-[9px] font-black uppercase text-right pr-8">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selectedSession?.students?.map((st) => (
          <TableRow key={st.id} className="border-border/40 h-[48px]"> {/* 4. Fixed height for consistency */}
            {isEditing && (
              <TableCell className="pl-3">
                <Checkbox
                  checked={!!editAttendance[st.id]}
                  onCheckedChange={(val) =>
                    setEditAttendance((p) => ({
                      ...p,
                      [st.id]: !!val,
                    }))
                  }
                />
              </TableCell>
            )}
            <TableCell className="pl-4 py-2">
              <p className="text-[9px] font-mono text-muted-foreground">
                {st.id}
              </p>
              <p className="text-sm font-bold truncate max-w-[150px]">
                {st.name}
              </p>
            </TableCell>
            <TableCell className="hidden md:table-cell text-center text-xs font-medium text-muted-foreground">
              {st.time !== "-"
                ? new Date(st.time).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </TableCell>
            <TableCell className="text-right pr-4">
              <StatusBadge
                status={
                  isEditing
                    ? editAttendance[st.id]
                      ? "present"
                      : "absent"
                    : st.status
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</div>

            <DialogFooter className="flex flex-col gap-2 pt-2 pb-1">
              {!isEditing ? (
                <Button
                  className="w-full h-11 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary"
                  onClick={() => {
                    const att = {};
                    selectedSession.students.forEach(
                      (st) => (att[st.id] = st.status === "present"),
                    );
                    setEditAttendance(att);
                    setIsEditing(true);
                  }}
                >
                  Modify Attendance
                </Button>
              ) : (
                <Button
                  className="w-full h-11 rounded-xl font-black uppercase tracking-widest text-[10px] bg-emerald-600"
                  onClick={async () => {
                    if (!selectedSession) return;

                    await updateAttendance();

                    const updatedStudents = selectedSession.students.map(
                      (st) => {
                        const status: "present" | "absent" = editAttendance[
                          st.id
                        ]
                          ? "present"
                          : "absent";

                        return {
                          ...st,
                          status,
                        };
                      },
                    );

                    const presentCount = updatedStudents.filter(
                      (s) => s.status === "present",
                    ).length;

                    const updatedSession: SessionRecord = {
                      ...selectedSession,
                      students: updatedStudents,
                      present: presentCount,
                    };

                    onUpdateSession(updatedSession);
                    setSelectedSession(updatedSession);
                    setIsEditing(false);

                    toast({
                      title: "Attendance Updated",
                      description: `Updated attendance: ${presentCount}/${updatedStudents.length} present.`,
                    });
                  }}
                >
                  <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Save Changes
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full h-10 rounded-xl font-bold text-muted-foreground text-xs bg-rose-500 text-white hover:bg-rose-400"
                onClick={() => {
                  setSelectedSession(null);
                  setIsEditing(false);
                }}
              >
                {isEditing ? "Cancel" : "Close"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReportsPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);

  // --- START: PRESERVED BACKEND LOGIC ---
  useEffect(() => {
    const fetchReport = async () => {
      if (!selectedClass || !selectedSubject) return;
      try {
        setLoading(true);
        const res = await authFetch(
          `${url}/api/attendance/teacher/eligibility?class_id=${selectedClass}&subject_id=${selectedSubject}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (!res) return;
        const data = await res.json();
        setReport(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Error fetching eligibility report:", err);
        setReport([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [selectedClass, selectedSubject]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await authFetch(
          `${url}/api/teachers/assignments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (!res) return;
        const data = await res.json();
        const rows = Array.isArray(data) ? data : [];
        setAssignments(rows);
        if (rows.length > 0) {
          const firstClass = String(rows[0].class_id);
          const firstSubject = String(rows[0].subject_id);
          setSelectedClass(firstClass);
          setSelectedSubject(firstSubject);
        }
      } catch (err) {
        console.log("Error fetching assignments:", err);
      }
    };
    fetchAssignments();
  }, []);
  // --- END: PRESERVED BACKEND LOGIC ---

  const totalStudents = report.length;
  const eligibleStudents = report.filter(
    (r: any) => Number(r.overall_percentage) >= 75,
  ).length;
  const notEligibleStudents = totalStudents - eligibleStudents;
  const avgAttendance =
    report.length > 0
      ? (
          report.reduce(
            (acc, curr: any) => acc + Number(curr.overall_percentage),
            0,
          ) / report.length
        ).toFixed(1)
      : "0";

  const StatCard = ({ title, value, subtext, icon: Icon, variant }: any) => {
    const iconVariants: any = {
      success: "bg-emerald-50 text-emerald-600 border-emerald-100",
      destructive: "bg-rose-50 text-rose-600 border-rose-100",
      accent: "bg-indigo-50 text-indigo-600 border-indigo-100",
    };

    return (
      <Card className="border border-border/50 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                {title}
              </p>
              <h3 className="text-2xl font-black tracking-tight text-foreground">
                {value}
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground/60 italic">
                {subtext}
              </p>
            </div>
            <div
              className={`p-2.5 rounded-xl border transition-transform group-hover:scale-110 duration-300 ${iconVariants[variant]}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto md:p-0 animate-in fade-in duration-700">
      {/* STATS BENTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={String(totalStudents)}
          subtext="Active Students"
          icon={Users}
          variant="accent"
        />
        <StatCard
          title="Eligible"
          value={String(eligibleStudents)}
          subtext="Above 75% Threshold"
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="Not Eligible"
          value={String(notEligibleStudents)}
          subtext="Below Requirements"
          icon={UserX}
          variant="destructive"
        />
        <StatCard
          title="Avg. Presence"
          value={`${avgAttendance}%`}
          subtext="Class performance"
          icon={Filter}
          variant="accent"
        />
      </div>

      {/* FILTER AND DATA SECTION */}
      <Card className="border-none shadow-md bg-card/60 ring-1 ring-border/50 overflow-hidden rounded-xl">
        <CardHeader className="border-b border-border/50 bg-muted/10 px-6 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-black uppercase tracking-tight">
                Student Eligibility
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                Real-time Eligibility Tracking
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-background border rounded-2xl px-3 py-1 shadow-sm">
                <span className="text-[10px] font-black uppercase text-muted-foreground">
                  Class
                </span>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-8 w-[140px] border-none focus:ring-0 bg-transparent font-bold">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {Array.from(
                      new Map(assignments.map((a) => [a.class_id, a])).values(),
                    ).map((a) => (
                      <SelectItem
                        key={a.class_id}
                        value={String(a.class_id)}
                        className="font-medium text-xs"
                      >
                        {a.class_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 bg-background border rounded-2xl px-3 py-1 shadow-sm">
                <span className="text-[10px] font-black uppercase text-muted-foreground">
                  Subject
                </span>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="h-8 w-[180px] border-none focus:ring-0 bg-transparent font-bold">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {Array.from(
                      new Map(
                        assignments.map((a) => [a.subject_id, a]),
                      ).values(),
                    ).map((a) => (
                      <SelectItem
                        key={a.subject_id}
                        value={String(a.subject_id)}
                        className="font-medium text-xs"
                      >
                        {a.subject_code} - {a.subject_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest px-6 h-12">
                    Student Profile
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest px-6 text-center">
                    Session Stats
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest px-6">
                    Attendance Metric
                  </TableHead>
                  <TableHead className="text-right pr-10 text-[10px] font-black uppercase tracking-widest">
                    Decision
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-20 animate-pulse font-bold text-muted-foreground"
                    >
                      Synchronizing Records...
                    </TableCell>
                  </TableRow>
                ) : report.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-20 font-bold text-muted-foreground"
                    >
                      No data matches current filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  report.map((r: any) => {
                    const isEligible = Number(r.overall_percentage) >= 75;
                    return (
                      <TableRow
                        key={r.student_id}
                        className="group hover:bg-primary/[0.02] transition-colors border-border/40"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-bold text-sm leading-none mb-1">
                                {r.student_name}
                              </p>
                              <p className="text-[10px] font-mono text-muted-foreground uppercase">
                                {r.student_id}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 text-center">
                          <div className="inline-flex items-center bg-muted/50 rounded-lg px-3 py-1 gap-4">
                            <div className="text-center">
                              <p className="text-[9px] font-black uppercase text-muted-foreground leading-none">
                                Pres
                              </p>
                              <p className="text-xs font-bold">
                                {Number(r.total_present)}
                              </p>
                            </div>
                            <div className="w-px h-6 bg-border" />
                            <div className="text-center">
                              <p className="text-[9px] font-black uppercase text-muted-foreground leading-none">
                                Total
                              </p>
                              <p className="text-xs font-bold">
                                {Number(r.total_conducted)}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 min-w-[200px]">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-black uppercase">
                              <span
                                className={
                                  isEligible
                                    ? "text-emerald-600"
                                    : "text-rose-600"
                                }
                              >
                                {r.overall_percentage}%
                              </span>
                              <span className="text-muted-foreground italic">
                                Target: 75%
                              </span>
                            </div>
                            <Progress
                              value={Number(r.overall_percentage)}
                              className={`h-1.5 rounded-full bg-muted ${isEligible ? "[&>div]:bg-emerald-500" : "[&>div]:bg-rose-500"}`}
                            />
                          </div>
                        </TableCell>

                        <TableCell className="md:text-right pr-6 text-left">
                          <StatusBadge
                            status={
                              Number(r.overall_percentage) >= 75
                                ? "eligible"
                                : "not-eligible"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const TeacherDashboard = () => {
  const location = useLocation();
  const path = location.pathname;
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const { user } = useAuth();

  const handleSubmitSession = (session: SessionRecord) => {
    setSessions((prev) => [session, ...prev]);
  };

  const handleUpdateSession = (updated: SessionRecord) => {
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const fetchSessions = async () => {
    const token = localStorage.getItem("token");

    const res = await authFetch(`${url}/api/attendance/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res) return;
    const data = await res.json();

    const formatted = data.map((s) => ({
      id: s.id,
      subject: s.subject,
      class_name: s.class_name,
      code: s.code,
      date: s.date,
      time: `${s.start_time} - ${s.end_time || ""}`,
      present: Number(s.present),
      total: Number(s.total),
      geo: s.geo,
      students: [],
    }));

    setSessions(formatted);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  let content;
  if (path === "/teacher/console")
    content = (
      <TeacherDashboardPage
        onSubmitSession={handleSubmitSession}
        fetchSessions={fetchSessions}
      />
    );
  else if (path === "/teacher/reports") content = <ReportsPage />;
  else
    content = (
      <SessionsPage sessions={sessions} onUpdateSession={handleUpdateSession} />
    );

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      subtitle={`${user?.name || "Teacher"}`}
      navItems={navItems}
      role="Teacher"
    >
      {content}
    </DashboardLayout>
  );
};

export default TeacherDashboard;
