// wrapper for querySelector...returns matching element
export function qs(selector:string, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key:string) {
  const data = localStorage.getItem(key)
  if (data) {
    return JSON.parse(data);
  } else { 
    return [] ;
  } 
  // Remember ? ... : ... ; is like saying if this then this, if not then this (Condition ? True : False;).
    // const dataList = JSON.parse(localStorage.getItem(key)) || [];
}

// save data to local storage
export function setLocalStorage(key:string, data:any) {
  const storedData = getLocalStorage(key);
  // if (Array.isArray(storedData)) {
  // return storedData
  // } else {
  // return [];
  // }
  const convertArray = Array.isArray(storedData) ? storedData : [];
  convertArray.push(data);
  // It still sees it as objects/string instead of array so add the condition and make sure is being converted to an array
  localStorage.setItem(key, JSON.stringify(convertArray));
}

// set a listener for both touchend and click
interface ClickHandler {
  (e:Event):void;
}

export function setClick(selector:string, callback:ClickHandler) {
  const element = qs(selector);
  element?.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback(event);
  });
  element?.addEventListener("click", callback);
}

export function openUserMenu(selector:string) {
  setClick(selector, (e:Event) => {
    e.stopPropagation();
    const el = document.querySelector(".user__menu");
    el?.classList.toggle("open");
  });
  setClick("body", () => {
    const openMenus = document.querySelectorAll(".open");
    openMenus.forEach((el) => {
      el?.classList.remove("open");
    });
  });
}
