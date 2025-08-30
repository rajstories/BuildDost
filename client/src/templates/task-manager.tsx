import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import TemplateActions from "@/components/features/template-actions";
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Circle,
  MoreVertical,
  Edit,
  Trash2,
  Flag,
  Users,
  Folder,
  Target,
  TrendingUp,
  AlertCircle,
  X,
  Check
} from "lucide-react";
import { useState } from "react";

export default function TaskManagerTemplate() {
  const [activeTab, setActiveTab] = useState("all");
  const [completedTasks, setCompletedTasks] = useState(new Set([1, 3]));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design new landing page",
      description: "Create a modern and responsive design for the homepage",
      project: "Website Redesign",
      priority: "High",
      dueDate: "2023-12-20",
      assignee: "Sarah Johnson",
      tags: ["Design", "Frontend"],
      completed: false
    },
    {
      id: 2,
      title: "Implement user authentication",
      description: "Set up secure login and registration system",
      project: "Mobile App",
      priority: "High",
      dueDate: "2023-12-18",
      assignee: "Mike Chen",
      tags: ["Backend", "Security"],
      completed: false
    },
    {
      id: 3,
      title: "Write blog post about new features",
      description: "Create engaging content highlighting the latest updates",
      project: "Marketing Campaign",
      priority: "Medium",
      dueDate: "2023-12-22",
      assignee: "Emily Rodriguez",
      tags: ["Content", "Marketing"],
      completed: true
    },
    {
      id: 4,
      title: "Set up analytics tracking",
      description: "Implement Google Analytics and conversion tracking",
      project: "Website Redesign",
      priority: "Low",
      dueDate: "2023-12-25",
      assignee: "David Park",
      tags: ["Analytics", "Tracking"],
      completed: false
    },
    {
      id: 5,
      title: "Test mobile responsiveness",
      description: "Ensure all pages work perfectly on mobile devices",
      project: "Website Redesign",
      priority: "High",
      dueDate: "2023-12-19",
      assignee: "Lisa Wang",
      tags: ["Testing", "Mobile"],
      completed: false
    },
    {
      id: 6,
      title: "Prepare product demo",
      description: "Create presentation and demo materials for stakeholders",
      project: "Product Launch",
      priority: "Medium",
      dueDate: "2023-12-21",
      assignee: "Alex Thompson",
      tags: ["Presentation", "Demo"],
      completed: true
    }
  ]);
  const { toast } = useToast();

  const toggleTask = (taskId: number) => {
    const newCompleted = new Set(completedTasks);
    const task = tasks.find(t => t.id === taskId);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
      toast({ title: "Task marked as incomplete", description: `${task?.title} is now pending` });
    } else {
      newCompleted.add(taskId);
      toast({ title: "Task completed!", description: `${task?.title} has been completed` });
    }
    setCompletedTasks(newCompleted);
  };

  const stats = [
    { label: "Total Tasks", value: "48", icon: Target, color: "blue" },
    { label: "Completed", value: "32", icon: CheckCircle2, color: "green" },
    { label: "In Progress", value: "12", icon: Clock, color: "orange" },
    { label: "Overdue", value: "4", icon: AlertCircle, color: "red" }
  ];

  const projects = [
    { id: 1, name: "Website Redesign", tasks: 12, completed: 8, color: "blue", progress: 67 },
    { id: 2, name: "Mobile App", tasks: 18, completed: 10, color: "purple", progress: 56 },
    { id: 3, name: "Marketing Campaign", tasks: 8, completed: 6, color: "green", progress: 75 },
    { id: 4, name: "Product Launch", tasks: 10, completed: 8, color: "orange", progress: 80 }
  ];

  const handleNewTask = () => {
    const newTask = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      title: "New Task",
      description: "Task description",
      project: "Website Redesign",
      priority: "Medium",
      dueDate: new Date().toISOString().split('T')[0],
      assignee: "Current User",
      tags: ["New"],
      completed: false
    };
    setTasks([...tasks, newTask]);
    toast({ title: "Task created!", description: "New task has been added to your list" });
  };

  const handleDeleteTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
    toast({ title: "Task deleted", description: `${task?.title} has been removed` });
  };

  const handleEditTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    toast({ title: "Edit Task", description: `Editing: ${task?.title}` });
  };

  const handleProjectFilter = (projectName: string) => {
    setSelectedProject(selectedProject === projectName ? null : projectName);
    toast({ title: "Filter Applied", description: `Showing tasks for ${projectName}` });
  };

  const handleNavigation = (navType: string) => {
    toast({ title: "Navigation", description: `Switched to ${navType}` });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProjectColor = (project: string) => {
    const projectData = projects.find(p => p.name === project);
    return projectData ? `bg-${projectData.color}-100 text-${projectData.color}-800` : "bg-gray-100 text-gray-800";
  };

  const filteredTasks = tasks.filter(task => {
    // Apply tab filter
    let tabMatch = true;
    switch (activeTab) {
      case "completed": 
        tabMatch = completedTasks.has(task.id);
        break;
      case "pending": 
        tabMatch = !completedTasks.has(task.id);
        break;
      case "overdue": 
        tabMatch = new Date(task.dueDate) < new Date() && !completedTasks.has(task.id);
        break;
      default: 
        tabMatch = true;
    }
    
    // Apply search filter
    const searchMatch = searchTerm === "" || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply project filter
    const projectMatch = !selectedProject || task.project === selectedProject;
    
    return tabMatch && searchMatch && projectMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <TemplateActions templateId="todo" templateName="Task Manager" />
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Target className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900">TaskFlow</span>
        </div>
        
        <nav className="mt-6">
          <div className="px-6 mb-6">
            <Button onClick={handleNewTask} className="w-full bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-new-task">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
          
          <div className="space-y-1 px-3">
            {[
              { name: "All Tasks", icon: Target, count: 48 },
              { name: "My Tasks", icon: User, count: 12 },
              { name: "Team Tasks", icon: Users, count: 24 },
              { name: "Projects", icon: Folder, count: 4 }
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.name)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full text-left"
                  data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex items-center">
                    <IconComponent className="h-5 w-5 mr-3" />
                    {item.name}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.count}
                  </Badge>
                </button>
              );
            })}
          </div>

          <div className="mt-8 px-3">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Projects
            </h3>
            <div className="space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectFilter(project.name)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 w-full text-left ${
                    selectedProject === project.name ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                  data-testid={`project-${project.name.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-${project.color}-500 mr-3`}></div>
                    <span className="truncate">{project.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{project.completed}/{project.tasks}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Manage your tasks and projects efficiently</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent w-64"
                data-testid="input-search-tasks"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} data-testid="button-filter">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <button onClick={() => toast({ title: "Profile", description: "User profile settings" })} className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors" data-testid="button-user-profile">
              <span className="text-white text-sm font-bold">A</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      stat.color === 'orange' ? 'bg-orange-100' : 'bg-red-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'orange' ? 'text-orange-600' : 'text-red-600'
                      }`} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Projects Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Projects Overview</h2>
                <Button variant="ghost" size="sm" onClick={() => toast({ title: "Analytics", description: "Viewing project analytics" })} data-testid="button-project-analytics">
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-${project.color}-500`}></div>
                        <span className="font-medium text-gray-900 text-sm">{project.name}</span>
                      </div>
                      <span className="text-xs text-gray-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-${project.color}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{project.completed} completed</span>
                      <span>{project.tasks - project.completed} remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Overview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
                    <Button onClick={handleNewTask} className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-task">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                  
                  {/* Task Tabs */}
                  <div className="flex space-x-4 mt-4">
                    {[
                      { id: "all", label: "All Tasks", count: tasks.length },
                      { id: "pending", label: "Pending", count: tasks.filter(t => !completedTasks.has(t.id)).length },
                      { id: "completed", label: "Completed", count: completedTasks.size },
                      { id: "overdue", label: "Overdue", count: tasks.filter(t => new Date(t.dueDate) < new Date() && !completedTasks.has(t.id)).length }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        data-testid={`tab-${tab.id}`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="mt-1 flex-shrink-0"
                          data-testid={`button-toggle-task-${task.id}`}
                        >
                          {completedTasks.has(task.id) ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-medium ${
                              completedTasks.has(task.id) ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}>
                              {task.title}
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => toast({ title: "More Actions", description: `Options for: ${task.title}` })} data-testid={`button-more-${task.id}`}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className={getPriorityColor(task.priority)} variant="secondary">
                                <Flag className="h-3 w-3 mr-1" />
                                {task.priority}
                              </Badge>
                              <Badge className={getProjectColor(task.project)} variant="secondary">
                                {task.project}
                              </Badge>
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                {task.dueDate}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600">
                                  {task.assignee.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => handleEditTask(task.id)} data-testid={`button-edit-${task.id}`}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)} data-testid={`button-delete-${task.id}`}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {task.tags.map((tag) => (
                              <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}