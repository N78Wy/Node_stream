export class Frameworks {
  protected cache = new Map<Symbol, any>();

  constructor(protected readonly ctx: any) {}
}
