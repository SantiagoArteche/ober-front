import { User } from './user.model';

enum STATUS {
  pending = 'pending',
  inProgress = 'in progress',
  completed = 'completed',
}

export class Task {
  constructor(
    public _id: string,
    public name: string,
    public description: string,
    public assignedTo: User[] = [],
    public projectId: { _id: string; name: string },
    public status: string = STATUS.pending,
    public startDate: Date = new Date(),
    public endDate: Date = new Date()
  ) {}
}
