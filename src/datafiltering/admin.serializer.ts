import { Exclude } from 'class-transformer';

export class SerializedAdmin {
  username: string;

  @Exclude()
  password: string;

  role: string;

  constructor(partial: Partial<SerializedAdmin>) {
    Object.assign(this, partial);
  }
}
