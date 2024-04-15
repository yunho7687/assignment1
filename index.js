$(document).ready(function () {
  const catArrayURL = []; // store URLs
  const catLength = { length: catArrayURL.length };

  // Cached jQuery selectors for various elements of the webpage
  const catsContainer = $("#cats-container");
  const catsVertical = $("#cats-vertical");
  const moreCatsButton = $("#more-cats-btn");
  const ajaxCatButton = $("#ajax-cat-btn");
  const ajaxJokeButton = $("#ajax-joke-btn");
  const fakeLoading = $("#fake-loading");
  const navBarCloseBtn = $("#nav-close-button");
  const titleSectionSelector = $("#title-section-selector");
  const navBarToggler = $("#navbar-toggler");
  const sectionOne = $("#section-1");
  const sectionTwo = $("#section-2");
  const sectionCV = $("#section-cv");
  const toSectionOne = $(".section-1");
  const toSectionTwo = $(".section-2");
  const toCV = $(".section-cv");
  const sideMenu = $("#side-menu");
  const navItemTemplate = $("#nav-item-template").html();
  const horizontalFilm = $("#horizontal-film");
  const joke = $("#joke");
  const ajaxSampleUrl =
    "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,racist&idRange=0-100";
    
  // Render dynamic menu items based on titles in the currently active section
  function renderMenu() {
    sideMenu.empty();
    const titles = $("section.active .title");
    titles.each(function () {
      // console.log(navItemTemplate);
      const temp = $(navItemTemplate);
      let url = "#" + $(this).attr("id");
      let text = $(this).find("a").text();
      temp.find("a").attr({ href: url });
      temp.find("a").text(text);
      if ($(this).prop("tagName") === "H3") {
        temp.addClass("ms-2");
      } else if ($(this).prop("tagName") === "H4") {
        temp.addClass("ms-3");
      } else if ($(this).prop("tagName") === "H5") {
        temp.addClass("ms-5");
      }
      sideMenu.append(temp);
    });
  }

  ajaxJokeButton.on("click", function () {
    $.get(ajaxSampleUrl, function (data) {

      joke.text(data.joke);
    });
  });

  sideMenu.on("click", function () {
    navBarCloseBtn.click();
  });

  titleSectionSelector.on("click", () => {
    navBarToggler.click();
  });

  navBarToggler.on("click", function () {
    $("a.nav-link.dropdown-toggle").addClass("show");
    $("a.nav-link.dropdown-toggle")
      .parent()
      .find(".dropdown-menu")
      .addClass("show");

    renderMenu();
  });

  getCats(catArrayURL);

  $("#to-top").on("click", function () {
    $(window).scrollTop(-1);
  });

  toSectionOne.each(function () {
    $(this).on("click", function (e) {
      e.preventDefault();
      sectionOne.addClass("active");
      sectionTwo.removeClass("active");
      sectionCV.removeClass("active");
      sectionTwo.fadeOut();
      sectionCV.fadeOut();
      sectionOne.fadeIn();
      titleSectionSelector.find("span").text("Section 1");
      renderMenu();
      $(window).scrollTop(-1);
      navBarCloseBtn.click();
    });
  });
  toSectionTwo.each(function () {
    $(this).on("click", function (e) {
      e.preventDefault(e);
      sectionOne.removeClass("active");
      sectionTwo.addClass("active");
      sectionCV.removeClass("active");
      sectionCV.fadeOut();
      sectionOne.fadeOut();
      sectionTwo.fadeIn();
      renderMenu();
      titleSectionSelector.find("span").text("Section 2");
      $(window).scrollTop(-1);
      navBarCloseBtn.click();
    });
  });
  toCV.each(function () {
    $(this).on("click", function (e) {
      e.preventDefault(e);

      sectionOne.removeClass("active");
      sectionTwo.removeClass("active");
      sectionCV.addClass("active");
      sectionOne.fadeOut();
      sectionTwo.fadeOut();
      sectionCV.fadeIn();
      renderMenu();
      titleSectionSelector.find("span").text("Curriculum Citae");
      $(window).scrollTop(-1);
      navBarCloseBtn.click();
    });
  });
  ajaxCatButton.on("click", function () {
    if (catArrayURL.length > 0) {
      console.log(catArrayURL);
      const randomIndex = Math.floor(Math.random() * catArrayURL.length);
      $("#show-bgi")
        .css("background-image", `url('${catArrayURL[randomIndex].url}')`)
        .text("");
    }
  });

  moreCatsButton.on("click", function () {
    catsContainer.empty();
    catsVertical.empty();
    catArrayURL.splice(0, catArrayURL.length);
    catLength.length = 0;
    catsContainer.addClass();
    getCats(catArrayURL);
  });
  //for cats ajax to clean the timer
  $(window).on("scroll", function fun() {
    scrollCatsHandler(catsVertical, fun);
  });

  $(window).on("scroll", function () {
    const progress = Math.floor(
      1 -
        ($(window).scrollTop() * 100) /
          ($(window).height() - $("body").height())
    );
    const scrollTop = 180 - $(window).scrollTop();
    $(".progress.fixed-top").css("width", progress + "%");
    $("#target").css("transform", "translateY(" + scrollTop + "px)");
    horizontalFilm.css("transform", `translate(${scrollTop}px, 0px)`);
  });

  catsVertical.on(
    "scroll",
    throttle(function () {
      let isBottom =
        catsVertical.get(0).scrollHeight -
        catsVertical.get(0).scrollTop -
        catsVertical.get(0).clientHeight;

      if (isBottom < 600) {
        getCats(catArrayURL);
      }
    }, 800)
  );
  sectionOne.fadeIn().delay(500).fadeOut();
  sectionTwo
    .fadeOut()
    .delay(500 + 500)
    .fadeIn()
    .fadeOut();
  sectionCV
    .fadeOut()
    .delay(1300 + 500)
    .fadeIn();

  function getCats(catArrayURL) {
    console.log("sending GET request...");
    $.get(
      "https://api.thecatapi.com/v1/images/search?limit=10",
      function (data, status, xhr) {
        fakeLoading.empty();
        console.log("🐱:Meow~");
        console.log(status);
        console.log("status code:", xhr.status);
        renderAjaxData(catArrayURL, catsContainer, data);
        renderSrollCats(catLength, catArrayURL, catsVertical);
        toggleCatMeow();
      }
    );
  }
});

function throttle(func, delay) {
  let timeout = null;
  return function () {
    if (!timeout) {
      timeout = setTimeout(function () {
        func.apply(this, arguments);
        timeout = null;
      }, delay);
    }
  };
}

function elementTriggerAt(jqel, position, recall) {
  let targetOffsetTop = jqel.offset().top;
  let scrollDistance = $(window).scrollTop() + position;
  if (scrollDistance >= targetOffsetTop) {
    recall();
  }
}

function scrollCatsHandler(catsVertical, handler) {
  // scroll the vertical cats container a little bit

  // Get the distance from the target element to the top of the document.
  let targetOffsetTop = catsVertical.offset().top;
  // Calculate the distance between the scroll position and the top of the target element.
  let scrollDistance = $(window).scrollTop() + 500;

  if (scrollDistance >= targetOffsetTop) {
    catsVertical
      .delay(100)
      .animate({ scrollTop: 500 }, 1000)
      .animate({ scrollTop: 0 }, 500)
      .animate({ scrollTop: 160 }, 250);
    // $("#cats-vertical").scrollTop(20);
    $(window).off("scroll", handler);
  }
}

function renderAjaxData(catArrayURL, catsContainer, data) {
  $.each(data, function (index, value) {
    catArrayURL.push({ url: value.url, id: value.id });
    if (catsContainer.children().length > 2) {
      return;
    }
    const catImg = $("<img>")
      .attr({
        id: value.id,
        src: value.url,
        alt: "a cat or cats",
      })
      .addClass("object-fit-cover");
    const hyperCat = $("<a>")
      .attr({
        href: value.url,
        target: "_blank",
      })
      .append(catImg);
    const catTemplate = $("<div>").addClass("carousel-item").append(hyperCat);
    catsContainer.append(catTemplate);
    $("#" + value.id).attr("src", catArrayURL[index].url);
    catsContainer.children().eq(0).addClass("active");
  });
}

function renderSrollCats(catLength, catArrayURL, catsVertical) {
  for (let i = catLength.length; i < catArrayURL.length; i++) {
    if (i < 3) continue;
    catsVertical.append(
      $("<a>")
        .attr({ href: catArrayURL[i].url, target: "_blank" })
        .append(
          // Append an anchor tag
          $("<img>")
            .attr({
              // Append an image tag
              src: catArrayURL[i].url,
              alt: "a cat or cats",
            })
            .addClass("rounded-5 object-fit-cover border border-1 p-1") // Add classes to the image
        )
    );
  }
  catLength.length = catArrayURL.length;
}

function toggleCatMeow() {
  const toastLiveExample = document.getElementById("liveToast");
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show();
}

//
//
//
//
//
//
//
// code below belong to Bootstrap

(() => {
  /*!
   * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
   * Copyright 2011-2024 The Bootstrap Authors
   * Licensed under the Creative Commons Attribution 3.0 Unported License.
   */
  "use strict";

  const getStoredTheme = () => localStorage.getItem("theme");
  const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setTheme = (theme) => {
    if (theme === "auto") {
      document.documentElement.setAttribute(
        "data-bs-theme",
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    } else {
      document.documentElement.setAttribute("data-bs-theme", theme);
    }
  };

  setTheme(getPreferredTheme());

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector("#bd-theme");

    if (!themeSwitcher) {
      return;
    }

    const themeSwitcherText = document.querySelector("#bd-theme-text");
    const activeThemeIcon = document.querySelector(".theme-icon-active use");
    const btnToActive = document.querySelector(
      `[data-bs-theme-value="${theme}"]`
    );
    const svgOfActiveBtn = btnToActive
      .querySelector("svg use")
      .getAttribute("href");

    document.querySelectorAll("[data-bs-theme-value]").forEach((element) => {
      element.classList.remove("active");
      element.setAttribute("aria-pressed", "false");
    });

    btnToActive.classList.add("active");
    btnToActive.setAttribute("aria-pressed", "true");
    activeThemeIcon.setAttribute("href", svgOfActiveBtn);
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
    themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);

    if (focus) {
      themeSwitcher.focus();
    }
  };

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const storedTheme = getStoredTheme();
      if (storedTheme !== "light" && storedTheme !== "dark") {
        setTheme(getPreferredTheme());
      }
    });

  window.addEventListener("DOMContentLoaded", () => {
    showActiveTheme(getPreferredTheme());

    document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const theme = toggle.getAttribute("data-bs-theme-value");
        setStoredTheme(theme);
        setTheme(theme);
        showActiveTheme(theme, true);
      });
    });
  });
})();
