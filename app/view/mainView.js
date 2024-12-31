"use strict";

class View {
  constructor(model) {
    this._model = model;
    this.sections = document.querySelectorAll("section");
    this.navContainer = document.querySelector(".nav--buttons");
    this.navLinks = document.querySelector(".nav--links");
    this.buttonsCarousel = document.querySelectorAll(".carousel--btn");
    this.carouselItem = document.querySelector(".carousel--item");
    this.socials = document.querySelector(".social--buttons");
    this.hero = document.querySelector(".section--hero");
    this.contact = document.querySelector(".contact");
    this.carousels = document.querySelectorAll(".carousel");
    this.galleryGrid = document.querySelector(".showcase--grid");
    this.galleryProducts = this.galleryGrid.querySelectorAll(".product");
    this.mealCarousel = document.querySelector(".meal--carousel");
    this.showcaseButton = document.querySelectorAll(".hero--button");
    this.copyYear = document.querySelector(".copy-year");
    this.mealCard = document.querySelectorAll(".meal--card");
    this.menuCards = document.querySelector(".menu-cards");
  }

  dynamicSections() {
    this.navContainer.innerHTML = "";
    let num = 0;
    this.sections.forEach((section, i) => {
      if (section.classList.contains("ignore")) return;
      num++;
      const sectionName = section.classList[0].split("--")[1];
      const sectionDisplayName = section
        .querySelector(".section--title")
        .textContent.toLowerCase();

      this.navContainer.insertAdjacentHTML(
        "beforeend",
        `<a class="nav--button nav--button--${num}" href="#${sectionName}">${
          sectionDisplayName[0].toUpperCase() + sectionDisplayName.slice(1)
        }</a>`
      );
    });
  }
  scrollToSection() {
    this.navLinks.addEventListener("click", (event) => {
      if (!event.target.classList.contains("nav--button")) return;
      const sectionName = event.target.href.split("#")[1];
      const section = document.querySelector(`.section--${sectionName}`);
      const sectionPosTop = section.getBoundingClientRect().top;
      scrollTo({
        behavior: "smooth",
        top: sectionPosTop,
      });
    });
  }
  carouselScroll(carousel, currentSlide, btn = { dataset: { side: "next" } }) {
    let margins;
    let cssVar;
    let displayAmount;
    if (carousel.dataset.menu === "true") {
      cssVar = "--carousel-menu-size";
      displayAmount = "--menu-display-number";
      margins = "--menu-margin";
    }
    if (carousel.dataset.alt) {
      cssVar = "--carousel-item-size";
      displayAmount = "--carousel-display-number";
      margins = "--carousel-margin";
    }
    if (carousel.dataset.meal === "true") {
      cssVar = "--carousel-meal-size";
      displayAmount = "--meal-display-number";
      margins = "--meal-margin";
    }
    let slideWidth = +getComputedStyle(document.body)
      .getPropertyValue(cssVar)
      .slice(0, -1);
    margins = +getComputedStyle(document.body).getPropertyValue(margins);

    let side = btn.dataset.side;

    let carouselItems = carousel.childElementCount;

    const skippedSlides = getComputedStyle(document.body).getPropertyValue(
      displayAmount
    );

    let maxSlides = carouselItems - skippedSlides;
    if (side === "prev") {
      // cap with counting
      if (currentSlide == 0) return currentSlide;

      currentSlide++;
      carousel.style.transform = `translateX(${
        (slideWidth + margins) * currentSlide
      }%)`;
    }
    if (side === "next") {
      if (-currentSlide === maxSlides) currentSlide = 0;
      else currentSlide--;

      carousel.style.transform = `translateX(${
        (slideWidth + margins) * currentSlide
      }%)`;
    }
    return currentSlide;
  }
  listenOnCarousels() {
    let currentSlide = 0;
    let currentSlideAlt = 0;
    let currentSlideMenu = 0;
    let currentSlideMeal = 0;
    this.buttonsCarousel.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        let carousel =
          btn.parentNode.parentNode.querySelector(".carousel") ||
          btn.parentNode.parentNode.querySelector(".menu-cards") ||
          btn.parentNode.parentNode.querySelector(".meal--carousel");
        if (carousel.dataset.alt === "alt")
          currentSlideAlt = this.carouselScroll(carousel, currentSlideAlt, btn);
        else if (carousel.dataset.alt !== "alt")
          currentSlide = this.carouselScroll(carousel, currentSlide, btn);
        else if (carousel.dataset.menu === "true") {
          currentSlideMenu = this.carouselScroll(
            carousel,
            currentSlideMenu,
            btn
          );
        } else if (carousel.dataset.meal === "true") {
          currentSlideMenu = this.carouselScroll(
            carousel,
            currentSlideMeal,
            btn
          );
        }
      });
    });
  }
  hideContact(entry, observer) {
    if (entry[0].isIntersecting === false) {
      this.socials.classList.remove("hidden");
    }
    if (entry[0].isIntersecting === true) {
      this.socials.classList.add("hidden");
    }
  }
  observeContact() {
    const observer = new IntersectionObserver(this.hideContact.bind(this), {
      root: null,
      rootMargin: "-50%",
      threshold: 0,
    });
    observer.observe(this.hero);
  }
  toggleLabelTimer() {
    setInterval(() => {
      if (this.contact.classList.contains("hidden--label")) {
        this.contact.classList.remove("hidden--label");
      } else if (this.contact.classList.contains("hidden--label") === false) {
        this.contact.classList.add("hidden--label");
      }
    }, 10000);
  }
  specialCtaScroll() {
    this.showcaseButton.forEach((button) => {
      button.addEventListener("click", () => {
        const scrolledSection = document.querySelector(
          ".section--" + button.dataset.section
        );

        scrollTo({
          behavior: "smooth",
          top: scrolledSection.getBoundingClientRect().top,
        });
      });
    });
  }
  displayChunkedData() {
    for (let i = 0; i <= this.carousels.length - 1; i++) {
      let carousel = this.carousels[i];
      const carouselItems = this._model.shuffleArray(this._model.chunks[i]);

      carousel.innerHTML = "";
      carouselItems.forEach((item) => {
        let innerHTML = `
              <div class="carousel--item">
                      <img src="${item.dishUrl}" class="carousel--img" alt="${item.altText}">
                        <h3 class="carousel-item-title">${item.altText}</h3>
                      <p class="carousel--text">${item.descriptionText}</p>
                    </div>`;
        carousel.insertAdjacentHTML("beforeend", innerHTML);
      });
    }
    this.shuffledDishData = this._model
      .shuffleArray(this._model.dishData)
      .slice(0, this.galleryProducts.length);
  }
  displayGalleryElements() {
    for (let i = 0; i <= this.galleryProducts.length - 1; i++) {
      const product = this.galleryProducts[i];
      const dish = this.shuffledDishData[i];
      product.querySelector("img").src = dish.dishUrl;
      product.querySelector("img").alt = dish.altText;
    }
  }
  displayMeals() {
    this.mealCarousel.innerHTML = "";
    this._model.mealData.forEach((meal) => {
      let html = `
     <div class="meal--card">
            <div class="meal--img"><img src="${meal.mealImage[0]}" alt="${
        meal.altText
      }"></div>
            <div class="meal--para">
              <h4 class="meal--title">${meal.altText}</h4>
              <p class="meal--text">
               ${meal.descriptionText}
              </p>
              <ul class="serving--type">${meal.mealIngredients.map(
                (ingredient) => {
                  return `
                  <li class="serving--feature">
                  <i class="fa-solid fa-bowl-food"></i>
                  <p class="serving--text">${ingredient}</p>
                  </li>
                  `;
                }
              )}</ul>
            </div>
          </div>
    `;
      html = html.replaceAll(",", "");
      this.mealCarousel.insertAdjacentHTML("beforeend", html);
    });
  }
  handleMouseIn(e) {
    const mealImage = e.target.querySelector(".meal--img img");
    const arrayName = mealImage.alt;
    const mealImages = this._model.mealData.filter(
      (meal) => meal.altText === arrayName
    )[0].mealImage;

    const intervalId = setInterval(() => {
      const chosenImage = Math.floor(Math.random() * (mealImages.length - 1));
      mealImage.src = mealImages[chosenImage];
    }, 2000);
    e.target.addEventListener("mouseout", () => {
      clearInterval(intervalId);
      mealImage.src = mealImages[0];
    });
  }

  mealChangingEffect() {
    this.mealCard.forEach((card) => {
      card.addEventListener("mouseenter", this.handleMouseIn.bind(this));
    });
  }
  displayMenus() {
    const menuData = this._model.shuffleArray(this._model.menuData);
    this.menuCards.innerHTML = "";
    menuData.forEach((card) => {
      let html = `
     <div class="menu--card">
            <img
              src="${card.menuImage}"
              class="menu--picture"
              alt="${card.altText}"
            />
          </div>
    `;
      this.menuCards.insertAdjacentHTML("beforeend", html);
    });
  }
  init() {
    this.dynamicSections();
    this.scrollToSection();
    this.listenOnCarousels();
    this.observeContact();
    this.toggleLabelTimer();
    this.specialCtaScroll();
    this.displayChunkedData();
    this.displayGalleryElements();
    this.displayMeals();
    this.mealChangingEffect();
    this.displayMenus();
  }
}
export default View;
