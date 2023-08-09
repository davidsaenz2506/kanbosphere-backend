export interface IChildCompounds {
  name: string;
  columnValue: string;
}
export interface ICompoundProjection {
  formulaName: string;
  compounds: IChildCompounds[]
}
interface ISpreadColumns {
  title: string;
  type?: string;
  width: number;
  icon: string;
  compoundValues?: ICompoundProjection;
  picklistValues?: [];
}

export class SpreadDataDTO {
  userId: string;
  columns: ISpreadColumns[];
  data: [];
}
