import { SaveMethod } from './types';

class ServerSaveMethod implements SaveMethod {
  saveData(data: any): Promise<void> {
    console.log(this);
    // implementation to save data to server
    return Promise.resolve();
  }
}

export default ServerSaveMethod;
