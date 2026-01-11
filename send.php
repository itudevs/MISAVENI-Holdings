<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'mail.misaveniholdings.co.za'; // Your Truehost Mail Server
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@misaveniholdings.co.za'; // Your cPanel email
    $mail->Password   = '8W94Lb[mYg4!Gp';        // Your cPanel email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // Recipients
    $mail->setFrom('info@misaveniholdings.co.za', 'Website Form');
    $mail->addAddress('info@misaveniholdings.co.za'); 
    $mail->addReplyTo($_POST['email'], $_POST['firstname']);

    // Content
    $mail->isHTML(false);
    $mail->Subject = 'New Message: ' . $_POST['subject'];
    $mail->Body    = "Name: " . $_POST['firstname'] . " " . $_POST['lastname'] . "\n" .
                     "Email: " . $_POST['email'] . "\n\n" .
                     "Message:\n" . $_POST['message'];

    $mail->send();
    echo "<script>window.location.href='message-sent.html';</script>";
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}