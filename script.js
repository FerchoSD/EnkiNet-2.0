document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar elementos del DOM
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const header = document.querySelector("header") || document.querySelector(".site-header");
  const logoContainer = document.querySelector(".logo-container");
  const serviciosCarousel = document.querySelector(".servicios-carousel");
  const productosCarousel = document.querySelector(".productos-carousel");
  const backToTop = document.querySelector(".back-to-top");
  const contactForm = document.getElementById("contactForm");
  const newsletterForm = document.getElementById("newsletterForm");
  const themeBtn = document.getElementById("theme-btn");
  const stats = document.querySelectorAll(".stat-item[data-count]");
  const statsSection = document.querySelector(".nosotros-stats");

  // Determinar en qué página estamos
  const currentPage = window.location.pathname.split("/").pop();
  const isIndexPage = currentPage === "" || currentPage === "index.html";
  const isServiciosPage = currentPage === "servicios.html";
  const isContactoPage = currentPage === "contacto.html";
  const isNosotrosPage = currentPage === "nosotros.html";
  const isCatalogoPage = currentPage === "catalogo.html";

  // Cambio de tema
  if (themeBtn) {
    const updateThemeIcon = () => {
      const isDarkTheme = document.body.classList.contains("dark-theme");
      themeBtn.querySelector("i").classList.remove("fa-sun", "fa-moon");
      themeBtn.querySelector("i").classList.add(isDarkTheme ? "fa-sun" : "fa-moon");
    };

    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(`${savedTheme}-theme`);
    updateThemeIcon();

    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      document.body.classList.toggle("light-theme");
      const newTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      updateThemeIcon();

      // Actualizar el color de las partículas dinámicamente
      const particlesColor = document.body.classList.contains("dark-theme") ? "#ffffff" : "#0052cc";
      if (pJSDom && pJSDom[0]) {
        pJSDom[0].pJS.particles.color.value = particlesColor;
        pJSDom[0].pJS.particles.line_linked.color = particlesColor;
        pJSDom[0].pJS.fn.particlesRefresh();
      }
    });
  }

  // Menú móvil
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.querySelector("i").classList.toggle("fa-bars");
      menuToggle.querySelector("i").classList.toggle("fa-times");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.querySelector("i").classList.add("fa-bars");
        menuToggle.querySelector("i").classList.remove("fa-times");
      });
    });
  }

  // Header dinámico / Mini logo
  if (header && logoContainer) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        logoContainer.classList.add("shrink");
        header.classList.add("scrolled");
      } else {
        logoContainer.classList.remove("shrink");
        header.classList.remove("scrolled");
      }
    });
  }

  // Carruseles funcionales
  const initCarousel = (carouselSelector, prevSelector, nextSelector) => {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return;
    
    const prevBtn = document.querySelector(prevSelector);
    const nextBtn = document.querySelector(nextSelector);
    if (!prevBtn || !nextBtn) return;
    
    const items = carousel.children;
    if (!items || items.length === 0) return;
    
    let currentIndex = 0;
    let itemWidth = 0;
    let visibleItems = 3;

    const updateCarousel = () => {
      itemWidth = items[0].offsetWidth + 30;
      const windowWidth = window.innerWidth;
      visibleItems = windowWidth > 1200 ? 3 : windowWidth > 768 ? 2 : 1;
      carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    };

    updateCarousel();

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentIndex < items.length - 1) {
        currentIndex++;
        updateCarousel();
      }
    });

    window.addEventListener("resize", updateCarousel);
  };

  if (serviciosCarousel && (isIndexPage || isServiciosPage)) {
    initCarousel(
      ".servicios-carousel",
      ".servicios .carousel-btn.prev",
      ".servicios .carousel-btn.next"
    );
  }

  if (productosCarousel && (isIndexPage || isCatalogoPage)) {
    initCarousel(
      ".productos-carousel",
      ".catalogo .carousel-btn.prev",
      ".catalogo .carousel-btn.next"
    );
  }

  // Animaciones al hacer scroll con IntersectionObserver
  const animateOnScroll = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate__animated");
        if (entry.target.classList.contains("fade-left")) {
          entry.target.classList.add("animate__fadeInLeft");
        } else if (entry.target.classList.contains("fade-right")) {
          entry.target.classList.add("animate__fadeInRight");
        } else if (entry.target.classList.contains("zoom-in")) {
          entry.target.classList.add("animate__zoomIn");
        } else {
          entry.target.classList.add("animate__fadeInUp");
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  animateOnScroll.forEach(el => observer.observe(el));

  // Contadores animados en la sección de Nosotros
  if (statsSection && stats.length > 0 && (isIndexPage || isNosotrosPage)) {
    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stats.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            let count = 0;
            const increment = target / 50;
            const updateCount = () => {
              count += increment;
              if (count >= target) {
                stat.querySelector(".stat-number").textContent = target;
              } else {
                stat.querySelector(".stat-number").textContent = Math.ceil(count);
                requestAnimationFrame(updateCount);
              }
            };
            updateCount();
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // Botón de volver arriba
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });
  }

  // Fondo interactivo con partículas
  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 120, density: { enable: true, value_area: 800 } },
        color: { value: document.body.classList.contains("dark-theme") ? "#ffffff" : "#0052cc" },
        shape: { type: "circle" },
        opacity: { value: 0.8, random: true },
        size: { value: 5, random: true },
        line_linked: { enable: true, distance: 150, color: document.body.classList.contains("dark-theme") ? "#ffffff" : "#0052cc", opacity: 0.7, width: 2 },
        move: { enable: true, speed: 4, direction: "none", random: false, straight: false, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }

  // Scroll suave para enlaces de navegación
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId.length > 1 && targetId.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.getElementById(targetId.substring(1));
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 60,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Función para desplazarse a un servicio específico
  window.scrollToService = (index) => {
    const currentPageHasCarousel = document.querySelector(".servicios-carousel");
    
    if (!currentPageHasCarousel) {
      if (!isServiciosPage) {
        window.location.href = `servicios.html#servicios`;
        // Guardar el índice en sessionStorage para usarlo después de la redirección
        sessionStorage.setItem('targetServiceIndex', index);
        return;
      }
    }

    const carousel = document.querySelector(".servicios-carousel");
    if (!carousel) return;
    
    const items = carousel.children;
    if (!items || items.length === 0) return;
    
    const itemWidth = items[0].offsetWidth + 30;
    carousel.scrollTo({
      left: index * itemWidth,
      behavior: "smooth",
    });

    const serviciosSection = document.getElementById("servicios");
    if (serviciosSection) {
      window.scrollTo({
        top: serviciosSection.offsetTop - 60,
        behavior: "smooth",
      });
    }
  };
  
  // Función para desplazarse a un producto específico en el catálogo
  window.scrollToProduct = (index) => {
    const currentPageHasCarousel = document.querySelector(".productos-carousel");
    
    if (!currentPageHasCarousel) {
      if (!isCatalogoPage) {
        window.location.href = `catalogo.html#catalogo`;
        // Guardar el índice en sessionStorage para usarlo después de la redirección
        sessionStorage.setItem('targetProductIndex', index);
        return;
      }
    }

    const carousel = document.querySelector(".productos-carousel");
    if (!carousel) return;
    
    const items = carousel.children;
    if (!items || items.length === 0) return;
    
    const itemWidth = items[0].offsetWidth + 30;
    carousel.scrollTo({
      left: index * itemWidth,
      behavior: "smooth",
    });

    const catalogoSection = document.getElementById("catalogo");
    if (catalogoSection) {
      window.scrollTo({
        top: catalogoSection.offsetTop - 60,
        behavior: "smooth",
      });
    }
  };
  
  // Verificar si tenemos un índice guardado después de redirección
  if (isServiciosPage) {
    const targetServiceIndex = sessionStorage.getItem('targetServiceIndex');
    if (targetServiceIndex !== null) {
      // Esperar a que la página se cargue completamente
      setTimeout(() => {
        scrollToService(parseInt(targetServiceIndex));
        sessionStorage.removeItem('targetServiceIndex');
      }, 500);
    }
  }
  
  if (isCatalogoPage) {
    const targetProductIndex = sessionStorage.getItem('targetProductIndex');
    if (targetProductIndex !== null) {
      // Esperar a que la página se cargue completamente
      setTimeout(() => {
        scrollToProduct(parseInt(targetProductIndex));
        sessionStorage.removeItem('targetProductIndex');
      }, 500);
    }
  }

  // Formulario de newsletter
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletterEmail");
      if (!email.value) {
        email.classList.add("error");
        return;
      }
      email.classList.remove("error");
      alert(`Gracias por suscribirte con el correo: ${email.value}`);
      newsletterForm.reset();
    });
  }

  // Formulario de contacto
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");
      const terms = document.getElementById("terms");

      let hasError = false;
      if (!name.value) {
        name.classList.add("error");
        hasError = true;
      } else {
        name.classList.remove("error");
      }
      if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add("error");
        hasError = true;
      } else {
        email.classList.remove("error");
      }
      if (!message.value) {
        message.classList.add("error");
        hasError = true;
      } else {
        message.classList.remove("error");
      }
      if (!terms.checked) {
        terms.classList.add("error");
        hasError = true;
      } else {
        terms.classList.remove("error");
      }

      if (hasError) return;

      alert(`Mensaje enviado:\nNombre: ${data.name}\nEmail: ${data.email}\nMensaje: ${data.message}`);
      contactForm.reset();
    });
  }

  // Lazy Loading
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.addEventListener("load", () => img.classList.add("lazyloaded"));
    if (img.complete) img.classList.add("lazyloaded");
  });

  // Efecto parallax en el banner
  const bannerImage = document.querySelector(".banner-image");
  if (bannerImage) {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY;
      bannerImage.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    });
  }
});

// Ocultar el preloader cuando todo esté cargado
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }
});