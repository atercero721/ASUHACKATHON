import { Assignment } from "@shared/schema";
import { useUpdateAssignment } from "@/hooks/use-assignments";
import { format } from "date-fns";
import { CheckCircle2, Circle, AlertCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TaskWidgetProps {
  tasks: Assignment[];
}

export function TaskWidget({ tasks }: TaskWidgetProps) {
  const updateMutation = useUpdateAssignment();

  // Filter pending vs completed for simple view
  const pendingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);
  
  const handleToggle = (id: number, currentStatus: string | null) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    updateMutation.mutate({ id, status: newStatus });
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-xl text-primary flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-secondary" />
          My Tasks
        </h2>
        <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">
          {pendingTasks.length} Due
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {pendingTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500/20" />
              <p>All caught up! Great job.</p>
            </motion.div>
          ) : (
            pendingTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
              >
                <button
                  disabled={updateMutation.isPending}
                  onClick={() => handleToggle(task.id, task.status)}
                  className="mt-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                  {updateMutation.isPending ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {task.dueDate && (
                      <span className={`text-xs flex items-center gap-1 ${
                        new Date(task.dueDate) < new Date() ? 'text-destructive font-bold' : 'text-muted-foreground'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {format(new Date(task.dueDate), "MMM d")}
                      </span>
                    )}
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 border border-border px-1.5 rounded">
                      Assignment
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-primary font-semibold hover:bg-primary/5 rounded-lg transition-colors">
        View All Tasks
      </button>
    </div>
  );
}
