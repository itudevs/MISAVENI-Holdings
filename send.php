<?php
// 1. Configuration
$recipient_email = "info@misaveniholdings.co.za"; 
$from_email      = "info@misaveniholdings.co.za";   

// 2. Get form data
$fname   = $_POST['firstname'] ?? 'No First Name';
$lname   = $_POST['lastname']  ?? 'No Last Name';
$email   = $_POST['email']     ?? 'No Email';
$subject = $_POST['subject']   ?? 'No Subject';
$message = $_POST['message']   ?? 'No Message';

// 3. Format email
$email_subject = "Website Contact: " . $subject;
$email_body    = "Name: $fname $lname\nEmail: $email\n\nMessage:\n$message";

$headers = "From: $from_email\n";
$headers .= "Reply-To: $email\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 4. Send and Redirect
if (mail($recipient_email, $email_subject, $email_body, $headers, "-f$from_email")) {
    // SUCCESS: Redirect to your thank you page
    header("Location: success.html"); 
    exit();
} else {
    // FAILURE: Redirect to an error page (optional) or show a simple message
    echo "Something went wrong. Please try again or email us directly at $from_email";
}
?>