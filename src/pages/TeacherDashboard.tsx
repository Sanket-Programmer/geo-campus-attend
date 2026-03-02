import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { BarChart3, Users, PlayCircle, MapPin, Clock, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const navItems = [
  { title: "Dashboard", url: "/teacher", icon: BarChart3 },
  { title: "Sessions", url: "/teacher/sessions", icon: PlayCircle },
  { title: "Reports", url: "/teacher/reports", icon: CalendarDays },
];

const liveStudents = [
  { id: "STU001", name: "Alex Johnson", time: "09:02 AM", status: "present" as const },
  { id: "STU002", name: "Maria Garcia", time: "09:03 AM", status: "present" as const },
  { id: "STU003", name: "James Wilson", time: "09:05 AM", status: "present" as const },
  { id: "STU004", name: "Emily Davis", time: "-", status: "absent" as const },
  { id: "STU005", name: "Robert Brown", time: "09:08 AM", status: "present" as const },
  { id: "STU006", name: "Sarah Miller", time: "-", status: "absent" as const },
];

const reportData = [
  { student: "Alex Johnson", id: "STU001", jan: 92, feb: 88, mar: 90, overall: 90 },
  { student: "Maria Garcia", id: "STU002", jan: 85, feb: 90, mar: 87, overall: 87 },
  { student: "James Wilson", id: "STU003", jan: 70, feb: 68, mar: 72, overall: 70 },
  { student: "Emily Davis", id: "STU004", jan: 60, feb: 65, mar: 58, overall: 61 },
];

const TeacherDashboard = () => {
  return (
    <DashboardLayout title="Teacher Dashboard" subtitle="Dr. Sarah Williams" navItems={navItems} role="Teacher">
      <div className="space-y-6 animate-slide-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students" value="156" icon={<Users className="w-5 h-5" />} />
          <StatCard title="Active Session" value="CS201" subtitle="Data Structures" icon={<PlayCircle className="w-5 h-5" />} variant="accent" />
          <StatCard title="Present Today" value="42" subtitle="out of 48" icon={<BarChart3 className="w-5 h-5" />} variant="success" />
          <StatCard title="Geo-Attendance" value="Enabled" icon={<MapPin className="w-5 h-5" />} variant="accent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session controls */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-sans font-semibold">Session Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Subject</Label>
                <Select defaultValue="cs201">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs201">CS201 - Data Structures</SelectItem>
                    <SelectItem value="cs301">CS301 - Database Systems</SelectItem>
                    <SelectItem value="cs302">CS302 - Operating Systems</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Class</Label>
                <Select defaultValue="cse-a">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cse-a">CSE - Section A</SelectItem>
                    <SelectItem value="cse-b">CSE - Section B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between py-2">
                <Label className="text-sm">Geo-Attendance</Label>
                <Switch defaultChecked />
              </div>
              <div className="rounded-lg bg-accent/10 border border-accent/20 p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-accent mb-1">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
                  Session Active
                </div>
                <p className="text-xs text-muted-foreground">Room 301, Block A · 50m radius</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <PlayCircle className="w-4 h-4 mr-1" /> Start
                </Button>
                <Button variant="outline">
                  <Clock className="w-4 h-4 mr-1" /> End
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live monitoring */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-sans font-semibold">Live Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveStudents.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.id}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-muted-foreground">{s.time}</TableCell>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Report table */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-sans font-semibold">Monthly Attendance Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Jan</TableHead>
                  <TableHead>Feb</TableHead>
                  <TableHead>Mar</TableHead>
                  <TableHead>Overall</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.student}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                    <TableCell>{r.jan}%</TableCell>
                    <TableCell>{r.feb}%</TableCell>
                    <TableCell>{r.mar}%</TableCell>
                    <TableCell className={`font-semibold ${r.overall >= 75 ? "text-success" : "text-destructive"}`}>{r.overall}%</TableCell>
                    <TableCell><StatusBadge status={r.overall >= 75 ? "eligible" : "not-eligible"} /></TableCell>
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

export default TeacherDashboard;
