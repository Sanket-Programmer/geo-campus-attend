import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { BarChart3, BookOpen, MapPin, Clock, CheckCircle2, CalendarDays, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const navItems = [
  { title: "Dashboard", url: "/student", icon: BarChart3 },
  { title: "Attendance", url: "/student/attendance", icon: CalendarDays },
  { title: "Mark Attendance", url: "/student/mark", icon: MapPin },
];

const subjects = [
  { name: "Data Structures", code: "CS201", attended: 38, total: 45, percentage: 84 },
  { name: "Database Systems", code: "CS301", attended: 30, total: 42, percentage: 71 },
  { name: "Operating Systems", code: "CS302", attended: 40, total: 44, percentage: 91 },
  { name: "Computer Networks", code: "CS401", attended: 28, total: 40, percentage: 70 },
  { name: "Software Engineering", code: "CS402", attended: 35, total: 42, percentage: 83 },
];

const monthlyData = [
  { month: "January", present: 22, absent: 2, percentage: 92 },
  { month: "February", present: 19, absent: 5, percentage: 79 },
  { month: "March", present: 20, absent: 3, percentage: 87 },
];

const attendanceHistory = [
  { date: "2026-03-07", subject: "CS201 - Data Structures", time: "09:00 AM", status: "present" as const, method: "Geo-location" },
  { date: "2026-03-07", subject: "CS301 - Database Systems", time: "11:00 AM", status: "present" as const, method: "Geo-location" },
  { date: "2026-03-06", subject: "CS302 - Operating Systems", time: "09:00 AM", status: "present" as const, method: "Manual" },
  { date: "2026-03-06", subject: "CS401 - Computer Networks", time: "02:00 PM", status: "absent" as const, method: "-" },
  { date: "2026-03-05", subject: "CS201 - Data Structures", time: "09:00 AM", status: "present" as const, method: "Geo-location" },
  { date: "2026-03-05", subject: "CS402 - Software Engineering", time: "11:00 AM", status: "present" as const, method: "Geo-location" },
  { date: "2026-03-04", subject: "CS301 - Database Systems", time: "09:00 AM", status: "absent" as const, method: "-" },
  { date: "2026-03-04", subject: "CS302 - Operating Systems", time: "11:00 AM", status: "present" as const, method: "Manual" },
];

function DashboardPage() {
  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Attendance" value="81%" icon={<BarChart3 className="w-5 h-5" />} variant="accent" />
        <StatCard title="Classes Attended" value="171" subtitle="out of 213" icon={<CheckCircle2 className="w-5 h-5" />} variant="success" />
        <StatCard title="Eligibility" value="Eligible" icon={<BookOpen className="w-5 h-5" />} variant="success" />
        <StatCard title="Active Session" value="CS201" subtitle="Data Structures" icon={<Clock className="w-5 h-5" />} variant="accent" />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-sans font-semibold">Subject-wise Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((s) => (
              <div key={s.code} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{s.name} <span className="text-muted-foreground">({s.code})</span></span>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${s.percentage >= 75 ? "text-success" : "text-destructive"}`}>{s.percentage}%</span>
                    <StatusBadge status={s.percentage >= 75 ? "eligible" : "not-eligible"} />
                  </div>
                </div>
                <Progress value={s.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-sans font-semibold">Monthly Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((m) => (
                <TableRow key={m.month}>
                  <TableCell className="font-medium">{m.month}</TableCell>
                  <TableCell>{m.present}</TableCell>
                  <TableCell>{m.absent}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${m.percentage >= 75 ? "text-success" : "text-destructive"}`}>{m.percentage}%</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AttendancePage() {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("march");

  const filtered = selectedSubject === "all" ? attendanceHistory : attendanceHistory.filter(a => a.subject.startsWith(selectedSubject));

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="This Month" value="87%" icon={<CalendarDays className="w-5 h-5" />} variant="accent" />
        <StatCard title="Classes Attended" value="20" subtitle="out of 23" icon={<CheckCircle2 className="w-5 h-5" />} variant="success" />
        <StatCard title="Absent" value="3" icon={<AlertCircle className="w-5 h-5" />} variant="destructive" />
        <StatCard title="Streak" value="5 days" subtitle="Consecutive present" icon={<Clock className="w-5 h-5" />} />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base font-sans font-semibold">Attendance History</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="h-8 w-44 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="CS201">CS201 - Data Structures</SelectItem>
                  <SelectItem value="CS301">CS301 - Database Systems</SelectItem>
                  <SelectItem value="CS302">CS302 - Operating Systems</SelectItem>
                  <SelectItem value="CS401">CS401 - Networks</SelectItem>
                  <SelectItem value="CS402">CS402 - Software Eng</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-8 w-32 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{a.date}</TableCell>
                  <TableCell>{a.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{a.time}</TableCell>
                  <TableCell className="text-muted-foreground">{a.method}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Subject-wise breakdown */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-sans font-semibold">Subject-wise Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((s) => (
              <div key={s.code} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.code} · {s.attended}/{s.total} classes</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${s.percentage >= 75 ? "text-success" : "text-destructive"}`}>{s.percentage}%</p>
                  <StatusBadge status={s.percentage >= 75 ? "eligible" : "not-eligible"} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MarkAttendancePage() {
  const { toast } = useToast();
  const [locationVerified, setLocationVerified] = useState(false);
  const [marked, setMarked] = useState(false);

  const handleVerifyLocation = () => {
    setLocationVerified(true);
    toast({ title: "Location Verified", description: "You are within the campus radius (50m)." });
  };

  const handleMarkAttendance = () => {
    setMarked(true);
    toast({ title: "Attendance Marked!", description: "Your attendance for CS201 - Data Structures has been recorded." });
  };

  return (
    <div className="space-y-6 animate-slide-in max-w-2xl mx-auto">
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-sans font-semibold">Geo-location Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Active session */}
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium">Active Session</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Subject:</span> <span className="font-medium">CS201 - Data Structures</span></div>
              <div><span className="text-muted-foreground">Teacher:</span> <span className="font-medium">Dr. Sarah Williams</span></div>
              <div><span className="text-muted-foreground">Room:</span> <span className="font-medium">Room 301, Block A</span></div>
              <div><span className="text-muted-foreground">Time:</span> <span className="font-medium">09:00 - 10:00 AM</span></div>
            </div>
          </div>

          {/* Location verification */}
          <div className={`rounded-lg border p-6 text-center ${locationVerified ? "border-success/30 bg-success/5" : "border-accent/30 bg-accent/5"}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${locationVerified ? "bg-success/20" : "bg-accent/20"}`}>
              <MapPin className={`w-8 h-8 ${locationVerified ? "text-success" : "text-accent"}`} />
            </div>
            <p className="font-medium text-foreground mb-1">
              {locationVerified ? "Location Verified ✓" : "Location Verification Required"}
            </p>
            <p className="text-xs text-muted-foreground mb-1">
              {locationVerified ? "You are within 50m of the classroom" : "Allow location access to verify your position"}
            </p>
            {locationVerified && (
              <div className="mt-3 text-xs space-y-1 text-muted-foreground">
                <p>Latitude: 28.6139° N, Longitude: 77.2090° E</p>
                <p>Distance from classroom: 12m ✓</p>
              </div>
            )}
          </div>

          {!locationVerified ? (
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleVerifyLocation}>
              <MapPin className="w-4 h-4 mr-2" /> Verify Location
            </Button>
          ) : !marked ? (
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleMarkAttendance}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Attendance
            </Button>
          ) : (
            <div className="rounded-lg border border-success/30 bg-success/5 p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="font-semibold text-success">Attendance Marked Successfully!</p>
              <p className="text-xs text-muted-foreground mt-1">Recorded at 09:05 AM via Geo-location</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other active sessions */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-sans font-semibold">Other Active Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border p-3 opacity-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">CS301 - Database Systems</p>
                <p className="text-xs text-muted-foreground">11:00 AM - 12:00 PM · Room 205</p>
              </div>
              <span className="text-xs text-muted-foreground">Starts in 2h</span>
            </div>
          </div>
          <div className="rounded-lg border p-3 opacity-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">CS401 - Computer Networks</p>
                <p className="text-xs text-muted-foreground">02:00 PM - 03:00 PM · Room 102</p>
              </div>
              <span className="text-xs text-muted-foreground">Starts in 5h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const StudentDashboard = () => {
  const location = useLocation();
  const path = location.pathname;

  let content;
  if (path === "/student/attendance") content = <AttendancePage />;
  else if (path === "/student/mark") content = <MarkAttendancePage />;
  else content = <DashboardPage />;

  return (
    <DashboardLayout title="Student Dashboard" subtitle="Welcome back, Alex Johnson" navItems={navItems} role="Student">
      {content}
    </DashboardLayout>
  );
};

export default StudentDashboard;
