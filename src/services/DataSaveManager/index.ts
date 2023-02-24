import LocalSaveMethod from './LocalSave';
import ServerSaveMethod from './ServerSave';
import { SaveMethod } from './types';

class DataSaver {
  private saveMethod: SaveMethod;

  constructor(useLocal: boolean) {
    if (useLocal) {
      this.saveMethod = new LocalSaveMethod();
    } else {
      this.saveMethod = new ServerSaveMethod();
    }
  }

  saveData(data: any): Promise<void> {
    return this.saveMethod.saveData(data);
  }
}

export default DataSaver;
