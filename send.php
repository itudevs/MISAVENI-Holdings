<?php
// Start output buffering at the very beginning
ob_start();

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die('Invalid request method');
}

if (empty($_POST['firstname']) || empty($_POST['lastname']) || empty($_POST['email']) || empty($_POST['subject']) || empty($_POST['message'])) {
    $_SESSION['error_message'] = 'All fields are required';
    header('Location: contact.php');
    exit();
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

$mail = new PHPMailer(true);

try {
    $firstname = strip_tags(trim($_POST['firstname']));
    $lastname = strip_tags(trim($_POST['lastname']));
    $name = $firstname . ' ' . $lastname;
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $subject = strip_tags(trim($_POST['subject']));
    $message = strip_tags(trim($_POST['message']));
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error_message'] = 'Invalid email address provided';
        header('Location: contact.php');
        exit();
    }
    
    if (strlen($message) < 10) {
        $_SESSION['error_message'] = 'Message is too short (minimum 10 characters)';
        header('Location: contact.php');
        exit();
    }
    
    // Calculate spam probability
    $spam_score = 0;
    
    // Check for gibberish (consonant clusters)
    if (preg_match('/[bcdfghjklmnpqrstvwxyz]{5,}/i', $message)) {
        $spam_score += 2;
    }
    
    // Check for very short words ratio
    $words = str_word_count($message, 1);
    if (count($words) > 0) {
        $short_words = array_filter($words, function($w) { return strlen($w) <= 2; });
        if (count($short_words) / count($words) > 0.5) {
            $spam_score += 1;
        }
    }
    
    // Check subject
    if (preg_match('/[bcdfghjklmnpqrstvwxyz]{5,}/i', $subject)) {
        $spam_score += 2;
    }
    
    // Server settings
    $mail->isSMTP();
    $mail->SMTPDebug = 0;
    $mail->Host = 'mail.misaveniholdings.co.za';
    $mail->SMTPAuth = true;
    $mail->Username = 'info@misaveniholdings.co.za';
    $mail->Password = 'Misaveni@2026';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->Timeout = 30;
    $mail->SMTPKeepAlive = true;
    
    // Optimal anti-spam settings
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->XMailer = ' ';
    $mail->Priority = 3;
    
    // Critical headers
    $mail->setFrom('info@misaveniholdings.co.za', 'AUSI Website');
    $mail->addAddress('info@misaveniholdings.co.za');
    $mail->addReplyTo('info@misaveniholdings.co.za', $name);
    
    // Add headers to look more legitimate
    $mail->addCustomHeader('X-Mailer-Type', 'Contact Form');
    $mail->addCustomHeader('X-Originating-IP', $_SERVER['REMOTE_ADDR']);
    $mail->addCustomHeader('Precedence', 'bulk');
    
    // Use PLAIN TEXT if spam score is high
    if ($spam_score >= 3) {
        $mail->isHTML(false);
        
        $mail->Subject = 'Contact Form - ' . substr($subject, 0, 50);
        
        $mail->Body = "Contact Form Submission\n\n" .
                      "Name: {$name}\n" .
                      "Email: {$email}\n" .
                      "Subject: {$subject}\n\n" .
                      "Message:\n" .
                      "{$message}\n\n" .
                      "Submitted: " . date('Y-m-d H:i:s') . "\n" .
                      "IP: " . $_SERVER['REMOTE_ADDR'];
    } else {
        // Use HTML for normal-looking content
        $mail->isHTML(true);
        
        $mail->Subject = 'Website Enquiry: ' . $subject;
        
        $mail->Body = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Contact Form</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="background-color: #333333; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Website Contact Form</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #dddddd;">
                    <tr style="background-color: #f5f5f5;">
                        <td style="border-bottom: 1px solid #dddddd; font-weight: bold; width: 100px;">Name</td>
                        <td style="border-bottom: 1px solid #dddddd;">' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</td>
                    </tr>
                    <tr>
                        <td style="border-bottom: 1px solid #dddddd; font-weight: bold;">Email</td>
                        <td style="border-bottom: 1px solid #dddddd;"><a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '">' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</a></td>
                    </tr>
                    <tr style="background-color: #f5f5f5;">
                        <td style="font-weight: bold;">Subject</td>
                        <td>' . htmlspecialchars($subject, ENT_QUOTES, 'UTF-8') . '</td>
                    </tr>
                </table>
                <div style="margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #333333;">
                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #333333;">Message:</p>
                    <div style="line-height: 1.6;">' . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . '</div>
                </div>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666666;">
                <p style="margin: 5px 0;">Received: ' . date('l, F j, Y \a\t g:i A') . '</p>
                <p style="margin: 5px 0;">IP Address: ' . htmlspecialchars($_SERVER['REMOTE_ADDR'], ENT_QUOTES, 'UTF-8') . '</p>
            </td>
        </tr>
    </table>
</body>
</html>';
        
        $mail->AltBody = "Website Contact Form\n\n" .
                         "Name: {$name}\n" .
                         "Email: {$email}\n" .
                         "Subject: {$subject}\n\n" .
                         "Message:\n{$message}\n\n" .
                         "Received: " . date('l, F j, Y \a\t g:i A') . "\n" .
                         "IP: " . $_SERVER['REMOTE_ADDR'];
    }

    // Send with retry logic
    $max_attempts = 2;
    $attempt = 0;
    $sent = false;
    
    while ($attempt < $max_attempts && !$sent) {
        $attempt++;
        try {
            $sent = $mail->send();
        } catch (Exception $e) {
            if ($attempt >= $max_attempts) {
                throw $e;
            }
            sleep(1); // Wait 1 second before retry
        }
    }
    
    if (!$sent) {
        throw new Exception('Failed to send after multiple attempts');
    }
    
    error_log("SUCCESS: Email sent from $email | Subject: $subject | Spam Score: $spam_score");
    
    $_SESSION['message_sent'] = true;
    $_SESSION['message_time'] = time();
    
    // Clear buffer and redirect
    ob_end_clean();
    
    // Redirect to success page
    header('Location: message-sent.html');
    exit();
    
} catch (Exception $e) {
    // Clear buffer for error page too
    ob_end_clean();
    
    error_log("FAILED: " . $mail->ErrorInfo . " | Exception: " . $e->getMessage());
    
    // Store error message in session and redirect
    $_SESSION['error_message'] = 'Failed to send message. Please try again later.';
    header('Location: contact.php');
    exit();
}
?>