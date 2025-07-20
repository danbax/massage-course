<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\User;
use App\Services\EmailService;
use App\DTO\EmailDTO;

class ForgotPasswordController extends Controller
{
    public function forgot(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid email'], 422);
        }
        $email = $request->input('email');
        $token = Str::random(64);
        DB::table('password_resets')->updateOrInsert([
            'email' => $email
        ], [
            'token' => $token,
            'created_at' => now()
        ]);
        $resetUrl = url('/reset-password?token=' . $token . '&email=' . urlencode($email));
        $emailData = new EmailDTO([
            'to' => $email,
            'subject' => 'Password Reset Request',
            'templateVars' => [
                'resetUrl' => $resetUrl,
                'userEmail' => $email
            ]
        ]);
        app(EmailService::class)->sendEmail($emailData);
        return response()->json(['message' => 'Reset link sent']);
    }

    public function reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid data'], 422);
        }
        $email = $request->input('email');
        $token = $request->input('token');
        $password = $request->input('password');
        $reset = DB::table('password_resets')->where('email', $email)->where('token', $token)->first();
        if (!$reset) {
            return response()->json(['error' => 'Invalid token'], 400);
        }
        User::where('email', $email)->update(['password' => Hash::make($password)]);
        DB::table('password_resets')->where('email', $email)->delete();
        return response()->json(['message' => 'Password reset successful']);
    }
}
