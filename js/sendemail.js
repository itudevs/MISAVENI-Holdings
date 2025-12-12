(function () {
  emailjs.init({
    publicKey: "XPyhK0yQ9Q3UlRoGX",
  });
})();

window.onload = function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); //prevent page reload

    let lname = document.getElementById("fname").value;
    let surname = document.getElementById("lname").value;

    const params = {
      name: lname + " " + surname,
      Subject: document.getElementById("subject").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };
    //send
    emailjs.send("service_fufkxsu", "template_id9e9qa", params).then(
      function (response) {
        alert("Email Sent successfully!");
        console.log("SUCCESS", response.status, response.text);
      },
      function (error) {
        alert("Failed to send email check console for details");
        console.log("FAILED...", error);
      }
    );
  });
};
