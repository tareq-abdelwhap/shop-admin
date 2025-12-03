export default {};

declare global {
  type Column = {
    field: string;
    header: any;
    sortable?: boolean;
    type?: 'price' | 'date';
    style?: string;
    class?: string;
    value?: (...args: any) => any;
  };

  type Field = {
    key: string;
    label: any;
    type: string;
    options?: any[];
    value: any;
    helperText?: boolean;
    hide?: boolean;
    attrs?: Record<string, any>;
  };
}
