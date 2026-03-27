export const INITIAL_USERS = [
  { id:'u1', name:'Alice Johnson', email:'alice@demo.com', password:'demo', role:'student', avatar:'AJ', color:'#4f8ef7' },
  { id:'u2', name:'Bob Chen', email:'bob@demo.com', password:'demo', role:'student', avatar:'BC', color:'#a78bfa' },
  { id:'u3', name:'Carol Smith', email:'carol@demo.com', password:'demo', role:'student', avatar:'CS', color:'#fbbf24' },
  { id:'u4', name:'Dr. Maya Reed', email:'teacher@demo.com', password:'demo', role:'teacher', avatar:'MR', color:'#00d4aa' },
];

export const INITIAL_MODULES = [
  { id:'m1', title:'React Fundamentals', description:'Core React concepts including components, state, and props', color:'teal', teacherId:'u4', totalTasks:4 },
  { id:'m2', title:'State Management', description:'useState, useReducer, Context API and global state patterns', color:'blue', teacherId:'u4', totalTasks:3 },
  { id:'m3', title:'Routing & Navigation', description:'React Router v6, protected routes, nested routing', color:'purple', teacherId:'u4', totalTasks:3 },
  { id:'m4', title:'Performance Optimization', description:'Memoization, lazy loading, code splitting techniques', color:'amber', teacherId:'u4', totalTasks:4 },
];

export const INITIAL_TASKS = [
  { id:'t1', moduleId:'m1', title:'JSX and Components', description:'Learn JSX syntax and create functional components', points:10, assignedTo:['u1','u2','u3'] },
  { id:'t2', moduleId:'m1', title:'Props & PropTypes', description:'Pass data between components using props', points:10, assignedTo:['u1','u2','u3'] },
  { id:'t3', moduleId:'m1', title:'State with useState', description:'Manage local state in functional components', points:15, assignedTo:['u1','u2','u3'] },
  { id:'t4', moduleId:'m1', title:'Lifecycle with useEffect', description:'Side effects and component lifecycle', points:15, assignedTo:['u1','u2','u3'] },
  { id:'t5', moduleId:'m2', title:'useState Patterns', description:'Advanced patterns and best practices', points:10, assignedTo:['u1','u2','u3'] },
  { id:'t6', moduleId:'m2', title:'useReducer Hook', description:'Complex state management with reducers', points:15, assignedTo:['u1','u2','u3'] },
  { id:'t7', moduleId:'m2', title:'Context API', description:'Global state with createContext and useContext', points:20, assignedTo:['u1','u2','u3'] },
  { id:'t8', moduleId:'m3', title:'BrowserRouter Setup', description:'Configure React Router in your application', points:10, assignedTo:['u1','u2','u3'] },
  { id:'t9', moduleId:'m3', title:'Protected Routes', description:'Implement role-based route protection', points:15, assignedTo:['u1','u2','u3'] },
  { id:'t10', moduleId:'m3', title:'URL Parameters', description:'Dynamic routing with useParams hook', points:10, assignedTo:['u1','u2','u3'] },
  { id:'t11', moduleId:'m4', title:'React.memo', description:'Prevent unnecessary re-renders with memo', points:15, assignedTo:['u1','u2','u3'] },
  { id:'t12', moduleId:'m4', title:'useMemo & useCallback', description:'Memoize expensive calculations and functions', points:15, assignedTo:['u1','u2','u3'] },
  { id:'t13', moduleId:'m4', title:'Lazy Loading', description:'Code splitting with React.lazy and Suspense', points:15, assignedTo:['u1','u2','u3'] },
  { id:'t14', moduleId:'m4', title:'Bundle Optimization', description:'Webpack and bundle analysis strategies', points:20, assignedTo:['u1','u2','u3'] },
];

export const INITIAL_PROGRESS = {
  u1: { t1:true, t2:true, t3:true, t4:true, t5:true, t6:true, t7:false, t8:true, t9:false, t10:false, t11:false, t12:false, t13:false, t14:false },
  u2: { t1:true, t2:true, t3:false, t4:false, t5:true, t6:false, t7:false, t8:false, t9:false, t10:false, t11:false, t12:false, t13:false, t14:false },
  u3: { t1:true, t2:true, t3:true, t4:true, t5:true, t6:true, t7:true, t8:true, t9:true, t10:true, t11:true, t12:true, t13:false, t14:false },
};

export const MODULE_COLORS = { teal:'#00d4aa', blue:'#4f8ef7', purple:'#a78bfa', amber:'#fbbf24' };

export function calcProgress(userId, tasks, progress) {
  const userTasks = tasks;
  if (!userTasks.length) return 0;
  const done = userTasks.filter(t => progress[userId]?.[t.id]).length;
  return Math.round((done / userTasks.length) * 100);
}

export function mockApi(fn, delay=600) {
  return new Promise((res, rej) => setTimeout(() => { try { res(fn()); } catch(e) { rej(e); } }, delay));
}

export function uid() { return 'm' + Date.now() + Math.random().toString(36).slice(2,6); }
