import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Calendar, DollarSign, User, AlertCircle, 
  CheckCircle, RefreshCw, Layers, Edit2, Check, X, ArrowRight,
  Paperclip, Send, MessageSquare, Clock, Upload, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, doc, setDoc, updateDoc, deleteDoc, 
  onSnapshot, getDocs, writeBatch, query, where 
} from 'firebase/firestore';
import TaskDetailPanel from './TaskDetailPanel';

interface Project {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  progress: number;
  status: 'in_progress' | 'revision' | 'pending_brief' | 'completed';
  budget: number;
  dueDate: string;
  assignedStaff: string;
  milestones: number;
  completedMilestones: number;
}

interface Attachment {
  name: string;
  size: string;
  uploadedAt: string;
  url?: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface Task {
  id: string;
  projectId: string;
  title: string;
  column: 'todo' | 'in_progress' | 'testing' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  dueDate?: string;
  completedDate?: string;
  description?: string;
  attachments?: Attachment[];
  comments?: Comment[];
}

interface KanbanBoardProps {
  language: 'en' | 'bn' | 'ar';
  theme: 'light' | 'dark';
  triggerToast: (msg: string) => void;
  isAdmin: boolean;
}

const INITIAL_PROJECTS: Project[] = [
  { id: 'proj-501', title: 'Enterprise E-Commerce Portal', clientName: 'Imran Hasan', clientId: 'usr-101', progress: 65, status: 'in_progress', budget: 1800, dueDate: '2026-07-15', assignedStaff: 'Anisur Rahman', milestones: 5, completedMilestones: 3 },
  { id: 'proj-502', title: 'Corporate Branding Website & SEO Boost', clientName: 'Al-Shehri Majid', clientId: 'usr-102', progress: 90, status: 'revision', budget: 3200, dueDate: '2026-06-30', assignedStaff: 'Sayeeda Yeasmin', milestones: 6, completedMilestones: 5 },
  { id: 'proj-503', title: 'SaaS Mobile App Core API Dev', clientName: 'Enamul Haque', clientId: 'usr-105', progress: 15, status: 'pending_brief', budget: 4500, dueDate: '2026-09-01', assignedStaff: 'Tariqul Islam', milestones: 8, completedMilestones: 1 }
];

const INITIAL_TASKS: Task[] = [
  { id: 'task-1', projectId: 'proj-501', title: 'Database Schema Design & Firestore Blueprint Mapping', column: 'todo', priority: 'high', assignee: 'Anisur', dueDate: '2026-06-10' },
  { id: 'task-2', projectId: 'proj-501', title: 'Stripe & bKash Callback Handlers Implementation', column: 'in_progress', priority: 'critical', assignee: 'Anisur', dueDate: '2026-06-14' },
  { id: 'task-3', projectId: 'proj-501', title: 'Design Glassmorphic User Interface Layout in Tailwind', column: 'done', priority: 'medium', assignee: 'Sayeeda', dueDate: '2026-06-11', completedDate: '2026-06-11' },
  { id: 'task-4', projectId: 'proj-502', title: 'Meta tags crawl test with Google Search Console', column: 'in_progress', priority: 'high', assignee: 'Tariqul', dueDate: '2026-06-25' },
  { id: 'task-5', projectId: 'proj-503', title: 'Collect Customer functional brief requirements doc', column: 'todo', priority: 'low', assignee: 'Sayeeda', dueDate: '2026-06-08' }
];

export default function KanbanBoard({ language, theme, triggerToast, isAdmin }: KanbanBoardProps) {
  const isDark = theme === 'dark';
  const panelBg = isDark ? 'bg-neutral-900/70 border-neutral-800 backdrop-blur-lg' : 'bg-white border-neutral-200 shadow-sm';
  const textTitle = isDark ? 'text-white' : 'text-neutral-900';
  const textMuted = isDark ? 'text-neutral-400' : 'text-neutral-500';

  // State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('webzone_admin_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('webzone_admin_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-501');
  const [isUsingFirestore, setIsUsingFirestore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Drag and Drop dragover column UI feedback status
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDragCol, setActiveDragCol] = useState<string | null>(null);

  // Modal / Create form states
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjBudget, setNewProjBudget] = useState(1500);
  const [newProjStaff, setNewProjStaff] = useState('Anisur Rahman');
  const [newProjDueDate, setNewProjDueDate] = useState('2026-08-30');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Anisur');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-06-15');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // Summary header metrics query states
  const [activeTasksCount, setActiveTasksCount] = useState(0);
  const [overdueTasksCount, setOverdueTasksCount] = useState(0);
  const [completedTodayCount, setCompletedTodayCount] = useState(0);

  // Task detail panel interactive state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Real-time Firestore sync
  useEffect(() => {
    let unsubProjects: (() => void) | undefined;
    let unsubTasks: (() => void) | undefined;

    const setupFirestoreSync = async () => {
      try {
        setIsLoading(true);
        // Step 1: Create active listeners
        unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
          if (!snapshot.empty) {
            const fetchedProjs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
            setProjects(fetchedProjs);
            setIsUsingFirestore(true);
            setIsLoading(false);
          } else {
            // Seed base items into Firestore once if it's empty
            INITIAL_PROJECTS.forEach(async (p) => {
              await setDoc(doc(db, 'projects', p.id), p);
            });
          }
        }, (err) => {
          console.warn("Firestore projects stream error (offline local mode fallback):", err);
          setIsLoading(false);
        });

        unsubTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
          if (!snapshot.empty) {
            const fetchedTasks = snapshot.docs.map(doc => {
              const data = doc.data();
              // Backlog / completed mapper for compatibility
              let column = data.column || 'todo';
              if (column === 'backlog') column = 'todo';
              if (column === 'completed') column = 'done';
              return { id: doc.id, ...data, column } as Task;
            });
            setTasks(fetchedTasks);
            setIsUsingFirestore(true);
          } else {
            // Seed base tasks into Firestore once if empty
            INITIAL_TASKS.forEach(async (t) => {
              await setDoc(doc(db, 'tasks', t.id), t);
            });
          }
        }, (err) => {
          console.warn("Firestore tasks stream error (offline local mode fallback):", err);
        });
      } catch (error) {
        console.warn("Firestore init failed (relying on offline LocalStorage models):", error);
        setIsLoading(false);
      }
    };

    setupFirestoreSync();

    return () => {
      if (unsubProjects) unsubProjects();
      if (unsubTasks) unsubTasks();
    };
  }, []);

  // Save changes to localStorage too, as a durable local backup
  useEffect(() => {
    localStorage.setItem('webzone_admin_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('webzone_admin_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Load stats from Firestore filtered by status
  useEffect(() => {
    let active = true;
    
    const queryFirestoreStats = async () => {
      const today = '2026-06-11';
      
      if (!isUsingFirestore) {
        // Fallback calculation using current local memory tasks state
        const activeTasks = tasks.filter(t => t.column !== 'done');
        const overdueTasks = activeTasks.filter(t => t.dueDate && t.dueDate < today);
        const doneTodayTasks = tasks.filter(t => t.column === 'done' && t.completedDate === today);
        
        if (active) {
          setActiveTasksCount(activeTasks.length);
          setOverdueTasksCount(overdueTasks.length);
          setCompletedTodayCount(doneTodayTasks.length);
        }
        return;
      }

      try {
        const tasksCol = collection(db, 'tasks');

        // Query Firestore task collection filtered by status (active: columns todo, in_progress, testing)
        const activeQuery = query(tasksCol, where('column', 'in', ['todo', 'in_progress', 'testing']));
        const activeSnap = await getDocs(activeQuery);
        
        let fetchedTasks: Task[] = [];
        activeSnap.forEach((doc) => {
          fetchedTasks.push({ id: doc.id, ...doc.data() } as Task);
        });

        // Query Firestore task collection filtered by status (done)
        const doneQuery = query(tasksCol, where('column', '==', 'done'));
        const doneSnap = await getDocs(doneQuery);
        
        let doneTasks: Task[] = [];
        doneSnap.forEach((doc) => {
          doneTasks.push({ id: doc.id, ...doc.data() } as Task);
        });

        const activeCount = fetchedTasks.length;
        const overdueCount = fetchedTasks.filter(t => t.dueDate && t.dueDate < today).length;
        const doneToday = doneTasks.filter(t => t.completedDate === today).length;

        if (active) {
          setActiveTasksCount(activeCount);
          setOverdueTasksCount(overdueCount);
          setCompletedTodayCount(doneToday);
        }
      } catch (err) {
        console.warn("Firestore status query execution failed, fallback to state values:", err);
        const activeTasks = tasks.filter(t => t.column !== 'done');
        const overdueTasks = activeTasks.filter(t => t.dueDate && t.dueDate < today);
        const doneTodayTasks = tasks.filter(t => t.column === 'done' && t.completedDate === today);
        
        if (active) {
          setActiveTasksCount(activeTasks.length);
          setOverdueTasksCount(overdueTasks.length);
          setCompletedTodayCount(doneTodayTasks.length);
        }
      }
    };

    queryFirestoreStats();

    return () => {
      active = false;
    };
  }, [tasks, isUsingFirestore]);

  // Operations handlers
  const handleMoveTaskColumn = async (taskId: string, destCol: 'todo' | 'in_progress' | 'testing' | 'done') => {
    // Optimistic UI updates
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { 
          ...t, 
          column: destCol,
          completedDate: destCol === 'done' ? '2026-06-11' : undefined
        };
      }
      return t;
    }));

    if (isUsingFirestore) {
      const taskRef = doc(db, 'tasks', taskId);
      try {
        const updateFields: any = { column: destCol };
        if (destCol === 'done') {
          updateFields.completedDate = '2026-06-11';
        } else {
          updateFields.completedDate = null;
        }
        await updateDoc(taskRef, updateFields);
        triggerToast(`🚀 Task updated real-time to ${destCol.replace('_', ' ').toUpperCase()}`);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `tasks/${taskId}`);
      }
    } else {
      triggerToast(`📁 Task column updated locally (Cached): ${destCol.replace('_', ' ').toUpperCase()}`);
    }
  };

  const updateSingleTaskInStateAndDb = async (updatedTask: Task) => {
    // Update local state first (optimistic)
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));

    if (isUsingFirestore) {
      try {
        const taskRef = doc(db, 'tasks', updatedTask.id);
        const updatePayload: any = {
          title: updatedTask.title,
          column: updatedTask.column,
          priority: updatedTask.priority,
          assignee: updatedTask.assignee,
          dueDate: updatedTask.dueDate || '',
          description: updatedTask.description || '',
          attachments: updatedTask.attachments || [],
          comments: updatedTask.comments || []
        };
        if (updatedTask.completedDate) {
          updatePayload.completedDate = updatedTask.completedDate;
        }
        await updateDoc(taskRef, updatePayload);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `tasks/${updatedTask.id}`);
      }
    }
  };

  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjClient.trim()) {
      triggerToast('⚠️ Please supply a Project Title and Client Name');
      return;
    }

    const projId = `proj-${Date.now()}`;
    const newProj: Project = {
      id: projId,
      title: newProjTitle,
      clientName: newProjClient,
      clientId: `usr-${Math.floor(Math.random() * 900) + 100}`,
      progress: 0,
      status: 'pending_brief',
      budget: Number(newProjBudget) || 1000,
      dueDate: newProjDueDate,
      assignedStaff: newProjStaff,
      milestones: 4,
      completedMilestones: 0
    };

    setProjects(prev => [...prev, newProj]);
    setSelectedProjectId(projId);
    setIsAddingProject(false);
    setNewProjTitle('');
    setNewProjClient('');

    if (isUsingFirestore) {
      try {
        await setDoc(doc(db, 'projects', projId), newProj);
        triggerToast('⚡ Project published real-time to Cloud Firestore!');
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `projects/${projId}`);
      }
    } else {
      triggerToast('📁 Project logged in Local Dashboard Cache');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      triggerToast('⚠️ Please write down a Task description');
      return;
    }

    const taskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: taskId,
      projectId: selectedProjectId,
      title: newTaskTitle,
      column: 'todo',
      priority: newTaskPriority,
      assignee: newTaskAssignee,
      dueDate: newTaskDueDate,
      description: newTaskDescription.trim() || 'No description provided yet.',
      attachments: [],
      comments: []
    };

    setTasks(prev => [...prev, newTask]);
    setIsAddingTask(false);
    setNewTaskTitle('');
    setNewTaskDescription('');

    // Re-verify progress metrics on project
    updateProjectProgress(selectedProjectId, [...tasks, newTask]);

    if (isUsingFirestore) {
      try {
        await setDoc(doc(db, 'tasks', taskId), newTask);
        triggerToast('⚡ Task added real-time to Cloud Firestore!');
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `tasks/${taskId}`);
      }
    } else {
      triggerToast('📁 Task added in Offline Workspace Cache');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirmation = window.confirm('Are you sure you want to delete this task item?');
    if (!confirmation) return;

    setTasks(prev => prev.filter(t => t.id !== taskId));

    if (isUsingFirestore) {
      try {
        await deleteDoc(doc(db, 'tasks', taskId));
        triggerToast('🗑️ Task removed from Cloud Firestore');
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `tasks/${taskId}`);
      }
    } else {
      triggerToast('🗑️ Task cleared from Workspace cache');
    }
  };

  const updateProjectProgress = async (projId: string, currentTasks: Task[]) => {
    const projTasks = currentTasks.filter(t => t.projectId === projId);
    if (projTasks.length === 0) return;

    const completed = projTasks.filter(t => t.column === 'done').length;
    const progressPercent = Math.round((completed / projTasks.length) * 100);

    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        const updated = { ...p, progress: progressPercent, completedMilestones: Math.min(p.milestones, Math.round((completed / projTasks.length) * p.milestones)) };
        if (isUsingFirestore) {
          updateDoc(doc(db, 'projects', projId), { progress: progressPercent, completedMilestones: updated.completedMilestones }).catch(err => {
            console.error("Firestore progress sync failed:", err);
          });
        }
        return updated;
      }
      return p;
    }));
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setActiveDragCol(columnId);
  };

  const handleDragLeave = () => {
    setActiveDragCol(null);
  };

  const handleDrop = (e: React.DragEvent, destColumn: 'todo' | 'in_progress' | 'testing' | 'done') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setActiveDragCol(null);
    setDraggedTaskId(null);

    if (taskId) {
      const targetTask = tasks.find(t => t.id === taskId);
      if (targetTask && targetTask.column !== destColumn) {
        handleMoveTaskColumn(taskId, destColumn);
        // Recalculate progress
        const updatedTasks = tasks.map(t => {
          if (t.id === taskId) {
            return { 
              ...t, 
              column: destColumn,
              completedDate: destColumn === 'done' ? '2026-06-11' : undefined
            };
          }
          return t;
        });
        updateProjectProgress(targetTask.projectId, updatedTasks);
      }
    }
  };

  const activeProj = projects.find(p => p.id === selectedProjectId) || projects[0];
  const activeProjTasks = tasks.filter(t => t.projectId === (activeProj?.id || selectedProjectId));

  // Columns specification
  const columnSchema = [
    { id: 'todo' as const, title: language === 'bn' ? '📋 করণীয় তালিকা' : '📋 To-Do', label: 'To-Do', color: 'border-blue-500/20 bg-blue-950/5 text-blue-400 hover:border-blue-500/40' },
    { id: 'in_progress' as const, title: language === 'bn' ? '⚡ চলমান কাজ' : '⚡ In Progress', label: 'In Progress', color: 'border-amber-500/20 bg-amber-950/5 text-amber-400 hover:border-amber-500/40' },
    { id: 'testing' as const, title: language === 'bn' ? '🧪 টেস্ট এবং কিউএ' : '🧪 Testing', label: 'Testing', color: 'border-purple-500/25 bg-purple-950/5 text-purple-400 hover:border-purple-500/40' },
    { id: 'done' as const, title: language === 'bn' ? '✅ সম্পন্ন হয়েছে' : '✅ Done', label: 'Done', color: 'border-emerald-500/25 bg-emerald-950/5 text-emerald-400 hover:border-emerald-500/40' },
  ];

  return (
    <div className="space-y-6" id="projects-kanban-board-portal">
      
      {/* 3-Column Summary Stats Dashboard Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="kanban-summary-statistics-header">
        
        {/* Metric 1: Active Tasks */}
        <div className={`p-5 rounded-3xl border ${panelBg} flex items-center justify-between shadow-sm transition hover:border-purple-500/20`}>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Active Sprint Tasks</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{activeTasksCount}</span>
              <span className="text-xs font-mono text-neutral-500">ongoing</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {language === 'bn' ? 'ব্যাকলগ ও বোর্ডে থাকা মোট সচল কাজ।' : 'Tracked across all backlog, design and testing pipelines.'}
            </p>
          </div>
          <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/10 shadow-inner">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Overdue Indicators */}
        <div className={`p-5 rounded-3xl border transition shadow-sm ${
          overdueTasksCount > 0 
            ? 'bg-rose-950/25 border-rose-500/20 text-rose-350 hover:border-rose-500/45' 
            : `${panelBg} hover:border-emerald-500/20`
        }`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Overdue Sprints</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black ${overdueTasksCount > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                  {overdueTasksCount}
                </span>
                <span className="text-xs font-mono text-neutral-500">delayed</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {overdueTasksCount > 0 
                  ? (language === 'bn' ? '⚠️ দ্রুত ডেডলাইন চেক করা জরুরি!' : '⚠️ Target milestones overdue. Urgent intervention required!') 
                  : (language === 'bn' ? '✅ সব কাজ নির্ধারিত সময়ে চলমান।' : '✅ All target deliverables on track. Master schedule safe.')}
              </p>
            </div>
            <div className={`p-3.5 rounded-2xl border shadow-inner ${
              overdueTasksCount > 0 
                ? 'bg-red-550/10 text-red-400 border-red-500/15' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'
            }`}>
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 3: Tasks Completed Today */}
        <div className={`p-5 rounded-3xl border ${panelBg} flex items-center justify-between shadow-sm transition hover:border-emerald-500/20`}>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Completed Today</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-405">{completedTodayCount}</span>
              <span className="text-xs font-mono text-emerald-500 font-bold">today</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {language === 'bn' ? 'আজ সম্পন্ন করা সফল কাজের সংখ্যা।' : `Sprint activities verified successfully on 2026-06-11.`}
            </p>
          </div>
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/15 shadow-inner">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Upper Navigation and Control Header Card */}
      <div className={`p-6 rounded-3xl border ${panelBg}`}>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <h3 className={`text-lg font-black tracking-tight ${textTitle}`}>
                {language === 'bn' ? 'এজাইল কানবান ওয়ার্কস্পেস' : 'Agile Scrum Team Kanban Board'}
              </h3>
            </div>
            <p className="text-xs text-neutral-400 font-medium">
              {language === 'bn' ? 'ফায়ারস্টোর রিয়েল-টাইম সিঙ্ক সুবিধাসহ প্রজেক্ট ও টাস্ক ড্র্যাগ-অ্যান্ড-ড্রপ পোর্টাল।' : 'Real-time collaborative workspace integrated directly with Cloud Firestore for teams & clients.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Source Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[10px] font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${isUsingFirestore ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
              <span className="opacity-80">
                {isUsingFirestore ? 'Firestore Connected (Live)' : 'LocalStorage Offline'}
              </span>
            </div>

            {/* Project Select Menu */}
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3.5 py-2.5 rounded-xl focus:border-purple-500 focus:outline-none font-bold"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title} ({p.id})</option>
              ))}
            </select>

            {/* New Project controls triggers */}
            <button
              onClick={() => setIsAddingProject(true)}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'নতুন প্রজেক্ট' : 'New Project'}</span>
            </button>

            {/* Create Task Button */}
            <button
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-650 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md shadow-purple-600/10 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'নতুন টাস্ক' : 'New Task'}</span>
            </button>
          </div>
        </div>

        {/* Selected Project Stats overview bar */}
        {activeProj && (
          <div className="mt-5 pt-5 border-t border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 text-left font-sans">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-lg border border-purple-500/10 uppercase tracking-widest">{activeProj.id}</span>
                <span className="font-extrabold text-sm text-neutral-200">{activeProj.title}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-450 font-semibold font-mono">
                <span className="flex items-center gap-1 text-neutral-400">
                  <User className="w-3.5 h-3.5 text-neutral-500" />
                  Lead: {activeProj.assignedStaff}
                </span>
                <span className="flex items-center gap-1 text-neutral-300 font-bold">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Budget: ${activeProj.budget}
                </span>
                <span className="flex items-center gap-1 text-neutral-400">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  Due: {activeProj.dueDate}
                </span>
                <span className="flex items-center gap-1 text-zinc-300">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  Tasks: {activeProjTasks.length} total
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 min-w-[200px]">
              <div className="w-full space-y-1">
                <div className="flex justify-between text-[11px] font-mono font-black text-purple-400">
                  <span>Sprint Completion</span>
                  <span>{activeProj.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-800">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300" 
                    style={{ width: `${activeProj.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kanban columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {columnSchema.map((col) => {
          const colTasks = activeProjTasks.filter(t => t.column === col.id);
          const isOver = activeDragCol === col.id;

          return (
            <div 
              key={col.id} 
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`p-4 rounded-3xl border transition-all duration-250 min-h-[420px] flex flex-col gap-3.5 ${col.color} ${
                isOver ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-neutral-950 border-purple-500/50 scale-[1.01]' : ''
              }`}
            >
              {/* Column Header */}
              <div className="flex justify-between items-center pb-2 border-b border-neutral-800/40 font-mono">
                <span className="text-xs font-extrabold text-neutral-200">{col.title}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-2.5 overflow-y-auto">
                <AnimatePresence initial={false}>
                  {colTasks.length === 0 ? (
                    <div className="h-32 rounded-2xl border border-dashed border-neutral-800/65 flex flex-col items-center justify-center p-3 text-center opacity-40">
                      <Layers className="w-6 h-6 text-neutral-500 mb-1" />
                      <span className="text-[9px] font-mono font-bold tracking-wide">
                        {language === 'bn' ? 'কাজ খালি' : 'Drop Tasks Here'}
                      </span>
                    </div>
                  ) : (
                    colTasks.map((t) => (
                      <motion.div
                        key={t.id}
                        layoutId={t.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, t.id)}
                        onClick={() => {
                          setSelectedTask(t);
                        }}
                        className="p-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-850/80 border border-neutral-800 hover:border-purple-500/50 transition-all duration-150 cursor-pointer space-y-3 group shadow-md hover:shadow-lg hover:shadow-purple-500/5"
                      >
                        <span className="text-xs font-semibold leading-relaxed text-neutral-205 block select-none">
                          {t.title}
                        </span>

                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className={`px-2 py-0.5 rounded-lg text-[8.5px] font-black uppercase tracking-wider ${
                            t.priority === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/10' : 
                            t.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' : 
                            t.priority === 'medium' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/10' : 
                            'bg-blue-500/10 text-blue-400 border border-blue-500/10'
                          }`}>
                            {t.priority}
                          </span>
                          
                          <span className="text-neutral-400 font-bold flex items-center gap-1 bg-neutral-950/85 px-2 py-0.5 rounded-lg border border-neutral-850">
                            👤 {t.assignee}
                          </span>
                        </div>

                        {t.dueDate && (
                          <div className="flex items-center justify-between pt-1 select-none font-mono text-[9px]">
                            <span className="text-neutral-500 font-semibold">{language === 'bn' ? 'শেষ সময়:' : 'Due:'} {t.dueDate}</span>
                            {t.column !== 'done' && t.dueDate < '2026-06-11' && (
                              <span className="text-red-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                                <AlertCircle className="w-3 h-3 inline" /> {language === 'bn' ? 'অতিক্রম!' : 'Overdue!'}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Interactive columns action movement triggers for non-mouse users */}
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-850/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteTask(t.id); }}
                            className="p-1 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-950 transition cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center gap-1.5">
                            {col.id !== 'todo' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleMoveTaskColumn(t.id, col.id === 'done' ? 'testing' : col.id === 'testing' ? 'in_progress' : 'todo'); }}
                                className="px-1.5 py-0.5 rounded text-[9px] font-black bg-neutral-950 text-neutral-500 hover:text-white border border-neutral-800"
                              >
                                ◀
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleMoveTaskColumn(t.id, col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'testing' : 'done'); }}
                                className="px-1.5 py-0.5 rounded text-[9px] font-black bg-neutral-950 text-purple-400 hover:text-purple-300 border border-neutral-800"
                              >
                                ▶
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* TASK DETAILS SLIDE-OVER PANEL */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetailPanel
            task={selectedTask}
            tasks={tasks}
            onClose={() => setSelectedTask(null)}
            onUpdateTask={updateSingleTaskInStateAndDb}
            language={language}
            theme={theme}
            triggerToast={triggerToast}
          />
        )}
      </AnimatePresence>

      {/* DIALOG MODEL A: CREATE NEW PROJECT */}
      {isAddingProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">📂 Instantiate New Scrum Project</h4>
              <button 
                onClick={() => setIsAddingProject(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Android Customer Delivery App"
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Imran Hasan"
                  value={newProjClient}
                  onChange={(e) => setNewProjClient(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Budget ($ USD)</label>
                  <input
                    type="number"
                    value={newProjBudget}
                    onChange={(e) => setNewProjBudget(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Due Date</label>
                  <input
                    type="date"
                    value={newProjDueDate}
                    onChange={(e) => setNewProjDueDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Staff Assignee Lead</label>
                <select
                  value={newProjStaff}
                  onChange={(e) => setNewProjStaff(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 font-bold"
                >
                  <option value="Anisur Rahman">Anisur Rahman (Dev Leads)</option>
                  <option value="Sayeeda Yeasmin">Sayeeda Yeasmin (UI Dev & QA)</option>
                  <option value="Tariqul Islam">Tariqul Islam (SEO Audit Expert)</option>
                  <option value="Fahim Morshed">Fahim Morshed (DevOps Lead)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG MODEL B: CREATE NEW TASK */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">📋 Queue New Kanban Task</h4>
              <button 
                onClick={() => setIsAddingTask(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Parent Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 font-bold"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Task Title / Specification</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Setup automated daily back-ups"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Priority Factor</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 font-bold"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical (ASAP)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Developer Assignee</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 font-bold"
                  >
                    <option value="Anisur">Anisur</option>
                    <option value="Sayeeda">Sayeeda</option>
                    <option value="Tariqul">Tariqul</option>
                    <option value="Fahim">Fahim</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Task Target Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 font-mono"
                />
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Task Scope & Description</label>
                <textarea
                  placeholder="Specify task instructions, expectations, and milestones..."
                  rows={2}
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Log Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
