document.addEventListener('DOMContentLoaded', () => {
  const pricingGrid = document.getElementById('pricing-grid');
  const ctaForm = document.getElementById('cta-form');
  const formMessage = document.getElementById('form-message');
  const planSelect = document.getElementById('plan-select');

  // Fetch pricing plans from API
  async function loadPricing() {
    try {
      const response = await fetch('/api/pricing');
      if (!response.ok) throw new Error('Failed to load pricing');
      const plans = await response.json();
      renderPricing(plans);
    } catch (error) {
      pricingGrid.innerHTML = '<p>Unable to load pricing. Please try again later.</p>';
      console.error(error);
    }
  }

  function renderPricing(plans) {
    pricingGrid.innerHTML = plans.map(plan => {
      const featuresHTML = plan.features.map(f => `<li>${f}</li>`).join('');
      return `
        <div class="plan-card ${plan.popular ? 'popular' : ''}">
          <div class="plan-name">${plan.name}</div>
          <div class="plan-price">$${plan.price}<span>/month</span></div>
          <ul class="plan-features">${featuresHTML}</ul>
          <div class="plan-cta">
            <button class="btn-primary" data-plan="${plan.name.toLowerCase()}" data-price="${plan.price}">Choose ${plan.name}</button>
          </div>
        </div>
      `;
    }).join('');

    // Add event listeners to plan CTA buttons
    document.querySelectorAll('.plan-cta .btn-primary').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const planName = e.target.dataset.plan;
        // Pre-fill the CTA form plan select
        const planOption = Array.from(planSelect.options).find(opt => opt.value.toLowerCase() === planName);
        if (planOption) {
          planSelect.value = planOption.value;
        }
        // Scroll to CTA section
        document.getElementById('cta').scrollIntoView({ behavior: 'smooth' });
        // Set focus on name input
        document.querySelector('#cta-form input[name="name"]').focus();
        // Event tracking (analytics placeholder)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'click_choose_plan', { plan_name: planName });
        } else {
          console.log('Analytics event:', 'click_choose_plan', { plan_name: planName });
        }
      });
    });
  }

  // Handle CTA form submission
  ctaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(ctaForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      plan: formData.get('plan')
    };

    // Basic validation
    if (!data.name || !data.email) {
      formMessage.textContent = 'Please fill in all required fields.';
      formMessage.style.color = '#ef4444';
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        formMessage.textContent = 'You\'re signed up! Check your email for next steps.';
        formMessage.style.color = '#4ade80';
        ctaForm.reset();
        // Event tracking (analytics placeholder)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'signup', { plan: data.plan });
        } else {
          console.log('Analytics event:', 'signup', { plan: data.plan });
        }
      } else {
        formMessage.textContent = result.error || 'Something went wrong.';
        formMessage.style.color = '#ef4444';
      }
    } catch (error) {
      formMessage.textContent = 'Network error. Please try again.';
      formMessage.style.color = '#ef4444';
      console.error(error);
    }
  });

  // Load pricing on page load
  loadPricing();
});