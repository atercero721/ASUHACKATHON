import { useDashboard } from "@/hooks/use-dashboard";
import { CourseCard } from "@/components/CourseCard";
import { TaskWidget } from "@/components/TaskWidget";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, User, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      {/* Top Header - Maroon */}
      <header className="bg-[#8C1D40] text-white py-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="https://www.asu.edu/asuthemes/7.0/assets/img/asu-logo-white.png" alt="ASU Logo" className="h-8" />
            <span className="text-xl font-bold border-l pl-3 ml-1">My ASU</span>
          </div>
          <div className="relative ml-8 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-white/20 border-none rounded-sm py-1.5 pl-10 pr-4 w-64 placeholder:text-white/70 focus:ring-1 focus:ring-white/50 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{data.user.name}</p>
            <div className="flex gap-1 justify-end mt-0.5">
              {data.user.affiliations?.map(aff => (
                <Badge key={aff} variant="secondary" className="bg-[#FFC627] text-black text-[10px] px-1 h-4 leading-none uppercase font-bold border-none">
                  {aff}
                </Badge>
              ))}
            </div>
          </div>
          <div className="h-9 w-9 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
        </div>
      </header>

      {/* Main Navigation - Gold */}
      <nav className="bg-[#FFC627] border-b border-black/10">
        <div className="container mx-auto px-4 flex gap-1">
          {["Home", "Finances", "Campus Services", "Profile", "Help"].map((item, i) => (
            <button key={item} className={`px-4 py-2 text-sm font-bold text-black hover:bg-black/5 transition-colors ${i === 0 ? "border-b-4 border-[#8C1D40]" : ""}`}>
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* Tertiary Nav - Apps */}
      <div className="bg-[#4D1426] text-white/90 text-xs py-1.5 px-4 overflow-x-auto whitespace-nowrap">
        <div className="container mx-auto flex items-center gap-6">
          {data.resources.map(res => (
            <a key={res.id} href={res.url} className="hover:text-white flex items-center gap-1.5">
              {res.title}
            </a>
          ))}
          <button className="bg-white/10 px-2 py-0.5 rounded text-[10px]">View More</button>
        </div>
      </div>

      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* My Classes */}
          <Card className="rounded-none border-t-4 border-t-[#8C1D40] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-white">
              <CardTitle className="text-base font-bold text-[#8C1D40]">My Classes</CardTitle>
              <div className="flex items-center gap-4">
                <Tabs defaultValue="spring26" className="w-auto">
                  <TabsList className="bg-transparent h-auto p-0 gap-3">
                    {["Summer '25", "Fall '25", "Spring '26"].map(term => (
                      <TabsTrigger 
                        key={term} 
                        value={term.toLowerCase().replace(/[^a-z0-9]/g, '')}
                        className="p-0 text-xs data-[state=active]:text-[#8C1D40] data-[state=active]:font-bold data-[state=active]:bg-transparent border-none"
                      >
                        {term}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <button className="text-[10px] text-blue-600 hover:underline">All Semesters</button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t">
                {data.courses.map(course => (
                  <div key={course.id} className="flex items-center justify-between p-3 border-b hover:bg-black/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-10 ${course.color === 'maroon' ? 'bg-[#8C1D40]' : 'bg-[#FFC627]'}`}></div>
                      <div>
                        <p className="text-sm font-bold">{course.code}: {course.title}</p>
                        <p className="text-[10px] text-muted-foreground">{course.instructor} • {course.location} • {course.schedule}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-[10px] font-bold border-[#8C1D40] text-[#8C1D40]">
                        {course.grade || "N/A"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 flex justify-center">
                <button className="bg-[#8C1D40] text-white text-[11px] px-4 py-1.5 font-bold rounded-sm uppercase">View My Schedule</button>
              </div>
              <div className="px-4 py-2 flex gap-4 text-[10px] text-blue-600 border-t">
                <button className="hover:underline">Registration</button>
                <button className="hover:underline">Class Search</button>
                <button className="hover:underline">Books</button>
                <button className="hover:underline">Grades & Transcripts</button>
              </div>
            </CardContent>
          </Card>

          {/* My Agenda */}
          <Card className="rounded-none border-t-4 border-t-[#8C1D40] shadow-sm">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-base font-bold text-[#8C1D40]">My Agenda</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 bg-gray-50 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">Monday, February 2, 2026</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="text-[10px] border px-2 py-0.5 rounded bg-white">Today</button>
                  <div className="flex border rounded overflow-hidden">
                    <button className="px-1 py-0.5 bg-white border-r">{"<"}</button>
                    <button className="px-1 py-0.5 bg-white">{">"}</button>
                  </div>
                </div>
              </div>
              <div className="divide-y">
                {data.courses.map(course => (
                  <div key={`agenda-${course.id}`} className="p-4 flex gap-4">
                    <div className="w-24 text-[10px] font-bold text-muted-foreground uppercase pt-0.5">
                      {course.schedule?.split(' ')[1]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#8C1D40]">{course.code} {course.title}</p>
                      <p className="text-[10px] text-muted-foreground">{course.location} • Tempe</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t bg-gray-50 text-[10px] flex gap-4 text-blue-600">
                <button className="hover:underline">Full agenda</button>
                <button className="hover:underline">Download calendar</button>
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="rounded-none border-t-4 border-t-[#8C1D40] shadow-sm">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-base font-bold text-[#8C1D40]">Announcements and News</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex border-b text-[10px] font-bold">
                {["Announcements", "News", "Sports", "Arts", "State Press"].map((tab, i) => (
                  <button key={tab} className={`px-4 py-2 ${i === 0 ? "text-[#8C1D40] border-b-2 border-[#8C1D40]" : "text-muted-foreground"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <ScrollArea className="h-48">
                <div className="p-4 space-y-4">
                  {data.announcements.map(item => (
                    <div key={item.id} className="space-y-1">
                      <p className="text-xs font-bold hover:underline cursor-pointer">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{item.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Priority Tasks */}
          <Card className="rounded-none border-t-4 border-t-[#8C1D40] shadow-sm">
            <CardHeader className="py-2 px-4 border-b bg-gray-50">
              <CardTitle className="text-[13px] font-bold">Finance</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {data.tasks.map(task => (
                <div key={task.id} className="p-3 border-b flex items-start gap-3 hover:bg-black/5 cursor-pointer">
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 mt-0.5"></div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold leading-tight">{task.title}</p>
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* My Programs */}
          <Card className="rounded-none border-t-4 border-t-[#8C1D40] shadow-sm">
            <CardHeader className="py-2 px-4 border-b bg-gray-50 flex flex-row items-center justify-between">
              <CardTitle className="text-[13px] font-bold">My Programs</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex gap-4 text-[10px] font-bold mb-3">
                <button className="text-[#8C1D40] border-b-2 border-[#8C1D40]">Programs</button>
                <button className="text-muted-foreground">Graduation</button>
                <button className="text-muted-foreground">Find Programs</button>
              </div>
              <div className="border p-2 rounded-sm mb-2">
                <p className="text-[11px] font-bold">Mechanical Engineering (BSE) <Badge variant="secondary" className="bg-black text-white text-[8px] h-3 ml-1">Off Track</Badge></p>
                <p className="text-[9px] text-muted-foreground">Degree Progress</p>
                <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#8C1D40] w-[65%]"></div>
                </div>
              </div>
              <div className="flex gap-3 text-[9px] text-blue-600 font-medium">
                <button className="flex items-center gap-0.5">+ Add minor</button>
                <button className="flex items-center gap-0.5">+ Add certificate</button>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="rounded-none border-t-4 border-t-[#8C1D40] shadow-sm">
            <CardHeader className="py-2 px-4 border-b bg-gray-50">
              <CardTitle className="text-[13px] font-bold">Academic Support Team</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-4">
              <div>
                <p className="text-[11px] font-bold">Academic Advising</p>
                <p className="text-[9px] text-muted-foreground">Degree requirements, graduation priorities, and course registration.</p>
              </div>
              <div className="border-t pt-3">
                <p className="text-[11px] font-bold">Tutoring</p>
                <p className="text-[9px] text-muted-foreground">Free assistance with writing or a specific subject area.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12">
        <div className="bg-[#FFC627] py-6 px-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-4 text-[10px] font-bold">
              <a href="#" className="hover:underline">Maps and Locations</a>
              <a href="#" className="hover:underline">Jobs</a>
              <a href="#" className="hover:underline">Directory</a>
              <a href="#" className="hover:underline">Contact ASU</a>
              <a href="#" className="hover:underline">My ASU</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase italic">Repeatedly ranked #1</span>
              <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
            </div>
          </div>
        </div>
        <div className="bg-[#222] text-white/50 text-[9px] py-4 text-center">
          <div className="container mx-auto px-4 flex flex-wrap justify-center gap-4">
            <span>Copyright and Trademark</span>
            <span>Accessibility</span>
            <span>Privacy</span>
            <span>Terms of Use</span>
            <span>Emergency</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
