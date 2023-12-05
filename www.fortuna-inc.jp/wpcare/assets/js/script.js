$(document).ready(function() {
    //AOS animation
    AOS.init({
        easing: 'ease-in-out-sine'
    });

    //Btn Humberger
    $(".wpc-Header_Hamburger").click(function() {
        $(this).parent().toggleClass("opened");
    });

    // Open hidden content
    $(".open-content").click(function() {
        $(this).closest(".socu-main").toggleClass("open");
    });
    $(".btn-close").click(function() {
        $(this).closest(".socu-main").removeClass("open");
    });




    // Smooth scroll
    var lastId,
        topMenu = $("#global ul"),
        topMenuHeight = topMenu.outerHeight() + 15,
        // All list items
        menuItems = topMenu.find(".onenav"),
        // Anchors corresponding to menu items
        scrollItems = menuItems.map(function() {
            var item = $($(this).attr("href"));
            if (item.length) {
                return item;
            }
        });

    menuItems.click(function(e) {
        var href = $(this).attr("href"),
            offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
        $('html, body').stop().animate({
            scrollTop: offsetTop
        }, 300);
        e.preventDefault();
    });

    // Bind to scroll
    $(window).scroll(function() {
        // Get container scroll position
        var fromTop = $(this).scrollTop() + topMenuHeight;

        // Get id of current scroll item
        var cur = scrollItems.map(function() {
            if ($(this).offset().top < fromTop)
                return this;
        });
        // Get the id of the current element
        cur = cur[cur.length - 1];
        var id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id) {
            lastId = id;
            // Set/remove active class
            menuItems
                .parent().removeClass("active")
                .end().filter("[href='#" + id + "']").parent().addClass("active");
        }
    });
});