(function() {
  function f(b) {
    return "false" === b
      ? !1
      : (b = b.match(
          /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/
        )) && /youtu\.?be/g.test(b[3])
        ? "youtube"
        : b && /vimeo/g.test(b[3]) ? "vimeo" : !1;
  }
  function g(b) {
    return "false" === b
      ? !1
      : (b = b.match(
          /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/
        ))
        ? b[6]
        : !1;
  }
  function h(b, c) {
    var a = new XMLHttpRequest();
    a.open("GET", "https://vimeo.com/api/v2/video/" + b + ".json", !0);
    a.onreadystatechange = function() {
      if (4 === this.readyState && 200 <= this.status && 400 > this.status) {
        var a = JSON.parse(this.responseText);
        c(a[0].thumbnail_large);
      }
    };
    a.send();
    a = null;
  }
  var k = (function() {
    var b = {};
    return function(c) {
      var a = $.Deferred();
      c in b
        ? b[c] ? a.resolve(b[c]) : a.reject("Preview image not found.")
        : $("<img>")
            .on("load", function() {
              if (120 === (this.naturalWidth || this.width)) {
                var e = this.src.split("/").pop();
                switch (e) {
                  case "maxresdefault.jpg":
                    this.src = this.src.replace(e, "sddefault.jpg");
                    break;
                  case "sddefault.jpg":
                    this.src = this.src.replace(e, "hqdefault.jpg");
                    break;
                  case "hqdefault.jpg":
                    this.src = this.src.replace(e, "default.jpg");
                    break;
                  default:
                    (b[c] = null), a.reject("Preview image not found.");
                }
              } else a.resolve((b[c] = this.src));
            })
            .attr(
              "src",
              "https://img.youtube.com/vi/" + c + "/maxrsesdefault.jpg"
            );
      return a;
    };
  })();
  if (!$("html").hasClass("is-builder"))
    $(document).on("add.cards", function(b) {
      if ($(b.target).hasClass("carousel")) {
        var c = $("html").hasClass("desktop");
        $(b.target).outerFind("[data-bg-video-slide]").each(function() {
          var a = g($(this).attr("data-bg-video-slide"));
          if (a) {
            var b = $('<div class="mbr-background-video-preview"></div>').css({
              display: "none",
              backgroundSize: "cover",
              backgroundPosition: "center"
            });
            $(".container-slide", this).before(b);
            var l = f($(this).attr("data-bg-video-slide")),
              d = $(this).find(".mbr-overlay");
            "youtube" === l
              ? (
                  k(a).done(function(a) {
                    b.css("background-image", 'url("' + a + '")').show();
                  }),
                  c &&
                    $.fn.YTPlayer &&
                    !$(this).find(".playerBox").length &&
                    (
                      $(".container-slide", this)
                        .before('<div class="mbr-background-video"></div>')
                        .prev()
                        .YTPlayer({
                          videoURL: a,
                          containment: "self",
                          showControls: !1,
                          mute: !0
                        }),
                      d.length &&
                        $(".YTPOverlay", this).css({
                          opacity: d.css("opacity"),
                          backgroundColor: d.css("background-color")
                        }),
                      $(this).find(".image_wrapper img").css("opacity", "0"),
                      $(this)
                        .find(".image_wrapper .mbr-overlay")
                        .css("opacity", "0")
                    )
                )
              : (
                  h(a, function(a) {
                    b.css("background-image", 'url("' + a + '")').show();
                  }),
                  c &&
                    $.fn.vimeo_player &&
                    !$(this).find(".playerBox").length &&
                    (
                      $(".container-slide", this)
                        .before('<div class="mbr-background-video"></div>')
                        .prev()
                        .vimeo_player({
                          videoURL: a,
                          containment: "self",
                          showControls: !1,
                          mute: !0
                        }),
                      d.length &&
                        $(".vimeo_player_overlay", this).css({
                          opacity: d.css("opacity"),
                          backgroundColor: d.css("background-color")
                        })
                    )
                );
          }
        });
        $(b.target)
          .find(".carousel-item iframe")
          .css({ transitionProperty: "opacity", transitionDuration: "1000ms" });
        $(this).on("slide.bs.carousel", "section.carousel", function(a) {
          $(a.target)
            .find(".carousel-item.active .mb_YTPlayer")
            .each(function() {
              $(this).YTPPause();
            });
          $(a.target)
            .find(".carousel-item.active .vimeo_player")
            .each(function() {
              $(this).v_pause();
            });
          $(a.target)
            .find(".carousel-item:not(.active) iframe")
            .css("opacity", 0);
        });
        $(this).on("slid.bs.carousel", "section.carousel", function(a) {
          $(a.target)
            .find(".carousel-item.active .mb_YTPlayer")
            .each(function() {
              $(this).YTPPlay();
            });
          $(a.target)
            .find(".carousel-item.active .vimeo_player")
            .each(function() {
              $(this).v_play();
            });
          $(a.target)
            .find(".carousel-item.active iframe")
            .resize()
            .css("opacity", 1);
        });
      }
    });
})();
