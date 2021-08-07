export const writeToLocal = (namespace) => ({ key, value }) => localStorage.setItem(`${namespace}/${key}`, value)

export const loadFromLocal = (namespace) => (key) => localStorage.getItem(`${namespace}/${key}`)
