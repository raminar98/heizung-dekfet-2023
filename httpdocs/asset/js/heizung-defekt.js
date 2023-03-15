`use strick`

//Preis by Click
let preis = document.querySelector(".preis_no_display");
document.querySelector("#cont5_title").onclick = function e() {
    if (document.querySelector(".preis_no_display") != null) {
        preis.className = preis.className.replace("preis_no_display", "preis");
    } else {
        preis.className = preis.className.replace("preis", "preis_no_display");
    }
}

function menu_function() {
    document.querySelector(".menu_top_no_display").classList.toggle("menu_top_display");
}
window.onclick = function(e) {
        if (!e.target.matches(".menu_hidden")) {
            let menu_down = document.getElementsByClassName("menu_top_no_display");
            let i;
            for (i = 0; i < menu_down.length; i++) {
                let menu_drop = menu_down[i];
                if (menu_drop.classList.contains("menu_top_display")) {
                    menu_drop.classList.replace("menu_top_display", "menu_top_no_display");
                }
            }
        }
    }
    /*cookies*/
let footerCookie = document.querySelector("#footer-cookie");
let footerCookieAccept = document.querySelector("#accept");

if (document.cookie.indexOf("dakitecCookieBanner=") == -1) {
    footerCookie.style.display = "block";
}

footerCookieAccept.onclick = function(e) {
    let cookieDate = new Date();
    cookieDate.setTime(new Date().getTime() + 31104000000);

    document.cookie = "dakitecCookieBanner = 1; path=/; secure; expires=" + cookieDate.toUTCString();

    footerCookie.style.display = "none";
};

/*scroll - hero leistung forEach function*/
//getElement scroll value all elements
//forEach Element scroll value font size und margin größer
//when click - link verfolgen
//return when not on the scroll value


/********/
//Partner Section Bauen