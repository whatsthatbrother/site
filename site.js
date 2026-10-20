// Fills the page from site.json — edit that file to change text, services, prices, work and contact links.
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // calm the diagram for people who prefer less motion
  var topo = $("topo");
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches && topo.pauseAnimations) {
    topo.pauseAnimations();
  }

  var CHANNELS = [
    ["email", "Email me", function (v) { return "mailto:" + v; }],
    ["whatsapp", "WhatsApp", function (v) { return "https://wa.me/" + String(v).replace(/[^0-9]/g, ""); }],
    ["linkedin", "LinkedIn", function (v) { return v; }],
    ["upwork", "Upwork", function (v) { return v; }]
  ];

  function render(d) {
    var p = d.profile || {}, c = p.contact || {};
    document.title = p.name + " — " + p.role;
    $("name").textContent = $("foot-name").textContent = p.name || "";
    $("headline").textContent = p.headline || "";
    $("intro").textContent = p.intro || "";
    $("yr").textContent = new Date().getFullYear();
    if (p.available === false) {
      $("status").classList.add("off");
      $("status").lastChild.textContent = "Fully booked for now";
    }
    if (c.email) $("hero-mail").href = "mailto:" + c.email;

    $("rates").innerHTML = (d.services || []).map(function (s) {
      var price = s.price
        ? '<div class="price">' + esc(s.price) + "</div>"
        : '<div class="price ask"><a href="#contact">Ask for a price</a></div>';
      return '<div class="rate"><h3>' + esc(s.name) + "</h3><p>" + esc(s.what) + "</p>" + price + "</div>";
    }).join("");

    var projects = d.projects || [];
    if (projects.length) {
      $("work").hidden = false;
      $("projects").innerHTML = projects.map(function (pr) {
        return '<article class="proj">' + (pr.image ? '<img src="' + esc(pr.image) + '" alt="" loading="lazy">' : "<div></div>") +
          "<div><h3>" + esc(pr.name) + "</h3><p>" + esc(pr.what || pr.short || "") + "</p>" +
          (pr.link ? '<a href="' + esc(pr.link) + '">View project</a>' : "") + "</div></article>";
      }).join("");
    }

    $("skills-list").innerHTML = (d.skills || []).map(function (s) { return "<span>" + esc(s) + "</span>"; }).join(" ");

    var links = CHANNELS.filter(function (ch) { return c[ch[0]]; }).map(function (ch, i) {
      return '<a class="btn ' + (i === 0 ? "solid" : "line") + '" href="' + esc(ch[2](c[ch[0]])) + '" target="_blank" rel="noopener">' + ch[1] + "</a>";
    });
    $("contacts").innerHTML = links.length ? links.join("")
      : '<span class="empty">Add your email, WhatsApp, LinkedIn or Upwork to site.json and the buttons appear here.</span>';
  }

  fetch("site.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(render).catch(function () {});
})();
