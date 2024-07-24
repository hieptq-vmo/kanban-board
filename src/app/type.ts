export interface Todo {
  id: string;
  name: string;
  isDone: boolean;
}

export enum POSTReq {
  AddColumn = "addColumn",
  AddTitle = "addTitle",
  ChangeColumn = 'ChangeColumn',
  UpdateTitle = 'UpdateTitle'
}
