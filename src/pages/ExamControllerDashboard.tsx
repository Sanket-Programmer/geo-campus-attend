import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Shield, Users, AlertTriangle, CheckCircle2, FileText, BarChart3, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { title: "Dashboard", url: "/exam-controller", icon: BarChart3 },
  { title: "Eligibility", url: "/exam-controller/eligibility", icon: Shield },
  { title: "Reports", url: "/exam-controller/reports", icon: FileText },
];

// Subject-to-department mapping
const subjectsByDept: Record<string, { code: string; name: string }[]> = {
  CSE: [
    { code: "CS101", name: "Data Structures" },
    { code: "CS102", name: "Operating Systems" },
    { code: "CS103", name: "Database Management" },
  ],
  ECE: [
    { code: "EC101", name: "Digital Electronics" },
    { code: "EC102", name: "Signal Processing" },
  ],
  ME: [
    { code: "ME101", name: "Thermodynamics" },
    { code: "ME102", name: "Fluid Mechanics" },
  ],
};

// Students with subjects they are registered in and per-subject attendance
const students = [
  { id: "STU001", name: "Alex Johnson", dept: "CSE", subjects: [
    { code: "CS101", attendance: 90 }, { code: "CS102", attendance: 85 }, { code: "CS103", attendance: 92 },
  ]},
  { id: "STU002", name: "Maria Garcia", dept: "CSE", subjects: [
    { code: "CS101", attendance: 87 }, { code: "CS102", attendance: 80 },
  ]},
  { id: "STU003", name: "James Wilson", dept: "CSE", subjects: [
    { code: "CS101", attendance: 70 }, { code: "CS103", attendance: 65 },
  ]},
  { id: "STU004", name: "Emily Davis", dept: "ECE", subjects: [
    { code: "EC101", attendance: 61 }, { code: "EC102", attendance: 72 },
  ]},
  { id: "STU005", name: "Robert Brown", dept: "CSE", subjects: [
    { code: "CS101", attendance: 82 }, { code: "CS102", attendance: 78 }, { code: "CS103", attendance: 88 },
  ]},
  { id: "STU006", name: "Sarah Miller", dept: "ECE", subjects: [
    { code: "EC101", attendance: 78 }, { code: "EC102", attendance: 84 },
  ]},
  { id: "STU007", name: "David Lee", dept: "ME", subjects: [
    { code: "ME101", attendance: 55 }, { code: "ME102", attendance: 60 },
  ]},
  { id: "STU008", name: "Lisa Wang", dept: "CSE", subjects: [
    { code: "CS101", attendance: 95 }, { code: "CS102", attendance: 91 }, { code: "CS103", attendance: 97 },
  ]},
];

// Helper to compute overall attendance for a student
function getOverallAttendance(student: typeof students[0]) {
  const total = student.subjects.reduce((sum, s) => sum + s.attendance, 0);
  return Math.round(total / student.subjects.length);
}

function getStatus(attendance: number): "eligible" | "not-eligible" {
  return attendance >= 75 ? "eligible" : "not-eligible";
}

function ExamDashboardPage() {
  const eligible = students.filter((s) => getStatus(getOverallAttendance(s)) === "eligible").length;
  const notEligible = students.length - eligible;

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length} icon={<Users className="w-5 h-5" />} />
        <StatCard title="Eligible" value={eligible} icon={<CheckCircle2 className="w-5 h-5" />} variant="success" />
        <StatCard title="Not Eligible" value={notEligible} icon={<AlertTriangle className="w-5 h-5" />} variant="destructive" />
        <StatCard title="Threshold" value="75%" subtitle="Minimum attendance" icon={<Shield className="w-5 h-5" />} variant="accent" />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-sans font-semibold">Student Eligibility Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Attendance %</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => {
                const att = getOverallAttendance(s);
                const status = getStatus(att);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-muted-foreground">{s.dept}</TableCell>
                    <TableCell className={`font-semibold ${att >= 75 ? "text-success" : "text-destructive"}`}>{att}%</TableCell>
                    <TableCell><StatusBadge status={status} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function EligibilityPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dept, setDept] = useState("CSE");
  const [subject, setSubject] = useState("CS101");

  // When department changes, reset subject filter
  const handleDeptChange = (value: string) => {
    setDept(value);
    setSubject("all");
  };

  // Get available subjects based on selected department
  const availableSubjects = dept === "all"
    ? Object.values(subjectsByDept).flat()
    : subjectsByDept[dept] || [];

  // Build filtered student list with subject-aware attendance
  const filtered = students
    .filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
      const matchDept = dept === "all" || s.dept === dept;
      // If a subject is selected, only show students registered in that subject
      const matchSubject = subject === "all" || s.subjects.some((sub) => sub.code === subject);
      return matchSearch && matchDept && matchSubject;
    })
    .map((s) => {
      // Calculate attendance based on subject filter
      let attendance: number;
      if (subject !== "all") {
        const sub = s.subjects.find((sub) => sub.code === subject);
        attendance = sub ? sub.attendance : 0;
      } else {
        attendance = getOverallAttendance(s);
      }
      const status = getStatus(attendance);
      const matchFilter = filter === "all" || status === filter;
      return matchFilter ? { ...s, displayAttendance: attendance, displayStatus: status } : null;
    })
    .filter(Boolean) as (typeof students[0] & { displayAttendance: number; displayStatus: "eligible" | "not-eligible" })[];

  const eligible = filtered.filter((s) => s.displayStatus === "eligible").length;

  // Get subject name for display
  const selectedSubjectName = subject !== "all"
    ? availableSubjects.find((s) => s.code === subject)?.name || subject
    : null;

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Filtered Students" value={filtered.length} icon={<Users className="w-5 h-5" />} />
        <StatCard title="Eligible" value={eligible} icon={<CheckCircle2 className="w-5 h-5" />} variant="success" />
        <StatCard title="Not Eligible" value={filtered.length - eligible} icon={<AlertTriangle className="w-5 h-5" />} variant="destructive" />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base font-sans font-semibold">
              Eligibility Details
              {selectedSubjectName && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">— {selectedSubjectName}</span>
              )}
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Input placeholder="Search student..." className="h-8 w-48 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-8 w-36 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="eligible">Eligible</SelectItem>
                  <SelectItem value="not-eligible">Not Eligible</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dept} onValueChange={handleDeptChange}>
                <SelectTrigger className="h-8 w-28 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dept</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="ME">ME</SelectItem>
                </SelectContent>
              </Select>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="h-8 w-44 text-sm"><SelectValue placeholder="All Subjects" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {availableSubjects.map((sub) => (
                    <SelectItem key={sub.code} value={sub.code}>{sub.code} - {sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Subject Attendance %</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.dept}</TableCell>
                  <TableCell className={`font-semibold ${s.displayAttendance >= 75 ? "text-success" : "text-destructive"}`}>{s.displayAttendance}%</TableCell>
                  <TableCell><StatusBadge status={s.displayStatus} /></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No students match the filters</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsPage() {
  const { toast } = useToast();

  const deptReports = [
    { dept: "Computer Science", total: 320, eligible: 268, notEligible: 52, avg: 82 },
    { dept: "Electronics", total: 240, eligible: 188, notEligible: 52, avg: 78 },
    { dept: "Mechanical", total: 280, eligible: 210, notEligible: 70, avg: 75 },
    { dept: "Civil", total: 200, eligible: 164, notEligible: 36, avg: 80 },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value="1,040" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Overall Eligible" value="830" icon={<CheckCircle2 className="w-5 h-5" />} variant="success" />
        <StatCard title="Not Eligible" value="210" icon={<AlertTriangle className="w-5 h-5" />} variant="destructive" />
        <StatCard title="Eligibility Rate" value="80%" icon={<Shield className="w-5 h-5" />} variant="accent" />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-sans font-semibold">Department-wise Eligibility Report</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast({ title: "Report Downloaded", description: "Eligibility report has been exported as CSV." })}>
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Eligible</TableHead>
                <TableHead>Not Eligible</TableHead>
                <TableHead>Avg Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deptReports.map((d) => (
                <TableRow key={d.dept}>
                  <TableCell className="font-medium">{d.dept}</TableCell>
                  <TableCell>{d.total}</TableCell>
                  <TableCell className="text-success font-semibold">{d.eligible}</TableCell>
                  <TableCell className="text-destructive font-semibold">{d.notEligible}</TableCell>
                  <TableCell className={`font-semibold ${d.avg >= 75 ? "text-success" : "text-destructive"}`}>{d.avg}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

const ExamControllerDashboard = () => {
  const location = useLocation();
  const path = location.pathname;

  let content;
  if (path === "/exam-controller/eligibility") content = <EligibilityPage />;
  else if (path === "/exam-controller/reports") content = <ReportsPage />;
  else content = <ExamDashboardPage />;

  return (
    <DashboardLayout title="Exam Controller" subtitle="Eligibility & Reports" navItems={navItems} role="Exam Controller">
      {content}
    </DashboardLayout>
  );
};

export default ExamControllerDashboard;
