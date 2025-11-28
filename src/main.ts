import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { Chart, registerables } from 'chart.js';

// ✅ Register all Chart.js controllers, elements, scales, plugins
Chart.register(...registerables);

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
