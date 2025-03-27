import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  // Toggle between Login and Sign-Up views
    showLogin: boolean = true;
    showSignUp: boolean = false;

  // Data objects for login and sign-up forms
  loginData = {
    email: '',
    password: '',
  };

  signUpData = {
    email: '',
    password: '',
  };

  constructor(private auth: Auth, private router: Router) {}

  // Handle Sign-Up functionality
  onSignUp() {
    console.log('Sign-Up Attempt:', this.signUpData);

    createUserWithEmailAndPassword(this.auth, this.signUpData.email, this.signUpData.password)
      .then((userCredential) => {
        console.log('Sign-Up Successful:', userCredential.user);
        this.router.navigate(['/main']).then(() => {
          console.log('Navigated to /main');
        });
      })
      .catch((error) => {
        console.error('Sign-Up Error:', error);

        // Handle specific Firebase sign-up errors
        if (error.code === 'auth/email-already-in-use') {
          alert('This email is already in use. Please try logging in.');
        } else if (error.code === 'auth/invalid-email') {
          alert('Invalid email format. Please enter a valid email.');
        } else if (error.code === 'auth/weak-password') {
          alert('Weak password. Password should be at least 6 characters.');
        } else {
          alert('Error during sign-up: ' + error.message);
        }
      });
  }

  // Handle Login functionality
  onLogin() {
    console.log('Login Attempt:', this.loginData);
  
    signInWithEmailAndPassword(this.auth, this.loginData.email, this.loginData.password)
      .then((userCredential) => {
        console.log('Login Successful:', userCredential.user);
        this.router.navigate(['/main']).then(() => {
          console.log('Navigated to /main');
        });
      })
      .catch((error) => {
        console.error('Login Error:', error);
  
        if (error.code === 'auth/user-not-found') {
          alert('No account found with this email. Please sign up first.');
        } else if (error.code === 'auth/wrong-password') {
          alert('Incorrect password. Please try again.');
        } else if (error.code === 'auth/invalid-email') {
          alert('Invalid email format. Please enter a valid email address.');
        } else {
          alert('Error during login: ' + error.message);
        }
      });
  }
  

  // Switch to Sign-Up view
  switchToSignUp() {
    this.showLogin = false;
    this.showSignUp = true;
  }

  // Switch to Login view
  switchToLogin() {
    this.showLogin = true;
    this.showSignUp = false;
  }
}
