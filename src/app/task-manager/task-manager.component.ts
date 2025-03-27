import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Task } from '../task.model';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css'],
})
export class TaskManagerComponent implements OnInit {
  categories = [
    { name: 'Work', icon: '📂' },
    { name: 'Personal', icon: '👤' },
    { name: 'Shopping', icon: '🛒' },
    { name: 'Health', icon: '🏥' },
  ];
  selectedCategory: string | null = null;
  tasks: Task[] = [];
  newTask: Task = {
    id: '',
    name: '',
    category: '',
    description: '',
    deadline: null,
  };
  editingTaskId: string | null = null;
  editingField: 'description' | 'deadline' | null = null;
  showAddTaskInput: boolean = false; // Controls visibility of input box and mic
  notifiedTasks: Set<string> = new Set(); // Track tasks that have been notified

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    // Check for deadlines every minute
    setInterval(() => this.checkDeadlines(), 60000);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;

    // Subscribe to the observable to fetch tasks
    this.todoService.getTasksByCategory(category).subscribe((tasks) => {
      this.tasks = tasks; // Assign the tasks to the array
    });

    this.newTask.category = category; // Assign the category for adding new tasks
  }

  addTask() {
    if (this.newTask.name.trim()) {
      this.newTask.id = Date.now().toString(); // Generate unique ID
      this.todoService.addTask({ ...this.newTask }).then(() => {
        this.newTask.name = ''; // Clear the input
        this.showAddTaskInput = false; // Hide the input box
      });
    }
  }

  deleteTask(taskId: string) {
    this.todoService.deleteTask(taskId).then(() => {
      this.notifiedTasks.delete(taskId); // Remove from notified list
    });
  }

  enterEditMode(taskId: string, field: 'description' | 'deadline') {
    this.editingTaskId = taskId;
    this.editingField = field;
  }

  saveEdit(taskId: string, value: string, field: 'description' | 'deadline') {
    // Check if it's a deadline and convert to a Date
    if (field === 'deadline') {
      value = value ? new Date(value).toISOString() : null;
    }

    this.todoService.updateTask(taskId, field, value).then(() => {
      this.tasks = this.tasks.map((task) =>
        task.id === taskId
          ? { ...task, [field]: field === 'deadline' ? new Date(value) : value }
          : task
      );

      this.editingTaskId = null; // Exit editing mode
      this.editingField = null; // Reset editing field
    });
  }

  checkDeadlines() {
    const now = new Date();
    this.tasks.forEach((task) => {
      if (
        task.deadline &&
        new Date(task.deadline) < now &&
        !this.notifiedTasks.has(task.id) // Notify only if not already notified
      ) {
        this.showNotification(`Task "${task.name}" is overdue!`);
        this.notifiedTasks.add(task.id); // Mark task as notified
      }
    });
  }

  showNotification(message: string) {
    if (Notification.permission === 'granted') {
      new Notification(message);
    } else if (Notification.permission !== 'denied') {
      // Request permission for notifications
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(message);
        }
      });
    } else {
      // Fallback to alert if notifications are denied
      alert(message);
    }
  }

  startVoiceInput() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event: any) => {
      const voiceInput = event.results[0][0].transcript;
      this.newTask.name = voiceInput;
    };

    recognition.onend = () => {
      this.addTask();
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
  }
}
