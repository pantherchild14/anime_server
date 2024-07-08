"use strict";
let mainContent;
(function () {
    let html = document.querySelector('html');
    mainContent = document.querySelector('.main-content');

    // theme color picker
    const dynamicPrimaryLight = document.querySelectorAll('input.color-primary-light');
    dynamicPrimaryColor(dynamicPrimaryLight);
    
    localStorageBackup();
    
    // theme dynamic background
    const dynamicBackgroundColor = document.querySelectorAll('input.color-background');
    dynamicBackground(dynamicBackgroundColor);


    /*RTL Start*/
    if (html.getAttribute('dir') === "rtl") {
        rtlFn();
    }
    /*RTL End*/

    /*Horizontal Start*/
    if (html.getAttribute('data-hor-style') === "hor-click") {
        horizontalClickFn();
    }
    /*Horizontal End*/

    /*Horizontal-Hover Start*/
    if (html.getAttribute('data-hor-style') === "hor-hover") {
        horizontalHoverFn();
    }
    /*Horizontal-Hover End*/

    switcherClick();
    checkOptions();

    //LTR to RTL 
    // html.setAttribute("dir" , "rtl") // for rtl version 

})();

function switcherClick() {
    let ltrBtn, rtlBtn, verticalBtn, horiBtn, horiHoverBtn,switchbtnDefault,switchbtnLight,switchbtnDark,switchbtnGlassy,menubgimg1,menubgimg2,menubgimg3,menubgimg4, boxedBtn, fullwidthBtn, scrollableBtn, fixedBtn, defaultBtn, closedBtn, iconTextBtn, hoversubBtn, hoversub1Btn, overlayBtn, doubleBtn, defaultlogoBtn, centerlogoBtn, resetBtn;
    let html = document.querySelector('html');
    ltrBtn = document.querySelector('#switchbtn-ltr');
    rtlBtn = document.querySelector('#switchbtn-rtl');
    verticalBtn = document.querySelector('#switchbtn-vertical');
    horiBtn = document.querySelector('#switchbtn-horizontal');
    horiHoverBtn = document.querySelector('#switchbtn-horizontalHover');
    switchbtnDefault = document.querySelector('#switchbtn-default');
    switchbtnLight = document.querySelector('#switchbtn-light-theme');
    switchbtnDark = document.querySelector('#switchbtn-dark');
    switchbtnGlassy = document.querySelector('#switchbtn-glassy-theme');
    menubgimg1 = document.querySelector("#menubg-img1");
    menubgimg2 = document.querySelector("#menubg-img2");
    menubgimg3 = document.querySelector("#menubg-img3");
    menubgimg4 = document.querySelector("#menubg-img4");
    boxedBtn = document.querySelector('#switchbtn-boxed');
    fullwidthBtn = document.querySelector('#switchbtn-fullwidth');
    scrollableBtn = document.querySelector('#switchbtn-scrollable');
    fixedBtn = document.querySelector('#switchbtn-fixed');
    defaultBtn = document.querySelector('#switchbtn-defaultmenu');
    closedBtn = document.querySelector('#switchbtn-closed');
    iconTextBtn = document.querySelector('#switchbtn-text');
    hoversubBtn = document.querySelector('#switchbtn-hoversub');
    hoversub1Btn = document.querySelector('#switchbtn-hoversub1');
    overlayBtn = document.querySelector('#switchbtn-overlay');
    doubleBtn = document.querySelector('#switchbtn-doublemenu');
    defaultlogoBtn = document.querySelector('#switchbtn-defaultlogo');
    centerlogoBtn = document.querySelector('#switchbtn-centerlogo');
    resetBtn = document.querySelector('#resetbtn');


    /* Default Theme */
    let defaultheme = switchbtnDefault.addEventListener('click', () => {
        html.setAttribute('data-theme-color',"default");
        localStorage.setItem("zemthemecolors", 'default');
        names();
        checkOptions();
    });
    /* Default Theme */

    /* Light Theme */
    let lighttheme = switchbtnLight.addEventListener('click', () => {
        html.setAttribute('data-theme-color',"light");
        localStorage.setItem("zemthemecolors", 'light');
        localStorage.removeItem('zemBackground');
        localStorage.removeItem('zemBackground');
        document.querySelector('html').style.removeProperty('--background-rgb', localStorage.zemBackground);
        names();
        checkOptions();
    })
    /* Light Theme */

    /* Dark Theme */
    let darktheme = switchbtnDark.addEventListener('click', () => {
        html.setAttribute('data-theme-color',"dark");
        localStorage.setItem("zemthemecolors", 'dark');
        localStorage.removeItem('zemBackground');
        document.querySelector('html').style.removeProperty('--background-rgb', localStorage.zemBackground);
        names();
        checkOptions();
    })
    /* Dark Theme */

    /* Glassy Theme */
    let glassytheme = switchbtnGlassy.addEventListener('click', () => {
        html.setAttribute('data-theme-color',"glassy"); 
        localStorage.setItem("zemthemecolors", 'glassy');
        localStorage.removeItem('zemBackground');
        document.querySelector('html').style.removeProperty('--background-rgb', localStorage.zemBackground);
        names();
        checkOptions();
    })
    /* Glassy Theme */

    /* Menu Background Images */
    let menuimg1 = menubgimg1.addEventListener('click', () => {
        html.setAttribute('data-menuimg', "bg-img1");
        localStorage.setItem("zemmenubgimg", 'bg-img1');
        checkOptions();
    })
    let menuimg2 = menubgimg2.addEventListener('click', () => {
        html.setAttribute('data-menuimg', "bg-img2");
        localStorage.setItem("zemmenubgimg", 'bg-img2');
        checkOptions();
    })
    let menuimg3 = menubgimg3.addEventListener('click', () => {
        html.setAttribute('data-menuimg', "bg-img3");
        localStorage.setItem("zemmenubgimg", 'bg-img3');
        checkOptions();
    })
    let menuimg4 = menubgimg4.addEventListener('click', () => {
        html.setAttribute('data-menuimg', "bg-img4");
        localStorage.setItem("zemmenubgimg", 'bg-img4');
        checkOptions();
    })
    /* Menu Background Images */

    /*Full Width Layout Start*/
    let fullwidthVar = fullwidthBtn.addEventListener('click', () => {
        html.setAttribute('data-width', 'fullwidth');
        if (html.getAttribute('data-layout') === "horizontal") {
            checkHoriMenu();
        }
        localStorage.setItem("zemfullwidth", true);
        localStorage.removeItem("zemboxed");
    });
    /*Full Width Layout End*/

    /*Boxed Layout Start*/
    let boxedVar = boxedBtn.addEventListener('click', () => {
        html.setAttribute('data-width', 'boxed');
        if (html.getAttribute('data-layout') === "horizontal") {
            checkHoriMenu();
        }
        localStorage.setItem("zemboxed", true);
        localStorage.removeItem("zemfullwidth");
    });
    /*Boxed Layout End*/

    /*Header-Position Styles Start*/
    let fixedVar = fixedBtn.addEventListener('click', () => {
        html.setAttribute('data-position', 'fixed');
        localStorage.setItem("zemfixed", true);
        localStorage.removeItem("zemscrollable");
    });

    let scrollableVar = scrollableBtn.addEventListener('click', () => {
        html.setAttribute('data-position', 'scrollable');
        localStorage.setItem("zemscrollable", true);
        localStorage.removeItem("zemfixed");
    });
    /*Header-Position Styles End*/

    /*Default Sidemenu Start*/
    let defaultVar = defaultBtn.addEventListener('click', () => {
        html.setAttribute('data-vertical-style', 'default');
        localStorage.removeItem("zemverticalstyles");

        hovermenu();
    });
    /*Default Sidemenu End*/

    /*Closed Sidemenu Start*/
    let closedVar = closedBtn.addEventListener('click', () => {
        html.setAttribute('data-vertical-style', 'closed');
        localStorage.setItem("zemverticalstyles", 'closed');
        hoverLayoutFn();
    });
    /*Closed Sidemenu End*/

    /*Hover Submenu Start*/
    let hoverSubVar = hoversubBtn.addEventListener('click', () => {
        html.setAttribute('data-vertical-style', 'hover');
        localStorage.setItem("zemverticalstyles", 'hover');

        hoverLayoutFn();
    });
    /*Hover Submenu End*/

    /*Hover Submenu 1 Start*/
    let hoverSub1Var = hoversub1Btn.addEventListener('click', () => {
        html.setAttribute('data-vertical-style', 'hover1');
        localStorage.setItem("zemverticalstyles", 'hover1');

        hoverLayoutFn();
    });
    /*Hover Submenu 1 End*/

    /*Icon Text Sidemenu Start*/
    let iconTextVar = iconTextBtn.addEventListener('click', () => {
        html.setAttribute('data-vertical-style', 'icontext');
        localStorage.setItem("zemverticalstyles", 'icontext');

        textLayoutFn();
    });
    /*Icon Text Sidemenu End*/

    /*Icon Overlay Sidemenu Start*/
    let overlayVar = overlayBtn.addEventListener('click', () => {
        html.setAttribute('data-vertical-style', 'overlay');
        localStorage.setItem("zemverticalstyles", 'overlay');

        hoverLayoutFn();
    });
    /*Icon Overlay Sidemenu End*/

    /*Icon Overlay Sidemenu Start*/
    let doubleVar = doubleBtn.addEventListener('click', () => {
        html.setAttribute('data-vertical-style', 'doublemenu');
        localStorage.setItem("zemverticalstyles", 'doublemenu');

        doubleLayoutFn();
    });
    /*Icon Overlay Sidemenu End*/

    /* Sidemenu start*/
    let verticalVar = verticalBtn.addEventListener('click', () => {
        // local storage
        localStorage.removeItem("zemlayout");
        localStorage.setItem("zemverticalstyles", 'default');

        verticalFn();
    });
    /* Sidemenu end*/

    /* horizontal click start*/
    let horiVar = horiBtn.addEventListener('click', () => {

        //    local storage 
        localStorage.setItem("zemlayout", 'horizontal');
        localStorage.removeItem("zemverticalstyles");

        horizontalClickFn();
    });
    /* horizontal click end*/

    /* horizontal hover start*/
    let horiHoverVar = horiHoverBtn.addEventListener('click', () => {

        //    local storage 
        localStorage.setItem("zemlayout", 'horizontalhover');
        localStorage.removeItem("zemverticalstyles");

        horizontalHoverFn();
    });
    /* horizontal hover end*/
    /* rtl start*/
    let rtlVar = rtlBtn.addEventListener('click', () => {
        localStorage.setItem("zemrtl", true);
        localStorage.removeItem("zemltr");

        rtlFn();
    });
    /* rtl end*/
    /* ltr start*/
    let ltrVar = ltrBtn.addEventListener('click', () => {
        //    local storage 
        localStorage.setItem("zemltr", true);
        localStorage.removeItem("zemrtl");
        ltrFn();
    });
    /* ltr end*/


    /*Horizontal Logo Position Start*/
    let defaultlogoVar = defaultlogoBtn.addEventListener('click', () => {
        html.setAttribute('data-logo', 'defaultlogo');
        localStorage.setItem("zemdefaultlogo", true);
        localStorage.removeItem("zemcenterlogo");
    });

    let centerlogoVar = centerlogoBtn.addEventListener('click', () => {
        html.setAttribute('data-logo', 'centerlogo');
        localStorage.setItem("zemcenterlogo", true);
        localStorage.removeItem("zemdefaultlogo");
    });
    /*Horizontal Logo Position End*/
}

function ltrFn() {
    let html = document.querySelector('html');
    html.setAttribute("dir", "ltr");
    let select2Cont = document.querySelectorAll(".select2-container")
    select2Cont.forEach(e => e.setAttribute("dir", "ltr"))
    document.querySelector("#style")?.setAttribute("href", "../assets/plugins/bootstrap/css/bootstrap.min.css");
    var carousel = $('.owl-carousel');
    $.each(carousel, function (index, element) {
        // element == this
        var carouselData = $(element).data('owl.carousel');
        carouselData.settings.rtl = false; //don't know if both are necessary
        carouselData.options.rtl = false;
        $(element).trigger('refresh.owl.carousel');
    });
    if (html.getAttribute('data-layout') === "horizontal") {
        checkHoriMenu();
    }
    //
    checkOptions();
}

function rtlFn() {
    let html = document.querySelector('html');
    html.setAttribute("dir", "rtl");
    let select2Cont = document.querySelectorAll(".select2-container")
    select2Cont.forEach(e => e.setAttribute("dir", "rtl"))
    document.querySelector("#style")?.setAttribute("href", "../assets/plugins/bootstrap/css/bootstrap.rtl.min.css");
    var carousel = $('.owl-carousel');
    $.each(carousel, function (index, element) {
        // element == this
        var carouselData = $(element).data('owl.carousel');
        carouselData.settings.rtl = true; //don't know if both are necessary
        carouselData.options.rtl = true;
        $(element).trigger('refresh.owl.carousel');
    });
    if (html.getAttribute('data-layout') === "horizontal") {
        checkHoriMenu();
    }
    //
    checkOptions();
}

function verticalFn() {
    let html = document.querySelector('html');
    html.setAttribute('data-layout', 'vertical');
    html.setAttribute('data-vertical-style', 'default');
    html.removeAttribute('data-hor-style');
    document.body.classList.add('sidebar-mini');
    document.querySelector(".main-content").classList.add("app-content");
    document.querySelector(".main-header").classList.add("side-header");
    let mainContainer = document.querySelectorAll(".main-container")
    mainContainer.forEach(e => e.classList.add("container-fluid"))
    mainContainer.forEach(e => e.classList.remove("container"))
    document.querySelector(".main-content").classList.remove("horizontal-content");
    document.querySelector(".main-header").classList.remove("hor-header");
    document.querySelector(".app-sidebar").classList.remove("horizontal-main");
    document.querySelector(".main-sidemenu").classList.remove("container");
    document.querySelector('#slide-left').classList.remove('d-none');
    document.querySelector('#slide-right').classList.remove('d-none');
    if (html.getAttribute('data-layout') === "horizontal") {
        checkHoriMenu();
    }
    responsive();
    mainContent.removeEventListener('click', slideClick);
    //
    checkOptions();
    $('#switchbtn-vertical').prop('checked', true);
}

function horizontalClickFn() {
    $('#switchbtn-horizontal').prop('checked', true);
    let html = document.querySelector('html');
    ActiveSubmenu();
    html.setAttribute('data-layout', 'horizontal');
    html.setAttribute('data-hor-style', 'hor-click');
    html.removeAttribute('data-vertical-style');
    if (window.innerWidth >= 992) {
        let li = document.querySelectorAll('.side-menu li')
        li.forEach((e, i) => {
            e.classList.remove('is-expanded')
        })
        var animationSpeed = 300;
        // first level
        var parent = $("[data-bs-toggle='sub-slide']").parents('ul');
        var ul = parent.find('ul:visible').slideUp(animationSpeed);
        ul.removeClass('open');
        var parent1 = $("[data-bs-toggle='sub-slide2']").parents('ul');
        var ul1 = parent1.find('ul:visible').slideUp(animationSpeed);
        ul1.removeClass('open');
    }
    document.querySelector(".main-content").classList.add("horizontal-content");
    let mainContainer = document.querySelectorAll(".main-container")
    mainContainer.forEach(e => e.classList.add("container"))
    mainContainer.forEach(e => e.classList.remove("container-fluid"))
    document.querySelector(".main-header").classList.add("hor-header");
    document.querySelector(".app-sidebar").classList.add("horizontal-main");
    document.querySelector(".main-sidemenu").classList.add("container");

    document.querySelector(".main-content").classList.remove("app-content");
    document.querySelector(".main-header").classList.remove("side-header");
    document.body.classList.remove('sidebar-mini');
    document.body.classList.remove('sidenav-toggled');
    setTimeout(() => { checkHoriMenu(); }, 300)
    responsive();
    mainContent.addEventListener('click', slideClick);
    //
    checkOptions();
}

function horizontalHoverFn() {
    $('#switchbtn-horizontalHover').prop('checked', true);
    let html = document.querySelector('html');
    html.setAttribute('data-layout', 'horizontal');
    html.setAttribute('data-hor-style', 'hor-hover');
    html.removeAttribute('data-vertical-style');
    let li = document.querySelectorAll('.side-menu li')
    li.forEach((e, i) => {
        e.classList.remove('is-expanded')
    })
    var animationSpeed = 300;
    // first level
    var parent = $("[data-bs-toggle='sub-slide']").parents('ul');
    var ul = parent.find('ul:visible').slideUp(animationSpeed);
    ul.removeClass('open');
    var parent1 = $("[data-bs-toggle='sub-slide2']").parents('ul');
    var ul1 = parent1.find('ul:visible').slideUp(animationSpeed);
    ul1.removeClass('open');
    let subNavSub = document.querySelectorAll('.sub-slide-menu');
    subNavSub.forEach((e) => {
        e.style.display = '';
    })
    let subNav = document.querySelectorAll('.slide-menu')
    subNav.forEach((e) => {
        e.style.display = '';
    })
    document.querySelector(".main-content").classList.add("horizontal-content");
    document.querySelector(".main-content").classList.remove("app-content");
    let mainContainer = document.querySelectorAll(".main-container")
    mainContainer.forEach(e => e.classList.add("container"))
    mainContainer.forEach(e => e.classList.remove("container-fluid"))
    document.querySelector(".main-header").classList.add("hor-header");
    document.querySelector(".main-header").classList.remove("side-header");
    document.querySelector(".app-sidebar").classList.add("horizontal-main")
    document.querySelector(".main-sidemenu").classList.add("container")
    document.body.classList.remove('sidebar-mini');
    document.body.classList.remove('sidenav-toggled');
    setTimeout(() => { checkHoriMenu(); }, 300)
    responsive();
    mainContent.removeEventListener('click', slideClick);
    //
    checkOptions();
}   

function resetData() {
    let html = document.querySelector('html');
    $('#switchbtn-ltr').prop('checked', true);
    $('#switchbtn-fullwidth').prop('checked', true);
    $('#switchbtn-fixed').prop('checked', true);
    $('#switchbtn-defaultmenu').prop('checked', true);
    $('#switchbtn-defaultlogo').prop('checked', true);
    $('#switchbtn-default').prop('checked', true);
    html.setAttribute('data-width', 'fullwidth');
    names();
    html.setAttribute('data-theme-color',"default");
    html.setAttribute('data-position', 'fixed');
    html.setAttribute('data-logo', 'defaultlogo');
    html.setAttribute('data-layout', 'vertical');
    html.setAttribute('data-vertical-style', 'default');
    html.removeAttribute('data-menuimg');
    document.body.classList.remove('sidenav-toggled');
    verticalFn();
    ltrFn();
    localStorage.clear();
    let mainHeader = document.querySelector('.main-header');
    mainHeader.style = "";
    let appSidebar = document.querySelector('.app-sidebar');
    appSidebar.style = "";
    //
    checkOptions();
}

function checkOptions() {

    // horizontal
    if (localStorage.getItem('zemlayout') === "horizontal") {
        $('#switchbtn-horizontal').prop('checked', true);
    }

    // horizontal-hover
    if (localStorage.getItem('zemlayout') === 'horizontalhover') {
        $('#switchbtn-horizontalHover').prop('checked', true);
    }

    //RTL 
    if (localStorage.getItem('zemrtl')) {
        $('#switchbtn-rtl').prop('checked', true);
    }
    
    // themecolors 
    if (localStorage.zemthemecolors) {
        let themeColors = localStorage.getItem("zemthemecolors");
        switch (themeColors) {
            case 'default':
                $('#switchbtn-default').prop('checked', true);
                break;
            case 'light':
                $('#switchbtn-light-theme').prop('checked', true);
                $('#switchbtn-lightheader').prop('checked', true);
                $('#switchbtn-lightmenu').prop('checked', true);
                break;
            case 'dark':
                $('#switchbtn-dark').prop('checked', true);
                $('#switchbtn-darkmenu').prop('checked', true);
                $('#switchbtn-darkheader').prop('checked', true);
                break;
            case 'glassy':
                $('#switchbtn-glassy-theme').prop('checked', true);
                break;
        }
    }

    //noshadow 
    if (localStorage.zemverticalstyles) {
        let verticalStyles = localStorage.getItem('zemverticalstyles');
        switch (verticalStyles) {
            case 'default':
                $('#switchbtn-defaultmenu').prop('checked', true);
                break;
            case 'closed':
                $('#switchbtn-closed').prop('checked', true);
                break;
            case 'icontext':
                $('#switchbtn-text').prop('checked', true);
                break;
            case 'overlay':
                $('#switchbtn-overlay').prop('checked', true);
                break;
            case 'hover':
                $('#switchbtn-hoversub').prop('checked', true);
                break;
            case 'hover1':
                $('#switchbtn-hoversub1').prop('checked', true);
                break;
            case 'doublemenu':
                $('#switchbtn-doublemenu').prop('checked', true);
                break;
            default:
                $('#switchbtn-defaultmenu').prop('checked', true);
                break;
        }
    }

    //boxed 
    if (localStorage.getItem('zemboxed')) {
        $('#switchbtn-boxed').prop('checked', true);
    }

    //scrollable 
    if (localStorage.getItem('zemscrollable')) {
        $('#switchbtn-scrollable').prop('checked', true);
    }

    //centerlogo 
    if (localStorage.getItem('zemcenterlogo')) {
        $('#switchbtn-centerlogo').prop('checked', true);
    }
}


const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    // return {r, g, b} // return an object
    return [ r, g, b ]
}
function dynamicPrimaryColor(primaryColor) {
    primaryColor.forEach((item) => {
        item.addEventListener('input', (e) => {
            document.querySelector('html').style.setProperty('--primary-rgb', hex2rgb(e.target.value)) ;
        });
    });
}
function dynamicBackground(backgroundColor) {
    backgroundColor.forEach((item) => {
        item.addEventListener('input', (e) => {
            document.querySelector('html').style.setProperty('--background-rgb', hex2rgb(e.target.value)) ;
        });
    });
}

function changePrimaryColor() {
    var userColor = document.getElementById('colorID').value;
    localStorage.setItem('zemprimaryColor', hex2rgb(userColor));
    names()
}
function changeBackground() {
    var userColor1 = document.getElementById('colorID1').value;
    localStorage.setItem('zemBackground', hex2rgb(userColor1));
    names()
}

// chart colors
let myVarVal,primaryColorVal
function names() {
    'use strict'
    primaryColorVal = getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb').trim();

    //get variable
    myVarVal = localStorage.getItem("zemprimaryColor") ||primaryColorVal;

    if (document.querySelector('#salesChart') !== null) {
        salesChart();
    }
    if (document.querySelector('#total-investment') !== null) {
        totalInvestment();
    }
    if (document.querySelector('#total-profit') !== null) {
        totalProfit();
    }
    if (document.querySelector('#visitors') !== null) {
        totalVisitors();
    }

    if (document.querySelector('#chartA') !== null) {
        chartA();
    }

    if (document.querySelector('#revenueReport') !== null) {
        revenueReport();
    }

    if (document.querySelector('#projectReport') !== null) {
        projectReport();
    }

    if (document.querySelector('#totalRevenue') !== null) {
        totalRevenue();
    }

    if (document.querySelector('#visitorsGrowth') !== null) {
        visitorsGrowth();
    }

    if (document.querySelector('#audienceReport') !== null) {
        audienceReport();
    }

    if (document.querySelector('#sessionsDevice') !== null) {
        sessionsDevice();
    }

    if (document.querySelector('#sessionsCountry') !== null) {
        sessionsCountry();
    }

    if (document.querySelector('#cryptoReport') !== null) {
        cryptoReport();
    }

    if (document.querySelector('#salesReport') !== null) {
        salesReport();
    }
}
names()


function localStorageBackup() {
    // if there is a value stored, update color picker and background color
    // Used to retrive the data from local storage
    if (localStorage.zemprimaryColor) {
        if (document.getElementById('colorID')) {
            document.getElementById('colorID').value = localStorage.zemprimaryColor;
        }
         document.querySelector('html').style.setProperty('--primary-rgb', localStorage.zemprimaryColor);
    }
    if(localStorage.zemBackground) {
        if (document.getElementById('colorID1')) {
            document.getElementById('colorID1').value = localStorage.zemBackground;
        }
         document.querySelector('html').style.setProperty('--background-rgb', localStorage.zemBackground);
    }
    if (localStorage.zemrtl) {
        let html = document.querySelector('html');
        html.setAttribute('dir', 'rtl');
    }
    if (localStorage.zemlayout) {
        let html = document.querySelector('html');
        let layoutValue = localStorage.getItem('zemlayout');
        html.setAttribute('data-layout', 'horizontal');
        switch (layoutValue) {
            case 'horizontal':
                html.setAttribute('data-hor-style', 'hor-click');
                break;
            case 'horizontalhover':
                html.setAttribute('data-hor-style', 'hor-hover');
                break;
        }
    }
    if (localStorage.zemthemecolors) {
        let html = document.querySelector('html');
        let themeColors = localStorage.getItem("zemthemecolors");
        switch (themeColors) {
            case 'default': 
            html.setAttribute('data-theme-color', 'default');
            break;
            case 'light': 
            html.setAttribute('data-theme-color', 'light');
            break;
            case 'dark': 
            html.setAttribute('data-theme-color', 'dark');
            break;
            case 'glassy': 
            html.setAttribute('data-theme-color', 'glassy');
            break;
        }
    }
    if (localStorage.zemmenubgimg) {
        let html = document.querySelector('html');
        let menubgimg = localStorage.getItem("zemmenubgimg");
        switch (menubgimg) {
            case 'bg-img1':
                html.setAttribute('data-menuimg', 'bg-img1');
                break;
            case 'bg-img2':
                html.setAttribute('data-menuimg', 'bg-img2')
                break;
            case 'bg-img3':
                html.setAttribute('data-menuimg', 'bg-img3')
                break;
            case 'bg-img4':
                html.setAttribute('data-menuimg', 'bg-img4')
                break;
        }
    }
    if (localStorage.zemverticalstyles) {
        let html = document.querySelector('html');
        let verticalStyles = localStorage.getItem('zemverticalstyles');
        if (!(document.body.classList.contains('error-page1'))) {
            switch (verticalStyles) {
                case 'closed':
                    hoverLayoutFn();
                    html.setAttribute('data-vertical-style', 'closed');
                    break;
                case 'icontext':
                    textLayoutFn();
                    html.setAttribute('data-vertical-style', 'icontext');
                    break;
                case 'overlay':
                    hoverLayoutFn();
                    html.setAttribute('data-vertical-style', 'overlay');
                    break;
                case 'hover':
                    hoverLayoutFn();
                    html.setAttribute('data-vertical-style', 'hover');
                    break;
                case 'hover1':
                    html.setAttribute('data-vertical-style', 'hover1');
                    hoverLayoutFn();
                    break;
                case 'doublemenu':
                    html.setAttribute('data-vertical-style', 'doublemenu');
                    doubleLayoutFn();
                    break;

            }
        }
    }
    if (localStorage.zemboxed) {
        let html = document.querySelector('html');
        html.setAttribute('data-width', 'boxed');
    }
    if (localStorage.zemscrollable) {
        let html = document.querySelector('html');
        html.setAttribute('data-position', 'scrollable');
    }

    if (localStorage.zemcenterlogo) {
        let html = document.querySelector('html');
        let layoutValue = localStorage.getItem('zemlayout');
        if (html.getAttribute('data-layout' === 'horizontal')) {
            html.setAttribute('data-logo', 'centerlogo');
        }
    }
}