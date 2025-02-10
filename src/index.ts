import 'module-alias/register';
import { AppFactory } from 'src/application';

AppFactory.create()
  .then((app) => app.start())
  .catch(console.error);
