/**
 * Created by chen on 2017/3/27.
 */

// localStorage存
export const setStore = (name, content) => {
  if(!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};
// 获取localStorage
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
};
