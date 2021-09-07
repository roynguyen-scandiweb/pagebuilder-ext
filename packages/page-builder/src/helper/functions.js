export const escapeHtml = unsafe => unsafe
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;")
.replace(/'/g, "&#039;");

export const isNotEmptyArr = arr => Array.isArray(arr) && arr.length;
export const isEmptyArr = arr => !isNotEmptyArr(arr)

export const makeId = length => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
};

export const isString = (item) => {
  return typeof item === 'string' || item instanceof String
}
