// Detects the visitor's OS, auto-triggers the vCard download, and shows
// OS-appropriate fallback instructions. The "Save contact" button always
// works as a manual fallback if the auto-trigger is blocked by the browser.

(function () {
  "use strict";

  var VCARD_URL = "contact.vcf";

  function detectOS() {
    var ua = navigator.userAgent || "";
    var platform = navigator.platform || "";

    // iPadOS 13+ reports a desktop Safari UA, so also check touch points.
    var isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) return "ios";
    if (/Android/.test(ua)) return "android";
    return "desktop";
  }

  function setHint(text) {
    var hint = document.getElementById("hint");
    if (hint) hint.textContent = text;
  }

  // Build initials from the displayed name (used when photo.jpg is missing).
  function setInitials() {
    var nameEl = document.getElementById("name");
    var initialsEl = document.getElementById("initials");
    if (!nameEl || !initialsEl) return;
    var parts = nameEl.textContent.trim().split(/\s+/);
    var initials = parts.slice(0, 2).map(function (p) {
      return p.charAt(0).toUpperCase();
    }).join("");
    if (initials) initialsEl.textContent = initials;
  }

  function triggerDownload(os) {
    if (os === "ios") {
      // Navigating to the .vcf opens the native "Add Contact" screen in Safari.
      window.location.href = VCARD_URL;
      return;
    }
    // Android / desktop: programmatically click the download link.
    var link = document.getElementById("save-btn");
    if (link) link.click();
  }

  function run() {
    setInitials();
    var os = detectOS();

    if (os === "ios") {
      setHint("Opening your contact card… If nothing happens, tap “Save contact”, then “Add Contact”.");
    } else if (os === "android") {
      setHint("Downloading your contact… Tap the downloaded file, then “Import” to save it.");
    } else {
      setHint("Tap “Save contact” to download the .vcf and import it into your contacts.");
    }

    // Give the page a moment to paint before firing the auto-download.
    if (os === "ios" || os === "android") {
      setTimeout(function () {
        triggerDownload(os);
      }, 700);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
