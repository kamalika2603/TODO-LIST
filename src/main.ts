import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; // Angular configuration
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
