import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { BarChart3, Users, PlayCircle, MapPin, Clock, CalendarDays, StopCircle, UserCheck, UserX, CheckCircle2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface SessionRecord {
  id: string;
  subject: string;
  date: string;
  time: string;
  present: number;
  total: number;
  geo: boolean;
  students: { id: string; name: string; roll: string; status: "present" | "absent"; time: string }[];
}

const allStudents = [
  { id: "STU001", name: "Alex Johnson", roll: "CSE-A-001" },
  { id: "STU002", name: "Maria Garcia", roll: "CSE-A-002" },
  { id: "STU003", name: "James Wilson", roll: "CSE-A-003" },
  { id: "STU004", name: "Emily Davis", roll: "CSE-A-004" },
  { id: "STU005", name: "Robert Brown", roll: "CSE-A-005" },
  { id: "STU006", name: "Sarah Miller", roll: "CSE-A-006" },
  { id: "STU007", name: "Daniel Lee", roll: "CSE-A-007" },
  { id: "STU008", name: "Jessica Taylor", roll: "CSE-A-008" },
  { id: "STU009", name: "Michael Anderson", roll: "CSE-A-009" },
  { id: "STU010", name: "Sophia Martinez", roll: "CSE-A-010" },
];

const navItems = [
  { title: "Dashboard", url: "/teacher", icon: BarChart3 },
  { title: "Sessions", url: "/teacher/sessions", icon: PlayCircle },
  { title: "Reports", url: "/teacher/reports", icon: CalendarDays },
];

const liveStudents = [
  { id: "STU001", name: "Alex Johnson", roll: "CSE-A-001", time: "09:02 AM", status: "present" as const },
  { id: "STU002", name: "Maria Garcia", roll: "CSE-A-002", time: "09:03 AM", status: "present" as const },
  { id: "STU003", name: "James Wilson", roll: "CSE-A-003", time: "09:05 AM", status: "present" as const },
  { id: "STU004", name: "Emily Davis", roll: "CSE-A-004", time: "-", status: "absent" as const },
  { id: "STU005", name: "Robert Brown", roll: "CSE-A-005", time: "09:08 AM", status: "present" as const },
  { id: "STU006", name: "Sarah Miller", roll: "CSE-A-006", time: "-", status: "absent" as const },
];

const reportData = [
  { student: "Alex Johnson", id: "STU001", jan: 92, feb: 88, mar: 90, overall: 90 },
  { student: "Maria Garcia", id: "STU002", jan: 85, feb: 90, mar: 87, overall: 87 },
  { student: "James Wilson", id: "STU003", jan: 70, feb: 68, mar: 72, overall: 70 },
  { student: "Emily Davis", id: "STU004", jan: 60, feb: 65, mar: 58, overall: 61 },
];

const initialSessions: SessionRecord[] = [
  {
    id: "SES001", subject: "CS201 - Data Structures", date: "2026-03-07", time: "09:00 - 10:00 AM", present: 42, total: 48, geo: true,
    students: [
      { id: "STU001", name: "Alex Johnson", roll: "CSE-A-001", status: "present", time: "09:02 AM" },
      { id: "STU002", name: "Maria Garcia", roll: "CSE-A-002", status: "present", time: "09:03 AM" },
      { id: "STU003", name: "James Wilson", roll: "CSE-A-003", status: "present", time: "09:05 AM" },
      { id: "STU004", name: "Emily Davis", roll: "CSE-A-004", status: "absent", time: "-" },
      { id: "STU005", name: "Robert Brown", roll: "CSE-A-005", status: "present", time: "09:08 AM" },
    ],
  },
  {
    id: "SES002", subject: "CS301 - Database Systems", date: "2026-03-07", time: "11:00 - 12:00 PM", present: 38, total: 45, geo: true,
    students: [
      { id: "STU001", name: "Alex Johnson", roll: "CSE-A-001", status: "present", time: "11:01 AM" },
      { id: "STU002", name: "Maria Garcia", roll: "CSE-A-002", status: "absent", time: "-" },
      { id: "STU003", name: "James Wilson", roll: "CSE-A-003", status: "present", time: "11:04 AM" },
    ],
  },
  {
    id: "SES003", subject: "CS201 - Data Structures", date: "2026-03-06", time: "09:00 - 10:00 AM", present: 44, total: 48, geo: false,
    students: [
      { id: "STU001", name: "Alex Johnson", roll: "CSE-A-001", status: "present", time: "09:00 AM" },
      { id: "STU002", name: "Maria Garcia", roll: "CSE-A-002", status: "present", time: "09:00 AM" },
      { id: "STU004", name: "Emily Davis", roll: "CSE-A-004", status: "absent", time: "-" },
    ],
  },
  {
    id: "SES004", subject: "CS301 - Database Systems", date: "2026-03-06", time: "11:00 - 12:00 PM", present: 40, total: 45, geo: true,
    students: [
      { id: "STU001", name: "Alex Johnson", roll: "CSE-A-001", status: "present", time: "11:02 AM" },
      { id: "STU003", name: "James Wilson", roll: "CSE-A-003", status: "present", time: "11:05 AM" },
      { id: "STU005", name: "Robert Brown", roll: "CSE-A-005", status: "absent", time: "-" },
    ],
  },
  {
    id: "SES005", subject: "CS201 - Data Structures", date: "2026-03-05", time: "09:00 - 10:00 AM", present: 46, total: 48, geo: true,
    students: [
      { id: "STU001", name: "Alex Johnson", roll: "CSE-A-001", status: "present", time: "09:01 AM" },
      { id: "STU002", name: "Maria Garcia", roll: "CSE-A-002", status: "present", time: "09:02 AM" },
    ],
  },
];

// Shared state across pages
let sharedSessions = [...initialSessions];
let sessionCounter = 6;

function TeacherDashboardPage({ onSubmitSession }: { onSubmitSession: (session: SessionRecord) => void }) {
  const { toast } = useToast();
  const [sessionActive, setSessionActive] = useState(true);
  const [geoEnabled, setGeoEnabled] = useState(true);
  const [manualAttendance, setManualAttendance] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("cs201");
  const [selectedClass, setSelectedClass] = useState("cse-a");

  const subjectMap: Record<string, string> = {
    cs201: "CS201 - Data Structures",
    cs301: "CS301 - Database Systems",
    cs302: "CS302 - Operating Systems",
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const updated: Record<string, boolean> = {};
    allStudents.forEach((s) => { updated[s.id] = checked; });
    setManualAttendance(updated);
  };

  const handleToggleStudent = (id: string, checked: boolean) => {
    const updated = { ...manualAttendance, [id]: checked };
    setManualAttendance(updated);
    setSelectAll(allStudents.every((s) => updated[s.id]));
  };

  const presentCount = Object.values(manualAttendance).filter(Boolean).length;
  const geoPresentCount = liveStudents.filter(s => s.status === "present").length;

  const handleSubmitGeo = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    const newSession: SessionRecord = {
      id: `SES${String(sessionCounter++).padStart(3, "0")}`,
      subject: subjectMap[selectedSubject] || "CS201 - Data Structures",
      date: now.toISOString().split("T")[0],
      time: `${timeStr} (Geo Session)`,
      present: geoPresentCount,
      total: liveStudents.length,
      geo: true,
      students: liveStudents.map(s => ({ ...s, roll: s.roll })),
    };
    onSubmitSession(newSession);
    setSessionActive(false);
    toast({ title: "Geo Attendance Submitted", description: `Session recorded: ${geoPresentCount}/${liveStudents.length} present.` });
  };

  const handleSubmitManual = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    const newSession: SessionRecord = {
      id: `SES${String(sessionCounter++).padStart(3, "0")}`,
      subject: subjectMap[selectedSubject] || "CS201 - Data Structures",
      date: now.toISOString().split("T")[0],
      time: `${timeStr} (Manual)`,
      present: presentCount,
      total: allStudents.length,
      geo: false,
      students: allStudents.map(s => ({
        ...s,
        status: manualAttendance[s.id] ? "present" as const : "absent" as const,
        time: manualAttendance[s.id] ? timeStr : "-",
      })),
    };
    onSubmitSession(newSession);
    setSessionActive(false);
    toast({ title: "Manual Attendance Submitted", description: `Marked ${presentCount} out of ${allStudents.length} students as present.` });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value="156" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Active Session" value="CS201" subtitle="Data Structures" icon={<PlayCircle className="w-5 h-5" />} variant="accent" />
        <StatCard title="Present Today" value={geoEnabled ? String(geoPresentCount) : String(presentCount)} subtitle={`out of ${geoEnabled ? liveStudents.length : allStudents.length}`} icon={<BarChart3 className="w-5 h-5" />} variant="success" />
        <StatCard title="Geo-Attendance" value={geoEnabled ? "Enabled" : "Disabled"} icon={<MapPin className="w-5 h-5" />} variant={geoEnabled ? "accent" : "default"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-sans font-semibold">Session Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse-a">CSE - Section A</SelectItem>
                  <SelectItem value="cse-b">CSE - Section B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm">Geo-Attendance</Label>
              <Switch checked={geoEnabled} onCheckedChange={setGeoEnabled} />
            </div>
            {!geoEnabled && (
              <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-center">
                <p className="text-xs font-medium text-warning">Manual Mode Active</p>
                <p className="text-xs text-muted-foreground mt-0.5">Mark attendance manually below</p>
              </div>
            )}
            {geoEnabled && (
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
            )}
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
                onClick={() => { setSessionActive(false); toast({ title: "Session Ended", description: "Attendance session has been closed." }); }}
              >
                <StopCircle className="w-4 h-4 mr-1" /> End
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-sans font-semibold">
              {geoEnabled ? "Live Attendance (Geo)" : "Manual Attendance"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {geoEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-sm">
                      <UserCheck className="w-4 h-4 text-success" />
                      <span className="font-medium text-success">{geoPresentCount}</span>
                      <span className="text-muted-foreground">Present</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <UserX className="w-4 h-4 text-destructive" />
                      <span className="font-medium text-destructive">{liveStudents.length - geoPresentCount}</span>
                      <span className="text-muted-foreground">Absent</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={handleSubmitGeo} disabled={!sessionActive}>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Submit Attendance
                  </Button>
                </div>
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
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-sm">
                      <UserCheck className="w-4 h-4 text-success" />
                      <span className="font-medium text-success">{presentCount}</span>
                      <span className="text-muted-foreground">Present</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <UserX className="w-4 h-4 text-destructive" />
                      <span className="font-medium text-destructive">{allStudents.length - presentCount}</span>
                      <span className="text-muted-foreground">Absent</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={handleSubmitManual} disabled={!sessionActive}>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Submit Attendance
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox checked={selectAll} onCheckedChange={(c) => handleSelectAll(!!c)} />
                      </TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allStudents.map((s) => (
                      <TableRow key={s.id} className={manualAttendance[s.id] ? "bg-success/5" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={!!manualAttendance[s.id]}
                            onCheckedChange={(c) => handleToggleStudent(s.id, !!c)}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs">{s.roll}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{s.id}</TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>
                          <StatusBadge status={manualAttendance[s.id] ? "present" : "absent"} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SessionsPage({ sessions, onUpdateSession }: { sessions: SessionRecord[]; onUpdateSession: (updated: SessionRecord) => void }) {
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editAttendance, setEditAttendance] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sessions" value={String(sessions.length)} icon={<PlayCircle className="w-5 h-5" />} />
        <StatCard title="This Week" value="8" icon={<CalendarDays className="w-5 h-5" />} variant="accent" />
        <StatCard title="Avg. Attendance" value="88%" icon={<BarChart3 className="w-5 h-5" />} variant="success" />
        <StatCard title="Geo Sessions" value={String(sessions.filter(s => s.geo).length)} subtitle={`${Math.round((sessions.filter(s => s.geo).length / sessions.length) * 100)}% of total`} icon={<MapPin className="w-5 h-5" />} />
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
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s) => (
                <TableRow key={s.id} className="cursor-pointer hover:bg-muted/60" onClick={() => setSelectedSession(s)}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{s.date}</TableCell>
                  <TableCell className="text-muted-foreground">{s.time}</TableCell>
                  <TableCell><span className="font-semibold text-success">{s.present}</span>/{s.total}</TableCell>
                  <TableCell>{s.geo ? <span className="text-xs text-accent font-medium">Enabled</span> : <span className="text-xs text-muted-foreground">Disabled</span>}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedSession(s); }}>
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Session Details Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={(open) => { if (!open) setSelectedSession(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary" />
              Session Details — {selectedSession?.id}
            </DialogTitle>
            <DialogDescription>
              View attendance details for this session.
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Subject</p>
                  <p className="text-sm font-semibold mt-0.5">{selectedSession.subject}</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold mt-0.5">{selectedSession.date}</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-semibold mt-0.5">{selectedSession.time}</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <p className={`text-sm font-semibold mt-0.5 ${selectedSession.geo ? "text-accent" : "text-warning"}`}>
                    {selectedSession.geo ? "Geo-Location" : "Manual"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-1">
                <div className="flex items-center gap-1.5 text-sm">
                  <UserCheck className="w-4 h-4 text-success" />
                  <span className="font-semibold text-success">{selectedSession.present}</span>
                  <span className="text-muted-foreground">Present</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <UserX className="w-4 h-4 text-destructive" />
                  <span className="font-semibold text-destructive">{selectedSession.total - selectedSession.present}</span>
                  <span className="text-muted-foreground">Absent</span>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  Attendance Rate: <span className="font-semibold text-foreground">{Math.round((selectedSession.present / selectedSession.total) * 100)}%</span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Time Marked</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSession.students.map((st) => (
                    <TableRow key={st.id} className={st.status === "present" ? "bg-success/5" : ""}>
                      <TableCell className="font-mono text-xs">{st.roll}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{st.id}</TableCell>
                      <TableCell className="font-medium">{st.name}</TableCell>
                      <TableCell className="text-muted-foreground">{st.time}</TableCell>
                      <TableCell><StatusBadge status={st.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSession(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Session Dialog */}
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
  const [sessions, setSessions] = useState<SessionRecord[]>(initialSessions);

  const handleSubmitSession = (session: SessionRecord) => {
    setSessions(prev => [session, ...prev]);
  };

  let content;
  if (path === "/teacher/sessions") content = <SessionsPage sessions={sessions} />;
  else if (path === "/teacher/reports") content = <ReportsPage />;
  else content = <TeacherDashboardPage onSubmitSession={handleSubmitSession} />;

  return (
    <DashboardLayout title="Teacher Dashboard" subtitle="Dr. Sarah Williams" navItems={navItems} role="Teacher">
      {content}
    </DashboardLayout>
  );
};

export default TeacherDashboard;
