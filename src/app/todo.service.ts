import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, deleteDoc, updateDoc, collectionData, query, where } from '@angular/fire/firestore';
import { Task } from './task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private firestore: Firestore) {} // Correctly inject Firestore here

  // Get tasks by category
  getTasksByCategory(category: string): Observable<Task[]> {
    // Firestore query to filter tasks by category
    const tasksCollection = collection(this.firestore, 'tasks'); // Properly tied to the DI Firestore instance
    const tasksQuery = query(tasksCollection, where('category', '==', category));
    return collectionData(tasksQuery, { idField: 'id' }) as Observable<Task[]>;
  }

  // Add a task
  addTask(task: Task): Promise<void> {
    const tasksCollection = collection(this.firestore, 'tasks');
    return addDoc(tasksCollection, task)
      .then(() => {
        console.log('Task added successfully:', task);
      })
      .catch((error) => {
        console.error('Error adding task:', error);
        throw error;
      });
  }

  // Delete a task by ID
  deleteTask(taskId: string): Promise<void> {
    const taskDoc = doc(this.firestore, `tasks/${taskId}`);
    return deleteDoc(taskDoc)
      .then(() => {
        console.log(`Task with ID: ${taskId} deleted successfully`);
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
        throw error;
      });
  }

  // Update a task's description or deadline
  updateTask(taskId: string, field: 'description' | 'deadline', value: string): Promise<void> {
    const taskDoc = doc(this.firestore, `tasks/${taskId}`);
    const updateData =
      field === 'description'
        ? { description: value }
        : { deadline: value ? new Date(value).toISOString() : null }; // Store deadline as ISO format
    return updateDoc(taskDoc, updateData)
      .then(() => {
        console.log(`Task with ID: ${taskId} updated successfully`);
      })
      .catch((error) => {
        console.error('Error updating task:', error);
        throw error;
      });
  }

  // Get all tasks (optional utility function)
  getAllTasks(): Observable<Task[]> {
    const tasksCollection = collection(this.firestore, 'tasks');
    return collectionData(tasksCollection, { idField: 'id' }) as Observable<Task[]>;
  }
}
