import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { BarChart3, BookOpen, MapPin, Clock, CheckCircle2, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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

const StudentDashboard = () => {
  return (
    <DashboardLayout title="Student Dashboard" subtitle="Welcome back, Alex Johnson" navItems={navItems} role="Student">
      <div className="space-y-6 animate-slide-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Overall Attendance" value="81%" icon={<BarChart3 className="w-5 h-5" />} variant="accent" />
          <StatCard title="Classes Attended" value="171" subtitle="out of 213" icon={<CheckCircle2 className="w-5 h-5" />} variant="success" />
          <StatCard title="Eligibility" value="Eligible" icon={<BookOpen className="w-5 h-5" />} variant="success" />
          <StatCard title="Active Session" value="CS201" subtitle="Data Structures" icon={<Clock className="w-5 h-5" />} variant="accent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subject-wise attendance */}
          <Card className="lg:col-span-2 shadow-card">
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

          {/* Geo-location card */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-sans font-semibold">Mark Attendance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-accent/10 border border-accent/20 p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Location Verified</p>
                <p className="text-xs text-muted-foreground">Within campus radius</p>
              </div>
              <div className="text-xs space-y-2 text-muted-foreground">
                <div className="flex justify-between"><span>Session</span><span className="text-foreground font-medium">CS201 - Data Structures</span></div>
                <div className="flex justify-between"><span>Status</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" /> Live</span></div>
                <div className="flex justify-between"><span>Radius</span><span className="text-foreground font-medium">50m ✓</span></div>
              </div>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <MapPin className="w-4 h-4 mr-2" /> Mark Attendance
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Monthly table */}
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
    </DashboardLayout>
  );
};

export default StudentDashboard;
