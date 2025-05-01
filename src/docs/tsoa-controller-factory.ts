import { container } from 'tsyringe';
import { Controller } from 'tsoa';

export function resolveController<T extends Controller>(controllerClass: new (...args: any[]) => T): T {
  return container.resolve<T>(controllerClass);
}
