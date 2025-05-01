// src/ioc/tsoa-controller-factory.ts
import { IocContainer } from "@tsoa/runtime";
import { container } from "tsyringe";

export const iocContainer: IocContainer = {
  get<T>(controller: string | symbol | { prototype: any }): T {
    return container.resolve(controller as any) as T;
  },
};