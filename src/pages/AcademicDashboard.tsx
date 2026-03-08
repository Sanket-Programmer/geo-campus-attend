import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Building2, Users, BookOpen, BarChart3, GraduationCap, UserPlus, Trash2, Edit, Eye, EyeOff, School } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const navItems = [
  { title: "Dashboard", url: "/academic", icon: BarChart3 },
  { title: "Students", url: "/academic/students", icon: Users },
  { title: "Teachers", url: "/academic/teachers", icon: GraduationCap },
  { title: "Classes", url: "/academic/classes", icon: School },
  { title: "Subjects", url: "/academic/subjects", icon: BookOpen },
];

const departments = [
  { name: "Computer Science", students: 320, teachers: 18, avgAttendance: 82 },
  { name: "Electronics", students: 240, teachers: 14, avgAttendance: 78 },
  { name: "Mechanical", students: 280, teachers: 16, avgAttendance: 75 },
  { name: "Civil", students: 200, teachers: 12, avgAttendance: 80 },
];

const initialStudents = [
  { id: "STU001", name: "Alex Johnson", email: "alex@uni.edu", dept: "CSE", year: "3rd", phone: "9876543210", status: "Active", password: "alex@123" },
  { id: "STU009", name: "Tom Harris", email: "tom@uni.edu", dept: "ECE", year: "2nd", phone: "9876543211", status: "Active", password: "tom@123" },
  { id: "STU010", name: "Anna White", email: "anna@uni.edu", dept: "ME", year: "4th", phone: "9876543212", status: "Active", password: "anna@123" },
  { id: "STU011", name: "Mike Ross", email: "mike@uni.edu", dept: "CSE", year: "1st", phone: "9876543213", status: "Active", password: "mike@123" },
  { id: "STU012", name: "Rachel Green", email: "rachel@uni.edu", dept: "CE", year: "2nd", phone: "9876543214", status: "Active", password: "rachel@123" },
];

const classOptions = ["CSE-A", "CSE-B", "ECE-A", "ECE-B", "ME-A", "ME-B", "CE-A", "CE-B"];

const initialTeachers = [
  { id: "TCH001", name: "Dr. Sarah Williams", email: "sarah@uni.edu", dept: "CSE", designation: "Professor", phone: "9876500001", subjects: 3, status: "Active", password: "sarah@123", assignedClass: ["CSE-A"], subjectsAssigned: ["CS201", "CS402"] },
  { id: "TCH002", name: "Prof. John Smith", email: "john@uni.edu", dept: "CSE", designation: "Associate Prof", phone: "9876500002", subjects: 2, status: "Active", password: "john@123", assignedClass: ["CSE-B"], subjectsAssigned: ["CS301"] },
  { id: "TCH003", name: "Dr. Lisa Wang", email: "lisa@uni.edu", dept: "ECE", designation: "Professor", phone: "9876500003", subjects: 3, status: "Active", password: "lisa@123", assignedClass: ["ECE-A", "ECE-B"], subjectsAssigned: ["EC201"] },
  { id: "TCH004", name: "Prof. Alan Brown", email: "alan@uni.edu", dept: "ME", designation: "Assistant Prof", phone: "9876500004", subjects: 2, status: "Active", password: "alan@123", assignedClass: ["ME-A"], subjectsAssigned: ["ME301"] },
  { id: "TCH005", name: "Dr. Priya Sharma", email: "priya@uni.edu", dept: "CE", designation: "Professor", phone: "9876500005", subjects: 2, status: "On Leave", password: "priya@123", assignedClass: ["CE-A"], subjectsAssigned: [] },
];

const initialSubjects = [
  { code: "CS201", name: "Data Structures", dept: "CSE", teacher: "Dr. Sarah Williams", semester: "3rd", credits: 4, students: 48 },
  { code: "CS301", name: "Database Systems", dept: "CSE", teacher: "Prof. John Smith", semester: "5th", credits: 4, students: 45 },
  { code: "EC201", name: "Digital Electronics", dept: "ECE", teacher: "Dr. Lisa Wang", semester: "3rd", credits: 3, students: 42 },
  { code: "ME301", name: "Thermodynamics", dept: "ME", teacher: "Prof. Alan Brown", semester: "5th", credits: 4, students: 50 },
  { code: "CS402", name: "Software Engineering", dept: "CSE", teacher: "Dr. Sarah Williams", semester: "7th", credits: 3, students: 40 },
];

// ---- Dashboard Page ----
function AcademicDashboardPage() {
  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value="1,040" icon={<GraduationCap className="w-5 h-5" />} />
        <StatCard title="Teachers" value="60" icon={<Users className="w-5 h-5" />} variant="accent" />
        <StatCard title="Departments" value="4" icon={<Building2 className="w-5 h-5" />} />
        <StatCard title="Avg Attendance" value="79%" icon={<BarChart3 className="w-5 h-5" />} variant="warning" />
      </div>

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
    </div>
  );
}

// ---- Password Cell Component ----
function PasswordCell({ password }: { password: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs font-mono">{visible ? password : "••••••••"}</span>
      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setVisible(!visible)}>
        {visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
      </Button>
    </div>
  );
}


// ---- Students Page ----
function StudentsPage() {
  const { toast } = useToast();
  const [studentsList, setStudentsList] = useState(initialStudents);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editStudent, setEditStudent] = useState<typeof initialStudents[0] | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<typeof initialStudents[0] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", dept: "CSE", year: "1st", phone: "", password: "", semester: "1st", subjectsRegistered: [] as string[] });
  const [search, setSearch] = useState("");

  const filtered = studentsList.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    const newStudent = {
      id: `STU${String(studentsList.length + 20).padStart(3, "0")}`,
      name: form.name,
      email: form.email,
      dept: form.dept,
      year: form.year,
      phone: form.phone,
      password: form.password || "default@123",
      status: "Active",
    };
    setStudentsList([...studentsList, newStudent]);
    setShowAdd(false);
    setForm({ name: "", email: "", dept: "CSE", year: "1st", phone: "", password: "", semester: "1st", subjectsRegistered: [] });
    toast({ title: "Student Added", description: `${form.name} has been registered successfully.` });
  };

  const handleEdit = () => {
    if (!editStudent) return;
    setStudentsList(studentsList.map((s) => (s.id === editStudent.id ? editStudent : s)));
    setShowEdit(false);
    toast({ title: "Student Updated", description: `${editStudent.name}'s details have been updated.` });
  };

  const handleDelete = () => {
    if (!deleteStudent) return;
    setStudentsList(studentsList.filter((s) => s.id !== deleteStudent.id));
    setShowDelete(false);
    toast({ title: "Student Removed", description: `${deleteStudent.name} has been removed from the system.` });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={studentsList.length} icon={<GraduationCap className="w-5 h-5" />} />
        <StatCard title="CSE" value={studentsList.filter(s => s.dept === "CSE").length} icon={<Users className="w-5 h-5" />} variant="accent" />
        <StatCard title="ECE" value={studentsList.filter(s => s.dept === "ECE").length} icon={<Users className="w-5 h-5" />} />
        <StatCard title="Active" value={studentsList.filter(s => s.status === "Active").length} icon={<Users className="w-5 h-5" />} variant="success" />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-sans font-semibold">Manage Students</CardTitle>
          <div className="flex gap-2">
            <Input placeholder="Search..." className="h-8 w-40 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button size="sm" onClick={() => setShowAdd(true)}><UserPlus className="w-4 h-4 mr-1" /> Add Student</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{s.email}</TableCell>
                  <TableCell className="text-muted-foreground">{s.dept}</TableCell>
                  <TableCell>{s.year}</TableCell>
                  <TableCell>
                    <PasswordCell password={s.password} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.phone}</TableCell>
                  <TableCell className="text-success font-medium text-sm">{s.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditStudent({ ...s }); setShowEdit(true); }}><Edit className="w-3.5 h-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { setDeleteStudent(s); setShowDelete(true); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Fill in the details to register a new student.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@uni.edu" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Password</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={form.dept} onValueChange={(v) => setForm({ ...form, dept: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={form.year} onValueChange={(v) => setForm({ ...form, year: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={form.semester} onValueChange={(v) => setForm({ ...form, semester: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Sem</SelectItem>
                    <SelectItem value="2nd">2nd Sem</SelectItem>
                    <SelectItem value="3rd">3rd Sem</SelectItem>
                    <SelectItem value="4th">4th Sem</SelectItem>
                    <SelectItem value="5th">5th Sem</SelectItem>
                    <SelectItem value="6th">6th Sem</SelectItem>
                    <SelectItem value="7th">7th Sem</SelectItem>
                    <SelectItem value="8th">8th Sem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subjects Registered</Label>
              <div className="grid grid-cols-2 gap-2">
                {initialSubjects.map((sub) => (
                  <label key={sub.code} className="flex items-center gap-2 text-sm cursor-pointer p-1.5 rounded-md border border-border hover:bg-accent/50">
                    <input
                      type="checkbox"
                      checked={form.subjectsRegistered.includes(sub.code)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm({ ...form, subjectsRegistered: [...form.subjectsRegistered, sub.code] });
                        } else {
                          setForm({ ...form, subjectsRegistered: form.subjectsRegistered.filter((c) => c !== sub.code) });
                        }
                      }}
                      className="rounded"
                    />
                    <span>{sub.code} - {sub.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name || !form.email}>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update student details.</DialogDescription>
          </DialogHeader>
          {editStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input value={editStudent.name} onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={editStudent.email} onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={editStudent.dept} onValueChange={(v) => setEditStudent({ ...editStudent, dept: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="ECE">ECE</SelectItem>
                      <SelectItem value="ME">ME</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={editStudent.year} onValueChange={(v) => setEditStudent({ ...editStudent, year: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st">1st Year</SelectItem>
                      <SelectItem value="2nd">2nd Year</SelectItem>
                      <SelectItem value="3rd">3rd Year</SelectItem>
                      <SelectItem value="4th">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Phone</Label><Input value={editStudent.phone} onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })} /></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Student</DialogTitle>
            <DialogDescription>Are you sure you want to remove {deleteStudent?.name}? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Teachers Page ----
function TeachersPage() {
  const { toast } = useToast();
  const [teachersList, setTeachersList] = useState(initialTeachers);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editTeacher, setEditTeacher] = useState<typeof initialTeachers[0] | null>(null);
  const [deleteTeacher, setDeleteTeacher] = useState<typeof initialTeachers[0] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", dept: "CSE", designation: "Assistant Prof", phone: "", password: "", subjectsAssigned: [] as string[], assignedClass: [] as string[] });

  const handleAdd = () => {
    const newTeacher = {
      id: `TCH${String(teachersList.length + 10).padStart(3, "0")}`,
      name: form.name,
      email: form.email,
      dept: form.dept,
      designation: form.designation,
      phone: form.phone,
      password: form.password || "default@123",
      subjects: 0,
      status: "Active",
      assignedClass: form.assignedClass,
      subjectsAssigned: form.subjectsAssigned,
    };
    setTeachersList([...teachersList, newTeacher]);
    setShowAdd(false);
    setForm({ name: "", email: "", dept: "CSE", designation: "Assistant Prof", phone: "", password: "", subjectsAssigned: [], assignedClass: [] });
    toast({ title: "Teacher Added", description: `${form.name} has been registered successfully.` });
  };

  const handleEdit = () => {
    if (!editTeacher) return;
    setTeachersList(teachersList.map((t) => (t.id === editTeacher.id ? editTeacher : t)));
    setShowEdit(false);
    toast({ title: "Teacher Updated", description: `${editTeacher.name}'s details have been updated.` });
  };

  const handleDelete = () => {
    if (!deleteTeacher) return;
    setTeachersList(teachersList.filter((t) => t.id !== deleteTeacher.id));
    setShowDelete(false);
    toast({ title: "Teacher Removed", description: `${deleteTeacher.name} has been removed from the system.` });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Teachers" value={teachersList.length} icon={<GraduationCap className="w-5 h-5" />} />
        <StatCard title="Professors" value={teachersList.filter(t => t.designation.includes("Professor")).length} icon={<Users className="w-5 h-5" />} variant="accent" />
        <StatCard title="Active" value={teachersList.filter(t => t.status === "Active").length} icon={<Users className="w-5 h-5" />} variant="success" />
        <StatCard title="On Leave" value={teachersList.filter(t => t.status === "On Leave").length} icon={<Users className="w-5 h-5" />} variant="warning" />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-sans font-semibold">Manage Teachers</CardTitle>
          <Button size="sm" onClick={() => setShowAdd(true)}><UserPlus className="w-4 h-4 mr-1" /> Add Teacher</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Assigned Class</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachersList.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{t.email}</TableCell>
                  <TableCell className="text-muted-foreground">{t.dept}</TableCell>
                  <TableCell className="text-sm">{t.designation}</TableCell>
                  <TableCell>
                    <PasswordCell password={t.password} />
                  </TableCell>
                  <TableCell className="text-sm">{t.assignedClass.length > 0 ? t.assignedClass.join(", ") : "—"}</TableCell>
                  <TableCell>{t.subjects}</TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditTeacher({ ...t }); setShowEdit(true); }}><Edit className="w-3.5 h-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { setDeleteTeacher(t); setShowDelete(true); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Teacher Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>Fill in the details to register a new teacher.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. John Doe" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@uni.edu" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Password</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={form.dept} onValueChange={(v) => setForm({ ...form, dept: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Select value={form.designation} onValueChange={(v) => setForm({ ...form, designation: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Prof">Associate Prof</SelectItem>
                    <SelectItem value="Assistant Prof">Assistant Prof</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subjects Assigned</Label>
              <div className="grid grid-cols-2 gap-2">
                {initialSubjects.map((sub) => (
                  <label key={sub.code} className="flex items-center gap-2 text-sm cursor-pointer p-1.5 rounded-md border border-border hover:bg-accent/50">
                    <input
                      type="checkbox"
                      checked={form.subjectsAssigned.includes(sub.code)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm({ ...form, subjectsAssigned: [...form.subjectsAssigned, sub.code] });
                        } else {
                          setForm({ ...form, subjectsAssigned: form.subjectsAssigned.filter((c) => c !== sub.code) });
                        }
                      }}
                      className="rounded"
                    />
                    <span>{sub.code} - {sub.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assigned Class</Label>
              <div className="grid grid-cols-2 gap-2">
                {classOptions.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm cursor-pointer p-1.5 rounded-md border border-border hover:bg-accent/50">
                    <input
                      type="checkbox"
                      checked={form.assignedClass.includes(c)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm({ ...form, assignedClass: [...form.assignedClass, c] });
                        } else {
                          setForm({ ...form, assignedClass: form.assignedClass.filter((x) => x !== c) });
                        }
                      }}
                      className="rounded"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name || !form.email}>Add Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>Update teacher details.</DialogDescription>
          </DialogHeader>
          {editTeacher && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input value={editTeacher.name} onChange={(e) => setEditTeacher({ ...editTeacher, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={editTeacher.email} onChange={(e) => setEditTeacher({ ...editTeacher, email: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={editTeacher.dept} onValueChange={(v) => setEditTeacher({ ...editTeacher, dept: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="ECE">ECE</SelectItem>
                      <SelectItem value="ME">ME</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Select value={editTeacher.designation} onValueChange={(v) => setEditTeacher({ ...editTeacher, designation: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Prof">Associate Prof</SelectItem>
                      <SelectItem value="Assistant Prof">Assistant Prof</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Phone</Label><Input value={editTeacher.phone} onChange={(e) => setEditTeacher({ ...editTeacher, phone: e.target.value })} /></div>
              </div>
              <div className="space-y-2">
                <Label>Subjects Assigned</Label>
                <div className="grid grid-cols-2 gap-2">
                  {initialSubjects.map((sub) => (
                    <label key={sub.code} className="flex items-center gap-2 text-sm cursor-pointer p-1.5 rounded-md border border-border hover:bg-accent/50">
                      <input
                        type="checkbox"
                        checked={editTeacher.subjectsAssigned?.includes(sub.code) || false}
                        onChange={(e) => {
                          const current = editTeacher.subjectsAssigned || [];
                          if (e.target.checked) {
                            setEditTeacher({ ...editTeacher, subjectsAssigned: [...current, sub.code] });
                          } else {
                            setEditTeacher({ ...editTeacher, subjectsAssigned: current.filter((c: string) => c !== sub.code) });
                          }
                        }}
                        className="rounded"
                      />
                      <span>{sub.code} - {sub.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assigned Class</Label>
                <div className="grid grid-cols-2 gap-2">
                  {classOptions.map((c) => (
                    <label key={c} className="flex items-center gap-2 text-sm cursor-pointer p-1.5 rounded-md border border-border hover:bg-accent/50">
                      <input
                        type="checkbox"
                        checked={editTeacher.assignedClass?.includes(c) || false}
                        onChange={(e) => {
                          const current = editTeacher.assignedClass || [];
                          if (e.target.checked) {
                            setEditTeacher({ ...editTeacher, assignedClass: [...current, c] });
                          } else {
                            setEditTeacher({ ...editTeacher, assignedClass: current.filter((x: string) => x !== c) });
                          }
                        }}
                        className="rounded"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Teacher</DialogTitle>
            <DialogDescription>Are you sure you want to remove {deleteTeacher?.name}? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Subjects Page ----
function SubjectsPage() {
  const { toast } = useToast();
  const [subjectsList, setSubjectsList] = useState(initialSubjects);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editSubject, setEditSubject] = useState<typeof initialSubjects[0] | null>(null);
  const [form, setForm] = useState({ code: "", name: "", dept: "CSE", teacher: "", semester: "1st", credits: 3 });

  const handleAdd = () => {
    const newSubject = { ...form, students: 0 };
    setSubjectsList([...subjectsList, newSubject]);
    setShowAdd(false);
    setForm({ code: "", name: "", dept: "CSE", teacher: "", semester: "1st", credits: 3 });
    toast({ title: "Subject Added", description: `${form.name} (${form.code}) has been created.` });
  };

  const handleEdit = () => {
    if (!editSubject) return;
    setSubjectsList(subjectsList.map((s) => (s.code === editSubject.code ? editSubject : s)));
    setShowEdit(false);
    toast({ title: "Subject Updated", description: `${editSubject.name} has been updated.` });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Subjects" value={subjectsList.length} icon={<BookOpen className="w-5 h-5" />} />
        <StatCard title="CSE Subjects" value={subjectsList.filter(s => s.dept === "CSE").length} icon={<BookOpen className="w-5 h-5" />} variant="accent" />
        <StatCard title="Total Credits" value={subjectsList.reduce((a, s) => a + s.credits, 0)} icon={<BarChart3 className="w-5 h-5" />} />
        <StatCard title="Avg Students" value={Math.round(subjectsList.reduce((a, s) => a + s.students, 0) / subjectsList.length)} icon={<Users className="w-5 h-5" />} variant="success" />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-sans font-semibold">Manage Subjects</CardTitle>
          <Button size="sm" onClick={() => setShowAdd(true)}>+ Add Subject</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Credits</TableHead>
                
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjectsList.map((s) => (
                <TableRow key={s.code}>
                  <TableCell className="font-mono text-xs">{s.code}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.dept}</TableCell>
                  <TableCell>{s.semester}</TableCell>
                  <TableCell>{s.credits}</TableCell>
                  
                  
                  <TableCell>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditSubject({ ...s }); setShowEdit(true); }}><Edit className="w-3.5 h-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Subject Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>Create a new subject and assign it to a department.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Subject Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="CS501" /></div>
              <div className="space-y-2"><Label>Subject Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Machine Learning" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={form.dept} onValueChange={(v) => setForm({ ...form, dept: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={form.semester} onValueChange={(v) => setForm({ ...form, semester: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Credits</Label><Input type="number" value={form.credits} onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })} /></div>
            </div>
            
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.code || !form.name}>Add Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>Update subject details.</DialogDescription>
          </DialogHeader>
          {editSubject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Subject Code</Label><Input value={editSubject.code} disabled /></div>
                <div className="space-y-2"><Label>Subject Name</Label><Input value={editSubject.name} onChange={(e) => setEditSubject({ ...editSubject, name: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={editSubject.dept} onValueChange={(v) => setEditSubject({ ...editSubject, dept: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="ECE">ECE</SelectItem>
                      <SelectItem value="ME">ME</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={editSubject.semester} onValueChange={(v) => setEditSubject({ ...editSubject, semester: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Credits</Label><Input type="number" value={editSubject.credits} onChange={(e) => setEditSubject({ ...editSubject, credits: Number(e.target.value) })} /></div>
              </div>
              
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// ---- Classes Page ----
const initialClasses = [
  { id: "CLS001", name: "CSE-A", department: "CSE", year: "3rd", semester: "5th", students: 48, classTeacher: "Dr. Sarah Williams" },
  { id: "CLS002", name: "CSE-B", department: "CSE", year: "3rd", semester: "5th", students: 45, classTeacher: "Prof. John Smith" },
  { id: "CLS003", name: "ECE-A", department: "ECE", year: "2nd", semester: "3rd", students: 42, classTeacher: "Dr. Lisa Wang" },
  { id: "CLS004", name: "ECE-B", department: "ECE", year: "2nd", semester: "3rd", students: 40, classTeacher: "—" },
  { id: "CLS005", name: "ME-A", department: "ME", year: "4th", semester: "7th", students: 50, classTeacher: "Prof. Alan Brown" },
  { id: "CLS006", name: "ME-B", department: "ME", year: "4th", semester: "7th", students: 38, classTeacher: "—" },
  { id: "CLS007", name: "CE-A", department: "CE", year: "1st", semester: "1st", students: 44, classTeacher: "Dr. Priya Sharma" },
  { id: "CLS008", name: "CE-B", department: "CE", year: "1st", semester: "1st", students: 36, classTeacher: "—" },
];

function ClassesPage() {
  const { toast } = useToast();
  const [classesList, setClassesList] = useState(initialClasses);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editClass, setEditClass] = useState<typeof initialClasses[0] | null>(null);
  const [deleteClass, setDeleteClass] = useState<typeof initialClasses[0] | null>(null);
  const [form, setForm] = useState({ name: "", department: "CSE", school: "School of Computer Sciences" });
  const [search, setSearch] = useState("");

  const filtered = classesList.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.department.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    const newClass = {
      id: `CLS${String(classesList.length + 20).padStart(3, "0")}`,
      name: form.name,
      department: form.department,
      school: form.school,
      year: "1st",
      semester: "1st",
      students: 0,
      classTeacher: "—",
    };
    setClassesList([...classesList, newClass]);
    setShowAdd(false);
    setForm({ name: "", department: "CSE", school: "School of Computer Sciences" });
    toast({ title: "Class Added", description: `${form.name} has been created successfully.` });
  };

  const handleEdit = () => {
    if (!editClass) return;
    setClassesList(classesList.map((c) => (c.id === editClass.id ? editClass : c)));
    setShowEdit(false);
    toast({ title: "Class Updated", description: `${editClass.name} has been updated.` });
  };

  const handleDelete = () => {
    if (!deleteClass) return;
    setClassesList(classesList.filter((c) => c.id !== deleteClass.id));
    setShowDelete(false);
    toast({ title: "Class Removed", description: `${deleteClass.name} has been removed.` });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Classes" value={classesList.length} icon={<School className="w-5 h-5" />} />
        <StatCard title="CSE" value={classesList.filter(c => c.department === "CSE").length} icon={<Building2 className="w-5 h-5" />} variant="accent" />
        <StatCard title="ECE" value={classesList.filter(c => c.department === "ECE").length} icon={<Building2 className="w-5 h-5" />} />
        <StatCard title="Total Students" value={classesList.reduce((sum, c) => sum + c.students, 0)} icon={<Users className="w-5 h-5" />} variant="success" />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-sans font-semibold">Manage Classes</CardTitle>
          <div className="flex gap-2">
            <Input placeholder="Search..." className="h-8 w-40 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button size="sm" onClick={() => setShowAdd(true)}><UserPlus className="w-4 h-4 mr-1" /> Add Class</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Class Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.department}</TableCell>
                  <TableCell>{c.students}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditClass({ ...c }); setShowEdit(true); }}><Edit className="w-3.5 h-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { setDeleteClass(c); setShowDelete(true); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Class Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>Fill in the details to create a new class.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Class Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. CSE-A" /></div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>School of Sciences</Label>
              <Select value={form.school} onValueChange={(v) => setForm({ ...form, school: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="School of Computer Sciences">School of Computer Sciences</SelectItem>
                  <SelectItem value="School of Mechanical Sciences">School of Mechanical Sciences</SelectItem>
                  <SelectItem value="School of Electrical Sciences">School of Electrical Sciences</SelectItem>
                  <SelectItem value="School of Civil Sciences">School of Civil Sciences</SelectItem>
                  <SelectItem value="School of Chemical Sciences">School of Chemical Sciences</SelectItem>
                  <SelectItem value="School of Biological Sciences">School of Biological Sciences</SelectItem>
                  <SelectItem value="School of Physical Sciences">School of Physical Sciences</SelectItem>
                  <SelectItem value="School of Mathematical Sciences">School of Mathematical Sciences</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name}>Add Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>Update class details.</DialogDescription>
          </DialogHeader>
          {editClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Class Name</Label><Input value={editClass.name} onChange={(e) => setEditClass({ ...editClass, name: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={editClass.department} onValueChange={(v) => setEditClass({ ...editClass, department: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="ECE">ECE</SelectItem>
                      <SelectItem value="ME">ME</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>School of Sciences</Label>
                <Select value={(editClass as any).school || "School of Computer Sciences"} onValueChange={(v) => setEditClass({ ...editClass, school: v } as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="School of Computer Sciences">School of Computer Sciences</SelectItem>
                    <SelectItem value="School of Mechanical Sciences">School of Mechanical Sciences</SelectItem>
                    <SelectItem value="School of Electrical Sciences">School of Electrical Sciences</SelectItem>
                    <SelectItem value="School of Civil Sciences">School of Civil Sciences</SelectItem>
                    <SelectItem value="School of Chemical Sciences">School of Chemical Sciences</SelectItem>
                    <SelectItem value="School of Biological Sciences">School of Biological Sciences</SelectItem>
                    <SelectItem value="School of Physical Sciences">School of Physical Sciences</SelectItem>
                    <SelectItem value="School of Mathematical Sciences">School of Mathematical Sciences</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Class</DialogTitle>
            <DialogDescription>Are you sure you want to remove {deleteClass?.name}? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


const AcademicDashboard = () => {
  const location = useLocation();
  const path = location.pathname;

  let content;
  if (path === "/academic/students") content = <StudentsPage />;
  else if (path === "/academic/teachers") content = <TeachersPage />;
  else if (path === "/academic/subjects") content = <SubjectsPage />;
  else if (path === "/academic/classes") content = <ClassesPage />;
  else content = <AcademicDashboardPage />;

  return (
    <DashboardLayout title="Academic Section" subtitle="Administration Panel" navItems={navItems} role="Admin">
      {content}
    </DashboardLayout>
  );
};

export default AcademicDashboard;
