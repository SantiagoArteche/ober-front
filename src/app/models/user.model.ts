export class User {
  constructor(
    public _id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) {}
}
