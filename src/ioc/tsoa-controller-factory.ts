// src/lib/tsyringeTsoaIocContainer.ts
// Target this file in your tsoa.json's "iocModule" property

import { IocContainer } from "@tsoa/runtime";
import { container } from "tsyringe";
import { UserController } from "../controllers/UserController";

export const iocContainer: IocContainer = {
  get<T>(controller: string | symbol | Function): T {
    return container.resolve(UserController) as T;
  },
};
