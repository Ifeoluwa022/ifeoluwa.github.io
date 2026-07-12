/* Contact page: form validation (mirrors the React Contact component rules). */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const fields = ["name", "email", "phone", "message"];

  function setError(field, message) {
    const input = form.elements[field];
    const errorEl = document.getElementById(`error-${field}`);
    input.classList.toggle("error", !!message);
    errorEl.textContent = message || "";
    errorEl.style.display = message ? "" : "none";
  }

  function validate() {
    const errors = {};
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const phone = form.elements.phone.value.trim();
    const message = form.elements.message.value.trim();

    if (!name) errors.name = "Name is required";

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(phone)) {
      errors.phone = "Phone number must contain only digits";
    }

    if (!message) errors.message = "Message cannot be empty";

    return errors;
  }

  // Clear a field's error as soon as the user edits it.
  fields.forEach((field) => {
    form.elements[field].addEventListener("input", () => setError(field, ""));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const errors = validate();
    fields.forEach((field) => setError(field, errors[field]));

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const firstName = form.elements.name.value.trim().split(" ")[0];
    toast.success(`Thanks ${firstName}! Your message has been sent.`);
    form.reset();
  });
});
