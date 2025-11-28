export const useGetField = (
  data: any,
  key: string,
  type?: Column['type']
): any => {
  if (!key) return false;

  const _key = key?.split('.');

  if (_key.length > 1) {
    return useGetField(data[_key?.at(0)!], _key.slice(1).join('.'));
  }

  let field = data[_key?.at(0)!];

  if (type === 'price') field = formatPrice(field);

  if (type === 'date') field = new Date(field).toLocaleString();

  return field;
};
