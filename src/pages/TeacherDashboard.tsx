import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { BarChart3, Users, PlayCircle, MapPin, Clock, CalendarDays, StopCircle, UserCheck, UserX, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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

const sessionHistory = [
  { id: "SES001", subject: "CS201 - Data Structures", date: "2026-03-07", time: "09:00 - 10:00 AM", present: 42, total: 48, geo: true },
  { id: "SES002", subject: "CS301 - Database Systems", date: "2026-03-07", time: "11:00 - 12:00 PM", present: 38, total: 45, geo: true },
  { id: "SES003", subject: "CS201 - Data Structures", date: "2026-03-06", time: "09:00 - 10:00 AM", present: 44, total: 48, geo: false },
  { id: "SES004", subject: "CS301 - Database Systems", date: "2026-03-06", time: "11:00 - 12:00 PM", present: 40, total: 45, geo: true },
  { id: "SES005", subject: "CS201 - Data Structures", date: "2026-03-05", time: "09:00 - 10:00 AM", present: 46, total: 48, geo: true },
];

function TeacherDashboardPage() {
  const { toast } = useToast();
  const [sessionActive, setSessionActive] = useState(true);

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value="156" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Active Session" value="CS201" subtitle="Data Structures" icon={<PlayCircle className="w-5 h-5" />} variant="accent" />
        <StatCard title="Present Today" value="42" subtitle="out of 48" icon={<BarChart3 className="w-5 h-5" />} variant="success" />
        <StatCard title="Geo-Attendance" value="Enabled" icon={<MapPin className="w-5 h-5" />} variant="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <div className={`rounded-lg border p-3 text-center ${sessionActive ? "bg-accent/10 border-accent/20" : "bg-muted/30"}`}>
              <div className="flex items-center justify-center gap-1.5 text-xs mb-1">
                {sessionActive ? (
                  <><span className="w-2 h-2 rounded-full bg-accent animate-pulse" /><span className="text-accent">Session Active</span></>
                ) : (
                  <span className="text-muted-foreground">No Active Session</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Room 301, Block A · 50m radius</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={sessionActive}
                onClick={() => { setSessionActive(true); toast({ title: "Session Started", description: "Attendance session is now active." }); }}
              >
                <PlayCircle className="w-4 h-4 mr-1" /> Start
              </Button>
              <Button
                variant="outline"
                disabled={!sessionActive}
                onClick={() => { setSessionActive(false); toast({ title: "Session Ended", description: "Attendance session has been closed. 42/48 present." }); }}
              >
                <StopCircle className="w-4 h-4 mr-1" /> End
              </Button>
            </div>
          </CardContent>
        </Card>

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
    </div>
  );
}

function SessionsPage() {
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sessions" value="45" icon={<PlayCircle className="w-5 h-5" />} />
        <StatCard title="This Week" value="8" icon={<CalendarDays className="w-5 h-5" />} variant="accent" />
        <StatCard title="Avg. Attendance" value="88%" icon={<BarChart3 className="w-5 h-5" />} variant="success" />
        <StatCard title="Geo Sessions" value="38" subtitle="84% of total" icon={<MapPin className="w-5 h-5" />} />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-sans font-semibold">Session History</CardTitle>
          <Button size="sm" onClick={() => setShowCreate(true)}>+ New Session</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Geo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionHistory.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{s.date}</TableCell>
                  <TableCell className="text-muted-foreground">{s.time}</TableCell>
                  <TableCell><span className="font-semibold text-success">{s.present}</span>/{s.total}</TableCell>
                  <TableCell>{s.geo ? <span className="text-xs text-accent font-medium">Enabled</span> : <span className="text-xs text-muted-foreground">Disabled</span>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Session</DialogTitle>
            <DialogDescription>Set up a new attendance session for your class.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select defaultValue="cs201">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs201">CS201 - Data Structures</SelectItem>
                  <SelectItem value="cs301">CS301 - Database Systems</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select defaultValue="cse-a">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse-a">CSE - Section A</SelectItem>
                  <SelectItem value="cse-b">CSE - Section B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" defaultValue="2026-03-08" />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" defaultValue="09:00" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Enable Geo-Attendance</Label>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => { setShowCreate(false); toast({ title: "Session Created", description: "New attendance session has been created successfully." }); }}>Create Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReportsPage() {
  const [selectedSubject, setSelectedSubject] = useState("all");

  return (
    <div className="space-y-6 animate-slide-in">
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base font-sans font-semibold">Monthly Attendance Report</CardTitle>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="h-8 w-48 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="cs201">CS201 - Data Structures</SelectItem>
                <SelectItem value="cs301">CS301 - Database Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-success">75%</p>
            <p className="text-sm text-muted-foreground mt-1">Students Above Threshold</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-accent">82%</p>
            <p className="text-sm text-muted-foreground mt-1">Average Class Attendance</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-destructive">25%</p>
            <p className="text-sm text-muted-foreground mt-1">Students Below 75%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const TeacherDashboard = () => {
  const location = useLocation();
  const path = location.pathname;

  let content;
  if (path === "/teacher/sessions") content = <SessionsPage />;
  else if (path === "/teacher/reports") content = <ReportsPage />;
  else content = <TeacherDashboardPage />;

  return (
    <DashboardLayout title="Teacher Dashboard" subtitle="Dr. Sarah Williams" navItems={navItems} role="Teacher">
      {content}
    </DashboardLayout>
  );
};

export default TeacherDashboard;
