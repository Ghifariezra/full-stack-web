document.addEventListener("DOMContentLoaded", () => {
  // Fungsi untuk Toggle Navigasi
  function toggleNav(toggle, nav, hero) {
    if (!toggle || !nav || !hero) {
      console.error("One or more elements not found! Toggle function aborted.");
      return;
    }

    toggle.addEventListener("click", () => {
      try {
        nav.classList.toggle("nav-links");
        hero.classList.toggle("gapnav");
      } catch (error) {
        console.error("Error toggling navigation:", error);
        const fallbackHero = document.querySelector("body main section:nth-child(2)");
        fallbackHero?.classList.toggle("gapnav");
      }
    });
  }

  // Ambil elemen menu navigasi
  const menuToggle = document.querySelector("nav .menu-toggle input");
  const navLink = document.querySelector("nav ul");
  let content = document.querySelector("section#hero") || document.querySelector("body main section:nth-child(2)");

  toggleNav(menuToggle, navLink, content);

  // ==============================
  // 🔄 Terapkan Navbar dari sessionStorage
  // ==============================
  const savedNavbarState = sessionStorage.getItem("navbarState");
  const homeButton = document.querySelector("nav ul li:nth-child(1) a");
  const articleButton = document.querySelector("nav ul li:nth-child(2) a");
  const signInButton = document.getElementById("outline-button");
  const signUpButton = document.getElementById("primary-button");

  if (savedNavbarState) {
    const navbarState = JSON.parse(savedNavbarState);

    if (homeButton && articleButton && signInButton && signUpButton) {
      homeButton.href = navbarState.homeHref;
      articleButton.href = navbarState.articleHref;
      signInButton.querySelector("a").textContent = navbarState.signInText;
      signUpButton.querySelector("a").textContent = navbarState.signUpText;
      signUpButton.querySelector("a").href = navbarState.signUpHref;

      console.log("🔄 Navbar state diterapkan dari sessionStorage.");

      // Pastikan posisi tombol tetap benar
      const parent = signUpButton.parentElement;
      if (parent) {
        parent.insertBefore(signInButton, signUpButton.nextSibling);
        console.log("✔️ Posisi tombol Sign In diperbaiki.");
      }
    }
  }

  // ==============================
  // 🔥 Pindah Posisi Sign In & Sign Up untuk Dashboard & Post Blog
  // ==============================
  const currentPath = window.location.pathname;
  console.log("Current Path:", currentPath);

  if (currentPath.includes("/dashboard") || currentPath.includes("/post-blog")) {
    if (homeButton && articleButton && signInButton && signUpButton) {
      homeButton.href = "/dashboard";
      articleButton.href = "/article";
      signInButton.querySelector("a").textContent = "Logout";
      signUpButton.querySelector("a").textContent = "Post Blog";
      signUpButton.querySelector("a").href = "/post-blog";

      // Simpan perubahan navbar ke sessionStorage
      sessionStorage.setItem("navbarState", JSON.stringify({
        homeHref: "/dashboard",
        articleHref: "/article",
        signInText: "Logout",
        signUpText: "Post Blog",
        signUpHref: "/post-blog"
      }));

      const parent = signUpButton.parentElement;
      if (parent) {
        parent.insertBefore(signInButton, signUpButton.nextSibling);
        console.log("✔️ Tombol Sign In dipindahkan setelah Sign Up.");
      } else {
        console.error("❌ Parent element tidak ditemukan.");
      }
    } else {
      console.error("❌ Salah satu elemen navbar tidak ditemukan.");
    }
  }

  // ==============================
  // 🚀 Fungsi Logout (Hapus Session + Redirect ke Home)
  // ==============================
  function logout() {
    sessionStorage.clear(); // Hapus semua sessionStorage
    localStorage.clear(); // Jika ada localStorage, hapus juga
    window.location.href = "/"; // Redirect ke halaman home
  }

  // Tambahkan event listener untuk logout jika tombolnya ada
  if (signInButton) {
    const signInLink = signInButton.querySelector("a");

    if (signInLink.textContent.trim() === "Logout") {
      signInLink.addEventListener("click", (event) => {
        event.preventDefault(); // Cegah navigasi default
        logout(); // Panggil fungsi logout
      });
    }
  }
});
