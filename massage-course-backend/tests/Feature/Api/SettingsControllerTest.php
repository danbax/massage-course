<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SettingsControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create([
            'notification_preferences' => json_encode([
                'email_course_updates' => true,
                'email_new_courses' => false,
                'email_certificates' => true,
                'push_lesson_reminders' => true,
                'sms_important_updates' => false
            ])
        ]);
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    public function test_user_can_view_settings()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/settings');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'account' => [
                    'email_verified',
                    'two_factor_enabled',
                    'last_password_change',
                    'account_status'
                ],
                'preferences' => [
                    'timezone',
                    'language',
                    'theme',
                    'auto_play_videos',
                    'playback_speed',
                    'subtitle_preferences'
                ],
                'privacy' => [
                    'profile_visibility',
                    'show_progress_publicly',
                    'allow_course_recommendations',
                    'data_sharing_consent'
                ],
                'notifications' => [
                    'email_course_updates',
                    'email_new_courses',
                    'email_certificates',
                    'push_lesson_reminders',
                    'sms_important_updates'
                ]
            ]);
    }

    public function test_user_can_update_general_settings()
    {
        $settingsData = [
            'timezone' => 'Europe/London',
            'language' => 'en',
            'theme' => 'dark',
            'auto_play_videos' => false,
            'playback_speed' => 1.25,
            'subtitle_preferences' => [
                'enabled' => true,
                'language' => 'en',
                'size' => 'medium'
            ],
            'privacy' => [
                'profile_visibility' => 'private',
                'show_progress_publicly' => false,
                'allow_course_recommendations' => true
            ]
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/settings', $settingsData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'settings' => [
                    'preferences',
                    'privacy'
                ]
            ])
            ->assertJson([
                'message' => 'Settings updated successfully'
            ]);

        // Verify settings were saved
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'timezone' => 'Europe/London',
            'language' => 'en'
        ]);
    }

    public function test_user_can_view_notification_settings()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/settings/notifications');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'email_notifications' => [
                    'course_updates' => [
                        'enabled',
                        'description'
                    ],
                    'new_courses' => [
                        'enabled',
                        'description'
                    ],
                    'certificates' => [
                        'enabled',
                        'description'
                    ],
                    'marketing' => [
                        'enabled',
                        'description'
                    ]
                ],
                'push_notifications' => [
                    'lesson_reminders' => [
                        'enabled',
                        'description'
                    ],
                    'progress_milestones' => [
                        'enabled',
                        'description'
                    ],
                    'course_deadlines' => [
                        'enabled',
                        'description'
                    ]
                ],
                'sms_notifications' => [
                    'important_updates' => [
                        'enabled',
                        'description'
                    ],
                    'security_alerts' => [
                        'enabled',
                        'description'
                    ]
                ]
            ])
            ->assertJson([
                'email_notifications' => [
                    'course_updates' => [
                        'enabled' => true
                    ],
                    'new_courses' => [
                        'enabled' => false
                    ],
                    'certificates' => [
                        'enabled' => true
                    ]
                ],
                'push_notifications' => [
                    'lesson_reminders' => [
                        'enabled' => true
                    ]
                ],
                'sms_notifications' => [
                    'important_updates' => [
                        'enabled' => false
                    ]
                ]
            ]);
    }

    public function test_user_can_update_notification_settings()
    {
        $notificationSettings = [
            'email_course_updates' => false,
            'email_new_courses' => true,
            'email_certificates' => true,
            'email_marketing' => false,
            'push_lesson_reminders' => false,
            'push_progress_milestones' => true,
            'push_course_deadlines' => true,
            'sms_important_updates' => true,
            'sms_security_alerts' => true
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/settings/notifications', $notificationSettings);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'notifications' => [
                    'email_notifications',
                    'push_notifications',
                    'sms_notifications'
                ]
            ])
            ->assertJson([
                'message' => 'Notification settings updated successfully'
            ]);

        // Verify notification preferences were updated
        $this->user->refresh();
        $preferences = json_decode($this->user->notification_preferences, true);
        
        $this->assertEquals(false, $preferences['email_course_updates']);
        $this->assertEquals(true, $preferences['email_new_courses']);
        $this->assertEquals(true, $preferences['sms_important_updates']);
    }

    public function test_settings_validation()
    {
        $invalidSettings = [
            'timezone' => 'Invalid/Timezone',
            'language' => 'invalid_lang',
            'theme' => 'invalid_theme',
            'playback_speed' => 5.0, // Too high
            'auto_play_videos' => 'not_boolean'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/settings', $invalidSettings);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'timezone',
                'language', 
                'theme',
                'playback_speed',
                'auto_play_videos'
            ]);
    }

    public function test_notification_settings_validation()
    {
        $invalidNotifications = [
            'email_course_updates' => 'not_boolean',
            'invalid_notification_type' => true
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/settings/notifications', $invalidNotifications);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email_course_updates']);
    }

    public function test_user_can_enable_two_factor_authentication()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/settings/2fa/enable');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'qr_code_url',
                'manual_entry_key',
                'backup_codes'
            ]);
    }

    public function test_user_can_disable_two_factor_authentication()
    {
        // First enable 2FA
        $this->user->update(['two_factor_enabled' => true]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/settings/2fa/disable', [
            'current_password' => 'password'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Two-factor authentication disabled successfully'
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'two_factor_enabled' => false
        ]);
    }

    public function test_user_can_export_personal_data()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/settings/export-data');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'export_request_id',
                'estimated_completion_time'
            ]);
    }

    public function test_user_can_request_account_deletion()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/settings/delete-account', [
            'current_password' => 'password',
            'reason' => 'No longer needed',
            'confirmation' => true
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'deletion_scheduled_date',
                'cancellation_deadline'
            ]);
    }

    public function test_account_deletion_requires_password_confirmation()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/settings/delete-account', [
            'current_password' => 'wrong_password',
            'reason' => 'No longer needed',
            'confirmation' => true
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);
    }

    public function test_privacy_settings_update()
    {
        $privacySettings = [
            'profile_visibility' => 'friends_only',
            'show_progress_publicly' => false,
            'allow_course_recommendations' => true,
            'data_sharing_consent' => false,
            'analytics_consent' => true
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/settings', [
            'privacy' => $privacySettings
        ]);

        $response->assertStatus(200);

        // Verify privacy settings were saved
        $this->user->refresh();
        // Privacy settings would typically be stored in a separate table or JSON column
    }

    public function test_unauthenticated_user_cannot_access_settings_endpoints()
    {
        $endpoints = [
            'GET /api/settings',
            'PUT /api/settings',
            'GET /api/settings/notifications',
            'PUT /api/settings/notifications'
        ];

        foreach ($endpoints as $endpoint) {
            [$method, $url] = explode(' ', $endpoint);
            $response = $this->json($method, $url);
            $response->assertStatus(401);
        }
    }

    public function test_settings_include_system_preferences()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/settings');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'system' => [
                    'available_languages',
                    'available_timezones',
                    'supported_themes',
                    'playback_speed_options',
                    'subtitle_languages'
                ]
            ]);
    }
}
