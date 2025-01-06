import { Task } from './task.model';
import { User } from './user.model';

export class Project {
  constructor(
    public _id: string,
    public readonly name: string,
    public readonly users: User[],
    public readonly tasks: Task[]
  ) {}
}
