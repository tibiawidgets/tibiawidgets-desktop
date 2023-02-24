import { SaveMethod } from './types';

class LocalSaveMethod implements SaveMethod {
  saveData(data: any): Promise<void> {
    console.log(this);
    // implementation to save data to local storage
    return Promise.resolve();
  }
}

export default LocalSaveMethod;
