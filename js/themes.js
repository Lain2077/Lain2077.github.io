function getCurrentTheme() {
    let theme = getOrInitCookie("theme", "0");

    if (theme == "1") {
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/theme-new.css">');
    } else {
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/theme-old.css">');
    }

    return theme;
}