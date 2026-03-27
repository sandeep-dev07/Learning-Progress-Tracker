// In-memory Mock Firebase implementation. 
// No LocalStorage or SessionStorage used per your request.
// Data will reset upon page refresh.

export const auth = { currentUser: null };
export const db = {};

// In-memory stores
let mockUsers = {};
let mockDb = {};
let mockCurrentUser = null;

let authListeners = [];

const triggerAuthChange = (user) => {
  mockCurrentUser = user;
  auth.currentUser = user;
  authListeners.forEach(fn => fn(user));
};

export const onAuthStateChanged = (authObj, cb) => {
  authListeners.push(cb);
  cb(mockCurrentUser); // Fire immediately with current state
  return () => {
    authListeners = authListeners.filter(f => f !== cb);
  };
};

export const signInWithEmailAndPassword = async (authObj, email, password) => {
  const userDoc = Object.values(mockUsers).find(u => u.email === email && u.password === password);
  
  if (!userDoc) throw new Error("Firebase Auth Mock: Invalid credentials.");
  
  const userObj = { uid: userDoc.uid, email };
  triggerAuthChange(userObj);
  return { user: userObj };
};

export const createUserWithEmailAndPassword = async (authObj, email, password) => {
  if (Object.values(mockUsers).some(u => u.email === email)) {
    throw new Error("Firebase Auth Mock: Email already in use.");
  }
  
  const uid = 'user_' + Date.now();
  mockUsers[uid] = { uid, email, password };
  
  const userObj = { uid, email };
  triggerAuthChange(userObj);
  return { user: userObj };
};

export const signOut = async () => {
  triggerAuthChange(null);
};

export const doc = (db, collectionName, id) => {
  return { collectionName, id, path: `${collectionName}/${id}` };
};

const snapshotListeners = {};

export const setDoc = async (docRef, data, options = {}) => {
  const collName = docRef.collectionName;
  if (!mockDb[collName]) mockDb[collName] = {};
  
  if (options.merge) {
    mockDb[collName][docRef.id] = { ...(mockDb[collName][docRef.id] || {}), ...data };
  } else {
    mockDb[collName][docRef.id] = data;
  }
  
  // Trigger onSnapshot listeners if any
  if (snapshotListeners[docRef.path]) {
    snapshotListeners[docRef.path].forEach(cb => cb({
      exists: () => true,
      data: () => mockDb[collName][docRef.id]
    }));
  }
};

export const getDoc = async (docRef) => {
  const collName = docRef.collectionName;
  const docData = mockDb[collName] ? mockDb[collName][docRef.id] : undefined;
  return {
    exists: () => !!docData,
    data: () => docData
  };
};

export const onSnapshot = (docRef, cb) => {
  if (!snapshotListeners[docRef.path]) {
    snapshotListeners[docRef.path] = [];
  }
  snapshotListeners[docRef.path].push(cb);

  // Trigger initial fetch
  getDoc(docRef).then(cb);

  return () => {
    snapshotListeners[docRef.path] = snapshotListeners[docRef.path].filter(f => f !== cb);
  };
};
