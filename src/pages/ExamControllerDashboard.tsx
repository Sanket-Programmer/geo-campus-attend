import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Shield, Users, AlertTriangle, CheckCircle2, FileText, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const navItems = [
  { title: "Dashboard", url: "/exam-controller", icon: BarChart3 },
  { title: "Eligibility", url: "/exam-controller/eligibility", icon: Shield },
  { title: "Reports", url: "/exam-controller/reports", icon: FileText },
];

const students = [
  { id: "STU001", name: "Alex Johnson", dept: "CSE", attendance: 90, status: "eligible" as const },
  { id: "STU002", name: "Maria Garcia", dept: "CSE", attendance: 87, status: "eligible" as const },
  { id: "STU003", name: "James Wilson", dept: "CSE", attendance: 70, status: "not-eligible" as const },
  { id: "STU004", name: "Emily Davis", dept: "ECE", attendance: 61, status: "not-eligible" as const },
  { id: "STU005", name: "Robert Brown", dept: "CSE", attendance: 82, status: "eligible" as const },
  { id: "STU006", name: "Sarah Miller", dept: "ECE", attendance: 78, status: "eligible" as const },
  { id: "STU007", name: "David Lee", dept: "ME", attendance: 55, status: "not-eligible" as const },
  { id: "STU008", name: "Lisa Wang", dept: "CSE", attendance: 95, status: "eligible" as const },
];

const ExamControllerDashboard = () => {
  const eligible = students.filter((s) => s.status === "eligible").length;
  const notEligible = students.length - eligible;

  return (
    <DashboardLayout title="Exam Controller" subtitle="Eligibility & Reports" navItems={navItems} role="Exam Controller">
      <div className="space-y-6 animate-slide-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students" value={students.length} icon={<Users className="w-5 h-5" />} />
          <StatCard title="Eligible" value={eligible} icon={<CheckCircle2 className="w-5 h-5" />} variant="success" />
          <StatCard title="Not Eligible" value={notEligible} icon={<AlertTriangle className="w-5 h-5" />} variant="destructive" />
          <StatCard title="Threshold" value="75%" subtitle="Minimum attendance" icon={<Shield className="w-5 h-5" />} variant="accent" />
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-base font-sans font-semibold">Student Eligibility Overview</CardTitle>
              <div className="flex gap-2">
                <Input placeholder="Search student..." className="h-8 w-48 text-sm" />
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 w-36 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="eligible">Eligible Only</SelectItem>
                    <SelectItem value="not-eligible">Below 75%</SelectItem>
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
                  <TableHead>Attendance %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-muted-foreground">{s.dept}</TableCell>
                    <TableCell className={`font-semibold ${s.attendance >= 75 ? "text-success" : "text-destructive"}`}>{s.attendance}%</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
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

export default ExamControllerDashboard;
