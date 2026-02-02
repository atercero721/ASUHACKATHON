import { useDashboard } from "@/hooks/use-dashboard";
import { CourseCard } from "@/components/CourseCard";
import { TaskWidget } from "@/components/TaskWidget";
import { format } from "date-fns";
import { 
  Megaphone, ExternalLink, CalendarDays, 
  ArrowRight, ShieldCheck, Mail 
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-primary font-medium animate-pulse">Loading My ASU...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        Error loading dashboard. Please refresh.
      </div>
    );
  }

  const { user, courses, announcements, resources, tasks } = data;

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Welcome Banner */}
      <div className="bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8 shadow-lg relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                Good afternoon, {user.name.split(' ')[0]}
              </h1>
              <p className="text-primary-foreground/80 text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                {user.affiliations?.join(' • ')}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-secondary text-primary font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-white hover:scale-105 transition-all duration-200">
                Class Search
              </button>
              <button className="bg-white/10 backdrop-blur text-white font-semibold px-6 py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200">
                Academic Calendar
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Classes (Main Content) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* My Classes Grid */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-display font-bold text-primary">My Classes</h2>
                <span className="text-sm font-medium text-muted-foreground bg-white px-3 py-1 rounded-full border shadow-sm">
                  Spring 2024
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Announcements Feed */}
            <section className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <Megaphone className="w-6 h-6 text-secondary" />
                <h2 className="text-xl font-display font-bold text-foreground">Announcements</h2>
              </div>
              
              <div className="space-y-6">
                {announcements.map((item) => (
                  <div key={item.id} className="group">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                      <h3 className="font-bold text-lg text-primary group-hover:underline decoration-secondary decoration-2 underline-offset-4 cursor-pointer">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground/70">{item.source}</span>
                        <span>•</span>
                        <span>{item.date && format(new Date(item.date), "MMM d")}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
              
              <button className="mt-6 w-full py-2 flex items-center justify-center gap-2 text-primary font-semibold hover:bg-primary/5 rounded-lg transition-colors group">
                View Past Announcements
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </section>

          </div>

          {/* RIGHT COLUMN: Tasks & Resources */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Task Widget */}
            <TaskWidget tasks={tasks} />

            {/* Resources / Quick Links */}
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <h2 className="font-display font-bold text-xl text-primary mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-secondary" />
                Quick Links
              </h2>
              
              <div className="grid grid-cols-1 gap-2">
                {resources.map((res) => (
                  <a 
                    key={res.id} 
                    href={res.url}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      {res.icon === 'dollar-sign' && <span className="font-bold">$</span>}
                      {res.icon === 'calendar' && <CalendarDays className="w-4 h-4" />}
                      {res.icon === 'mail' && <Mail className="w-4 h-4" />}
                      {/* Fallback */}
                      {!['dollar-sign', 'calendar', 'mail'].includes(res.icon || '') && <ExternalLink className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{res.title}</div>
                      <div className="text-xs text-muted-foreground">{res.category}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Promo Card */}
            <div className="bg-gradient-to-br from-secondary to-orange-400 rounded-xl shadow-lg p-6 text-primary-foreground relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
              <div className="relative z-10">
                <h3 className="font-display font-bold text-2xl mb-2 text-primary">Sun Devil Rewards</h3>
                <p className="text-primary/80 font-medium mb-4">Earn points for attending events and showing spirit!</p>
                <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Join Now
                </span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
