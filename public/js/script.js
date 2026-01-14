// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()

  
  // Toggle visibility of password inputs (show/hide password)
   document.querySelectorAll(".toggle-password").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const icon = toggle.querySelector("i");

      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";

      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  });