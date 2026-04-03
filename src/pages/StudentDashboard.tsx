import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import {
  BarChart3,
  BookOpen,
  MapPin,
  Clock,
  CheckCircle2,
  CalendarDays,
  AlertCircle,
  Search,
  History,
  GraduationCap,
  MapPinned,
  User,
  Navigation,
  ShieldCheck,
  LayoutDashboard,
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
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "../components/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { authFetch } from "../../utils/authFetch";

const navItems = [
  { title: "Dashboard", url: "/student", icon: LayoutDashboard },
  {
    title: "Attendance History",
    url: "/student/attendance",
    icon: CalendarDays,
  },
  { title: "Mark Attendance", url: "/student/mark", icon: MapPin },
];

function DashboardPage() {
  // --- Backend State (Kept Same) ---
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState<"H1" | "H2">("H1");

  useEffect(() => {
    const fetchSubjectWiseAttendance = async () => {
      try {
        setLoading(true);
        const res = await authFetch(
          "http://localhost:5000/api/attendance/student/subject-wise",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (!res) return;
        const data = await res.json();
        setSubjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error:", err);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjectWiseAttendance();
  }, []);

  useEffect(() => {
    const fetchMonthlyAttendance = async () => {
      try {
        setMonthlyLoading(true);
        const res = await authFetch(
          "http://localhost:5000/api/attendance/student/monthly",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (!res) return;
        const data = await res.json();
        setMonthlyData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error:", err);
        setMonthlyData([]);
      } finally {
        setMonthlyLoading(false);
      }
    };
    fetchMonthlyAttendance();
  }, []);

  const firstHalfMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
  ];
  const secondHalfMonths = [
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const filteredMonthlyData = useMemo(() => {
    return monthlyData.filter((m: any) =>
      activePeriod === "H1"
        ? firstHalfMonths.includes(m.month)
        : secondHalfMonths.includes(m.month),
    );
  }, [monthlyData, activePeriod]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 border border-border/50 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {label}
          </p>
          <p className="text-sm flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="font-semibold">Attendance:</span>
            <span
              className={
                payload[0].value >= 75 ? "text-emerald-500" : "text-rose-500"
              }
            >
              {payload[0].value}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });

  const below75Count = subjects.filter(
    (s: any) => Number(s.attendance_percentage) < 75,
  ).length;

  const validSubjects = subjects.filter((s) => Number(s.total_classes) > 0);

  const bestSubject =
    validSubjects.length > 0
      ? validSubjects.reduce((best, curr) =>
          Number(curr.attendance_percentage) >
          Number(best.attendance_percentage)
            ? curr
            : best,
        )
      : null;

  const validMonths = monthlyData.filter((m) => Number(m.total_classes) > 0);

  const bestMonth =
    validMonths.length > 0
      ? validMonths.reduce((best, curr) =>
          Number(curr.percentage) > Number(best.percentage) ? curr : best,
        )
      : null;

  const currentMonthData = monthlyData.find(
    (m: any) => m.month.toLowerCase() === currentMonthName.toLowerCase(),
  );

  const currentMonthAttendance = currentMonthData
    ? Number(currentMonthData.percentage)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="This Month"
          value={`${currentMonthAttendance}%`}
          subtitle={currentMonthName}
          icon={
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <CalendarDays className="w-5 h-5 text-emerald-500" />
            </div>
          }
        />

        <StatCard
          title="At Risk Subjects"
          value={String(below75Count)}
          subtitle={`out of ${subjects.length}`}
          icon={
            <div className="p-2 bg-rose-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-rose-500" />
            </div>
          }
        />

        <StatCard
          title="Best Subject"
          value={
            bestSubject && Number(bestSubject.total_classes) > 0
              ? bestSubject.subject_code
              : "NaN"
          }
          subtitle={
            bestSubject && Number(bestSubject.total_classes) > 0
              ? `${bestSubject.attendance_percentage}%`
              : "No attendance taken"
          }
          icon={
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-indigo-500" />
            </div>
          }
        />

        <StatCard
          title="Best Month"
          value={
            bestMonth && Number(bestMonth.total_classes) > 0
              ? bestMonth.month
              : "NaN"
          }
          subtitle={
            bestMonth && Number(bestMonth.total_classes) > 0
              ? `${bestMonth.percentage}%`
              : "No attendance taken"
          }
          icon={
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        <div className="xl:col-span-1 flex flex-col gap-6">
          <Card className="flex flex-col flex-1 shadow-md border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold tracking-tight">
                  Subject Analysis
                </CardTitle>
                <BookOpen className="w-5 h-5 text-muted-foreground/50" />
              </div>
              <CardDescription>Individual course percentage</CardDescription>
            </CardHeader>

            <CardContent className="pt-6 flex-1">
              <div className="space-y-6">
                {loading ? (
                  <div className="py-10 text-center text-sm text-muted-foreground animate-pulse">
                    Fetching subjects...
                  </div>
                ) : (
                  subjects.map((s: any) => {
                    const perc = Number(s.attendance_percentage);
                    const isSafe = perc >= 75;
                    return (
                      <div key={s.subject_id} className="group space-y-2">
                        <div className="flex justify-between items-end">
                          <div className="space-y-0.5">
                            <p className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-1">
                              {s.subject_name}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                              {s.subject_code} • {s.attended_classes}/
                              {s.total_classes} Classes
                            </p>
                          </div>
                          <span
                            className={`text-sm font-black ${isSafe ? "text-emerald-500" : "text-rose-500"}`}
                          >
                            {perc}%
                          </span>
                        </div>
                        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden border border-border/20">
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${isSafe ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-rose-500"}`}
                            style={{ width: `${perc}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>

            <div className="p-4 bg-muted/20 border-t border-border/20 mt-auto">
              <p className="text-[10px] text-center text-muted-foreground italic">
                * For any discrepancy contact to your concerned subject teacher.
              </p>
            </div>
          </Card>

          <Card className="shadow-md border-border/50 bg-card/60">
            <CardHeader className="pb-3 border-b border-border/10">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <CardTitle className="text-base font-bold">
                  Marks Breakdown
                </CardTitle>
              </div>
              <CardDescription>Attendance mark allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
                {[
                  {
                    range: "96% - 100%",
                    marks: "5 Marks",
                    color: "text-emerald-600 bg-emerald-500/10",
                  },
                  {
                    range: "90% - 95%",
                    marks: "4 Marks",
                    color: "text-emerald-500 bg-emerald-500/5",
                  },
                  {
                    range: "85% - 89%",
                    marks: "3 Marks",
                    color: "text-blue-500 bg-blue-500/5",
                  },
                  {
                    range: "80% - 84%",
                    marks: "2 Marks",
                    color: "text-indigo-500 bg-indigo-500/5",
                  },
                  {
                    range: "75% - 79%",
                    marks: "1 Mark",
                    color: "text-orange-500 bg-orange-500/5",
                  },
                  {
                    range: "< 75%",
                    marks: "0 Marks",
                    color: "text-rose-500 bg-rose-500/10",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg border border-transparent hover:border-border/40 hover:bg-muted/30 transition-all"
                  >
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {item.range}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.color}`}
                    >
                      {item.marks}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2 flex flex-col gap-6">
          <Card className="flex-1 shadow-md border-border/50 bg-card/60">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
              <div>
                <CardTitle className="text-lg font-bold">
                  Attendance Analytics
                </CardTitle>
                <CardDescription>
                  Viewing {activePeriod === "H1" ? "Jan - Jun" : "Jul - Dec"}
                </CardDescription>
              </div>
              <div className="flex p-1 bg-muted/50 rounded-xl border border-border/50 self-start">
                <button
                  onClick={() => setActivePeriod("H1")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activePeriod === "H1" ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Jan - Jun
                </button>
                <button
                  onClick={() => setActivePeriod("H2")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activePeriod === "H2" ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Jul - Dec
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full mt-6">
                {monthlyLoading ? (
                  <div className="h-full flex items-center justify-center animate-pulse text-muted-foreground">
                    Loading chart...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredMonthlyData}
                      margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
                      barGap={8}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--muted-foreground)/0.1)"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-30}
                        height={40}
                        tick={{
                          fontSize: 11,
                          fontWeight: 500,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        dy={10}
                        dx={-5}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11,
                          fontWeight: 600,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                          fill: "hsl(var(--muted-foreground)/0.05)",
                          radius: 4,
                        }}
                      />
                      <ReferenceLine
                        y={75}
                        stroke="hsl(var(--destructive))"
                        strokeWidth={1.5}
                        strokeDasharray="6 6"
                      />
                      <Bar
                        dataKey="percentage"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]} 
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-border/50 bg-card/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 font-bold text-foreground">
                    Month
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Present
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Absent
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Total
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMonthlyData.length > 0 ? (
                  filteredMonthlyData.map((m: any) => (
                    <TableRow key={m.month} className="border-border/20">
                      <TableCell className="font-semibold pl-6">
                        {m.month}
                      </TableCell>
                      <TableCell className="text-emerald-600 font-medium">
                        {m.present}
                      </TableCell>
                      <TableCell className="text-rose-500 font-medium">
                        {m.absent}
                      </TableCell>
                      <TableCell className="font-medium text-muted-foreground">
                        {m.total_classes}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-black ${Number(m.percentage) >= 75 ? "text-emerald-500" : "text-rose-500"}`}
                        >
                          {m.percentage}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground italic"
                    >
                      No records for this period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AttendancePage() {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth() + 1),
  );
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear()),
  );
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await authFetch(
          `http://localhost:5000/api/attendance/student/history?subject=${selectedSubject}&month=${selectedMonth}&year=${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (!res) return;
        const data = await res.json();
        setAttendanceHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [selectedSubject, selectedMonth, selectedYear]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await authFetch("http://localhost:5000/api/students/subjects", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res) return;
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubjects();
  }, []);

  const totalPresent = attendanceHistory.filter(
    (a: any) => a.status === "present",
  ).length;
  const totalAbsent = attendanceHistory.filter(
    (a: any) => a.status === "absent",
  ).length;
  const totalClasses = totalPresent + totalAbsent;
  const totalPercentage =
    totalClasses === 0 ? 0 : ((totalPresent / totalClasses) * 100).toFixed(1);

  const calculateStreak = () => {
    if (!Array.isArray(attendanceHistory) || attendanceHistory.length === 0)
      return 0;
    const sorted = [...attendanceHistory].sort(
      (a: any, b: any) =>
        new Date(b.marked_time).getTime() - new Date(a.marked_time).getTime(),
    );
    let streak = 0;
    let lastDate: string | null = null;
    for (let record of sorted) {
      if (record.status !== "present") continue;
      const dateStr = new Date(record.marked_time).toDateString();
      if (lastDate === dateStr) continue;
      if (!lastDate) {
        streak++;
        lastDate = dateStr;
        continue;
      }
      const prev = new Date(lastDate);
      const current = new Date(dateStr);
      const diffDays = Math.floor(
        (prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays === 1) {
        streak++;
        lastDate = dateStr;
      } else break;
    }
    return streak;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg. Attendance"
          value={`${totalPercentage}%`}
          icon={
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
            </div>
          }
        />
        <StatCard
          title="Present"
          value={String(totalPresent)}
          subtitle={`Out of ${totalClasses}`}
          icon={
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
          }
        />
        <StatCard
          title="Absent"
          value={String(totalAbsent)}
          subtitle="Classes missed"
          icon={
            <div className="p-2 bg-rose-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-rose-500" />
            </div>
          }
        />
        <StatCard
          title="Attendance Streak"
          value={`${calculateStreak()}`}
          subtitle="Consecutive days present"
          icon={
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <CalendarDays className="w-5 h-5 text-amber-500" />
            </div>
          }
        />
      </div>

      <Card className="shadow-md border-border/50 bg-card/60 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/10 bg-muted/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                Attendance Log
              </CardTitle>
              <CardDescription className="text-[11px] uppercase tracking-tighter font-semibold opacity-70">
                Interactive History Management
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow className="hover:bg-transparent border-b border-border/40">
                <TableHead className="pl-6 py-4 min-w-[180px]">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black uppercase text-muted-foreground ml-1">
                      Period
                    </span>
                    <Select
                      value={selectedMonth}
                      onValueChange={setSelectedMonth}
                    >
                      <SelectTrigger className="h-8 border-none bg-background/40 hover:bg-background/80 transition-all text-xs font-bold shadow-none focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ].map((m, i) => (
                          <SelectItem
                            key={i}
                            value={String(i + 1)}
                            className="text-xs"
                          >
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>

                <TableHead className="py-4 min-w-[250px]">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black uppercase text-muted-foreground ml-1">
                      Subject Selection
                    </span>
                    <Select
                      value={selectedSubject}
                      onValueChange={setSelectedSubject}
                    >
                      <SelectTrigger className="h-8 border-none bg-background/40 hover:bg-background/80 transition-all text-xs font-bold shadow-none focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs">
                          All Courses
                        </SelectItem>
                        {subjects.map((sub: any) => (
                          <SelectItem
                            key={sub.subject_id}
                            value={sub.subject_code}
                            className="text-xs"
                          >
                            {sub.subject_code} - {sub.subject_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>

                <TableHead className="py-4 font-black text-[10px] uppercase text-muted-foreground">
                  <div className="h-8 flex items-center">Method</div>
                </TableHead>
                <TableHead className="pr-6 py-4 font-black text-[10px] uppercase text-right text-muted-foreground">
                  <div className="h-8 flex items-center">Status</div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-60 text-center">
                    <div className="flex flex-col items-center gap-2 animate-pulse">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
                        Synchronizing...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : attendanceHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-60 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <Search className="w-10 h-10 mb-3" />
                      <p className="text-sm font-bold">No Records Found</p>
                      <p className="text-[11px]">
                        Try adjusting your header filters
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                attendanceHistory.map((a: any, i) => {
                  const dateObj = new Date(a.marked_time);
                  return (
                    <TableRow
                      key={i}
                      className="border-border/10 group hover:bg-primary/[0.02] transition-colors"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-foreground">
                            {dateObj.toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {dateObj.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">
                            {a.subject_name}
                          </span>
                          <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
                            {a.subject_code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-muted border border-border/50 text-muted-foreground shadow-sm">
                          {a.method}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center gap-3">
                          <StatusBadge status={a.status} />
                          {a.edited && (
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-3 bg-muted/10 border-t border-border/10 flex justify-between items-center px-6">
          <span className="text-[10px] text-muted-foreground font-medium italic">
            * Filters applied automatically on selection
          </span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
            Total Records: {attendanceHistory.length}
          </span>
        </div>
      </Card>
    </div>
  );
}

function MarkAttendancePage() {
  const { toast } = useToast();
  const [locationVerified, setLocationVerified] = useState(false);
  const [marked, setMarked] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [distance, setDistance] = useState(null);
  const [coords, setCoords] = useState(null);
  const [alreadyMarked, setAlreadyMarked] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem("token");
      const res = await authFetch("http://localhost:5000/api/attendance/active", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res) return;
      const data = await res.json();
      if (data && data.geolocation_enabled) {
        setActiveSession(data);
      } else {
        setActiveSession(null);
      }
    };
    fetchSession();
  }, []);

  const checkAlreadyMarked = async (sessionId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/attendance/status/${sessionId}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    const data = await res.json();
    if (data.marked) {
      setAlreadyMarked(true);
      setMarked(true);
    }
  };

  useEffect(() => {
    if (activeSession) {
      checkAlreadyMarked(activeSession.session_id);
    }
  }, [activeSession]);

  const handleVerifyLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", variant: "destructive" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            "http://localhost:5000/api/attendance/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                session_id: activeSession.session_id,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              }),
            },
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);

          setLocationVerified(true);
          setDistance(data.distance);
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });

          toast({
            title: "Location Verified",
            description: "You are eligible for attendance",
          });
        } catch (err) {
          toast({
            title: "Verification Failed",
            description: err.message,
            variant: "destructive",
          });
        }
      },
      () =>
        toast({
          title: "Location Permission Required",
          variant: "destructive",
        }),
    );
  };

  const handleMarkAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ session_id: activeSession.session_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMarked(true);
      setAlreadyMarked(true);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-border/50 bg-card/60 shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <MapPinned className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">
                Geo-Attendance
              </CardTitle>
              <CardDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
                Location-based Attendance Marking
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {!activeSession ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/40 rounded-2xl bg-muted/5">
              <AlertCircle className="w-10 h-10 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground font-semibold text-sm">
                No active session found
              </p>
              <p className="text-[11px] text-muted-foreground/60">
                Wait for your instructor to start the session.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/20 flex items-start gap-3">
                <BookOpen className="w-4 h-4 text-primary mt-1" />
                <div>
                  <p className="text-[10px] uppercase font-black text-muted-foreground opacity-60">
                    Subject
                  </p>
                  <p className="text-sm font-bold">
                    {activeSession.subject_code}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {activeSession.subject_name}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/20 flex items-start gap-3">
                <User className="w-4 h-4 text-primary mt-1" />
                <div>
                  <p className="text-[10px] uppercase font-black text-muted-foreground opacity-60">
                    Instructor
                  </p>
                  <p className="text-sm font-bold">
                    {activeSession.teacher_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    In {activeSession.class_name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSession && (
            <>
              <div
                className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-500 p-8 text-center ${
                  locationVerified
                    ? "border-emerald-500/20 bg-emerald-500/5 shadow-inner"
                    : "border-primary/20 bg-primary/5"
                }`}
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 ${
                    locationVerified ? "bg-emerald-500" : "bg-primary"
                  }`}
                />

                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-500 ${
                    locationVerified
                      ? "bg-emerald-500/20 scale-110"
                      : "bg-primary/20"
                  }`}
                >
                  <Navigation
                    className={`w-10 h-10 ${locationVerified ? "text-emerald-500" : "text-primary"} ${!locationVerified && "animate-pulse"}`}
                  />
                </div>

                <h3
                  className={`text-lg font-bold mb-1 ${locationVerified ? "text-emerald-600" : "text-foreground"}`}
                >
                  {locationVerified
                    ? "Location Confirmed"
                    : "Identity Check Required"}
                </h3>
                <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                  {locationVerified
                    ? "Verification successful. You are currently within the allowed classroom perimeter."
                    : "Please enable high-accuracy location to confirm your presence in the classroom."}
                </p>

                {locationVerified && (
                  <div className="mt-6 pt-4 border-t border-emerald-500/10 flex justify-center gap-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-emerald-600/60">
                        Distance
                      </p>
                      <p className="text-sm font-black">
                        {distance?.toFixed(1)}m
                      </p>
                    </div>
                    <div className="w-px h-8 bg-emerald-500/10" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-emerald-600/60">
                        Lat/Long
                      </p>
                      <p className="text-sm font-black tracking-tighter">
                        {coords?.lat.toFixed(3)}, {coords?.lng.toFixed(3)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                {!locationVerified ? (
                  <Button
                    className="w-full h-12 text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl"
                    onClick={handleVerifyLocation}
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" /> Verify My Position
                  </Button>
                ) : !marked ? (
                  <Button
                    className="w-full h-12 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 rounded-xl animate-bounce-subtle"
                    onClick={handleMarkAttendance}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Submit Attendance
                    Now
                  </Button>
                ) : (
                  <div className="group relative overflow-hidden rounded-xl border-2 border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-emerald-500 rounded-full">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-emerald-700 uppercase tracking-widest text-xs">
                          Submission Confirmed
                        </p>
                        <p className="text-[11px] text-emerald-600/80 font-medium mt-1 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          Recorded at{" "}
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>

        <div className="bg-muted/10 p-4 text-center border-t border-border/10">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Encrypted Session • ID:{" "}
            {activeSession?.session_id || "N/A"}
          </p>
        </div>
      </Card>
    </div>
  );
}

const StudentDashboard = () => {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();

  let content;
  if (path === "/student/attendance") content = <AttendancePage />;
  else if (path === "/student/mark") content = <MarkAttendancePage />;
  else content = <DashboardPage />;

  return (
    <DashboardLayout
      title="Student Dashboard"
      subtitle={`${user?.name || "Student"}`}
      navItems={navItems}
      role="Student"
    >
      {content}
    </DashboardLayout>
  );
};

export default StudentDashboard;
