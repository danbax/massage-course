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
        $token = Str::random(60);
        // Store token in remember_token column
        $user = User::where('email', $email)->first();
        $user->remember_token = Hash::make($token);
        $user->save();

        // Send email with token
        $emailDTO = new EmailDTO([
            'to' => $user->email,
            'subject' => 'Password Reset Request',
            'templateVars' => [
                'token' => $token,
                'user' => $user
            ]
        ]);
        app(EmailService::class)->sendEmail($emailDTO);

        return response()->json(['message' => 'Password reset email sent']);
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
        $user = User::where('email', $email)->first();
        if (!$user || !$user->remember_token || !Hash::check($request->token, $user->remember_token)) {
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        $user->password = Hash::make($password);
        // Clear the token after successful reset
        $user->remember_token = null;
        $user->save();

        return response()->json(['message' => 'Password has been reset']);
    }
}
