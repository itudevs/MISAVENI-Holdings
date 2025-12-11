(function () {
  "use strict";

  var tinyslider = function () {
    var el = document.querySelectorAll(".testimonial-slider");

    if (el.length > 0) {
      tns({
        container: ".testimonial-slider",
        items: 1,
        axis: "horizontal",
        controlsContainer: "#testimonial-nav",
        swipeAngle: false,
        speed: 700,
        nav: true,
        controls: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 3500,
        autoplayButtonOutput: false,
      });
    }
  };
  tinyslider();

  var sitePlusMinus = function () {
    var value;
    var quantity = document.getElementsByClassName("quantity-container");

    function createBindings(quantityContainer) {
      var quantityAmount =
        quantityContainer.getElementsByClassName("quantity-amount")[0];
      var increase = quantityContainer.getElementsByClassName("increase")[0];
      var decrease = quantityContainer.getElementsByClassName("decrease")[0];
      increase.addEventListener("click", function (e) {
        increaseValue(e, quantityAmount);
      });
      decrease.addEventListener("click", function (e) {
        decreaseValue(e, quantityAmount);
      });
    }

    function init() {
      for (var i = 0; i < quantity.length; i++) {
        createBindings(quantity[i]);
      }
    }

    function increaseValue(event, quantityAmount) {
      value = parseInt(quantityAmount.value, 10);

      value = isNaN(value) ? 0 : value;
      value++;
      quantityAmount.value = value;
    }

    function decreaseValue(event, quantityAmount) {
      value = parseInt(quantityAmount.value, 10);

      value = isNaN(value) ? 0 : value;
      if (value > 0) value--;

      quantityAmount.value = value;
    }

    init();
  };
  sitePlusMinus();
})();

(function () {
  var HERO_INTERVAL_MS = 10000;
  var TRANSITION_DURATION_MS = 850;
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
    var intervalMs = !isNaN(intervalAttr) ? intervalAttr : HERO_INTERVAL_MS;
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

(function () {
  "use strict";

  var form = document.querySelector("#contact-form");

  if (!form) {
    return;
  }

  var statusNode = form.querySelector("[data-form-status]");
  var fullNameInput = form.querySelector("[data-fullname-input]");
  var submitting = false;

  if (!statusNode) {
    statusNode = document.createElement("div");
    statusNode.className = "form-status small mt-3";
    statusNode.setAttribute("data-form-status", "");
    statusNode.setAttribute("role", "alert");
    statusNode.setAttribute("aria-live", "polite");
    form.appendChild(statusNode);
  }

  function setStatus(message, stateClass) {
    if (!statusNode) {
      return;
    }

    var classesToClear = ["text-success", "text-danger", "text-muted"];

    for (var i = 0; i < classesToClear.length; i++) {
      statusNode.classList.remove(classesToClear[i]);
    }

    if (stateClass) {
      statusNode.classList.add(stateClass);
    }

    statusNode.textContent = message || "";
  }

  function submitForm(event) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    submitting = true;
    setStatus("Sending...", "text-muted");

    var formData = new FormData(form);

    if (fullNameInput) {
      var firstField = form.querySelector('[name="firstname"]');
      var lastField = form.querySelector('[name="lastname"]');
      var nameParts = [];

      if (firstField && firstField.value.trim()) {
        nameParts.push(firstField.value.trim());
      }

      if (lastField && lastField.value.trim()) {
        nameParts.push(lastField.value.trim());
      }

      var fullName = nameParts.join(" ").trim();

      if (!fullName) {
        fullName = (formData.get("email") || "").trim();
      }

      if (!fullName) {
        fullName = "Website Visitor";
      }

      fullNameInput.value = fullName;
      formData.set("name", fullName);
      formData.set("from_name", fullName);
    }

    fetch(form.action, {
      method: form.method || "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            return { success: response.ok };
          })
          .then(function (data) {
            if (!response.ok || data.success === false) {
              var error = new Error(
                (data && data.message) ||
                  "Submission failed. Please try again later."
              );
              error.data = data;
              throw error;
            }
            return data;
          });
      })
      .then(function (data) {
        var message =
          (data && data.message) ||
          "Thanks for reaching out. We will contact you soon.";

        setStatus(message, "text-success");
        form.reset();
      })
      .catch(function (error) {
        var message =
          (error && error.message) ||
          "Sorry, something went wrong. Please try again.";

        setStatus(message, "text-danger");
      })
      .then(function () {
        submitting = false;
      });
  }

  form.addEventListener("submit", submitForm);
})();
