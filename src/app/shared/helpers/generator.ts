export const generateId = (idLength: number): string => {
  const abc = 'abcdefghijklmnopqrstuvwxyz';
  const numbs = '0123456789';
  const chars = `${abc.toUpperCase()}${abc.toLowerCase()}${numbs}`;

  return [...Array(idLength)]
    .map(() => (
      chars.charAt(Math.floor(Math.random() * chars.length))
    ))
    .join('')
  ;
};
