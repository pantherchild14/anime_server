"use strict";
(function () {
  // ______________LOADER
  $("#global-loader").fadeOut("slow");

  // ______________Full screen
  $(document).on("click", ".fullscreen-button", function toggleFullScreen() {
    if (
      (document.fullScreenElement !== undefined && document.fullScreenElement === null) ||
      (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) ||
      (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
      (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)
    ) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      $("html").removeClass("fullscreen-button");
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  });

  // ______________Cover Image
  $(".cover-image").each(function () {
    var attr = $(this).attr("data-image-src");
    if (typeof attr !== typeof undefined && attr !== false) {
      $(this).css("background", "url(" + attr + ") center center");
    }
  });

  // ______________Toast
  var toastElList = [].slice.call(document.querySelectorAll(".toast"));
  var toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl);
  });

  // ______________ BACK TO TOP BUTTON
  $(window).on("scroll", function (e) {
    if ($(this).scrollTop() > 130) {
      $("#back-to-top").removeClass("animate-reverse");
      $("#back-to-top").addClass("animate");
      $("#back-to-top").fadeIn("slow");
    } else {
      $("#back-to-top").removeClass("animate");
      $("#back-to-top").addClass("animate-reverse");
      $("#back-to-top").fadeOut("slow");
    }
  });

  // ______________ PROGRESS BAR ON SCROLL
  window.addEventListener("scroll", () => {
    var widnowScroll = document.body.scrollTop || document.documentElement.scrollTop,
      height = document.documentElement.scrollHeight - document.documentElement.clientHeight,
      scrollAmount = (widnowScroll / height) * 100;
    document.querySelector(".progress-top-bar").style.width = scrollAmount + "%";
  });

  /* Headerfixed */
  $(window).on("scroll", function (e) {
    if ($(window).scrollTop() >= 66) {
      $("main-header").addClass("fixed-header");
    } else {
      $(".main-header").removeClass("fixed-header");
    }
  });

  // ______________Search
  $('body, .main-header form[role="search"] button[type="reset"]').on(
    "click keyup",
    function (event) {
      if (
        (event.which == 27 && $('.main-header form[role="search"]').hasClass("active")) ||
        $(event.currentTarget).attr("type") == "reset"
      ) {
        closeSearch();
      }
    }
  );
  function closeSearch() {
    var $form = $(' form[role="search"].active');
    $form.find("input").val("");
    $form.removeClass("active");
    $("body").removeClass("search-open");
  }
  // Show Search if form is not active // event.preventDefault() is important, this prevents the form from submitting
  $(document).on(
    "click",
    ' form[role="search"]:not(.active) button[type="submit"]',
    function (event) {
      event.preventDefault();
      var $form = $(this).closest("form"),
        $input = $form.find("input");
      $form.addClass("active");
      $input.focus();
      $("body").addClass("search-open");
    }
  );
  // if your form is ajax remember to call `closeSearch()` to close the search container
  $(document).on("click", ' form[role="search"].active button[type="submit"]', function (event) {
    event.preventDefault();
    var $form = $(this).closest("form"),
      $input = $form.find("input");
    $("#showSearchTerm").text($input.val());
    closeSearch();
    $("body").addClass("search-open");
  });

  // if your form is ajax remember to call `closeSearch()` to close the search container
  $(document).on("click", ' form[role="search"].active button[type="reset"]', function (event) {
    event.preventDefault();
    $("body").removeClass("search-open");
    var $form = $(this).closest("form"),
      $input = $form.find("input");
    $("#showSearchTerm").text($input.val());
    closeSearch();
  });

  //  item notes
  $(".thumb").click(function () {
    if (!$(this).hasClass("active")) {
      $(".thumb.active").removeClass("active");
      $(this).addClass("active");
    }
  });
  $(".thumb1").click(function () {
    if (!$(this).hasClass("active")) {
      $(".thumb1.active").removeClass("active");
      $(this).addClass("active");
    }
  });
  $(".thumb2").click(function () {
    if (!$(this).hasClass("active")) {
      $(".thumb2.active").removeClass("active");
      $(this).addClass("active");
    }
  });

  // ______________ Function for remove card in Whislist
  const DIV_CARD1 = ".Wishlist-card";

  $(document).on("click", '[data-bs-toggle="card-remove"]', function (e) {
    console.log("ok");
    let $card2 = $(this).closest(DIV_CARD1);
    $card2.remove();
    e.preventDefault();
    return false;
  });
  // ______________ Function for card
  const DIV_CARD = "div.card";

  // ______________ Function for remove card
  $(document).on("click", '[data-bs-toggle="card-remove"]', function (e) {
    let $card = $(this).closest(DIV_CARD);
    $card.remove();
    e.preventDefault();
    return false;
  });
  // ______________ Functions for collapsed card
  $(document).on("click", '[data-bs-toggle="card-collapse"]', function (e) {
    let $card = $(this).closest(DIV_CARD);
    $card.toggleClass("card-collapsed");
    e.preventDefault();
    return false;
  });
  // ______________ Card full screen
  $(document).on("click", '[data-bs-toggle="card-fullscreen"]', function (e) {
    let $card = $(this).closest(DIV_CARD);
    $card.toggleClass("card-fullscreen").removeClass("card-collapsed");
    e.preventDefault();
    return false;
  });
  // open multiple links on click
  $("a#openAllBtn").click(function (e) {
    window.open("calendar.html");
    window.open("contacts.html");
    window.open("file-manager.html");
    window.open("mail-inbox.html");
    window.open("gallery.html");
    window.open("blog.html");
    window.open("shop.html");
    window.open("form-elements.html");
    e.preventDefault();
    return false;
  });
  /* ----------------------------------- */

  // this will hide dropdown menu from open in mobile
  $(".dropdown-menu .main-header-arrow").on("click", function (e) {
    e.preventDefault();
    $(this).closest(".dropdown").removeClass("show");
  });

  // navbar backdrop for mobile only
  $("body").append('<div class="main-navbar-backdrop"></div>');
  $(".main-navbar-backdrop").on("click touchstart", function () {
    $("body").removeClass("main-navbar-show");
  });

  // Close dropdown menu of header menu
  $(document).on("click touchstart", function (e) {
    e.stopPropagation();
    // closing of dropdown menu in header when clicking outside of it
    var dropTarg = $(e.target).closest(".main-header .dropdown").length;
    if (!dropTarg) {
      $(".main-header .dropdown").removeClass("show");
    }
    // closing nav sub menu of header when clicking outside of it
    if (window.matchMedia("(min-width: 992px)").matches) {
      // Navbar
      var navTarg = $(e.target).closest(".main-navbar .nav-item").length;
      if (!navTarg) {
        $(".main-navbar .show").removeClass("show");
      }
      // Header Menu
      var menuTarg = $(e.target).closest(".main-header-menu .nav-item").length;
      if (!menuTarg) {
        $(".main-header-menu .show").removeClass("show");
      }
      if ($(e.target).hasClass("main-menu-sub-mega")) {
        $(".main-header-menu .show").removeClass("show");
      }
    } else {
      //
      if (!$(e.target).closest("#mainMenuShow").length) {
        var hm = $(e.target).closest(".main-header-menu").length;
        if (!hm) {
          $("body").removeClass("main-header-menu-show");
        }
      }
    }
  });
  $("#mainMenuShow").on("click", function (e) {
    e.preventDefault();
    $("body").toggleClass("main-header-menu-show");
  });
  $(".main-header-menu .with-sub").on("click", function (e) {
    e.preventDefault();
    $(this).parent().toggleClass("show");
    $(this).parent().siblings().removeClass("show");
  });
  $(".main-header-menu-header .close").on("click", function (e) {
    e.preventDefault();
    $("body").removeClass("main-header-menu-show");
  });

  $(".card-header-right .card-option .fe fe-chevron-left").on("click", function () {
    var a = $(this);
    if (a.hasClass("icofont-simple-right")) {
      a.parents(".card-option").animate({
        width: "35px",
      });
    } else {
      a.parents(".card-option").animate({
        width: "180px",
      });
    }
    $(this).toggleClass("fe fe-chevron-right").fadeIn("slow");
  });

  // ___________TOOLTIP
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // __________POPOVER
  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // ______________ SWITCHER-toggle ______________//
  $(".layout-setting").on("click", function (e) {
    let html = document.querySelector("html");
    if (html.getAttribute("data-theme-color") === "dark") {
      html.setAttribute("data-theme-color", "light");
      html.setAttribute("data-header-color", "light");
      html.setAttribute("data-menu-color", "light");
      $("#switchbtn-lightmenu").prop("checked", true);
      $("#switchbtn-lightheader").prop("checked", true);
      checkOptions();
      localStorage.removeItem("zembgColor");
      localStorage.removeItem("zembgwhite");
      localStorage.removeItem("zemheaderbg");
      localStorage.removeItem("zemmenubg");
      let mainHeader = document.querySelector(".main-header");
      mainHeader.style = "";
      let appSidebar = document.querySelector(".app-sidebar");
      appSidebar.style = "";
      document.querySelector("html").style = "";
      document.querySelector("#switchbtn-light-theme").checked = true;
      document.querySelector("#switchbtn-dark").checked = false;
      names();
    } else {
      html.setAttribute("data-theme-color", "dark");
      html.setAttribute("data-header-color", "dark");
      html.setAttribute("data-menu-color", "dark");
      $("#switchbtn-darkmenu").prop("checked", true);
      $("#switchbtn-darkheader").prop("checked", true);
      checkOptions();
      localStorage.removeItem("zembgColor");
      localStorage.removeItem("zembgwhite");
      localStorage.removeItem("zemheaderbg");
      localStorage.removeItem("zemmenubg");
      let mainHeader = document.querySelector(".main-header");
      mainHeader.style = "";
      let appSidebar = document.querySelector(".app-sidebar");
      appSidebar.style = "";
      document.querySelector("html").style = "";
      document.querySelector("#switchbtn-light-theme").checked = false;
      document.querySelector("#switchbtn-dark").checked = true;
      names();
    }
  });
})();

document.cookie = "SameSite";
