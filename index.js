/*
$(document).ready(function () {
    var homeHeaderDiv = $('.homeHeaderDiv h1');
    var homeHeaderContentDiv = $('.homeHeaderContentDiv div');

    //custom css
    var setCustomCss = function () {
        var homeHeaderDivHeight = homeHeaderDiv.height();
        homeHeaderContentDiv.css("margin", `${40 - (144 - homeHeaderDivHeight)}px 30px 40px 30px`);
        console.log(`found height ${homeHeaderDivHeight}`)
    }
    setCustomCss();

    $(document).resize(function () {
        setCustomCss();
    })
})
*/

$(document).ready(function () {
    var homeHeaderDiv = $('.homeHeaderDiv h1');
    var homeHeaderContentDiv = $('.homeHeaderContentDiv div');
    var navbar = $("navbar navbar-expand-sm bg-dark navbar-dark fixed-top");
    var homeContentDiv = $("#homeContentDiv")
    var $footer = $("#footer");


    // Custom CSS
    var setCustomCss = function () {
        // header height adjusts 
        var homeHeaderDivHeight = homeHeaderDiv.height();

        var marginTopValue = (homeHeaderDivHeight - 74) + 'px 30px 40px 30px';
        homeHeaderContentDiv.css('margin', marginTopValue);

        /*var navbarHeight = navbar.height();
        homeContentDiv.css("top", 164 + (navbarHeight - 56));*/
    };

    setCustomCss();


    $(window).resize(function () {
        setCustomCss();
    });

    //remove initial scroll indicator properties
    $(window).scroll(function () {
        $("#mainHomeDiv").removeClass("mainHomeFadeDiv");
    })

    //set image bg img height to prevent double scrollbars
    var footerEnd = $footer.offset().top;
    $("#homeOpacityDiv").css("height", footerEnd);
});

