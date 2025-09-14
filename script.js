// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functionality
  initializeLoading()
  initializeNavigation()
  initializeScrollAnimations()
  initializePortfolioFilter()
  initializeContactForm()
  initializeSmoothScroll()
})

// Loading Screen
function initializeLoading() {
  const loadingScreen = document.getElementById("loading-screen")

  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingScreen.classList.add("fade-out")
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }, 1000)
  })
}

// Navigation
function initializeNavigation() {
  const navbar = document.getElementById("navbar")
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Mobile menu toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })

  // Active navigation link
  window.addEventListener("scroll", () => {
    let current = ""
    const sections = document.querySelectorAll("section")

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      // Adjust offset for navigation bar height and to make it active slightly earlier
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active")
      }
    })
  })
}

// Scroll Animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe all elements with fade-in class
  const fadeElements = document.querySelectorAll(".fade-in")
  fadeElements.forEach((element) => {
    observer.observe(element)
  })
}

// Portfolio Filter
function initializePortfolioFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const portfolioItems = document.querySelectorAll(".portfolio-item")

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter")

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Filter portfolio items
      portfolioItems.forEach((item) => {
        const category = item.getAttribute("data-category")

        if (filter === "all" || category === filter) {
          item.classList.remove("hidden")
          // Use requestAnimationFrame for smoother transitions
          requestAnimationFrame(() => {
            item.style.display = "block"
          })
        } else {
          item.classList.add("hidden")
          // Wait for the transition to finish before hiding
          setTimeout(() => {
            if (item.classList.contains("hidden")) {
              item.style.display = "none"
            }
          }, 300) // Match this duration with your CSS transition for .portfolio-item.hidden
        }
      })
    })
  })
}

// Contact Form
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form")

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Get form data
    const formData = new FormData(this)
    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")

    // Basic validation
    if (!name || !email || !subject || !message) {
      showNotification("Please fill in all fields.", "error")
      return
    }

    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address.", "error")
      return
    }

    // Simulate form submission
    const submitButton = this.querySelector(".submit-button")
    const originalText = submitButton.textContent

    submitButton.textContent = "Sending..."
    submitButton.disabled = true

    setTimeout(() => {
      showNotification("Thank you! Your message has been sent successfully.", "success")
      contactForm.reset()
      submitButton.textContent = originalText
      submitButton.disabled = false
    }, 2000)
  })
}

// Smooth Scroll
function initializeSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        // Account for fixed navbar height
        const navbarHeight = document.getElementById("navbar").offsetHeight
        const offsetTop = targetSection.offsetTop - navbarHeight

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// Utility Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === "success" ? "#28a745" : "#dc3545"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 5000)
}

// Parallax Effect for Hero Section (Optional)
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const hero = document.querySelector(".hero")
  // Adjust parallax effect speed as needed
  const rate = scrolled * -0.3

  if (hero) {
    hero.style.transform = `translateY(${rate}px)`
  }
})

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (!timeout) {
      timeout = setTimeout(later, wait)
    }
  }
}

// Apply throttling to scroll events - example for initializing scroll animations only once
const throttledScrollHandler = throttle(() => {
  // You can add other scroll-dependent logic here if needed,
  // but for scroll animations, the Intersection Observer handles it efficiently.
}, 16) // ~60fps

window.addEventListener("scroll", throttledScrollHandler)

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close mobile menu if open
    const hamburger = document.getElementById("hamburger")
    const navMenu = document.getElementById("nav-menu")

    if (navMenu.classList.contains("active")) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    }
  }
})

// Focus management for accessibility
document.addEventListener("DOMContentLoaded", () => {
  const focusableElements = document.querySelectorAll(
    'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  focusableElements.forEach((element) => {
    element.addEventListener("focus", function () {
      // Add a distinct outline for focused elements
      this.style.outline = "2px solid #007BFF";
      this.style.outlineOffset = "2px";
    })

    element.addEventListener("blur", function () {
      // Remove the outline when the element loses focus
      this.style.outline = ""
      this.style.outlineOffset = ""
    })
  })
})