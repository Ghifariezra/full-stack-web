function activeUnderline(hrefItems) {
  document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname;
    
    hrefItems.forEach((link) => {
      // Aktifkan underline berdasarkan path saat ini
      link.classList.toggle("active", link.getAttribute("href") === currentPath);

      link.addEventListener("click", (e) => {
        e.preventDefault();
        
        hrefItems.forEach((nav) => nav.classList.remove("active"));
        link.classList.add("active");

        // Simpan path yang diklik di Session Storage
        sessionStorage.setItem("activeLink", link.getAttribute("href"));

        // Redirect ke halaman yang diklik
        window.location.href = link.href;
      });
    });
  });
}

// Panggil fungsi dengan elemen navigasi
activeUnderline(document.querySelectorAll("nav ul li a"));
