"use strict";
(function () {
  if (localStorage.getItem("zemthemecolors") == "light") {
    document.querySelector("html").setAttribute("data-theme-color", "light");
  }
  if (localStorage.getItem("zemthemecolors") == "dark") {
    document.querySelector("html").setAttribute("data-theme-color", "dark");
  }
  if (localStorage.getItem("zemthemecolors") == "glassy") {
    document.querySelector("html").setAttribute("data-theme-color", "glassy");
  }
})();
