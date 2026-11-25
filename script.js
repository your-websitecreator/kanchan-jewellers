/* ==========================================================================
   KANCHAN JEWELLERS — INTERACTIVE SCRIPTS
   Edit WhatsApp number, store hours, and timezone configuration below.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. BUSINESS CONFIGURATION (Edit phone number or hours here)
     ------------------------------------------------------------------------ */
  const CONFIG = {
    whatsappNumber: "919892993298", // Country code + 10-digit mobile number
    timeZone: "Asia/Kolkata",
    closedDay: 1, // 0 = Sunday, 1 = Monday, 2 = Tuesday ... 6 = Saturday
    openHour: 10,
    openMinute: 0, // 10:00 AM
    closeHour: 21,
    closeMinute: 45 // 9:45 PM
  };

  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     2. SCROLL PROGRESS BAR & STICKY HEADER SHADOW
     ------------------------------------------------------------------------ */
  function initScrollChrome() {
    const progressBar = document.getElementById("scrollProgressBar");
    const header = document.getElementById("siteHeader");

    if (!progressBar && !header) {
      return;
    }

    function updateScrollUI() {
      const scrollTop = window.scrollY || window.pageYOffset || 0;

      if (header) {
        header.classList.toggle("is-scrolled", scrollTop > 12);
      }

      if (progressBar) {
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
        progressBar.style.width = progress.toFixed(2) + "%";
      }
    }

    updateScrollUI();
    window.addEventListener("scroll", updateScrollUI, { passive: true });
    window.addEventListener("resize", updateScrollUI, { passive: true });
  }

  /* ------------------------------------------------------------------------
     3. MOBILE SLIDE-DOWN NAVIGATION MENU
     ------------------------------------------------------------------------ */
  function initMobileMenu() {
    const navToggle = document.getElementById("navToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!navToggle || !mobileMenu) {
      return;
    }

    let closeTimer = null;

    function openMenu() {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      mobileMenu.hidden = false;
      navToggle.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close navigation menu");

      window.requestAnimationFrame(function () {
        mobileMenu.classList.add("is-open");
      });
    }

    function closeMenu() {
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation menu");
      mobileMenu.classList.remove("is-open");

      if (prefersReducedMotion) {
        mobileMenu.hidden = true;
      } else {
        closeTimer = window.setTimeout(function () {
          if (!mobileMenu.classList.contains("is-open")) {
            mobileMenu.hidden = true;
          }
        }, 350);
      }
    }

    navToggle.addEventListener("click", function () {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    const mobileLinks = mobileMenu.querySelectorAll(".mobile-nav-link");
    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 980 && navToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. ACTIVE NAVIGATION LINK HIGHLIGHT ON SCROLL
     ------------------------------------------------------------------------ */
  function initActiveNavOnScroll() {
    const navLinks = document.querySelectorAll("[data-section]");
    if (!navLinks.length) {
      return;
    }

    const sectionIds = Array.from(
      new Set(
        Array.from(navLinks)
          .map(function (el) {
            return el.getAttribute("data-section");
          })
          .filter(Boolean)
      )
    );

    const sections = sectionIds
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!sections.length) {
      return;
    }

    function setActiveLink(activeId) {
      navLinks.forEach(function (link) {
        const isMatch = link.getAttribute("data-section") === activeId;
        link.classList.toggle("active", isMatch);
      });
    }

    function updateActiveSection() {
      const header = document.getElementById("siteHeader");
      const offset = (header ? header.offsetHeight : 76) + 32;
      const scrollY = window.scrollY || window.pageYOffset || 0;

      // If near the very bottom of the page, highlight the last section
      if (
        window.innerHeight + scrollY >=
        document.documentElement.scrollHeight - 40
      ) {
        setActiveLink(sections[sections.length - 1].id);
        return;
      }

      let currentSectionId = sections[0].id;

      for (let i = 0; i < sections.length; i += 1) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= offset) {
          currentSectionId = sections[i].id;
        }
      }

      setActiveLink(currentSectionId);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
  }

  /* ------------------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!revealItems.length) {
      return;
    }

    if (prefersReducedMotion || typeof IntersectionObserver !== "function") {
      revealItems.forEach(function (item) {
        item.classList.add("is-revealed");
      });
      return;
    }

    document.documentElement.classList.add("js-reveal-ready");

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -36px 0px"
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ------------------------------------------------------------------------
     6. LIVE STORE HOURS & TODAY HIGHLIGHT (Asia/Kolkata)
     ------------------------------------------------------------------------ */
  function getIndiaTimeParts() {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: CONFIG.timeZone,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });

      const parts = formatter.formatToParts(new Date());
      const map = {};
      parts.forEach(function (part) {
        map[part.type] = part.value;
      });

      const weekdayLookup = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6
      };

      const day = weekdayLookup[map.weekday];
      let hour = parseInt(map.hour, 10);
      const minute = parseInt(map.minute, 10);

      if (hour === 24) {
        hour = 0;
      }

      if (typeof day === "number" && !Number.isNaN(hour) && !Number.isNaN(minute)) {
        return { day: day, hour: hour, minute: minute };
      }
    } catch (e) {
      // Fallback to local clock if Intl timeZone is unavailable
    }

    const now = new Date();
    return {
      day: now.getDay(),
      hour: now.getHours(),
      minute: now.getMinutes()
    };
  }

  function initStoreHoursStatus() {
    const hoursTable = document.getElementById("hoursTable");
    const statusBadge = document.getElementById("storeStatusBadge");

    if (!hoursTable && !statusBadge) {
      return;
    }

    function updateStoreHours() {
      const ist = getIndiaTimeParts();
      const currentMinutes = ist.hour * 60 + ist.minute;
      const openMinutes = CONFIG.openHour * 60 + CONFIG.openMinute;
      const closeMinutes = CONFIG.closeHour * 60 + CONFIG.closeMinute;

      if (hoursTable) {
        const rows = hoursTable.querySelectorAll("tr[data-day]");
        rows.forEach(function (row) {
          const rowDay = parseInt(row.getAttribute("data-day"), 10);
          row.classList.toggle("is-today", rowDay === ist.day);
        });
      }

      if (statusBadge) {
        const isOpenToday = ist.day !== CONFIG.closedDay;
        const isWithinHours =
          currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
        const isOpenNow = isOpenToday && isWithinHours;

        statusBadge.textContent = isOpenNow ? "Open Now" : "Closed Now";
        statusBadge.classList.toggle("status-badge--open", isOpenNow);
        statusBadge.classList.toggle("status-badge--closed", !isOpenNow);
      }
    }

    updateStoreHours();
    window.setInterval(updateStoreHours, 60000);
  }

  /* ------------------------------------------------------------------------
     7. GALLERY LIGHTBOX (Click, Keyboard, Outside Click & Touch Swipe)
     ------------------------------------------------------------------------ */
  function initGalleryLightbox() {
    const galleryButtons = Array.from(
      document.querySelectorAll(".gallery-card-btn")
    );
    const lightbox = document.getElementById("galleryLightbox");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxFallback = document.getElementById("lightboxFallback");
    const lightboxFallbackTitle = document.getElementById("lightboxFallbackTitle");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxCounter = document.getElementById("lightboxCounter");

    if (!galleryButtons.length || !lightbox || !lightboxImg) {
      return;
    }

    const items = galleryButtons.map(function (btn) {
      const img = btn.querySelector("img");
      return {
        src: btn.getAttribute("data-src") || (img ? img.getAttribute("src") : ""),
        caption: btn.getAttribute("data-caption") || (img ? img.getAttribute("alt") : ""),
        alt: img ? img.getAttribute("alt") : ""
      };
    });

    let currentIndex = 0;
    let lastFocusedElement = null;
    let touchStartX = 0;
    let touchEndX = 0;

    function renderSlide(index) {
      currentIndex = (index + items.length) % items.length;
      const item = items[currentIndex];

      if (lightboxFallback) {
        lightboxFallback.hidden = true;
      }
      if (lightboxFallbackTitle) {
        lightboxFallbackTitle.textContent = item.caption || "Kanchan Jewellers";
      }

      lightboxImg.hidden = false;
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt || item.caption || "Kanchan Jewellers piece";

      if (lightboxCaption) {
        lightboxCaption.textContent = item.caption || "";
      }
      if (lightboxCounter) {
        lightboxCounter.textContent = currentIndex + 1 + " / " + items.length;
      }
    }

    function openLightbox(index) {
      lastFocusedElement = document.activeElement;
      renderSlide(index);
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");

      if (lightboxClose) {
        lightboxClose.focus();
      }
    }

    function closeLightbox() {
      if (lightbox.hidden) {
        return;
      }
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");

      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    }

    galleryButtons.forEach(function (btn, idx) {
      btn.addEventListener("click", function () {
        const attrIndex = parseInt(btn.getAttribute("data-gallery-index"), 10);
        openLightbox(Number.isNaN(attrIndex) ? idx : attrIndex);
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", function () {
        renderSlide(currentIndex - 1);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener("click", function () {
        renderSlide(currentIndex + 1);
      });
    }

    // Close when clicking the dark backdrop outside the image/controls
    lightbox.addEventListener("click", function (event) {
      const target = event.target;
      const clickedBackdrop =
        target === lightbox ||
        target.classList.contains("lightbox-dialog") ||
        target.classList.contains("lightbox-stage");

      if (clickedBackdrop) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (lightbox.hidden) {
        return;
      }
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        renderSlide(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        renderSlide(currentIndex + 1);
      }
    });

    // Swipe navigation for touch screens
    lightbox.addEventListener(
      "touchstart",
      function (event) {
        if (event.changedTouches && event.changedTouches.length) {
          touchStartX = event.changedTouches[0].screenX;
        }
      },
      { passive: true }
    );

    lightbox.addEventListener(
      "touchend",
      function (event) {
        if (!event.changedTouches || !event.changedTouches.length) {
          return;
        }
        touchEndX = event.changedTouches[0].screenX;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) > 45) {
          if (deltaX < 0) {
            renderSlide(currentIndex + 1);
          } else {
            renderSlide(currentIndex - 1);
          }
        }
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------------
     8. CONTACT FORM VALIDATION & WHATSAPP SUBMISSION
     ------------------------------------------------------------------------ */
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) {
      return;
    }

    const nameInput = document.getElementById("contactName");
    const phoneInput = document.getElementById("contactPhone");
    const messageInput = document.getElementById("contactMessage");

    const nameError = document.getElementById("nameError");
    const phoneError = document.getElementById("phoneError");
    const messageError = document.getElementById("messageError");
    const formStatus = document.getElementById("formStatus");

    function setFieldError(inputEl, errorEl, message) {
      if (inputEl) {
        inputEl.classList.toggle("is-invalid", Boolean(message));
        inputEl.setAttribute("aria-invalid", message ? "true" : "false");
      }
      if (errorEl) {
        errorEl.textContent = message;
      }
    }

    function showStatus(text, isError) {
      if (!formStatus) {
        return;
      }
      formStatus.textContent = text;
      formStatus.classList.toggle("form-status--error", Boolean(isError));
      formStatus.classList.toggle("form-status--success", !isError);
      formStatus.hidden = false;
    }

    function clearFieldOnInput(inputEl, errorEl) {
      if (!inputEl) {
        return;
      }
      inputEl.addEventListener("input", function () {
        setFieldError(inputEl, errorEl, "");
        if (formStatus) {
          formStatus.hidden = true;
        }
      });
    }

    clearFieldOnInput(nameInput, nameError);
    clearFieldOnInput(phoneInput, phoneError);
    clearFieldOnInput(messageInput, messageError);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = nameInput ? nameInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      let isValid = true;

      if (name.length < 2) {
        setFieldError(nameInput, nameError, "Please enter your name.");
        isValid = false;
      } else {
        setFieldError(nameInput, nameError, "");
      }

      const digitsOnly = phone.replace(/\D/g, "");
      if (digitsOnly.length < 10 || digitsOnly.length > 13) {
        setFieldError(
          phoneInput,
          phoneError,
          "Please enter a valid 10-digit phone number."
        );
        isValid = false;
      } else {
        setFieldError(phoneInput, phoneError, "");
      }

      if (message.length < 5) {
        setFieldError(
          messageInput,
          messageError,
          "Please share a short message about your enquiry."
        );
        isValid = false;
      } else {
        setFieldError(messageInput, messageError, "");
      }

      if (!isValid) {
        showStatus("Please check the highlighted fields above.", true);
        return;
      }

      const whatsappText =
        "Hello Kanchan Jewellers!\n\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Message: " + message;

      const whatsappUrl =
        "https://wa.me/" +
        CONFIG.whatsappNumber +
        "?text=" +
        encodeURIComponent(whatsappText);

      showStatus("Opening WhatsApp...", false);

      const openedWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!openedWindow) {
        window.location.href = whatsappUrl;
      }
    });
  }

  /* ------------------------------------------------------------------------
     9. BACK TO TOP BUTTON
     ------------------------------------------------------------------------ */
  function initBackToTop() {
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (!backToTopBtn) {
      return;
    }

    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  }

  /* ------------------------------------------------------------------------
     INITIALIZE ALL FEATURES ON DOM READY
     ------------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initScrollChrome();
    initMobileMenu();
    initActiveNavOnScroll();
    initScrollReveal();
    initStoreHoursStatus();
    initGalleryLightbox();
    initContactForm();
    initBackToTop();
  });
})();