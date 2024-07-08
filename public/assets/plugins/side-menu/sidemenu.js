"use strict";

let currentWidth;
(function () {
  currentWidth = [];
  var slideMenu = $(".side-menu");

  // Toggle Sidebar
  $(document).on("click", '[data-bs-toggle="sidebar"]', function (event) {
    event.preventDefault();
    if ($(".app").hasClass("sidenav-toggled")) {
      $(".app").removeClass("sidenav-toggled");
      if (document.querySelector("html").getAttribute("data-vertical-style") === "doublemenu") {
        if (document.querySelector(".slide-menu") && innerWidth >= 992) {
          let slidemenu = document.querySelectorAll(".slide-menu");
          slidemenu.forEach((e) => {
            if (e.classList.contains("double-menu-active")) {
              e.classList.remove("double-menu-active");
            }
          });
          let sidemenuActive = document.querySelector(".side-menu__item.is-expanded");
          if (sidemenuActive?.nextElementSibling) {
            let submenu = sidemenuActive.nextElementSibling;
            submenu.classList.add("double-menu-active");
            document.body.classList.remove("sidenav-toggled");
          } else {
            document.body.classList.add("sidenav-toggled");
          }
        }
      }
    } else {
      $(".app").addClass("sidenav-toggled");
      if (innerWidth >= 992) {
        if (document.querySelector("html").getAttribute("data-vertical-style") === "doublemenu") {
          if (document.querySelector(".slide-menu")) {
            let slidemenu = document.querySelectorAll(".slide-menu");
            slidemenu.forEach((e) => {
              if (e.classList.contains("double-menu-active")) {
                e.classList.remove("double-menu-active");
              }
            });
          }
        }
      }
    }
  });
  responsive();
  // clearing the clicking functions already present on the element
  $("[data-bs-toggle='slide']").off("click");
  $("[data-bs-toggle='sub-slide']").off("click");
  $("[data-bs-toggle='sub-slide2']").off("click");

  // initiating the click function
  $("[data-bs-toggle='slide']").on("click", function (e) {
    var $this = $(this);
    var checkElement = $this.next();
    var animationSpeed = 300,
      slideMenuSelector = ".slide-menu";
    if (checkElement.is(slideMenuSelector) && checkElement.is(":visible")) {
      checkElement.slideUp(animationSpeed, function () {
        checkElement.removeClass("open");
      });
      checkElement.parent("li").removeClass("is-expanded");
    } else if (checkElement.is(slideMenuSelector) && !checkElement.is(":visible")) {
      var parent = $this.parents("ul").first();
      var ul = parent.find("ul:visible").slideUp(animationSpeed);
      ul.removeClass("open");
      var parent_li = $this.parent("li");
      checkElement.slideDown(animationSpeed, function () {
        checkElement.addClass("open");
        parent.find("li.is-expanded").removeClass("is-expanded");
        parent_li.addClass("is-expanded");
      });
    }
    if (checkElement.is(slideMenuSelector)) {
      e.preventDefault();
    }
  });

  // Activate sidebar slide toggle
  $("[data-bs-toggle='sub-slide']").on("click", function (e) {
    var $this = $(this);
    var checkElement = $this.next();
    var animationSpeed = 300,
      slideMenuSelector = ".sub-slide-menu";
    if (checkElement.is(slideMenuSelector) && checkElement.is(":visible")) {
      checkElement.slideUp(animationSpeed, function () {
        checkElement.removeClass("open");
      });
      checkElement.parent("li").removeClass("is-expanded");
    } else if (checkElement.is(slideMenuSelector) && !checkElement.is(":visible")) {
      var parent = $this.parents("ul").first();
      var ul = parent.find("ul:visible").slideUp(animationSpeed);
      ul.removeClass("open");
      var parent_li = $this.parent("li");
      checkElement.slideDown(animationSpeed, function () {
        checkElement.addClass("open");
        parent.find("li.is-expanded").removeClass("is-expanded");
        parent_li.addClass("is-expanded");
      });
    }
    if (checkElement.is(slideMenuSelector)) {
      e.preventDefault();
    }
  });

  // Activate sidebar slide toggle
  $("[data-bs-toggle='sub-slide2']").on("click", function (e) {
    var $this = $(this);
    var checkElement = $this.next();
    var animationSpeed = 300,
      slideMenuSelector = ".sub-slide-menu1";
    if (checkElement.is(slideMenuSelector) && checkElement.is(":visible")) {
      checkElement.slideUp(animationSpeed, function () {
        checkElement.removeClass("open");
      });
      checkElement.parent("li").removeClass("is-expanded");
    } else if (checkElement.is(slideMenuSelector) && !checkElement.is(":visible")) {
      var parent = $this.parents("ul").first();
      var ul = parent.find("ul:visible").slideUp(animationSpeed);
      ul.removeClass("open");
      var parent_li = $this.parent("li");
      checkElement.slideDown(animationSpeed, function () {
        checkElement.addClass("open");
        parent.find("li.is-expanded").removeClass("is-expanded");
        parent_li.addClass("is-expanded");
      });
    }
    if (checkElement.is(slideMenuSelector)) {
      e.preventDefault();
    }
  });

  // To close the sub menu dropdown by clicking on inner content
  $(".hor-content").on("click", function () {
    $(".side-menu li").each(function () {
      $(".side-menu ul.open").slideUp(300);
      $(this).parent().removeClass("is-expanded");
      $(this).parent().parent().removeClass("open");
      $(this).parent().parent().prev().removeClass("is-expanded");
      $(this).parent().parent().parent().removeClass("is-expanded");
      $(this).parent().parent().parent().parent().removeClass("open");
      $(this).parent().parent().parent().parent().parent().removeClass("is-expanded");
    });
  });

  var position = window.location.pathname.split("/");
  $(".app-sidebar li a").each(function () {
    var $this = $(this);
    var pageUrl = $this.attr("href");

    if (pageUrl) {
      if (position[position.length - 1] == pageUrl) {
        $(this).addClass("active");
        $(this).parent().addClass("is-expanded");
        $(this).parent().parent().prev().addClass("active");
        $(this).parent().parent().addClass("open");
        $(this).parent().parent().prev().addClass("is-expanded");
        $(this).parent().parent().parent().addClass("is-expanded");
        $(this).parent().parent().parent().parent().addClass("open");
        $(this).parent().parent().parent().parent().prev().addClass("active");
        $(this).parent().parent().parent().parent().parent().addClass("is-expanded");
        return false;
      }
    }
  });
  if ($(".slide-item").hasClass("active")) {
    $(".app-sidebar").animate(
      {
        scrollTop: $("a.slide-item.active").offset().top - 600,
      },
      600
    );
  }
  if ($(".sub-slide-item").hasClass("active")) {
    $(".app-sidebar").animate(
      {
        scrollTop: $("a.sub-slide-item.active").offset().top - 600,
      },
      600
    );
  }

  var toggleSidebar = function () {
    var w = $(window);
    if (w.outerWidth() <= 1024) {
      $("body").addClass("sidebar-gone");
      $(document)
        .off("click", "body")
        .on("click", "body", function (e) {
          if ($(e.target).hasClass("sidebar-show") || $(e.target).hasClass("search-show")) {
            $("body").removeClass("sidebar-show");
            $("body").addClass("sidebar-gone");
            $("body").removeClass("search-show");
          }
        });
    } else {
      $("body").removeClass("sidebar-gone");
    }
  };
  toggleSidebar();
  $(window).resize(toggleSidebar);

  //sticky-header
  $(window).on("scroll", function (e) {
    if ($(window).scrollTop() >= 70) {
      $(".app-header").addClass("fixed-header");
      $(".app-header").addClass("visible-title");
    } else {
      $(".app-header").removeClass("fixed-header");
      $(".app-header").removeClass("visible-title");
    }
  });

  $(window).on("scroll", function (e) {
    if ($(window).scrollTop() >= 70) {
      $(".horizontal-main").addClass("fixed-header");
      $(".horizontal-main").addClass("visible-title");
    } else {
      $(".horizontal-main").removeClass("fixed-header");
      $(".horizontal-main").removeClass("visible-title");
    }
  });

  //p-scroll
  const ps1 = new PerfectScrollbar(".app-sidebar", {
    useBothWheelAxes: true,
    suppressScrollX: true,
  });
})();
document.addEventListener("DOMContentLoaded", function () {
  ActiveSubmenu();
});
function responsive() {
  if (window.innerWidth >= 992) {
    let html = document.querySelector("html");
    if (
      document.querySelector("body").classList.contains("sidenav-toggled") &&
      html.getAttribute("data-layout") === "horizontal"
    ) {
      document.querySelector("body").classList.remove("sidenav-toggled");
    }
  }

  const mediaQuery = window.innerWidth;
  currentWidth.push(mediaQuery);
  if (currentWidth.length > 2) {
    currentWidth.shift();
  }
  if (currentWidth.length > 1) {
    if (
      currentWidth[currentWidth.length - 1] < 992 &&
      currentWidth[currentWidth.length - 2] >= 992
    ) {
      // less than 992
    }

    if (
      currentWidth[currentWidth.length - 1] >= 992 &&
      currentWidth[currentWidth.length - 2] < 992
    ) {
      // greater than 992

      if (document.querySelector("html").getAttribute("data-vertical-style") === "doublemenu") {
        document.body.classList.remove("sidenav-toggled");
      }
    }
  }
}

function hoverLayoutFn() {
  hovermenu();
  document.body.classList.add("sidenav-toggled");
  document.body.classList.remove("sidenav-toggled-open");
}
function textLayoutFn() {
  icontext();
  document.body.classList.add("sidenav-toggled");
}
function doubleLayoutFn() {
  doublemenu();
  ActiveSubmenu();
  if (document.querySelector(".slide-menu") && innerWidth >= 992) {
    let sidemenuActive = document.querySelector(".side-menu__item.is-expanded");
    if (sidemenuActive?.nextElementSibling) {
      document.body.classList.remove("sidenav-toggled");
    }
  }
}

// ______________HOVER JS start
function hovermenu() {
  $(".app-sidebar").hover(
    function () {
      if ($("body").hasClass("sidenav-toggled")) {
        $("body").addClass("sidenav-toggled-open");
      }
    },
    function () {
      if ($("body").hasClass("sidenav-toggled")) {
        $("body").removeClass("sidenav-toggled-open");
      }
    }
  );
}
// ______________HOVER JS end

// ______________ICON-TEXT JS start
function icontext() {
  $(".app-sidebar").off("mouseenter mouseleave");

  $(document).on("click", ".app-sidebar", function (event) {
    if ($("body").hasClass("sidenav-toggled") == true) {
      $("body").addClass("sidenav-toggled-open");
    }
  });

  $(document).on("click", ".app-content", function (event) {
    $("body").removeClass("sidenav-toggled-open");
  });

  //Mobile menu
  var alterClass = function () {
    var ww = document.body.clientWidth;
    if (ww < 992) {
      $("body").removeClass("sidenav-toggled");
    }
  };
  $(window).resize(function () {
    alterClass();
  });
  //Fire it when the page first loads:
  alterClass();
}
// ______________ICON-TEXT JS end

// ______________DOUBLE-MENU JS start
function doublemenu() {
  if (innerWidth >= 992) {
    $(".app-sidebar").off("mouseenter mouseleave");
    $("[data-bs-toggle='slide']").on("click", function (e) {
      var $this = $(this);
      var checkElement = $this.next();
      if (!checkElement.hasClass("double-menu-active")) {
        if (document.querySelector(".slide-menu")) {
          let slidemenu = document.querySelectorAll(".slide-menu");
          slidemenu.forEach((e) => {
            if (e.classList.contains("double-menu-active")) {
              e.classList.remove("double-menu-active");
            }
          });
        }

        checkElement.addClass("double-menu-active");
        document.body.classList.remove("sidenav-toggled");
      }
    });
  }
}
// ______________DOUBLE-MENU JS end

//________________Horizontal js
jQuery(
  (function () {
    "use strict";
    document.addEventListener("touchstart", function () {}, false);
    jQuery(function () {
      jQuery("body").wrapInner('<div class="horizontalMenucontainer" />');
    });

    checkHoriMenu();
  })()
);

// for Icon-text Menu
//icontext();

// default layout
hovermenu();

let slideLeft = document.querySelector(".slide-left");
let slideRight = document.querySelector(".slide-right");
slideLeft.addEventListener(
  "click",
  () => {
    slideClick();
  },
  true
);
slideRight.addEventListener(
  "click",
  () => {
    slideClick();
  },
  true
);

// used to remove is-expanded class and remove class on clicking arrow buttons
function slideClick() {
  let slide = document.querySelectorAll(".slide");
  let slideMenu = document.querySelectorAll(".slide-menu");
  slide.forEach((element, index) => {
    if (element.classList.contains("is-expanded") == true) {
      element.classList.remove("is-expanded");
    }
  });
  slideMenu.forEach((element, index) => {
    if (element.classList.contains("open") == true) {
      element.classList.remove("open");
      element.style.display = "none";
    }
  });
}
// horizontal arrows
var sideMenu = $(".side-menu");
var slide = "100px";

let menuWidth = document.querySelector(".horizontal-main");
let menuItems = document.querySelector(".side-menu");

$(window).resize(() => {
  let menuWidth = document.querySelector(".horizontal-main");
  let menuItems = document.querySelector(".side-menu");
  let mainSidemenuWidth = document.querySelector(".main-sidemenu");
  let menuContainerWidth = menuWidth?.offsetWidth - mainSidemenuWidth?.offsetWidth;
  let marginLeftValue = Math.ceil(window.getComputedStyle(menuItems).marginLeft.split("px")[0]);
  let marginRightValue = Math.ceil(window.getComputedStyle(menuItems).marginRight.split("px")[0]);
  let check = menuItems.scrollWidth + (0 - menuWidth?.offsetWidth) + menuContainerWidth;
  // to check and adjst the menu on screen size change
  if (!(document.querySelector("html").getAttribute("dir") === "rtl")) {
    if (
      marginLeftValue > -check == false &&
      menuWidth?.offsetWidth - menuContainerWidth < menuItems.scrollWidth
    ) {
      sideMenu.stop(false, true).animate(
        {
          marginLeft: -check,
        },
        {
          duration: 400,
        }
      );
    } else {
      sideMenu.stop(false, true).animate(
        {
          marginLeft: 0,
        },
        {
          duration: 400,
        }
      );
    }
  } else {
    if (marginRightValue > -check == false && menuWidth?.offsetWidth < menuItems.scrollWidth) {
      sideMenu.stop(false, true).animate(
        {
          marginRight: -check,
        },
        {
          duration: 400,
        }
      );
    } else {
      sideMenu.stop(false, true).animate(
        {
          marginRight: 0,
        },
        {
          duration: 400,
        }
      );
    }
  }
  checkHoriMenu();
  responsive();

  if (window.innerWidth >= 992) {
    if (document.querySelector("body").classList.contains("horizontal-hover")) {
      let li = document.querySelectorAll(".side-menu li");
      li.forEach((e, i) => {
        e.classList.remove("is-expanded");
      });
      var animationSpeed = 300;
      // first level
      var parent = $("[data-bs-toggle='sub-slide']").parents("ul");
      var ul = parent.find("ul:visible").slideUp(animationSpeed);
      ul.removeClass("open");
      var parent1 = $("[data-bs-toggle='sub-slide2']").parents("ul");
      var ul1 = parent1.find("ul:visible").slideUp(animationSpeed);
      ul1.removeClass("open");
    }
  } else {
    ActiveSubmenu();
  }
});
function ActiveSubmenu() {
  let position = window.location.pathname;
  position = position.substring(position.lastIndexOf("/") + 1);
  position = position == "" ? "/login" : position;

  $(".app-sidebar li a").each(function () {
    var $this = $(this);
    var pageUrl = $this.attr("href");
    if (pageUrl) {
      if (position == pageUrl) {
        $(this).addClass("active");
        $(this).parent().addClass("is-expanded");
        $(this).parent().parent().prev().addClass("active");
        $(this).parent().parent().addClass("open");
        $(this).parent().parent().prev().addClass("is-expanded");
        $(this).parent().parent().parent().addClass("is-expanded");
        $(this).parent().parent().parent().parent().addClass("open");
        $(this).parent().parent().parent().parent().prev().addClass("active");
        $(this).parent().parent().parent().parent().parent().addClass("is-expanded");
        if (document.querySelector("html").getAttribute("data-vertical-style") === "doublemenu") {
          if (document.querySelector(".slide-menu")) {
            let sidemenuActive = document.querySelector(".slide.is-expanded");
            if (sidemenuActive?.children.length >= 2) {
              let submenu = sidemenuActive.children;
              submenu[1].classList.add("double-menu-active");
            } else {
              document.body.classList.add("sidenav-toggled");
            }
          }
        }
        return false;
      }
    }
  });
  if (
    document.querySelector("html").getAttribute("data-layout") === "horizontal" &&
    window.innerWidth >= 992
  ) {
    slideClick();
  }
}
function checkHoriMenu() {
  let html = document.querySelector("html");
  let menuWidth = document.querySelector(".horizontal-main");
  let menuItems = document.querySelector(".side-menu");
  let mainSidemenuWidth = document.querySelector(".main-sidemenu");
  let menuContainerWidth = menuWidth?.offsetWidth - mainSidemenuWidth?.offsetWidth;
  let marginLeftValue = Math.ceil(window.getComputedStyle(menuItems).marginLeft.split("px")[0]);
  let marginRightValue = Math.ceil(window.getComputedStyle(menuItems).marginRight.split("px")[0]);
  let check = menuItems.scrollWidth + (0 - menuWidth?.offsetWidth) + menuContainerWidth;

  if (!(html.getAttribute("dir") === "rtl")) {
    menuItems.style.marginRight = 0;
  } else {
    menuItems.style.marginLeft = 0;
  }

  if (menuItems.scrollWidth < menuWidth?.offsetWidth - menuContainerWidth) {
    document.querySelector(".slide-left")?.classList.add("d-none");
    document.querySelector(".slide-right")?.classList.add("d-none");
  } else if (marginLeftValue != 0 || marginRightValue != 0) {
    document.querySelector(".slide-right")?.classList.remove("d-none");
  } else if (marginLeftValue != -check || marginRightValue != -check) {
    document.querySelector(".slide-left")?.classList.remove("d-none");
  }
  if (menuItems.scrollWidth > menuWidth?.offsetWidth - menuContainerWidth) {
    document.querySelector(".slide-left")?.classList.remove("d-none");
    document.querySelector(".slide-right")?.classList.remove("d-none");
  }
  if (marginLeftValue == 0 || marginRightValue == 0) {
    document.querySelector(".slide-left")?.classList.add("d-none");
  }
  if (marginLeftValue !== 0 || marginRightValue !== 0) {
    document.querySelector(".slide-left")?.classList.remove("d-none");
  }
}
$(document).on("click", "#slide-left", function () {
  let html = document.querySelector("html");
  let menuWidth = document.querySelector(".horizontal-main");
  let menuItems = document.querySelector(".side-menu");
  let mainSidemenuWidth = document.querySelector(".main-sidemenu");
  let menuContainerWidth = menuWidth?.offsetWidth - mainSidemenuWidth?.offsetWidth;
  let marginLeftValue =
    Math.ceil(window.getComputedStyle(menuItems).marginLeft.split("px")[0]) + 100;
  let marginRightValue =
    Math.ceil(window.getComputedStyle(menuItems).marginRight.split("px")[0]) + 100;

  if (!(html.getAttribute("dir") === "rtl")) {
    if (marginLeftValue < 0) {
      sideMenu.stop(false, true).animate(
        {
          // marginRight : 0,
          marginLeft: "+=" + slide,
        },
        {
          duration: 400,
        }
      );
      if (menuWidth?.offsetWidth - menuContainerWidth < menuItems.scrollWidth) {
        $("#slide-right").removeClass("d-none");
      }
    } else {
      $("#slide-left").addClass("d-none");
    }

    if (marginLeftValue >= 0) {
      sideMenu.stop(false, true).animate(
        {
          // marginRight : 0,
          marginLeft: 0,
        },
        {
          duration: 400,
        }
      );

      if (menuWidth?.offsetWidth < menuItems.scrollWidth) {
        // $("#slide-left").addClass("d-none");
      }
    }
    // to remove dropdown when clicking arrows in horizontal menu
    let subNavSub = document.querySelectorAll(".sub-nav-sub");
    subNavSub.forEach((e) => {
      e.style.display = "";
    });
    let subNav = document.querySelectorAll(".nav-sub");
    subNav.forEach((e) => {
      e.style.display = "";
    });
    //
  } else {
    if (marginRightValue < 0) {
      sideMenu.stop(false, true).animate(
        {
          // marginRight : 0,
          marginLeft: 0,
          marginRight: "+=" + slide,
        },
        {
          duration: 400,
        }
      );
      if (menuWidth?.offsetWidth - menuContainerWidth < menuItems.scrollWidth) {
        $("#slide-right").removeClass("d-none");
      }
    } else {
      $("#slide-left").addClass("d-none");
    }

    if (marginRightValue >= 0) {
      $("#slide-left").addClass("d-none");
      sideMenu.stop(false, true).animate(
        {
          // marginRight : 0,
          marginLeft: 0,
        },
        {
          duration: 400,
        }
      );
    }
    // to remove dropdown when clicking arrows in horizontal menu
    let subNavSub = document.querySelectorAll(".sub-nav-sub");
    subNavSub.forEach((e) => {
      e.style.display = "";
    });
    let subNav = document.querySelectorAll(".nav-sub");
    subNav.forEach((e) => {
      e.style.display = "";
    });
    //
  }
});
$(document).on("click", "#slide-right", function () {
  let html = document.querySelector("html");
  let menuWidth = document.querySelector(".app-sidebar");
  let menuItems = document.querySelector(".side-menu");
  let mainSidemenuWidth = document.querySelector(".main-sidemenu");
  let menuContainerWidth = menuWidth?.offsetWidth - mainSidemenuWidth?.offsetWidth;
  let marginLeftValue =
    Math.ceil(window.getComputedStyle(menuItems).marginLeft.split("px")[0]) - 100;
  let marginRightValue =
    Math.ceil(window.getComputedStyle(menuItems).marginRight.split("px")[0]) - 100;
  let check = menuItems.scrollWidth + (0 - menuWidth?.offsetWidth) + menuContainerWidth;

  if (!(html.getAttribute("dir") === "rtl")) {
    if (marginLeftValue > -check) {
      sideMenu.stop(false, true).animate(
        {
          // marginLeft : 0,
          marginLeft: "-=" + slide,
          marginRight: 0,
        },
        {
          duration: 400,
        }
      );
    } else {
      sideMenu.stop(false, true).animate(
        {
          // marginLeft : 0,
          marginRight: 0,
          marginLeft: -check,
        },
        {
          duration: 400,
        }
      );

      $("#slide-right").addClass("d-none");
    }

    if (marginLeftValue != 0) {
      $("#slide-left").removeClass("d-none");
    }
    // to remove dropdown when clicking arrows in horizontal menu
    let subNavSub = document.querySelectorAll(".sub-nav-sub");
    subNavSub.forEach((e) => {
      e.style.display = "";
    });
    let subNav = document.querySelectorAll(".nav-sub");
    subNav.forEach((e) => {
      e.style.display = "";
    });
  } else {
    //
    if (marginRightValue > -check) {
      sideMenu.stop(false, true).animate(
        {
          // marginLeft : 0,
          marginLeft: 0,
          marginRight: "-=" + slide,
        },
        {
          duration: 400,
        }
      );
    } else {
      sideMenu.stop(false, true).animate(
        {
          // marginLeft : 0,
          marginLeft: 0,
          marginRight: -check,
        },
        {
          duration: 400,
        }
      );
      $("#slide-right").addClass("d-none");
    }

    if (marginRightValue != 0) {
      $("#slide-left").removeClass("d-none");
    }
    // to remove dropdown when clicking arrows in horizontal menu
    let subNavSub = document.querySelectorAll(".sub-nav-sub");
    subNavSub.forEach((e) => {
      e.style.display = "";
    });
    let subNav = document.querySelectorAll(".nav-sub");
    subNav.forEach((e) => {
      e.style.display = "";
    });
  }
});
