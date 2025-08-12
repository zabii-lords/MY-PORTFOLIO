// app.js — full, final (vanilla JS) for your portfolio site
document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- AOS (scroll animations) ---------------- */
  if (window.AOS) {
    AOS.init({
      once: true,
      duration: 800,
      offset: 100,
    });
  }

  /* ---------------- DARK MODE TOGGLE ---------------- */
  const darkToggle = document.getElementById("darkToggle");
  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      darkToggle.setAttribute(
        "aria-pressed",
        String(document.documentElement.classList.contains("dark"))
      );
    });
  }

  /* ---------------- BACK TO TOP ---------------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    const onScroll = () => {
      backToTop.style.display = window.scrollY > 300 ? "block" : "none";
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  /* ---------------- CURRENT YEAR ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- SKILL BARS (animate on view) ---------------- */
  const skillBars = document.querySelectorAll(".skill .bar > i");
  if (skillBars.length) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const val = entry.target.dataset.value || entry.target.getAttribute("data-value") || "0";
            entry.target.style.width = `${val}%`;
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    skillBars.forEach((b) => skillObserver.observe(b));
  }

  /* ---------------- CERTIFICATIONS: inject buttons if section present ---------------- */
  const certificationsData = [
    {
      title: "Java Programming Course - Master the Fundamentals and Advanced Concepts",
      image: "/cert1.jpg",
    },
    {
      title: "DBMS Course - Master the Fundamentals and Advanced Concepts",
      image: "/cert2.jpg",
    },
    {
      title: "100 Days of Code: The Complete Python Programming Bootcamp",
      image: "/cert3.jpg",
    },
    {
      title: "Certification Appreciation in SPARK 2.0, PROJECT EXPO, LIET",
      image: "/cert4.jpg",
    },
  ];

  const certificationsSection = document.getElementById("certifications");
  if (certificationsSection) {
    // Clear existing content
    certificationsSection.innerHTML = `<h2>Certifications</h2>`;

    // Create container for buttons
    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "20px";
    btnContainer.style.marginTop = "10px";
    btnContainer.style.flexWrap = "wrap";
    btnContainer.style.justifyContent = "center";

    certificationsData.forEach((cert) => {
      const btn = document.createElement("button");
      btn.textContent = cert.title;
      btn.style.padding = "10px 20px";
      btn.style.cursor = "pointer";
      btn.style.minWidth = "220px";
      btn.setAttribute("aria-label", `Open certificate ${cert.title}`);

      // Open certificate image in modal inside the page
      btn.addEventListener("click", () => {
        if (!modalBackdrop) return;
        modalTitle.textContent = cert.title || "";
        modalDesc.textContent = "";
        modalTags.textContent = "";

        modalImage.src = cert.image;
        modalImage.style.display = "block";

        if (modalLive) modalLive.style.display = "none";

        modalBackdrop.classList.add("show");
        modalBackdrop.setAttribute("aria-hidden", "false");

        // focus modal for accessibility
        setTimeout(() => {
          const focusable = modalBackdrop.querySelector("a, button, [tabindex]:not([tabindex='-1'])");
          if (focusable) focusable.focus();
        }, 100);
      });

      btnContainer.appendChild(btn);
    });

    certificationsSection.appendChild(btnContainer);
  }

  /* ---------------- MODAL (projects & certs) ---------------- */
  const modalBackdrop = document.getElementById("modalBackdrop"); // the backdrop element in your HTML
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalTags = document.getElementById("modalTags");
  const modalLive = document.getElementById("modalLive");
  const modalClose = document.getElementById("modalClose");

  // ensure modal image element exists (create if missing)
  let modalImage = document.getElementById("modalImage");
  if (!modalImage && modalBackdrop) {
    // create an img element and insert before modalLive (if exists)
    modalImage = document.createElement("img");
    modalImage.id = "modalImage";
    modalImage.style.width = "100%";
    modalImage.style.borderRadius = "8px";
    modalImage.style.display = "none";
    modalImage.alt = "Preview";
    // find the .modal inside backdrop
    const modalEl = modalBackdrop.querySelector(".modal") || modalBackdrop;
    // try to insert before modalLive if exists
    const liveEl = modalEl.querySelector("#modalLive");
    if (liveEl) modalEl.insertBefore(modalImage, liveEl);
    else modalEl.appendChild(modalImage);
  }

  // Helper to open modal from project or cert cards (if any)
  function openModalFromCard(card) {
    if (!modalBackdrop) return;
    if (modalTitle) modalTitle.textContent = card.dataset.title || "";
    if (modalDesc) modalDesc.textContent = card.dataset.desc || "";
    if (modalTags) modalTags.textContent = card.dataset.tags || "";

    const imageSrc = card.dataset.image || "";
    const linkHref = card.dataset.link || card.dataset.live || "";

    if (imageSrc) {
      modalImage.src = imageSrc;
      modalImage.style.display = "block";
      if (modalLive) modalLive.style.display = "none";
    } else {
      if (modalImage) modalImage.style.display = "none";
      if (modalLive) {
        if (linkHref) {
          modalLive.href = linkHref;
          modalLive.style.display = "inline-block";
        } else {
          modalLive.style.display = "none";
        }
      }
    }

    modalBackdrop.classList.add("show");
    modalBackdrop.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      const focusable = modalBackdrop.querySelector("a, button, [tabindex]:not([tabindex='-1'])");
      if (focusable) focusable.focus();
    }, 100);
  }

  // Attach click listeners to project cards and cert cards if any
  const clickableSelector = ".project-card, .cert-card";
  document.querySelectorAll(clickableSelector).forEach((card) => {
    card.addEventListener("click", () => openModalFromCard(card));
    card.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        card.click();
      }
    });
  });

  // Close modal handlers
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      if (!modalBackdrop) return;
      modalBackdrop.classList.remove("show");
      modalBackdrop.setAttribute("aria-hidden", "true");
      if (modalImage) {
        modalImage.addEventListener(
          "transitionend",
          function clearOnce() {
            if (!modalBackdrop.classList.contains("show")) modalImage.src = "";
            modalImage.removeEventListener("transitionend", clearOnce);
          }
        );
      }
    });
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (ev) => {
      if (ev.target === modalBackdrop) {
        modalBackdrop.classList.remove("show");
        modalBackdrop.setAttribute("aria-hidden", "true");
      }
    });
  }
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && modalBackdrop && modalBackdrop.classList.contains("show")) {
      modalBackdrop.classList.remove("show");
      modalBackdrop.setAttribute("aria-hidden", "true");
    }
  });

  /* ---------------- CONTACT FORM (demo behaviour) ---------------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Message sent! (demo) — Thank you for contacting me.");
      contactForm.reset();
    });
  }

  /* ---------------- OPTIONAL: smooth anchor links ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
});
