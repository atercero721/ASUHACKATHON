import { CourseWithGrade } from "@shared/schema";
import { BookOpen, MapPin, Clock, ChevronRight, User } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface CourseCardProps {
  course: CourseWithGrade;
}

export function CourseCard({ course }: CourseCardProps) {
  // Determine gradient based on course color string (mock logic)
  const getGradient = (color: string | null) => {
    switch(color) {
      case 'gold': return "from-amber-500 to-yellow-600";
      case 'blue': return "from-blue-600 to-indigo-700";
      default: return "from-primary to-primary/90"; // maroon default
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group bg-card rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className={`h-2 bg-gradient-to-r ${getGradient(course.color)}`} />
      
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-muted text-primary uppercase tracking-wider">
            {course.term}
          </span>
          {course.grade && (
            <span className="font-display font-bold text-xl text-primary">
              {course.grade}
            </span>
          )}
        </div>

        <Link href={`/courses/${course.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-display font-bold text-xl mb-1 leading-tight">{course.title}</h3>
          <p className="text-sm font-semibold text-muted-foreground mb-4">{course.code}</p>
        </Link>

        <div className="space-y-2 text-sm text-foreground/80">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary/60" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary/60" />
            <span>{course.schedule || "TBA"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary/60" />
            <span>{course.location || "Online"}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-muted/30 border-t flex justify-between items-center group-hover:bg-muted/50 transition-colors">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {course.assignments?.length || 0} Assignments
        </span>
        <Link 
          href={`/courses/${course.id}`}
          className="p-2 rounded-full hover:bg-white text-primary hover:shadow-md transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
