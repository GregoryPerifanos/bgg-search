import { bootstrapApplication, type BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfigServer } from './app/app.config.server';

export default function bootstrap(context: BootstrapContext) {
  return bootstrapApplication(AppComponent, appConfigServer, context);
}
