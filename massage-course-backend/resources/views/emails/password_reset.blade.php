<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f7fafc; color: #2d3748; }
        .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e2e8f0; padding: 32px; }
        .btn { display: inline-block; background: #3182ce; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; }
        h2 { color: #2b6cb0; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password for your account (<strong>{{ $userEmail }}</strong>).</p>
        <p>Click the button below to reset your password:</p>
        <p><a href="{{ $resetUrl }}" class="btn">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thanks,<br>The Massage Course Team</p>
    </div>
</body>
</html>
