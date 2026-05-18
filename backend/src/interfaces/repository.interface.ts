export interface IBaseRepository<T, CreateDto, UpdateDto> {
  findById(id: string): Promise<T | null>;
  findAll(filters: Record<string, unknown>): Promise<T[]>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}