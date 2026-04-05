import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  Search,
  Loader2,
  Inbox,
  GraduationCap,
  FileSpreadsheet,
  Building2,
  CalendarDays,
  Layers,
  UserRoundCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { authFetch } from "../../utils/authFetch";

const navItems = [
  { title: "Eligibility", url: "/exam-controller", icon: UserRoundCheck },
  { title: "Reports", url: "/exam-controller/reports", icon: FileText },
];

const yrl = "https://geo-campus.onrender.com";

function EligibilityPage() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [dept, setDept] = useState("");
  const [subject, setSubject] = useState("");

  const availableSubjects =
    departments.find((d: any) => String(d.department_id) === String(dept))
      ?.subjects || [];

  const handleDeptChange = (value: string) => {
    setDept(value);
    const deptObj = departments.find(
      (d: any) => String(d.department_id) === String(value),
    );

    if (deptObj && deptObj.subjects.length > 0) {
      setSubject(String(deptObj.subjects[0].subject_id));
    } else {
      setSubject("");
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await authFetch(
          `${yrl}/api/departments/with-subjects`,
                  {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        );
              if (!res) return;
        const data = await res.json();
        setDepartments(Array.isArray(data) ? data : []);

        if (data.length > 0) {
          setDept(String(data[0].department_id));
          if (data[0].subjects.length > 0) {
            setSubject(String(data[0].subjects[0].subject_id));
          }
        }
      } catch (err) {
        console.log("Error fetching departments:", err);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!dept || !subject) return;

    const fetchEligibility = async () => {
      try {
        setLoading(true);
        setStudents([]);

        const res = await authFetch(
          `${yrl}/api/exam/eligibility?department_id=${dept}&subject_id=${subject}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
      if (!res) return;
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Error fetching eligibility:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEligibility();
  }, [dept, subject]);
  
  const filtered = students.filter((s: any) => {
    const matchSearch =
      s.student_name.toLowerCase().includes(search.toLowerCase()) ||
      String(s.student_id).toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const eligible = filtered.filter(
    (s: any) => s.eligibility === "eligible",
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* Total Students Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="p-3 bg-blue-100/50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              TOTAL STUDENTS FILTERED
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {filtered.length}
            </h3>
          </div>
        </div>

        {/* Eligible Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="p-3 bg-emerald-100/50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">ELIGIBLE</p>
            <h3 className="text-3xl font-bold text-emerald-600 mt-1">
              {eligible}
            </h3>
          </div>
        </div>

        {/* Not Eligible Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="p-3 bg-rose-100/50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">NOT ELIGIBLE</p>
            <h3 className="text-3xl font-bold text-rose-600 mt-1">
              {filtered.length - eligible}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <Card className="border-slate-200 shadow-md rounded-2xl overflow-hidden bg-white">
        {/* Command Bar / Filters */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative w-full lg:max-w-xs group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by name or regd no..."
                className="pl-10 h-10 bg-white border-slate-200 focus:ring-primary/20 rounded-xl transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Select value={dept} onValueChange={handleDeptChange}>
                <SelectTrigger className="h-10 sm:w-[200px] bg-white border-slate-200 rounded-xl font-medium text-slate-700">
                  <SelectValue placeholder="Select Dept" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
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

              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="h-10 sm:w-[240px] bg-white border-slate-200 rounded-xl font-medium text-slate-700">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {availableSubjects.map((sub: any) => (
                    <SelectItem
                      key={sub.subject_id}
                      value={String(sub.subject_id)}
                    >
                      <span className="font-mono text-xs mr-2">
                        {sub.subject_code}
                      </span>
                      {sub.subject_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Modern Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 hover:bg-slate-50">
              <TableRow className="border-slate-100">
                <TableHead className="font-semibold text-slate-600 h-12">
                  Regd No.
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Department
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Attendance
                </TableHead>
                <TableHead className="font-semibold text-slate-600 text-right pr-8">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-primary/60" />
                      <p className="text-sm font-medium animate-pulse">
                        Analyzing eligibility data...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                        <Inbox className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-base font-semibold text-slate-700">
                        No records found
                      </p>
                      <p className="text-sm text-slate-400">
                        Try adjusting your filters or search query.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s: any) => (
                  <TableRow
                    key={s.student_id}
                    className="group border-slate-100 hover:bg-slate-50/80 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-slate-500 font-medium py-4">
                      {s.student_id}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center text-primary shrink-0 hidden sm:flex">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        {s.student_name}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {s.department_name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm ${
                            Number(s.percentage) >= 75
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {s.percentage}%
                        </span>
                        {/* Optional: Add a visual progress bar indicating attendance */}
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 hidden sm:block overflow-hidden">
                          <div
                            className={`h-full rounded-full ${Number(s.percentage) >= 75 ? "bg-emerald-500" : "bg-rose-500"}`}
                            style={{
                              width: `${Math.min(Number(s.percentage), 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right md:pr-6 p-2">
                      <StatusBadge status={s.eligibility} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function ReportsPage() {
  const { toast } = useToast();
  const [reportDept, setReportDept] = useState("1");
  const [semester, setSemester] = useState("Even (Jan-Jun)");
  const [semesterNumber, setSemesterNumber] = useState("1st");
  const [filteredData, setFilteredData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const handleExportMonth = async (month) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${yrl}/api/reports/export?department_id=${reportDept}&semester=${semesterNumber}&month=${month}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
    if (!res) return;
      if (!res.ok) {
        toast({
          title: "Export Failed",
          description: "Could not generate report",
          variant: "destructive",
        });
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Monthly_Report_${month}.xlsx`;
      a.click();

      toast({
        title: "Report Exported",
        description: `Excel report downloaded successfully`,
      });
    } catch (err) {
      console.log("Export error:", err);
    }
  };

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        setLoading(true);

        const res = await authFetch(
          `${yrl}/api/reports/monthly-summary?department_id=${reportDept}&semester=${semesterNumber}&period=${semester}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
    if (!res) return;
        const data = await res.json();
        setFilteredData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Error fetching monthly report:", err);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyReport();
  }, [reportDept, semesterNumber, semester]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await authFetch(
          `${yrl}/api/departments/details`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
    if (!res) return;
        const data = await res.json();

        setDepartments(Array.isArray(data) ? data : []);

        if (Array.isArray(data) && data.length > 0) {
          setReportDept(String(data[0].department_id));
        }
      } catch (err) {
        console.log("Error fetching departments:", err);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, []);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const visibleData = filteredData.filter((d: any) => {
    const monthNumber = Number(monthMap[d.month]);

    return monthNumber < currentMonth;
  });

  const totalStudents = visibleData.length > 0 ? visibleData[0].total : 0;
  const totalReports = visibleData.length;
  const totalEligible = visibleData.reduce((sum, d) => sum + d.eligible, 0);
  const totalNotEligible = visibleData.reduce((sum, d) => sum + d.notEligible, 0);
  const avgEligible =
    visibleData.length > 0
      ? Math.round(
          visibleData.reduce((s: any, d: any) => s + d.eligible, 0) /
            visibleData.length,
        )
      : 0;
  const avgNotEligible = totalStudents - avgEligible;
  const avgAttendance =
    visibleData.length > 0
      ? Math.round(
          visibleData.reduce((s: any, d: any) => s + d.avgAttendance, 0) /
            visibleData.length,
        )
      : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="p-3 bg-blue-100/50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">TOTAL STUDENTS</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {totalStudents}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="p-3 bg-emerald-100/50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">AVG ELIGIBLE</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {avgEligible}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="p-3 bg-rose-100/50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              AVG NOT ELIGIBLE
            </p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">
              {avgNotEligible}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="p-3 bg-indigo-100/50 text-indigo-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">AVG ATTENDANCE</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">
              {avgAttendance}%
            </h3>
          </div>
        </div>
      </div>

      <Card className="border-slate-200 shadow-md rounded-2xl overflow-hidden bg-white">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-800">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold">Report View</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
            <div className="relative group">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary z-10 pointer-events-none" />
              <Select value={semesterNumber} onValueChange={setSemesterNumber}>
                <SelectTrigger className="h-10 pl-9 md:w-[130px] bg-white border-slate-200 rounded-xl font-medium text-slate-700 shadow-sm transition-all focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem
                      key={num}
                      value={`${num}${num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th"}`}
                    >
                      {num}
                      {num === 1
                        ? "st"
                        : num === 2
                          ? "nd"
                          : num === 3
                            ? "rd"
                            : "th"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative group">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary z-10 pointer-events-none" />
              <Select value={reportDept} onValueChange={setReportDept}>
                <SelectTrigger className="h-10 pl-9 md:w-[130px] bg-white border-slate-200 rounded-xl font-medium text-slate-700 shadow-sm transition-all focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Dept" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {departments.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No Departments Found
                    </SelectItem>
                  ) : (
                    departments.map((d: any) => (
                      <SelectItem
                        key={d.department_id}
                        value={String(d.department_id)}
                      >
                        {d.department_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="relative group">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary z-10 pointer-events-none" />
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="h-10 pl-9 md:w-[180px] bg-white border-slate-200 rounded-xl font-medium text-slate-700 shadow-sm transition-all focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Even (Jan-Jun)">Even (Jan-Jun)</SelectItem>
                  <SelectItem value="Odd (Jul-Dec)">Odd (Jul-Dec)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="font-semibold text-slate-600 h-12 pl-6">
                  Month
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Total Students
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Eligible
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Not Eligible
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Avg Attendance
                </TableHead>
                <TableHead className="font-semibold text-slate-600 text-right pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visibleData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center text-slate-400"
                  >
                    No data available for {semesterNumber} sem in this period.
                  </TableCell>
                </TableRow>
              ) : (
                visibleData.map((d: any) => (
                  <TableRow
                    key={d.month}
                    className="group border-slate-100 hover:bg-slate-50/80 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-900 pl-6">
                      {d.month}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {d.total}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {d.eligible}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                        {d.notEligible}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-bold text-sm ${d.avgAttendance >= 75 ? "text-emerald-600" : "text-rose-600"}`}
                      >
                        {d.avgAttendance}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportMonth(monthMap[d.month])}
                        className="rounded-xl border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 mr-2" />
                        Export
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

const ExamControllerDashboard = () => {
  const location = useLocation();
  const path = location.pathname;

  let content;
  if (path === "/exam-controller/reports") content = <ReportsPage />;
  else content = <EligibilityPage />;

  return (
    <DashboardLayout
      title="Exam Controller"
      subtitle="Eligibility & Reports"
      navItems={navItems}
      role="Exam Controller"
    >
      {content}
    </DashboardLayout>
  );
};

export default ExamControllerDashboard;
