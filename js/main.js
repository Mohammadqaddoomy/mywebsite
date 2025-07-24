document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu functionality
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".nav");

  menuButton.addEventListener("click", () => {
    menuButton.classList.toggle("active");
    nav.classList.toggle("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !menuButton.contains(e.target)) {
      menuButton.classList.remove("active");
      nav.classList.remove("active");
    }
  });

  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.classList.remove("active");
      nav.classList.remove("active");
    });
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Intersection Observer for animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  // Observe feature cards and about sections
  document
    .querySelectorAll(".feature-card, .text-content, .image-content")
    .forEach((element) => {
      observer.observe(element);
    });

  // Contact form handling
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const submitButton = contactForm.querySelector(".submit-button");
    const formStatus = contactForm.querySelector(".form-status");

    const validateForm = () => {
      let isValid = true;
      const errors = {};

      contactForm.querySelectorAll('[data-error]').forEach(errorElement => {
        errorElement.textContent = "";
        errorElement.classList.remove("visible");
      });

      // Name validation
      const name = contactForm.querySelector("#name").value.trim();
      if (!name) {
        errors.name = "الرجاء إدخال الاسم";
        isValid = false;
      }

      // Email validation
      const email = contactForm.querySelector("#email").value.trim();
      if (!email) {
        errors.email = "الرجاء إدخال البريد الإلكتروني";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "الرجاء إدخال بريد إلكتروني صحيح";
        isValid = false;
      }

      // Message validation
      const message = contactForm.querySelector("#message").value.trim();
      if (!message) {
        errors.message = "الرجاء إدخال رسالتك";
        isValid = false;
      }

      // Display errors
      Object.keys(errors).forEach((field) => {
        const errorElement = contactForm.querySelector(
          `[data-error="${field}"]`
        );
        if (errorElement) {
          errorElement.textContent = errors[field];
          errorElement.classList.add("visible");
        }
      });

      return isValid;
    };

    // Clear errors when typing
    contactForm.querySelectorAll(".form-input").forEach((input) => {
      input.addEventListener("input", () => {
        const errorElement = contactForm.querySelector(
          `[data-error="${input.name}"]`
        );
        if (errorElement) {
          errorElement.textContent = "";
          errorElement.classList.remove("visible");
        }
      });
    });

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Clear previous status
      formStatus.className = "form-status";
      formStatus.textContent = "";

      if (!validateForm()) {
        return;
      }

      // Show loading state
      submitButton.disabled = true;
      submitButton.classList.add("loading");

      try {
        // Simulate form submission
        const formData = new FormData(contactForm);
      
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (response.ok) {
          // Show success message
          formStatus.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا</span>
          `;
          formStatus.classList.add("success");
          contactForm.reset();

        // Remove success message after 5 seconds with fade out
        setTimeout(() => {
          formStatus.style.transition = "all 0.5s ease";
          formStatus.style.opacity = "0";
          formStatus.style.transform = "translateY(-20px)";
          setTimeout(() => {
            formStatus.classList.remove("success");
            formStatus.innerHTML = "";
            formStatus.style.opacity = "1";
            formStatus.style.transform = "";
          }, 500);
        }, 5000);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'حدث خطأ في الإرسال');
      }
      } catch (error) {
        // Show error message
        formStatus.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <span>عذراً، حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.</span>
                `;
        formStatus.classList.add("error");
      } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.classList.remove("loading");
      }
    });
  }

  // إضافة زر تبديل الوضع في الهيدر
  const header = document.querySelector('.header .container');
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.title = 'تبديل الوضع';
  themeToggle.innerHTML = '<span class="theme-icon">🌙</span>';
  // أعد الزر إلى نهاية عناصر الهيدر
  header.appendChild(themeToggle);

  // تفعيل الوضع المحفوظ أو الافتراضي
  function setTheme(mode) {
    document.body.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
    themeToggle.querySelector('.theme-icon').textContent = mode === 'dark' ? '☀️' : '🌙';
  }
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) setTheme(savedTheme);

  // تبديل الوضع عند الضغط
  themeToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(current);
  });
  
}
);
