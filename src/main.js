import "./style.css";

// Background color transition as requested
function bgTransition() {
  const body = document.body;
  const lightBlue = "#ECF8FB";
  const lightGray = "#EFEFEF"; // (little will be noticed here, try changing this to black to see the difference)
  let isLightBlue = true;

  // initial bgcolor
  body.style.backgroundColor = lightBlue;

  // Not sure this would affect performance, but I'm sure it's not good for it
  setInterval(() => {
    // Toggle colors
    if (isLightBlue) {
      body.style.backgroundColor = lightGray;
      isLightBlue = false;
    } else {
      body.style.backgroundColor = lightBlue;
      isLightBlue = true;
    }
  }, 5000);
}

// Phone number masking function. Ok so there was little contribution from me here, some AI did most of this function.
function formatPhoneNumber(input) {
  // Store cursor position (AI is smart, I dint know this)
  const cursorPosition = input.selectionStart;
  const previousLength = input.value.length;

  // Remove non-numeric characters
  let phoneNumber = input.value.replace(/\D/g, "");

  // Limit to whateve {10} digits you want
  if (phoneNumber.length > 10) {
    phoneNumber = phoneNumber.slice(0, 10);
  }

  // Format phone number as (XXX) XXX-XXXX
  let formattedNumber = phoneNumber;
  if (phoneNumber.length > 0) {
    if (phoneNumber.length <= 3) {
      formattedNumber = `(${phoneNumber}`;
    } else if (phoneNumber.length <= 6) {
      formattedNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      formattedNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  }

  input.value = formattedNumber;

  // this is complicated, I dont understand it. But it works
  if (formattedNumber.length > previousLength) {
    const addedChars = formattedNumber.length - previousLength;
    input.setSelectionRange(cursorPosition + addedChars, cursorPosition + addedChars);
  } else if (cursorPosition < previousLength) {
    input.setSelectionRange(cursorPosition, cursorPosition);
  }
}

// Main function
document.addEventListener("DOMContentLoaded", () => {
  // Start that bgcolor transition
  bgTransition();

  const form = document.getElementById("contestForm");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const submitButton = form.querySelector('button[type="submit"]');
  let formSubmitted = false;

  // Add focus event listeners to mark fields as focused
  [nameInput, phoneInput, emailInput].forEach((input) => {
    input.addEventListener("focus", () => {
      input.dataset.wasFocused = "true";
    });
  });

  // Phone input mask
  phoneInput.addEventListener("input", function (e) {
    const start = this.selectionStart;
    formatPhoneNumber(this);
    if (formSubmitted || phoneInput.dataset.touched) {
      validateField(phoneInput, isPhoneValid(phoneInput.value), "Please enter a valid phone number");
    }
  });

  // Validation helper functions
  const isNameValid = (name) => name && name.trim().length >= 2;
  const isPhoneValid = (phone) => /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // error message span to show below inputs
  const createErrorElement = (message) => {
    const errorElement = document.createElement("span");
    errorElement.className = "error-message text-xs mt-1";
    errorElement.style.color = "#D50303";
    errorElement.textContent = message;
    return errorElement;
  };

  // Validate form fields with error messages
  const validateField = (input, isValid, errorMessage) => {
    // Remove any existing error message
    const parent = input.parentElement;
    const existingError = parent.querySelector(".error-message");
    if (existingError) {
      parent.removeChild(existingError);
    }

    if (isValid) {
      input.style.borderColor = "#d8d8d8";
    } else {
      input.style.borderColor = "#D50303";

      // Add error message after input
      if (errorMessage) {
        parent.appendChild(createErrorElement(errorMessage));
      }
    }
  };

  // Name validation
  nameInput.addEventListener("input", () => {
    if (formSubmitted || nameInput.dataset.touched) {
      validateField(nameInput, isNameValid(nameInput.value), "Name must be at least 2 characters");
    }
  });

  nameInput.addEventListener("blur", () => {
    nameInput.dataset.touched = "true";
    if (nameInput.dataset.wasFocused) {
      validateField(nameInput, isNameValid(nameInput.value), "Name must be at least 2 characters");
    }
  });

  // Phone validation
  phoneInput.addEventListener("blur", () => {
    phoneInput.dataset.touched = "true";
    if (phoneInput.dataset.wasFocused) {
      validateField(phoneInput, isPhoneValid(phoneInput.value), "Please enter a valid phone number");
    }
  });

  // Email validation
  emailInput.addEventListener("input", () => {
    if (formSubmitted || emailInput.dataset.touched) {
      validateField(emailInput, isEmailValid(emailInput.value), "Please enter a valid email address");
    }
  });

  emailInput.addEventListener("blur", () => {
    emailInput.dataset.touched = "true";
    if (emailInput.dataset.wasFocused) {
      validateField(emailInput, isEmailValid(emailInput.value), "Please enter a valid email address");
    }
  });

  // Mobile optimization for inputs
  [nameInput, phoneInput, emailInput, document.getElementById("city"), document.getElementById("state")].forEach((input) => {
    // Handle autofill by checking if value exists after a slight delay (this is also AI but from my research)
    setTimeout(() => {
      if (input.value !== "") {
        input.dataset.touched = "true";
        input.dataset.wasFocused = "true";
        if (input === nameInput) validateField(input, isNameValid(input.value), "Name must be at least 2 characters");
        if (input === phoneInput) validateField(input, isPhoneValid(input.value), "Please enter a valid phone number");
        if (input === emailInput) validateField(input, isEmailValid(input.value), "Please enter a valid email address");
      }
    }, 100);
  });

  // something I nabbed from a recent project, kind of helper to show submitted sate. There is a known bug here, the page increases in height and may cause issues in bg image, I nkow about it, will fix later if selected
  function showSubmittedState() {
    // Changing button text to Submitted, fooling the user
    submitButton.textContent = "Submitted";
    submitButton.disabled = true;

    // Disable all form inputs, no more allowed please, unless you refresh. Maybe I should use a modal
    Array.from(form.querySelectorAll("input")).forEach((input) => {
      input.disabled = true;
    });

    // animation keyframes to document
    if (!document.getElementById("checkmark-animation")) {
      const style = document.createElement("style");
      style.id = "checkmark-animation";
      style.textContent = `
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-in {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .checkmark-circle {
          animation: scale-in 0.5s ease-out forwards;
        }
        .success-heading {
          animation: slide-in 0.4s ease-out 0.3s forwards;
          opacity: 0;
        }
        .success-message {
          animation: slide-in 0.4s ease-out 0.5s forwards;
          opacity: 0;
        }
        .success-note {
          animation: fade-in 0.6s ease-out 0.7s forwards;
          opacity: 0;
        }
      `;
      document.head.appendChild(style);
    }

    // on success show this
    const successMessage = document.createElement("div");
    successMessage.className = "mt-6 text-center";
    successMessage.innerHTML = `
      <div class="bg-white shadow-md rounded-lg py-6 px-8 max-w-sm mx-auto border border-[#95c11f]/20" style="animation: fade-in 0.3s ease-out forwards;">
        <div class="flex flex-col items-center">
          <div class="rounded-full bg-[#95c11f]/10 p-3 mb-3 checkmark-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#95c11f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2 success-heading">Thank You!</h3>
          <p class="text-gray-600 mb-4 success-message">Your entry has been successfully submitted.</p>
          <div class="text-sm text-gray-500 success-note">You will be contacted if you win.</div>
        </div>
      </div>
    `;
    form.appendChild(successMessage);
  }

  // Actual  form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formSubmitted = true;

    // this is the validation
    const nameValid = isNameValid(nameInput.value);
    const phoneValid = isPhoneValid(phoneInput.value);
    const emailValid = isEmailValid(emailInput.value);

    validateField(nameInput, nameValid, "Name must be at least 2 characters");
    validateField(phoneInput, phoneValid, "Please enter a valid phone number");
    validateField(emailInput, emailValid, "Please enter a valid email address");

    // If all required fields are valid, submit the form
    if (nameValid && phoneValid && emailValid) {
      const formData = {
        name: nameInput.value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        phone: phoneInput.value,
        email: emailInput.value,
      };

      // Disable button and show submitting...
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";

      // remove error messages before submission
      document.querySelectorAll(".error-message").forEach((elem) => elem.remove());

      try {
        // Create a promise that will reject after 5 seconds
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), 5000);
        });

        // Race between the fetch and timeout, jsut flexing something I learnt recently
        const response = await Promise.race([
          fetch("https://formsws-hilstaging-com-0adj9wt8gzyq.runscope.net/solar", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }),
          timeoutPromise,
        ]);

        // Call that awesome function to show the success
        showSubmittedState();
      } catch (error) {
        // ignoring errors like you wanted
        console.log("Submission error (ignored):", error);
        showSubmittedState();
      }
    } else {
      // This is just oversmart and unwanted but, scroll to the first invalid field
      const firstInvalid = [nameInput, phoneInput, emailInput].find((input) => {
        if (input === nameInput) return !nameValid;
        if (input === phoneInput) return !phoneValid;
        if (input === emailInput) return !emailValid;
      });

      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus();
      }
    }
  });
});
