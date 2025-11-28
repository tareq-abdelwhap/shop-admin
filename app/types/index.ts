export default {};

declare global {
  type Column = {
    field: string;
    header: any;
    sortable?: boolean;
    type?: 'price' | 'date';
    style?: string;
    class?: string;
  };

  type Field = {
    key: string;
    label: any;
    type: string;
    value: any;
    helperText?: boolean;
    hide?: boolean;
  };
}
