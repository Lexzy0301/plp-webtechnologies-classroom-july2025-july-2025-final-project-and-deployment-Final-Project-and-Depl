// Mobile menu toggle
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  if (navLinks.classList.contains("active")) {
    navLinks.style.display = "flex";
  } else {
    navLinks.style.display = "none";
  }
});

// Contact form submission
document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Thank you! Your message has been sent.");
  this.reset();
});

// Scroll animations
const animatedElements = document.querySelectorAll(".fade-in, .slide-left, .slide-right");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

animatedElements.forEach(el => observer.observe(el));

// Testimonials Carousel
const track = document.getElementById("testimonial-track");
const testimonials = document.querySelectorAll(".testimonial");
let index = 0;

function showTestimonial() {
  index = (index + 1) % testimonials.length;
  track.style.transform = `translateX(-${index * 100}%)`;
}

setInterval(showTestimonial, 4000); // every 4s








const giftFloating = document.querySelector(".gift-floating");
const giftBox = document.getElementById("giftBox");
const closeGift = document.getElementById("closeGift");

// Toggle when clicking the gift box
giftBox.addEventListener("click", function () {
  giftFloating.classList.toggle("active");
});

// Close when clicking ❌ button
closeGift.addEventListener("click", function (e) {
  e.stopPropagation(); // prevents re-triggering giftBox click
  giftFloating.classList.remove("active");
});



// Static Gift Card Rates (NGN per USD)
const giftCardRates = {
  apple: 955,
  steam: 1060,
  razer: 1170,
  visa: 900,
  googleplay: 860,
  cashapp: 1100
};

// Live crypto rates will be stored here
let liveRates = {
  btc: null,
  usdt: null
};

// Fetch live BTC & USDT rates from CoinGecko API
async function fetchRates() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd");

    if (!response.ok) throw new Error("Network response failed");

    const data = await response.json();

    liveRates.btc = data.bitcoin.usd;
    liveRates.usdt = data.tether.usd;

    document.getElementById("last-updated").innerText =
      `🔄 Rates refreshed at ${new Date().toLocaleTimeString()}`;
  } catch (error) {
    console.error("Error fetching live rates:", error);
    document.getElementById("last-updated").innerText =
      "⚠️ Failed to fetch live rates. Please try again later.";
  }
}

// Convert USD to NGN
function calculateRate() {
  const service = document.getElementById("service").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const resultDiv = document.getElementById("result");

  if (isNaN(amount) || amount <= 0) {
    resultDiv.innerHTML = "⚠️ Please enter a valid amount!";
    return;
  }

  let total;
  let serviceName;

  if (service === "btc") {
    if (!liveRates.btc) {
      resultDiv.innerHTML = "⚠️ BTC rate not loaded yet. Please try again.";
      return;
    }
    const nairaRate = 1500; // fixed NGN/USD multiplier for BTC
    total = amount * liveRates.btc * nairaRate;
    serviceName = "Bitcoin (BTC)";
  } else if (service === "usdt") {
    if (!liveRates.usdt) {
      resultDiv.innerHTML = "⚠️ USDT rate not loaded yet. Please try again.";
      return;
    }
    const nairaRate = 1480; // fixed NGN/USD multiplier for USDT
    total = amount * liveRates.usdt * nairaRate;
    serviceName = "Tether (USDT)";
  } else {
    total = amount * giftCardRates[service];
    serviceName = service.charAt(0).toUpperCase() + service.slice(1) + " Gift Card";
  }

  resultDiv.innerHTML = `💰 ${amount} USD in ${serviceName} = <br> <strong>${total.toLocaleString()} NGN</strong>`;
}

// Fetch rates on load + refresh every 5 mins
window.onload = () => {
  fetchRates();
  setInterval(fetchRates, 300000);
};
