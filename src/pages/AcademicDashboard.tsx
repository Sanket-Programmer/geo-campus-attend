import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
// import StatCard from "@/components/StatCard";
import {
  Users,
  BookOpen,
  GraduationCap,
  UserPlus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  School,
  LayoutDashboard,
  Search,
  Hash,
  Mail,
  Phone,
  Plus,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { authFetch } from "../../utils/authFetch";

const navItems = [
  { title: "Dashboard", url: "/academic", icon: LayoutDashboard },
  { title: "Students Management", url: "/academic/students", icon: Users },
  {
    title: "Teacher Management",
    url: "/academic/teachers",
    icon: GraduationCap,
  },
  { title: "Classes Management", url: "/academic/classes", icon: School },
  { title: "Subjects Management", url: "/academic/subjects", icon: BookOpen },
];

// ---- Dashboard Page ----
const StatCard = ({ title, value, icon, variant }) => {
  const variantStyles = {
    primary: "bg-blue-50 text-blue-600 border-blue-100",
    accent: "bg-indigo-50 text-indigo-600 border-indigo-100",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden border-border/50">
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-2 rounded-lg border transition-transform group-hover:scale-110 duration-300 ${variantStyles[variant] || "bg-muted text-muted-foreground"}`}
          >
            {icon}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
            {title}
          </p>
        </div>
        <p className="text-2xl font-black tracking-tighter truncate text-foreground">
          {value}
        </p>
      </CardContent>
    </Card>
  );
};

function AcademicDashboardPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectsList, setSubjectsList] = useState([]);

  // --- PRESERVED BACKEND LOGIC ---
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const res = await authFetch(
          "http://localhost:5000/api/departments/details",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (!res) return;
        const data = await res.json();
        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Error fetching department details:", err);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await authFetch("http://localhost:5000/api/subjects", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res) return;
        const data = await res.json();
        setSubjectsList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Error fetching subjects:", err);
        setSubjectsList([]);
      }
    };
    fetchSubjects();
  }, []);

  const totalStudents = departments.reduce(
    (sum, d) => sum + Number(d.total_students),
    0,
  );
  const totalTeachers = departments.reduce(
    (sum, d) => sum + Number(d.total_teachers),
    0,
  );
  const totalSubjects = subjectsList.length;
  const totalClasses = departments.reduce(
    (sum, d) => sum + Number(d.total_classes),
    0,
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-2 mb-2">
        <LayoutDashboard className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-black tracking-tight uppercase">
          Academic Overview
        </h1>
      </div>

      {/* MODERN STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students Added"
          value={String(totalStudents)}
          icon={<GraduationCap className="w-4 h-4" />}
          variant="success"
        />
        <StatCard
          title="Total Teachers Addded"
          value={String(totalTeachers)}
          icon={<Users className="w-4 h-4" />}
          variant="accent"
        />
        <StatCard
          title="Total Subjects Added"
          value={String(totalSubjects)}
          icon={<BookOpen className="w-4 h-4" />}
          variant="primary"
        />
        <StatCard
          title="Total Classes Added"
          value={String(totalClasses)}
          icon={<School className="w-4 h-4" />}
          variant="warning"
        />
      </div>

      {/* MODERN TABLE VIEW */}
      <Card className="border-none shadow-md bg-card/60 ring-1 ring-border/50 overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            Department Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-6 h-12">
                  Department Name
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-8">
                  School
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-6 text-center">
                  Resources
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-6 text-right">
                  Capacity
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-20 animate-pulse font-bold text-muted-foreground"
                  >
                    Retrieving Academic Data...
                  </TableCell>
                </TableRow>
              ) : departments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-20 font-bold text-muted-foreground"
                  >
                    No department records available.
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((d: any) => (
                  <TableRow
                    key={d.department_id}
                    className="group hover:bg-primary/[0.02] transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div>
                        <p className="font-bold text-sm text-foreground uppercase">
                          {d.department_name}
                        </p>
                        <p className="text-[9px] font-mono text-muted-foreground">
                          ID: {d.department_id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge
                        variant="outline"
                        className="bg-background font-bold text-[10px] uppercase rounded-md border-border/60"
                      >
                        {d.school_name}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 text-center">
                      <div className="inline-flex items-center gap-4 text-xs font-bold">
                        <div className="flex flex-col items-center">
                          <span className="text-muted-foreground text-[9px] uppercase font-black">
                            Tch
                          </span>
                          <span>{d.total_teachers}</span>
                        </div>
                        <div className="w-px h-4 bg-border" />
                        <div className="flex flex-col items-center">
                          <span className="text-muted-foreground text-[9px] uppercase font-black">
                            Sub
                          </span>
                          <span>{d.total_subjects}</span>
                        </div>
                        <div className="w-px h-4 bg-border" />
                        <div className="flex flex-col items-center">
                          <span className="text-muted-foreground text-[9px] uppercase font-black">
                            Cls
                          </span>
                          <span>{d.total_classes}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <div className="inline-block text-right">
                        <p className="text-sm font-black text-primary">
                          {d.total_students}
                        </p>
                        <p className="text-[9px] font-black uppercase text-muted-foreground">
                          Students
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Students Page ----
function StudentsPage() {
  interface Student {
    regd: string;
    name: string;
    email: string;
    dept: string;
    department_id: string;
    password: string;
    class_id: string;
    semester: string;
    phone: string;
    subjectsRegistered?: string[];
  }

  const API = "http://localhost:5000/api/students";
  const { toast } = useToast();

  const [studentsList, setStudentsList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [search, setSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({
    regd: "",
    name: "",
    email: "",
    dept: "",
    department_id: "",
    class_id: "",
    phone: "",
    password: "",
    semester: "",
    subjectsRegistered: [] as string[],
  });

  const fetchStudents = async () => {
    try {
      const res = await authFetch(API, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, //added authorization header
      });
      if (!res) return;
      const data = await res.json();
      setStudentsList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await authFetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }, //added authorization header
        body: JSON.stringify(form),
      });
      if (!res) return;
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchStudents();
      setShowAdd(false);
      setForm({
        regd: "",
        name: "",
        email: "",
        dept: "",
        department_id: "",
        class_id: "",
        phone: "",
        password: "",
        semester: "",
        subjectsRegistered: [],
      });
      toast({ title: "Success", description: "Student added successfully." });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!editStudent) return;
    try {
      const res = await authFetch(`${API}/${editStudent.regd}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }, //added authorization header
        body: JSON.stringify(editStudent),
      });
      if (!res) return;
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchStudents();
      setShowEdit(false);
      toast({ title: "Updated", description: "Student details updated." });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOpenEdit = async (regd: string) => {
    const res = await authFetch(`${API}/${regd}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, //added authorization header
    });
    if (!res) return;
    const data = await res.json();
    await fetchSubjectsByDept(data.dept, data.semester);
    setEditStudent(data);
    setShowEdit(true);
  };

  const handleDelete = async () => {
    if (!deleteStudent) return;
    try {
      const res = await authFetch(`${API}/${deleteStudent.regd}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, //added authorization header
      });
      if (!res) return;
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchStudents();
      setShowDelete(false);
      toast({ title: "Deleted", description: "Student record removed." });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchSubjectsByDept = async (dept: string, semester: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/subjects/by-department/${dept}?semester=${semester}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, //added authorization header
        },
      );
      if (!res) return;
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      setSubjects([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await authFetch("http://localhost:5000/api/classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res1) {
        const data1 = await res1.json();
        setClasses(data1);
      }
      const res2 = await authFetch(
        "http://localhost:5000/api/departments/details",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      if (!res2) return;

      const data2 = await res2.json();
      setDepartments(Array.isArray(data2) ? data2 : []);
    };

    fetchData();
  }, []);

useEffect(() => {
  if (form.dept && form.semester) {
    fetchSubjectsByDept(form.dept, form.semester);
  } else {
    setSubjects([]);
  }
}, [form.dept, form.semester]);

  const filtered = studentsList.filter((s) => {
    const name = s.name?.toLowerCase() || "";
    const regd = String(s.regd ?? "");
    return name.includes(search.toLowerCase()) || regd.includes(search);
  });

  return (
    <div className="space-y-6 animate-slide-in">
      <Card className="border-none shadow-md bg-card/50">
        <CardHeader className="flex lg:flex-row flex-col justify-between space-y-0 pb-7 gap-4">
          <CardTitle className="text-xl font-bold tracking-tight">
            Student Directory
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or regd..."
                className="pl-8 bg-background/50 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setShowAdd(true)}
              className="px-6 w-full md:w-auto"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[120px]">Regd No.</TableHead>
                  <TableHead>Student Details</TableHead>
                  <TableHead>Contact Details</TableHead>
                  <TableHead>Academic Info</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.regd} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm font-semibold">
                      {s.regd || s.student_id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{s.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" /> {s.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" /> {s.phone || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-medium">
                          {s.dept}
                        </Badge>
                        <span className="text-xs font-medium text-muted-foreground">
                          {s.classes} • {s.semester}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-primary"
                          onClick={() => handleOpenEdit(s.regd)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive"
                          onClick={() => {
                            setDeleteStudent(s);
                            setShowDelete(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ADD DIALOG */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="w-[95vw] sm:max-w-[650px] p-0 overflow-hidden rounded-2xl border-none max-h-[95vh] flex flex-col">
          <div className="bg-primary px-6 py-6 md:py-8 text-primary-foreground shrink-0">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <UserPlus className="h-5 w-5 md:h-6 md:w-6" /> Register New
                Student
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80 text-xs md:text-sm">
                Enter student credentials and assign academic batches.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-background">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">
                    Registration Number
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="e.g. 2101..."
                      value={form.regd}
                      onChange={(e) =>
                        setForm({ ...form, regd: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">
                    Full Name
                  </Label>
                  <Input
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="john@university.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">
                    Phone
                  </Label>
                  <Input
                    placeholder="10-digit number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">
                    Department
                  </Label>
                  <Select
                    value={form.department_id}
                    onValueChange={(v) => {
                      const deptName = departments.find(
                        (d) => String(d.department_id) === v,
                      )?.department_name;

                      setForm({
                        ...form,
                        department_id: v,
                        dept: deptName || "",
                        subjectsRegistered: [],
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Dept" />
                    </SelectTrigger>

                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem
                          key={d.department_id}
                          value={String(d.department_id)}
                        >
                          {d.department_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">
                    Semester
                  </Label>
                  <Select
                    value={form.semester}
                    onValueChange={(v) =>
                      setForm({ ...form, semester: v, subjectsRegistered: [] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Semester"/>
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "1st",
                        "2nd",
                        "3rd",
                        "4th",
                        "5th",
                        "6th",
                        "7th",
                        "8th",
                      ].map((sem) => (
                        <SelectItem key={sem} value={sem}>
                          {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">
                    Class Batch
                  </Label>
                  <Select
                    value={form.class_id}
                    onValueChange={(v) => setForm({ ...form, class_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>

                    <SelectContent>
                      {classes.map((c: any) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">
                    Login Password
                  </Label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-12"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-3">
                <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <BookOpen className="h-3 w-3" /> Subject Enrolment
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-1">
                  {subjects.map((sub: any) => (
                    <label
                      key={sub.subject_code}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${form.subjectsRegistered.includes(sub.subject_code) ? "bg-primary/5 border-primary ring-1 ring-primary" : "hover:bg-muted"}`}
                    >
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={form.subjectsRegistered.includes(
                          sub.subject_code,
                        )}
                        onChange={(e) => {
                          const list = form.subjectsRegistered;
                          setForm({
                            ...form,
                            subjectsRegistered: e.target.checked
                              ? [...list, sub.subject_code]
                              : list.filter((i) => i !== sub.subject_code),
                          });
                        }}
                      />
                      <span className="truncate">
                        {sub.subject_code} - {sub.subject_name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 md:p-6 bg-muted/30 border-t shrink-0 flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAdd(false)}
              className="bg-red-500 text-white hover:bg-red-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.name || form.dept === "Select Dept"}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="w-[95vw] sm:max-w-[650px] p-0 overflow-hidden rounded-2xl border-none max-h-[95vh] flex flex-col">
          {editStudent && (
            <>
              <div className="px-6 py-5 shrink-0 bg-primary text-primary-foreground">
                <DialogHeader>
                  <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    <Edit className="h-5 w-5 md:h-6 md:w-6" /> Update Profile
                  </DialogTitle>
                  <p className="text-xs md:text-sm text-left">
                    Editing: {editStudent.name}
                  </p>
                </DialogHeader>
              </div>

              <div className="p-4 md:p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-background">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">
                        Name
                      </Label>
                      <Input
                        value={editStudent.name}
                        onChange={(e) =>
                          setEditStudent({
                            ...editStudent,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">
                        Phone
                      </Label>
                      <Input
                        value={editStudent.phone}
                        onChange={(e) =>
                          setEditStudent({
                            ...editStudent,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">
                        Dept
                      </Label>
                      <Select
                        value={String(editStudent.department_id || "")}
                        onValueChange={(v) => {
                          const up = {
                            ...editStudent,
                            department_id: v,
                            dept: departments.find(
                              (d) => String(d.department_id) === v,
                            )?.department_name,
                            subjectsRegistered: [],
                          };

                          setEditStudent(up);
                          fetchSubjectsByDept(up.dept, up.semester); // keep this if your subject API uses dept name
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Dept" />
                        </SelectTrigger>

                        <SelectContent>
                          {departments.map((d: any) => (
                            <SelectItem
                              key={d.department_id}
                              value={String(d.department_id)}
                            >
                              {d.department_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">
                        Sem
                      </Label>
                      <Select
                        value={editStudent.semester}
                        onValueChange={(v) => {
                          const up = {
                            ...editStudent,
                            semester: v,
                            subjectsRegistered: [],
                          };
                          setEditStudent(up);
                          fetchSubjectsByDept(up.dept, v);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "1st",
                            "2nd",
                            "3rd",
                            "4th",
                            "5th",
                            "6th",
                            "7th",
                            "8th",
                          ].map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">
                      Class
                    </Label>

                    <Select
                      value={String(editStudent.class_id || "")}
                      onValueChange={(v) =>
                        setEditStudent({
                          ...editStudent,
                          class_id: v,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>

                      <SelectContent>
                        {classes.map((c: any) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-3 pt-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">
                      Enrolled Subjects
                    </Label>
                    <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-2">
                      {subjects.map((sub: any) => (
                        <label
                          key={sub.subject_code}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${editStudent.subjectsRegistered?.includes(sub.subject_code) ? "" : "hover:bg-muted"}`}
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-muted-foreground">
                              {sub.subject_code}
                            </span>
                            <span className="text-sm font-semibold">
                              {sub.subject_name}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded-full accent-primary"
                            checked={editStudent.subjectsRegistered?.includes(
                              sub.subject_code,
                            )}
                            onChange={(e) => {
                              const list = editStudent.subjectsRegistered || [];
                              setEditStudent({
                                ...editStudent,
                                subjectsRegistered: e.target.checked
                                  ? [...list, sub.subject_code]
                                  : list.filter((i) => i !== sub.subject_code),
                              });
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-4 md:p-6 bg-muted/30 border-t shrink-0 flex-row justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEdit(false)}
                  className="bg-red-500 text-white hover:bg-red-400"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/80 text-white"
                  onClick={handleEdit}
                >
                  Save
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="w-[95vw] sm:max-w-[500px] rounded-2xl">
          <DialogHeader className="items-center text-center">
            <div className="h-12 w-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-2">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl">Confirm Deletion</DialogTitle>
            <DialogDescription className="pt-2 text-sm">
              Are you sure you want to remove <b>{deleteStudent?.name}</b>?
              <br className="hidden sm:block" /> This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDelete(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full sm:w-auto"
            >
              Delete Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Teachers Page ----
function TeachersPage() {
  interface Teacher {
    id: string;
    name: string;
    email: string;
    dept: string;
    designation: string;
    phone: string;
    password?: string;
    subjectsAssigned?: string[];
    assignedClass?: string[];
  }

  const { toast } = useToast();

  const API = "http://localhost:5000/api/teachers";

  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<any[]>([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [deleteTeacher, setDeleteTeacher] = useState<Teacher | null>(null);

  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    dept: "",
    designation: "",
    phone: "",
    password: "",
    subjectsAssigned: [] as string[],
    assignedClass: [] as string[],
  });

  const fetchTeachers = async () => {
    try {
      const res = await authFetch(API, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res) return;

      const data = await res.json();
      setTeachersList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubjectsAndClassesBySchool = async (deptName: string) => {
    try {
      const token = localStorage.getItem("token");

      const [subRes, classRes] = await Promise.all([
        authFetch(`http://localhost:5000/api/subjects/by-school/${deptName}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        authFetch(`http://localhost:5000/api/classes/by-school/${deptName}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!subRes || !classRes) return;

      const subData = await subRes.json();
      const classData = await classRes.json();

      setFilteredSubjects(Array.isArray(subData) ? subData : []);
      setFilteredClasses(Array.isArray(classData) ? classData : []);
    } catch (err) {
      console.log("Error fetching filtered data:", err);
      setFilteredSubjects([]);
      setFilteredClasses([]);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await authFetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (!res) return;

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to add teacher",
          variant: "destructive",
        });
        return;
      }

      fetchTeachers();
      setShowAdd(false);

      setForm({
        id: "",
        name: "",
        email: "",
        dept: "",
        designation: "",
        phone: "",
        password: "",
        subjectsAssigned: [],
        assignedClass: [],
      });

      toast({
        title: "Teacher Added",
        description: "Teacher has been registered successfully.",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async () => {
    if (!editTeacher) return;

    try {
      const res = await authFetch(`${API}/${editTeacher.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editTeacher),
      });

      if (!res) return;

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to update teacher",
          variant: "destructive",
        });
        return;
      }

      fetchTeachers();
      setShowEdit(false);

      toast({
        title: "Teacher Updated",
        description: "Teacher details updated successfully.",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTeacher) return;

    try {
      const res = await authFetch(`${API}/${deleteTeacher.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res) return;

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to delete teacher",
          variant: "destructive",
        });
        return;
      }

      fetchTeachers();
      setShowDelete(false);

      toast({
        title: "Teacher Removed",
        description: "Teacher removed successfully.",
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchTeachers();

      const token = localStorage.getItem("token");

      const res1 = await authFetch("http://localhost:5000/api/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res1) {
        const data1 = await res1.json();
        setSubjects(Array.isArray(data1) ? data1 : []);
      }

      const res2 = await authFetch("http://localhost:5000/api/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res2) {
        const data2 = await res2.json();
        setClasses(Array.isArray(data2) ? data2 : []);
      }

      const res3 = await authFetch(
        "http://localhost:5000/api/departments/details",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res3) {
        const data3 = await res3.json();
        setDepartments(Array.isArray(data3) ? data3 : []);
      }
    };

    fetchData();
  }, []);

  const DataPill = ({ items }: { items?: string[] }) => {
    if (!items || items.length === 0)
      return <span className="text-muted-foreground">—</span>;

    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <Card className="border-none shadow-md bg-card/50">
        <CardHeader className="pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Manage Teachers
            </CardTitle>
          </div>

          <Button
            size="sm"
            onClick={() => setShowAdd(true)}
            className="w-full md:w-auto shadow-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Add Teacher
          </Button>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <Table className="w-full whitespace-nowrap">
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">ID</TableHead>
                  <TableHead>Teacher Info</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Assigned Class</TableHead>
                  <TableHead>Assigned Subjects</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {teachersList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No teachers found. Click "Add Teacher" to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  teachersList.map((t) => (
                    <TableRow
                      key={t.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                        {t.id}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {t.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {t.email}
                          </span>
                          <span className="text-xs text-muted-foreground mt-0.5">
                            {t.phone}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{t.dept}</span>
                          <span className="text-xs text-muted-foreground">
                            {t.designation}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="max-w-[200px] whitespace-normal">
                        <DataPill items={t.assignedClass} />
                      </TableCell>

                      <TableCell className="max-w-[250px] whitespace-normal">
                        <DataPill items={t.subjectsAssigned} />
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 hover:bg-primary"
                            onClick={async () => {
                              const res = await authFetch(`${API}/${t.id}`, {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem(
                                    "token",
                                  )}`,
                                },
                              });

                              if (!res) return;

                              const data = await res.json();
                              setEditTeacher({ ...data, password: "" });

                              fetchSubjectsAndClassesBySchool(data.dept);

                              setShowEdit(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-destructive hover:bg-destructive"
                            onClick={() => {
                              setDeleteTeacher(t);
                              setShowDelete(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ADD DIALOG */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Teacher</DialogTitle>
            <DialogDescription>
              Fill in the details to register a new teacher in the system.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Dr. John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@uni.edu"
                />
              </div>

              <div className="space-y-2">
                <Label>Teacher ID</Label>
                <Input
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  placeholder="2311XXX"
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Enter 10-digit number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-2">
                <Label>Department</Label>

                <Select
                  value={form.dept}
                  onValueChange={(v) => {
                    setForm({
                      ...form,
                      dept: v,
                      subjectsAssigned: [],
                      assignedClass: [],
                    });

                    if (v !== "Select Dept") fetchSubjectsAndClassesBySchool(v);
                    else {
                      setFilteredSubjects([]);
                      setFilteredClasses([]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Dept" />
                  </SelectTrigger>

                  <SelectContent>
                    {departments.map((d: any) => (
                      <SelectItem
                        key={d.department_id}
                        value={d.department_name}
                      >
                        {d.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Designation</Label>
                <Select
                  value={form.designation}
                  onValueChange={(v) => setForm({ ...form, designation: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Desgn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Prof">
                      Associate Prof
                    </SelectItem>
                    <SelectItem value="Assistant Prof">
                      Assistant Prof
                    </SelectItem>
                    <SelectItem value="Contractual Faculty">
                      Contractual Faculty
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <Label>Subjects Assigned</Label>
                <div className="grid gap-2 max-h-40 overflow-y-auto p-1">
                  {filteredSubjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md text-center">
                      No subjects found for this dept.
                    </p>
                  ) : (
                    filteredSubjects.map((sub) => (
                      <label
                        key={sub.subject_id}
                        className={`flex items-center gap-3 text-sm cursor-pointer p-2.5 rounded-lg border border-border transition-colors ${form.subjectsAssigned.includes(sub.subject_code) ? "bg-primary/5 border-primary ring-1 ring-primary" : "hover:bg-muted"}`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-primary"
                          checked={form.subjectsAssigned.includes(
                            sub.subject_code,
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm({
                                ...form,
                                subjectsAssigned: [
                                  ...form.subjectsAssigned,
                                  sub.subject_code,
                                ],
                              });
                            } else {
                              setForm({
                                ...form,
                                subjectsAssigned: form.subjectsAssigned.filter(
                                  (x) => x !== sub.subject_code,
                                ),
                              });
                            }
                          }}
                        />
                        <span className="font-medium">
                          {sub.subject_code}{" "}
                          <span className="text-muted-foreground font-normal ml-1">
                            - {sub.subject_name}
                          </span>
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Assigned Class</Label>
                <div className="grid gap-2 max-h-40 overflow-y-auto p-1">
                  {filteredClasses.length === 0 ? (
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md text-center">
                      No classes found for this dept.
                    </p>
                  ) : (
                    filteredClasses.map((c) => (
                      <label
                        key={c.class_id}
                        className={`flex items-center gap-3 text-sm cursor-pointer p-2.5 rounded-lg border border-border transition-colors ${form.assignedClass.includes(c.class_name) ? "bg-primary/5 border-primary ring-1 ring-primary" : "hover:bg-muted"}`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-primary"
                          checked={form.assignedClass.includes(c.class_name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm({
                                ...form,
                                assignedClass: [
                                  ...form.assignedClass,
                                  c.class_name,
                                ],
                              });
                            } else {
                              setForm({
                                ...form,
                                assignedClass: form.assignedClass.filter(
                                  (x) => x !== c.class_name,
                                ),
                              });
                            }
                          }}
                        />
                        <span className="font-medium">{c.class_name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-red-500 text-white hover:bg-red-400"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </Button>

            <Button
              className="w-full sm:w-auto"
              onClick={handleAdd}
              disabled={
                !form.name || !form.email || form.dept === "Select Dept"
              }
            >
              Add Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Teacher</DialogTitle>
            <DialogDescription>
              Update details for {editTeacher?.name}.
            </DialogDescription>
          </DialogHeader>

          {editTeacher && (
            <div className="space-y-5 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={editTeacher.name}
                    onChange={(e) =>
                      setEditTeacher({ ...editTeacher, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editTeacher.email}
                    onChange={(e) =>
                      setEditTeacher({ ...editTeacher, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Teacher ID</Label>
                  <Input value={editTeacher.id} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editTeacher.phone}
                    onChange={(e) =>
                      setEditTeacher({ ...editTeacher, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>Department</Label>

                  <Select
                    value={editTeacher.dept}
                    onValueChange={(v) => {
                      setEditTeacher({
                        ...editTeacher,
                        dept: v,
                        subjectsAssigned: [],
                        assignedClass: [],
                      });

                      fetchSubjectsAndClassesBySchool(v);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>

                    <SelectContent>
                      {departments.map((d: any) => (
                        <SelectItem
                          key={d.department_id}
                          value={d.department_name}
                        >
                          {d.department_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Select
                    value={editTeacher.designation}
                    onValueChange={(v) =>
                      setEditTeacher({ ...editTeacher, designation: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Prof">
                        Associate Prof
                      </SelectItem>
                      <SelectItem value="Assistant Prof">
                        Assistant Prof
                      </SelectItem>
                      <SelectItem value="Contractual Faculty">
                        Contractual Faculty
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <Label>Subjects Assigned</Label>
                  <div className="grid gap-2 max-h-40 overflow-y-auto p-1">
                    {filteredSubjects.map((sub) => (
                      <label
                        key={sub.subject_id}
                        className="flex items-center gap-3 text-sm cursor-pointer p-2.5 rounded-lg border border-border hover:bg-gray-200 transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-primary"
                          checked={
                            editTeacher.subjectsAssigned?.includes(
                              sub.subject_code,
                            ) || false
                          }
                          onChange={(e) => {
                            const current = editTeacher.subjectsAssigned || [];

                            if (e.target.checked) {
                              setEditTeacher({
                                ...editTeacher,
                                subjectsAssigned: [
                                  ...current,
                                  sub.subject_code,
                                ],
                              });
                            } else {
                              setEditTeacher({
                                ...editTeacher,
                                subjectsAssigned: current.filter(
                                  (x) => x !== sub.subject_code,
                                ),
                              });
                            }
                          }}
                        />
                        <span className="font-medium">
                          {sub.subject_code}{" "}
                          <span className="text-muted-foreground font-normal ml-1">
                            - {sub.subject_name}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Assigned Class</Label>
                  <div className="grid gap-2 max-h-40 overflow-y-auto p-1">
                    {filteredClasses.map((c) => (
                      <label
                        key={c.class_id}
                        className="flex items-center gap-3 text-sm cursor-pointer p-2.5 rounded-lg border border-border hover:bg-gray-200 transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-primary"
                          checked={
                            editTeacher.assignedClass?.includes(c.class_name) ||
                            false
                          }
                          onChange={(e) => {
                            const current = editTeacher.assignedClass || [];

                            if (e.target.checked) {
                              setEditTeacher({
                                ...editTeacher,
                                assignedClass: [...current, c.class_name],
                              });
                            } else {
                              setEditTeacher({
                                ...editTeacher,
                                assignedClass: current.filter(
                                  (x) => x !== c.class_name,
                                ),
                              });
                            }
                          }}
                        />
                        <span className="font-medium">{c.class_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-red-500 text-white hover:bg-red-400"
              onClick={() => setShowEdit(false)}
            >
              Cancel
            </Button>

            <Button className="w-full sm:w-auto" onClick={handleEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="w-[95vw] sm:max-w-[400px] rounded-2xl p-6">
          <DialogHeader className="items-center text-center">
            <div className="h-12 w-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-2">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl">Remove Teacher</DialogTitle>
            <DialogDescription className="pt-2 text-sm">
              Are you sure you want to remove{" "}
              <b className="text-foreground">{deleteTeacher?.name}</b>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3 mt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleDelete}
            >
              Remove Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// ---- Subjects Page ----
const SEMESTER_OPTIONS = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
];

function SubjectsPage() {
  const { toast } = useToast();
  const [subjectsList, setSubjectsList] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editSubject, setEditSubject] = useState(null);
  const [deleteSubject, setDeleteSubject] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    code: "",
    name: "",
    departments: [],
    semester: "",
    credits: 3,
  });

  const API = "http://localhost:5000/api/subjects";

  // --- API Handlers (Untouched) ---
  const handleAdd = async () => {
    try {
      const res = await authFetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      if (!res) return;

      if (!res.ok) throw new Error("Failed to add subject");
      const data = await res.json();

      toast({
        title: "Subject Added",
        description: `${form.name} (${form.code}) has been created.`,
      });

      setShowAdd(false);
      setForm({
        code: "",
        name: "",
        departments: [],
        semester: "",
        credits: 3,
      });
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    const payload = {
      code: editSubject.code,
      name: editSubject.name,
      semester: editSubject.semester,
      credits: editSubject.credits,
      departments: editSubject.department_ids || [],
    };

    const res = await authFetch(`${API}/${editSubject.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res) return;
    const data = await res.json();

    if (!res.ok) {
      toast({
        title: "Error",
        description: data.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Updated",
      description: "Subject updated successfully",
    });

    setShowEdit(false);
    fetchSubjects();
  };

  const handleDelete = async () => {
    if (!deleteSubject) return;
    try {
      const res = await authFetch(`${API}/${deleteSubject.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res) return;
      if (!res.ok) throw new Error("Failed to delete subject");

      toast({
        title: "Subject Removed",
        description: `${deleteSubject.name} has been removed from the system.`,
      });

      setShowDelete(false);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await authFetch(API, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res) return;
      const data = await res.json();
      setSubjectsList(data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await authFetch(
        "http://localhost:5000/api/departments/details",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      if (!res) return;

      const data = await res.json();

      const formatted = data.map((d) => ({
        id: String(d.department_id),
        name: d.department_name,
      }));

      setDepartments(formatted);
    } catch (err) {
      console.log("Error fetching departments:", err);
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchDepartments();
  }, []);

  return (
    <div className="space-y-6 animate-slide-in">
      <Card className="border-none shadow-md bg-card/50">
        <CardHeader className="pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold tracking-tight">
            Manage Subjects
          </CardTitle>
          <Button
            onClick={() => setShowAdd(true)}
            className="w-full md:w-auto shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Subject
          </Button>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead className="min-w-[200px]">Subject</TableHead>
                  <TableHead className="min-w-[150px]">Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectsList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No subjects found. Click "Add Subject" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  subjectsList.map((s) => (
                    <TableRow
                      key={s.code}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold">
                        <Badge variant="outline" className="bg-background">
                          {s.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {s.departments?.length > 0 ? (
                            s.departments.map((d, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {d}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-muted-foreground border-dashed"
                        >
                          {s.semester}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {s.credits}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 hover:bg-primary"
                            onClick={() => {
                              setEditSubject({
                                ...s,
                                department_ids: s.department_ids || [],
                              });
                              setShowEdit(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive"
                            onClick={() => {
                              setDeleteSubject(s);
                              setShowDelete(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Subject Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Subject</DialogTitle>
            <DialogDescription>
              Fill out the details below to add a new subject to the curriculum.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Subject Code & Name: Stacks on mobile, side-by-side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Subject Code</Label>
                <Input
                  id="code"
                  className="h-10 focus:bg-background transition-colors"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. CS501"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input
                  id="name"
                  className="h-10 focus:bg-background transition-colors"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Machine Learning"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select
                  value={form.semester}
                  onValueChange={(v) => setForm({ ...form, semester: v })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTER_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s} Semester
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  min="1"
                  className="h-10 focus:bg-background transition-colors"
                  value={form.credits}
                  onChange={(e) =>
                    setForm({ ...form, credits: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Assigned Departments</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {departments.map((dept) => {
                  const isSelected = form.departments.includes(dept.id);

                  return (
                    <label
                      key={dept.id}
                      className={`
        cursor-pointer flex items-center justify-center p-3 md:p-2 rounded-md border text-sm font-medium transition-all
        ${
          isSelected
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-background hover:bg-muted text-muted-foreground border-input"
        }
      `}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({
                              ...form,
                              departments: [...form.departments, dept.id],
                            });
                          } else {
                            setForm({
                              ...form,
                              departments: form.departments.filter(
                                (d) => d !== dept.id,
                              ),
                            });
                          }
                        }}
                      />
                      {dept.name}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-red-500 text-white hover:bg-red-400"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleAdd}
              disabled={!form.code || !form.name}
            >
              Save Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Subject</DialogTitle>
            <DialogDescription>
              Make changes to the subject details below.
            </DialogDescription>
          </DialogHeader>

          {editSubject && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Subject Code</Label>
                  <Input
                    id="edit-code"
                    className="h-10 bg-muted/50 focus:bg-background transition-colors"
                    value={editSubject.code}
                    onChange={(e) =>
                      setEditSubject({ ...editSubject, code: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Subject Name</Label>
                  <Input
                    id="edit-name"
                    className="h-10 bg-muted/50 focus:bg-background transition-colors"
                    value={editSubject.name}
                    onChange={(e) =>
                      setEditSubject({ ...editSubject, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select
                    value={editSubject.semester}
                    onValueChange={(v) =>
                      setEditSubject({ ...editSubject, semester: v })
                    }
                  >
                    <SelectTrigger className="h-10 bg-muted/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEMESTER_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s} Semester
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-credits">Credits</Label>
                  <Input
                    id="edit-credits"
                    type="number"
                    min="1"
                    className="h-10 bg-muted/50 focus:bg-background transition-colors"
                    value={editSubject.credits}
                    onChange={(e) =>
                      setEditSubject({
                        ...editSubject,
                        credits: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Assigned Departments</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {departments.map((dept) => {
                    const deptId = String(dept.id);

                    const isSelected = (editSubject.department_ids || [])
                      .map(String)
                      .includes(deptId);

                    return (
                      <label
                        key={deptId}
                        className={`
        cursor-pointer flex items-center justify-center p-3 md:p-2 rounded-md border text-sm font-medium transition-all
        ${
          isSelected
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-background hover:bg-muted text-muted-foreground border-input"
        }
      `}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditSubject({
                                ...editSubject,
                                department_ids: [
                                  ...(editSubject.department_ids || []),
                                  deptId,
                                ],
                              });
                            } else {
                              setEditSubject({
                                ...editSubject,
                                department_ids: (
                                  editSubject.department_ids || []
                                ).filter((d) => String(d) !== deptId),
                              });
                            }
                          }}
                        />
                        {dept.name}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-red-500 text-white hover:bg-destructive/80"
              onClick={() => setShowEdit(false)}
            >
              Cancel
            </Button>
            <Button className="w-full sm:w-auto" onClick={handleEdit}>
              Update Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Remove Subject
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to completely remove{" "}
              <strong>{deleteSubject?.name}</strong>? This action cannot be
              undone and will remove it from all assigned departments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Classes Page ----
interface Department {
  department_id: number;
  department_name: string;
}

interface ClassRecord {
  id: string;
  name: string;
  department_id: number;
  department: string;
  school: string;
  total_students?: number;
}

function ClassesPage() {
  const { toast } = useToast();

  const [classesList, setClassesList] = useState<ClassRecord[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    department_id: "",
    school: "",
  });

  const [editClass, setEditClass] = useState<any>(null);
  const [deleteClass, setDeleteClass] = useState<any>(null);

  const API = "http://localhost:5000/api/classes";

  // ---------------- FETCH DEPARTMENTS ----------------
  const fetchDepartments = async () => {
    try {
      const res = await authFetch(
        "http://localhost:5000/api/departments/details",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      if (!res) return;

      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error fetching departments:", err);
      setDepartments([]);
    }
  };

  // ---------------- FETCH CLASSES ----------------
  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch(API, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res) return;

      const data = await res.json();
      setClassesList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setClassesList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchClasses();
  }, []);

  // ---------------- FILTER ----------------
  const filtered = classesList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.department?.toLowerCase().includes(search.toLowerCase()),
  );

  // ---------------- ADD CLASS ----------------
  const handleAdd = async () => {
    try {
      if (!form.name || !form.department_id) {
        toast({
          title: "Missing Fields",
          description: "Class name and department are required.",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        name: form.name,
        department_id: Number(form.department_id),
        school: form.school,
      };

      const res = await authFetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res) return;

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to add class",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Class created successfully.",
      });

      setShowAdd(false);
      setForm({
        name: "",
        department_id: "",
        school: "",
      });

      fetchClasses();
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not add class.",
        variant: "destructive",
      });
    }
  };

  // ---------------- EDIT CLASS ----------------
  const handleEdit = async () => {
    if (!editClass) return;

    try {
      const payload = {
        name: editClass.name,
        department_id: Number(editClass.department_id),
        school: editClass.school,
      };

      const res = await authFetch(`${API}/${editClass.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res) return;

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Update failed",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Updated", description: "Class details saved." });

      setShowEdit(false);
      fetchClasses();
    } catch (err) {
      toast({
        title: "Error",
        description: "Update failed.",
        variant: "destructive",
      });
    }
  };

  // ---------------- DELETE CLASS ----------------
  const handleDelete = async () => {
    if (!deleteClass) return;

    try {
      const res = await authFetch(`${API}/${deleteClass.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res) return;

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Delete failed",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Removed", description: "Class deleted successfully." });

      setShowDelete(false);
      fetchClasses();
    } catch (err) {
      toast({
        title: "Error",
        description: "Delete failed.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <Card className="border-none shadow-md bg-card/50">
        <CardHeader className="flex lg:flex-row flex-col justify-between space-y-0 pb-7 gap-4">
          <CardTitle className="text-xl font-bold tracking-tight">
            Class Directory
          </CardTitle>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes or departments..."
                className="pl-9 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button
              onClick={() => setShowAdd(true)}
              className="w-full md:w-auto shadow-md"
            >
              <UserPlus className="w-4 h-4 mr-2" /> Add New Class
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[250px] pl-6">Class Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="hidden md:table-cell">School</TableHead>
                  <TableHead>Total Students</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No classes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => (
                    <TableRow
                      key={c.id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <TableCell className="font-semibold pl-6">
                        {c.name}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                        >
                          {c.department}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <School className="w-3.5 h-3.5 text-muted-foreground/70" />
                          {c.school || "Not Assigned"}
                        </div>
                      </TableCell>

                      <TableCell className="font-semibold text-muted-foreground/70">
                        {c.total_students || 0}
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 hover:bg-primary hover:text-white"
                            onClick={() => {
                              setEditClass({
                                ...c,
                                department_id: c.department_id,
                              });
                              setShowEdit(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                            onClick={() => {
                              setDeleteClass(c);
                              setShowDelete(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ---------------- ADD DIALOG ---------------- */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle>Create Class</DialogTitle>
            <DialogDescription>
              Enter the primary details for the new academic group.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-name">Class Name</Label>
              <Input
                id="add-name"
                className="h-10"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. CSE-2024-A"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Department</Label>
                <Select
                  value={form.department_id}
                  onValueChange={(v) => setForm({ ...form, department_id: v })}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select Dept" />
                  </SelectTrigger>

                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem
                        key={d.department_id}
                        value={String(d.department_id)}
                      >
                        {d.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>School Affiliation</Label>
                <Select
                  value={form.school}
                  onValueChange={(v) => setForm({ ...form, school: v })}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select School"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="School of Computer Sciences">
                      School of Computer Sciences
                    </SelectItem>
                    <SelectItem value="School of Mechanical Sciences">
                      School of Mechanical Sciences
                    </SelectItem>
                    <SelectItem value="School of Infrastructure and Planning">
                      School of Infrastructure and Planning
                    </SelectItem>
                    <SelectItem value="School of Electronic Sciences">
                      School of Electronic Sciences
                    </SelectItem>
                    <SelectItem value="School of Electrical Sciences">
                      School of Electrical Sciences
                    </SelectItem>
                    <SelectItem value="School of Basic Science and Humanities">
                      School of Basic Science and Humanities
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-red-500 text-white hover:bg-red-400"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </Button>

            <Button
              className="w-full sm:w-auto"
              onClick={handleAdd}
              disabled={!form.name || !form.department_id}
            >
              Save Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- EDIT DIALOG ---------------- */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle>Edit Class Information</DialogTitle>
            <DialogDescription>
              Modify settings for this specific class group.
            </DialogDescription>
          </DialogHeader>

          {editClass && (
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Class Name</Label>
                <Input
                  id="edit-name"
                  className="h-10"
                  value={editClass.name}
                  onChange={(e) =>
                    setEditClass({ ...editClass, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Department</Label>
                  <Select
                    value={String(editClass.department_id)}
                    onValueChange={(v) =>
                      setEditClass({ ...editClass, department_id: Number(v) })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>

                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem
                          key={d.department_id}
                          value={String(d.department_id)}
                        >
                          {d.department_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>School</Label>
                  <Select
                    value={editClass.school}
                    onValueChange={(v) =>
                      setEditClass({ ...editClass, school: v })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Select School">
                        Select School
                      </SelectItem>
                      <SelectItem value="School of Computer Sciences">
                        School of Computer Sciences
                      </SelectItem>
                      <SelectItem value="School of Mechanical Sciences">
                        School of Mechanical Sciences
                      </SelectItem>
                      <SelectItem value="School of Infrastructure and Planning">
                        School of Infrastructure and Planning
                      </SelectItem>
                      <SelectItem value="School of Electronic Sciences">
                        School of Electronic Sciences
                      </SelectItem>
                      <SelectItem value="School of Electrical Sciences">
                        School of Electrical Sciences
                      </SelectItem>
                      <SelectItem value="School of Basic Science and Humanities">
                        School of Basic Science and Humanities
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
            <Button
              variant="ghost"
              className="w-full sm:w-auto bg-red-500 text-white hover:bg-red-400"
              onClick={() => setShowEdit(false)}
            >
              Cancel
            </Button>

            <Button className="w-full sm:w-auto" onClick={handleEdit}>
              Update Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- DELETE DIALOG ---------------- */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-bold">{deleteClass?.name}</span>? This will
              permanently delete the record.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              className="w-full sm:w-auto shadow-sm"
              onClick={handleDelete}
            >
              Delete Permanently
            </Button>
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
    <DashboardLayout
      title="Academic Section"
      subtitle="Administration Panel"
      navItems={navItems}
      role="Admin"
    >
      {content}
    </DashboardLayout>
  );
};

export default AcademicDashboard;
