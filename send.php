<?php
// 1. CONFIGURATION
$recipient_email = "info@misaveniholdings.co.za"; 
$from_email = "info@misaveniholdings.co.za"; 

// 2. COLLECT DATA FROM YOUR FORM
// We use $_REQUEST to ensure it grabs the data even if the security check is gone
$fname   = strip_tags(trim($_REQUEST["firstname"] ?? ""));
$lname   = strip_tags(trim($_REQUEST["lastname"] ?? ""));
$email   = filter_var(trim($_REQUEST["email"] ?? ""), FILTER_SANITIZE_EMAIL);
$user_subject = strip_tags(trim($_REQUEST["subject"] ?? "Contact"));
$message = htmlspecialchars($_REQUEST["message"] ?? "");

// 3. PREPARE THE EMAIL CONTENT
$email_subject = "Website Contact: " . $user_subject;

$email_body = "You have received a new message.\n\n".
              "Full Name: $fname $lname\n".
              "Email: $email\n".
              "Subject: $user_subject\n\n".
              "Message:\n$message";

// 4. HEADERS
$headers = "From: $from_email" . "\r\n" .
           "Reply-To: $email" . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

// 5. SENDING LOGIC & REDIRECT
if (mail($recipient_email, $email_subject, $email_body, $headers)) {
    // Redirect to your custom success page
    header("Location: message-sent.html");
    exit();
} else {
    // If it fails, send them back to the contact page
    // You can also change this to an error page if you prefer
    header("Location: contact.html?error=Notsent");
    exit();    
}
?>