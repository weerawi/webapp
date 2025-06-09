import { 
    collection, 
    addDoc, 
    updateDoc, 
    doc, 
    getDocs, 
    query, 
    where,
    Timestamp,
    deleteDoc 
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from '@/lib/firebase/config';
  import { ReconnectionTask } from '@/lib/store/slices/reconnectionSlice';
import { getAuth } from 'firebase/auth';
import { uploadService } from './uploadService';
  
  export const reconnectionService = {
    // Add new task
    async addTask(task: Omit<ReconnectionTask, 'id'>): Promise<string> {
      const docRef = await addDoc(collection(db, 'reconnectionTasks'), {
        ...task,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    },
  
    // Upload image
    // In reconnectionService.ts
    async uploadImage(file: File): Promise<string> {
        return await uploadService.uploadImage(file);
      },
  
    // Get active tasks (not finished)
    async getActiveTasks(): Promise<ReconnectionTask[]> {
      const q = query(collection(db, 'reconnectionTasks'), where('finished', '==', false));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ReconnectionTask));
    },
  
    // Update task status
    async updateTaskStatus(taskId: string, updates: Partial<ReconnectionTask>): Promise<void> {
      await updateDoc(doc(db, 'reconnectionTasks', taskId), updates);
    },
  
    // Clean up finished tasks (for daily cleanup)
    async cleanupFinishedTasks(): Promise<void> {
      const q = query(collection(db, 'reconnectionTasks'), where('finished', '==', true));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    }
  };


  export const setupDailyCleanup = () => {
    const scheduleCleanup = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0); // Next midnight
      
      const timeUntilMidnight = midnight.getTime() - now.getTime();
      
      setTimeout(async () => {
        try {
          await reconnectionService.cleanupFinishedTasks();
          console.log('Daily cleanup completed');
        } catch (error) {
          console.error('Daily cleanup failed:', error);
        }
        
        // Schedule next cleanup
        scheduleCleanup();
      }, timeUntilMidnight);
    };
    
    scheduleCleanup();
  };