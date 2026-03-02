import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Building2, Users, BookOpen, BarChart3, Settings, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const navItems = [
  { title: "Dashboard", url: "/academic", icon: BarChart3 },
  { title: "Students", url: "/academic/students", icon: Users },
  { title: "Subjects", url: "/academic/subjects", icon: BookOpen },
  { title: "Settings", url: "/academic/settings", icon: Settings },
];

const departments = [
  { name: "Computer Science", students: 320, teachers: 18, avgAttendance: 82 },
  { name: "Electronics", students: 240, teachers: 14, avgAttendance: 78 },
  { name: "Mechanical", students: 280, teachers: 16, avgAttendance: 75 },
  { name: "Civil", students: 200, teachers: 12, avgAttendance: 80 },
];

const recentStudents = [
  { id: "STU001", name: "Alex Johnson", dept: "CSE", year: "3rd", status: "Active" },
  { id: "STU009", name: "Tom Harris", dept: "ECE", year: "2nd", status: "Active" },
  { id: "STU010", name: "Anna White", dept: "ME", year: "4th", status: "Active" },
  { id: "STU011", name: "Mike Ross", dept: "CSE", year: "1st", status: "Active" },
];

const subjects = [
  { code: "CS201", name: "Data Structures", dept: "CSE", teacher: "Dr. Sarah Williams", students: 48 },
  { code: "CS301", name: "Database Systems", dept: "CSE", teacher: "Prof. John Smith", students: 45 },
  { code: "EC201", name: "Digital Electronics", dept: "ECE", teacher: "Dr. Lisa Wang", students: 42 },
  { code: "ME301", name: "Thermodynamics", dept: "ME", teacher: "Prof. Alan Brown", students: 50 },
];

const AcademicDashboard = () => {
  return (
    <DashboardLayout title="Academic Section" subtitle="Administration Panel" navItems={navItems} role="Admin">
      <div className="space-y-6 animate-slide-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students" value="1,040" icon={<GraduationCap className="w-5 h-5" />} />
          <StatCard title="Teachers" value="60" icon={<Users className="w-5 h-5" />} variant="accent" />
          <StatCard title="Departments" value="4" icon={<Building2 className="w-5 h-5" />} />
          <StatCard title="Avg Attendance" value="79%" icon={<BarChart3 className="w-5 h-5" />} variant="warning" />
        </div>

        {/* Department-wise */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-sans font-semibold">Department-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Teachers</TableHead>
                  <TableHead>Avg Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((d) => (
                  <TableRow key={d.name}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell>{d.students}</TableCell>
                    <TableCell>{d.teachers}</TableCell>
                    <TableCell className={`font-semibold ${d.avgAttendance >= 75 ? "text-success" : "text-destructive"}`}>{d.avgAttendance}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabs for students and subjects */}
        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
          </TabsList>
          <TabsContent value="students">
            <Card className="shadow-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-sans font-semibold">Manage Students</CardTitle>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">+ Add Student</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentStudents.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-xs">{s.id}</TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-muted-foreground">{s.dept}</TableCell>
                        <TableCell>{s.year}</TableCell>
                        <TableCell className="text-success font-medium text-sm">{s.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="subjects">
            <Card className="shadow-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-sans font-semibold">Manage Subjects</CardTitle>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">+ Add Subject</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Students</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((s) => (
                      <TableRow key={s.code}>
                        <TableCell className="font-mono text-xs">{s.code}</TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-muted-foreground">{s.dept}</TableCell>
                        <TableCell>{s.teacher}</TableCell>
                        <TableCell>{s.students}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AcademicDashboard;
