export interface SaveMethod {
  saveData(data: any): Promise<void>;
}
