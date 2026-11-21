(function () {
  const CHECKLIST = "https://calmcaninedaily.systeme.io/free-checklist";
  const STORAGE_KEY = "ccd-popup-dismissed";
  const WEEK = 7 * 24 * 60 * 60 * 1000;

  const path = location.pathname;
  const noPopup = /thank-you|free-checklist/.test(path);

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("nav.primary");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  const sticky = document.querySelector(".sticky-bar");
  const stickyDismiss = document.querySelector(".sticky-bar .dismiss");
  let stickyClosed = sessionStorage.getItem("ccd-sticky-closed") === "1";
  function maybeSticky() {
    if (!sticky || stickyClosed) return;
    const doc = document.documentElement;
    const scrolled = (doc.scrollTop || document.body.scrollTop) / ((doc.scrollHeight - doc.clientHeight) || 1);
    if (scrolled >= 0.4) sticky.classList.add("is-on");
  }
  if (stickyDismiss) {
    stickyDismiss.addEventListener("click", function () {
      stickyClosed = true;
      sticky.classList.remove("is-on");
      sessionStorage.setItem("ccd-sticky-closed", "1");
    });
  }
  window.addEventListener("scroll", maybeSticky, { passive: true });

  const popupBack = document.querySelector(".popup-back");
  function hidePopup() {
    if (!popupBack) return;
    popupBack.classList.remove("is-on");
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }
  function showPopup() {
    if (!popupBack || noPopup) return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && Date.now() - Number(raw) < WEEK) return;
    popupBack.classList.add("is-on");
  }
  if (popupBack) {
    popupBack.addEventListener("click", function (e) {
      if (e.target === popupBack) hidePopup();
    });
    const closer = popupBack.querySelector(".close");
    if (closer) closer.addEventListener("click", hidePopup);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hidePopup();
    });
    let armed = false;
    setTimeout(function () { armed = true; showPopup(); }, 45000);
    window.addEventListener("scroll", function () {
      if (armed) return;
      const doc = document.documentElement;
      const scrolled = (doc.scrollTop || document.body.scrollTop) / ((doc.scrollHeight - doc.clientHeight) || 1);
      if (scrolled >= 0.5) { armed = true; showPopup(); }
    }, { passive: true });
    document.addEventListener("mouseout", function (e) {
      if (armed) return;
      if (e.clientY <= 0) { armed = true; showPopup(); }
    });
  }

  // Style product / checklist links that aren't already buttons
  document.querySelectorAll(".box-checklist a, .box-product a, .side-card a[href*='systeme'], .side-card a[href*='/go/']").forEach(function (a) {
    if (!a.classList.contains("btn")) a.classList.add("btn");
    if (a.getAttribute("href") && a.getAttribute("href").indexOf("/go/") !== -1) {
      a.setAttribute("rel", "sponsored nofollow");
      a.classList.add("btn-gold");
    }
  });
})();
