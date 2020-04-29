window.clicked = false;

var author = window.matchMedia('(min-width: 1091px)').matches ? true : false,
    authornav = false,
    openedDropdown = false,
    fadded = false,
    lastScrollTop = 0,
    fired = 0,
    firstStart = 0,
    delay = 0,
    posScroll = 0;


function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop(),
        docViewBottom = docViewTop + $(window).height(),
        elemTop = $(elem).offset().top,
        elemBottom = elemTop + $(elem).height();
    return (elemTop >= docViewTop);
};

/* Drop down menu */

$('.nav-responsive li:nth-child(2) a').mouseover(function() {
    if (author) {
        if (!openedDropdown) {
            $('.dropdown-menu').slideDown(400);
            openedDropdown = true;
        }
    }
});

$('.close-drop').mouseover(function() {
    if (author) {
        if (openedDropdown) {
            $('.dropdown-menu').slideUp(400);
            openedDropdown = false;
        }
    }
});

$("header").mouseleave(function() {
    if (author) {
        if (openedDropdown) {
            $('.dropdown-menu').slideUp(400);
            openedDropdown = false;
        }
    }
});

/* END Drop down menu */

/* SHOW TOOLTIP */
$('.column-menu-carte a').mouseover(function() {
    if ($(window).width() > 1060) {
        showTooltip($(this));
        if (($(this).width() + $(this).position().left) > $('.menu-change-cont').outerWidth()) {
            $(this).addClass('arrow-left');
        }

    }
});

$(".column-menu-carte").mouseleave(function() {
    $('.column-menu-carte a').each(function() {
        $(this).removeClass('arrow-left');
    });



    $('.image-tooltip').animate({
        opacity: 0
    }, 200, function() {
        $(this).css('visibility', 'hidden');
    });
});

$('.image-tooltip').mouseover(function() {
    $(this).animate({
        opacity: 0
    }, 100, function() {
        $(this).css('visibility', 'hidden');
    });
});

function showTooltip(elem) {
    var element = elem,
        pic = element.data('img-pdt'),
        gap = 20,
        elemWidth = element.outerWidth(),
        elemPosition = element.position().left,
        tooltip = $('.image-tooltip'),
        tooltipWidth = tooltip.outerWidth(),
        contWidth = $('.menu-change-cont').outerWidth(),
        tooltipAlign = elemWidth + elemPosition > contWidth ? elemPosition - tooltipWidth - gap : elemWidth + elemPosition + gap;
    tooltip.css({
        'background-image': 'url(' + pic + ')',
        'visibility': 'visible',
        left: Math.round(tooltipAlign)
    });
    if (tooltip.css('opacity') == 0) {
        tooltip.animate({
            opacity: 1
        }, 400)
    }
}

/* END TOOLTIP */

function checkPosF() {
    var $allElem = $("#steps ul li"),
        $elemFirst = $allElem.first(),
        $elemlast = $allElem.last(),
        $contBas = $('.contener-basket'),
        sc = 'step-current',
        so = 'step-ok';

    if ($(document).height() <= ($(window).height() + $(window).scrollTop())) {
        if (!$elemlast.hasClass(sc)) {
            $allElem.removeClass(sc);
            $elemlast.addClass(sc).prevAll().addClass(so);
        }
    } else if ($(window).scrollTop() < $contBas.first().outerHeight() - ($contBas.first().outerHeight() * 0.75)) {
        //else if ($(window).scrollTop() < $contBas.first().outerHeight() - ($('.contener-basket:eq(1)').outerHeight()*1.5)) {
        if (!$elemFirst.hasClass(sc)) {
            $allElem.removeClass(sc + ' ' + so);
            $elemFirst.addClass(sc);

        }
    } else {
        $contBas.each(function() {
            if (isScrolledIntoView($(this))) {
                // if (!$(this).hasClass(sc)) {
                if (($(this).offset().top) - 120 < $(window).scrollTop()) {
                    var url = $(this).attr("id"),
                        target = $("#steps ul").find('.' + url);
                    if (!target.hasClass(sc)) {
                        $allElem.removeClass(sc);
                        target.addClass('step-current').removeClass(so);
                        target.prevAll().addClass(so);
                        target.nextAll().removeClass(so);
                    }
                }
                // }
            }
        });
    }
}

//$('.more-information').on("click", function() {
$(document).on("click","span.more-information",function(event){
    var thisitem = $(this).parent().find('.bloc-pdt-table-back');
    $('.bloc-pdt-table-back').not(thisitem).removeClass('showinfos');
    thisitem.toggleClass('showinfos');
});

$(".overlay .close").on("click", function(event) {
    event.preventDefault();
    $(this).closest('.overlay').removeClass('ov-visible');
});

$(".wide-error a").on("click", function(event) {
    event.preventDefault();
    $(window).scrollTo($(this).attr('href'), 800, {
        offset: {
            top: -112
        }
    });
});

$("#steps li").on("click", function() {
    window.clicked = true;
    var goto = $(this).attr('class').split(' ')[0];
    $(window).scrollTo("#" + goto, 800, {
        offset: {
            top: -112
        },
        onAfter: function() {
            window.clicked = false;
            checkPosF();
        }
    })
});

$(".choice-intro .active_click").on("click", function(event) {
  event.preventDefault();
  if(!$(this).hasClass('slected-sc')) {
    var typeDemande = $(this).data('type'),
        $cs = $(".hide-select");

    $('.active_click').removeClass('selected-sc');
    $(this).addClass('selected-sc');
    $('#type-demande').val(typeDemande);
}

if(typeDemande == 'Suggestion') {
    $cs.slideUp(400).addClass('invisible-select')
}else {
  if($cs.hasClass('invisible-select')) {
      $cs.slideDown(400).removeClass('invisible-select')
  }
   changeOptions("opt" + typeDemande);
}

});

window.optQuestion = {
  "Un produit": "Un produit",
  "Un service": "Un service",
  "Une livraison": "Une livraison",
  "Un restaurant": "Un restaurant",
  "Un paiement": "Un paiement",
  "Autre": "Autre"
};

window.optReclamation = {
  "Une commande": "Une commande",
  "Un produit": "Un produit",
  "Un service": "Un service",
  "Autre": "Autre"
};

function changeOptions(type) {
  var $el = $("#dynamic-options");
  $el.empty(); // remove old options
  $.each(window[type], function(key,value) {
    $el.append($("<option></option>")
       .attr("value", value).text(key));
  });
}


function openCloseNav() {
    $('.hamburger').toggleClass('is-active');
    $('body').scrollTop(0)
    $('html').toggleClass('is-opened');
    setTimeout(function() {
        authornav = !authornav
    }, 300);

}

$('.hamburger').on("click", function() {
    openCloseNav()
});

$(document).on("click", '.line-to-check .formule-add', function() {
    var elem = $(this).closest($('.bloc-pdt')),
      //  falseRadio = elem.find($('.falseradio')),
        elemInput = elem.find($('input')),
        closestDiv = elem.closest('.line-to-check');



    elem.addClass('checked-radio');
    elemInput.prop("checked", true);

    closestDiv.find($('input').not(elemInput)).each(function() {
        $(this).prop("checked", false);
    })

    closestDiv.find($('.bloc-pdt').not(elem)).each(function() {
        $(this).removeClass('checked-radio');
    })




});

// DEBUG
/*$('body').click(function(e) {
    console.log($(e.target));
  });*/

$('.add-adresse').on("click", function(e) {
$('.overlay-adresse').addClass('ov-visible');

});


$(document).on("click", function(e) {

    if (authornav) {
        var container = $('.nav-responsive'),
            button = $('.hamburger');
        if (!button.is(e.target) && button.has(e.target).length === 0) {
            if (!container.is(e.target) && container.has(e.target).length === 0) {



                openCloseNav()



            }
        }

    }
});

$("#menu-change").change(function() {
    if ($(this).val() != '') {
        window.location.href = $(this).val();

    }
});

jQuery('.scrollbar-inner').scrollbar({
    mouseWheel: {
        preventDefault: false
    }
});

/*function checkPosMenu() {
    window.topCurrent = $("#big-basket").css("top");
    window.posX = $("header").outerHeight() + 32;
    window.topMarg = $(window).height() - $("#big-basket").outerHeight() - 32;
    window.MenuSup = $("#big-basket").outerHeight() > ($(window).outerHeight() - $("header").outerHeight() - 32) ? true : false;
}*/

//checkPosMenu();

function hidePrice() {
    if (window.matchMedia('(max-width: 1090px)').matches) {

        var elem = $('.responsive-total'),
            finalHeight = $('#finaliser').outerHeight();
        if (!$('html').hasClass('is-opened')) {

            if ($(window).scrollTop() + $(window).height() + finalHeight > $(document).height()) {
                elem.fadeOut('300');
                fadded = true;
            } else {
                if (fadded) {
                    elem.fadeIn('300');
                    fadded = false;
                }
            }
        }
    }
}

/* Fix iOS bug for -unit support */
var iOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/);
if (iOS) {
    function iosVhHeightBug() {
        var height = $(window).height();
        $(".main").css('height', height);
    }

    iosVhHeightBug();
    $(window).bind('resize', iosVhHeightBug);
}

$(window).resize(function() {
  //  checkPosMenu();
    author = window.matchMedia('(min-width: 1091px)').matches ? true : false;
    if (window.matchMedia('(min-width: 1090px)').matches) {
        $('.responsive-total').removeAttr('style');
    }
});

$('#slides').superslides({
    pagination: false,
    play: 5000,
    animation: 'fade'
});

$(window).scroll(function(event) {

    hidePrice()

    if (!window.clicked) {
        checkPosF();
    }

    //var topMarg = $(window).height() - $("#big-basket").outerHeight() - 32;

    /*if (MenuSup) {
        var st = $(this).scrollTop();
        if (st > lastScrollTop) {
            if (fired == 0) {
                if (topMarg != topCurrent) {
                    fired = 1;
                    $("#big-basket").animate({
                        top: topMarg
                    }, function() {
                        fired = 0;
                    })
                    topCurrent = topMarg;
                } else if (!firstStart) {
                    fired = 0;
                    firstStart = 1;
                }
            }
        } else {
            if (fired == 0) {

                if (topCurrent > posX || topCurrent < posX) {
                    fired = 1;
                    $("#big-basket").animate({
                        top: "7em"
                    }, function() {
                        fired = 0
                    })
                    topCurrent = 7 * 16;
                } else if (!firstStart) {
                    fired = 0;
                    firstStart = 1;
                }
            }
        }
        lastScrollTop = st;
    } else {
        $("#big-basket").animate({
            top: "7em"
        });
    }*/
});

$("#steps").stick_in_parent({
    offset_top: 112
});

$("#big-basket").stick_in_parent({
    offset_top: 112

});


function test() {
$('.img-bloc-philo').each(function() {

    var speed = Math.floor((Math.random() * 200) + 1) + 150;

    $(this).delay(delay).animate({
        left: 0,
        opacity: 1
    }, speed);
    delay += Math.floor((Math.random() * 200) + 1) + 150;
});
}

if (window.addEventListener) {
    var kkeys = [],
        check = "67,72,73,78,79,73,83"; //this spells dinner
    window.addEventListener("keydown", function(e) {
        kkeys.push(e.keyCode);
        if (kkeys.toString().indexOf(check) >= 0) {
            // run code here
            $('body').attr('id', 'snow');
            $('div').addClass('shake');
        }
    }, true);
}

function delegateFunc() {
    $(".scrollbar-inner").on("scroll", function() {
        posScroll = $(this).scrollTop();
    });
}

delegateFunc()

$("body").bind("contentchanged", function() {
    var elem = $(".scrollbar-inner");
    elem.off('scroll').scrollbar('destroy').scrollbar().scrollTop(posScroll);
    delegateFunc();
});

function debug_js(message)
{
    $.ajax({
        type: "POST",
        url: "index.php",
        data: "action=debug_js&message=" + message
     });
}