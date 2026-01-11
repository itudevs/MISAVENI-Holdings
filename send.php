<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. CONFIGURATION (Change these)
    $recipient_email = "info@misaveniholdings.co.za"; // Where you want the mail sent
    $from_email = "info@misaveniholdings.co.za"; // Must be an email created in your Truehost cPanel
    
    // 2. COLLECT DATA FROM YOUR FORM
    $fname   = strip_tags(trim($_POST["firstname"]));
    $lname   = strip_tags(trim($_POST["lastname"]));
    $email   = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $user_subject = strip_tags(trim($_POST["subject"]));
    $message = htmlspecialchars($_POST["message"]);

    // 3. PREPARE THE EMAIL CONTENT
    $email_subject = "Website Contact: " . $user_subject;
    
    $email_body = "You have received a new message.\n\n".
                  "Full Name: $fname $lname\n".
                  "Email: $email\n".
                  "Subject: $user_subject\n\n".
                  "Message:\n$message";

    // 4. HEADERS (Vital for Truehost to deliver the mail)
    $headers = "From: $from_email" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    // 5. SENDING LOGIC
    if (mail($recipient_email, $email_subject, $email_body, $headers)) {
        // Success: Redirect to a 'thank you' page or show success
        echo "<script>alert('Message sent successfully!'); window.location.href='index.html';</script>";
    } else {
        // Error
        echo "<script>alert('Something went wrong. Please try again.'); window.history.back();</script>";
    }
} else {
    echo "Direct access not allowed.";
}
?>