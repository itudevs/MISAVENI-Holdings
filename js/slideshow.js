(function () {
  var TRANSITION_DURATION_MS = 850;
  var DEFAULT_INTERVAL_MS = 10000;
  var carousels = Array.prototype.slice.call(
    document.querySelectorAll(".custom-carousel")
  );

  if (!carousels.length) {
    return;
  }

  function normaliseIndex(index, length) {
    return ((index % length) + length) % length;
  }

  carousels.forEach(function (carousel) {
    var slides = Array.prototype.slice.call(
      carousel.querySelectorAll(".carousel-item")
    );

    if (slides.length <= 1) {
      if (slides.length === 1 && !slides[0].classList.contains("active")) {
        slides[0].classList.add("active");
        slides[0].setAttribute("aria-hidden", "false");
      }
      return;
    }

    var dots = Array.prototype.slice.call(
      carousel.querySelectorAll("[data-slide-index]")
    );
    var instanceId = carousel.getAttribute("data-carousel") || "";
    var intervalAttr = parseInt(
      carousel.getAttribute("data-carousel-interval"),
      10
    );
    var intervalMs = !isNaN(intervalAttr) ? intervalAttr : DEFAULT_INTERVAL_MS;
    var autoHeight =
      carousel.getAttribute("data-carousel-autoheight") === "true";
    var navControls = instanceId
      ? Array.prototype.slice.call(
          document.querySelectorAll(
            '[data-carousel-target="' + instanceId + '"]'
          )
        )
      : [];

    var currentIndex = slides.findIndex(function (slide) {
      return slide.classList.contains("active");
    });

    if (currentIndex === -1) {
      currentIndex = 0;
      slides[0].classList.add("active");
    }

    slides.forEach(function (slide, index) {
      slide.setAttribute(
        "aria-hidden",
        index === currentIndex ? "false" : "true"
      );
      slide.classList.remove(
        "slide-in-from-right",
        "slide-in-from-left",
        "slide-out-left",
        "slide-out-right",
        "position-left",
        "position-right"
      );
    });

    function updateDots() {
      if (!dots.length) {
        return;
      }

      dots.forEach(function (dot, index) {
        var isActive = index === currentIndex;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    updateDots();

    var isAnimating = false;
    var autoTimer = null;

    function updateContainerHeight(targetSlide) {
      if (!autoHeight) {
        return;
      }

      var slide = targetSlide || slides[currentIndex];

      if (!slide) {
        return;
      }

      var desiredHeight = slide.offsetHeight;

      if (desiredHeight) {
        carousel.style.height = desiredHeight + "px";
      }
    }

    function determineDirection(targetIndex) {
      var forwardDistance = normaliseIndex(
        targetIndex - currentIndex,
        slides.length
      );
      var backwardDistance = normaliseIndex(
        currentIndex - targetIndex,
        slides.length
      );

      return forwardDistance <= backwardDistance ? "forward" : "backward";
    }

    function resetAutoplay() {
      if (autoTimer) {
        clearInterval(autoTimer);
      }

      if (intervalMs <= 0) {
        return;
      }

      autoTimer = setInterval(function () {
        goToSlide(currentIndex + 1, "forward");
      }, intervalMs);
    }

    function goToSlide(targetIndex, directionOverride) {
      if (isAnimating) {
        return;
      }

      var nextIndex = normaliseIndex(targetIndex, slides.length);

      if (nextIndex === currentIndex) {
        resetAutoplay();
        return;
      }

      var direction = directionOverride || determineDirection(nextIndex);
      var exitClass =
        direction === "backward" ? "slide-out-right" : "slide-out-left";
      var prepClass =
        direction === "backward" ? "position-left" : "position-right";
      var enterClass =
        direction === "backward" ? "slide-in-from-left" : "slide-in-from-right";

      var outgoing = slides[currentIndex];
      var incoming = slides[nextIndex];

      if (!incoming || !outgoing) {
        return;
      }

      isAnimating = true;
      resetAutoplay();

      incoming.classList.remove(
        "slide-in-from-right",
        "slide-in-from-left",
        "slide-out-left",
        "slide-out-right",
        "position-left",
        "position-right"
      );
      outgoing.classList.remove(
        "slide-in-from-right",
        "slide-in-from-left",
        "slide-out-left",
        "slide-out-right",
        "position-left",
        "position-right"
      );

      incoming.classList.add("active", prepClass);
      incoming.setAttribute("aria-hidden", "false");
      updateContainerHeight(incoming);

      requestAnimationFrame(function () {
        incoming.classList.add(enterClass);
        outgoing.classList.add(exitClass);
      });

      setTimeout(function () {
        outgoing.classList.remove(
          "active",
          "slide-out-left",
          "slide-out-right"
        );
        outgoing.setAttribute("aria-hidden", "true");

        incoming.classList.remove(
          enterClass,
          "position-left",
          "position-right"
        );

        currentIndex = nextIndex;
        updateDots();
        isAnimating = false;
      }, TRANSITION_DURATION_MS);
    }

    if (dots.length) {
      dots.forEach(function (dot) {
        dot.addEventListener("click", function (event) {
          var value = parseInt(dot.getAttribute("data-slide-index"), 10);

          if (isNaN(value)) {
            return;
          }

          event.preventDefault();
          goToSlide(value);
        });
      });
    }

    if (navControls.length) {
      navControls.forEach(function (control) {
        var action = control.getAttribute("data-carousel-action");

        control.addEventListener("click", function (event) {
          event.preventDefault();

          if (action === "prev") {
            goToSlide(currentIndex - 1, "backward");
          } else if (action === "next") {
            goToSlide(currentIndex + 1, "forward");
          }
        });
      });
    }

    resetAutoplay();
    updateContainerHeight();
  });
})();

$(".testimonials").slick({
  autoplay: true,
  autoplaySpeed: 2000,
  dots: true,
  arrows: true,
  infinite: true,
  slidesToShow: 1,
  adaptiveHeight: true,
  fade: true,
  cssEase: "linear",
  responsive: [
    {
      breakpoint: 600,
      settings: {
        arrows: "flase",
      },
    },
  ],
});
