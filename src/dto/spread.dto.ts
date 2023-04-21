interface ISpreadColumns {
  title: string;
  type?: string;
  width: number;
  picklistValues?: [];
}

export class SpreadDataDTO {
  userId: string;
  columns: ISpreadColumns[];
  data: [];
}
