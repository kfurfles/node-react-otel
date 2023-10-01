import { UniqueEntityID } from './UniqueEntityID';
import debug from 'debug';
const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

export abstract class Entity<T> {
  public readonly _id: UniqueEntityID;
  public readonly props: T;
  public readonly _log: debug.Debugger;

  constructor(props: T, id?: UniqueEntityID) {
    this._id = id ? id : new UniqueEntityID();
    this.props = props;
    this._log = debug(`app:domain:user:${this._id}`);
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}
