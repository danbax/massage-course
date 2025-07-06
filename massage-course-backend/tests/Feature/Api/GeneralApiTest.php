<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GeneralApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_check_endpoint_works()
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'timestamp',
                'version'
            ])
            ->assertJson([
                'status' => 'ok',
                'version' => '1.0.0'
            ]);

        // Verify timestamp is a valid ISO date
        $timestamp = $response->json('timestamp');
        $this->assertNotNull(\Carbon\Carbon::parse($timestamp));
    }

    public function test_api_returns_json_for_404_routes()
    {
        $response = $this->getJson('/api/nonexistent-endpoint');

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Not Found.'
            ]);
    }

    public function test_api_handles_cors_preflight_requests()
    {
        $response = $this->call('OPTIONS', '/api/courses', [], [], [], [
            'HTTP_Origin' => 'http://localhost:3000',
            'HTTP_Access-Control-Request-Method' => 'GET',
            'HTTP_Access-Control-Request-Headers' => 'Content-Type, Authorization'
        ]);

        $response->assertStatus(200)
            ->assertHeader('Access-Control-Allow-Origin', '*')
            ->assertHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->assertHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }

    public function test_api_rate_limiting()
    {
        // Test rate limiting on public endpoints
        for ($i = 0; $i < 65; $i++) {
            $response = $this->getJson('/api/health');
            
            if ($i < 60) {
                $response->assertStatus(200);
            } else {
                // Should hit rate limit after 60 requests
                $response->assertStatus(429);
                break;
            }
        }
    }

    public function test_api_validates_accept_header()
    {
        $response = $this->get('/api/courses', [
            'Accept' => 'text/html'
        ]);

        // Should still return JSON even with HTML accept header
        $response->assertHeader('Content-Type', 'application/json');
    }

    public function test_api_handles_malformed_json()
    {
        $response = $this->call('POST', '/api/auth/login', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], '{malformed json');

        $response->assertStatus(400)
            ->assertJsonStructure([
                'message'
            ]);
    }

    public function test_api_security_headers_are_present()
    {
        $response = $this->getJson('/api/health');

        $response->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'DENY')
            ->assertHeader('X-XSS-Protection', '1; mode=block');
    }

    public function test_api_handles_large_request_bodies()
    {
        $largeData = [
            'data' => str_repeat('a', 1024 * 1024) // 1MB string
        ];

        $response = $this->postJson('/api/auth/register', $largeData);

        // Should handle large requests gracefully
        $this->assertContains($response->status(), [422, 413]); // Validation error or payload too large
    }

    public function test_api_handles_concurrent_requests()
    {
        // Simulate concurrent requests
        $responses = [];
        
        for ($i = 0; $i < 10; $i++) {
            $responses[] = $this->getJson('/api/health');
        }

        foreach ($responses as $response) {
            $response->assertStatus(200);
        }
    }

    public function test_api_pagination_works_correctly()
    {
        // Create test data
        \App\Models\Course::factory()->count(25)->published()->create();

        $response = $this->getJson('/api/courses?page=1&per_page=10');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'meta' => [
                    'current_page',
                    'per_page',
                    'total',
                    'last_page',
                    'from',
                    'to'
                ],
                'links' => [
                    'first',
                    'last',
                    'prev',
                    'next'
                ]
            ])
            ->assertJsonCount(10, 'data')
            ->assertJson([
                'meta' => [
                    'current_page' => 1,
                    'per_page' => 10
                ]
            ]);

        // Test next page
        $response = $this->getJson('/api/courses?page=2&per_page=10');
        $response->assertStatus(200)
            ->assertJson([
                'meta' => [
                    'current_page' => 2
                ]
            ]);
    }

    public function test_api_search_functionality()
    {
        \App\Models\Course::factory()->create([
            'title' => 'Advanced Deep Tissue Massage',
            'is_published' => true
        ]);
        \App\Models\Course::factory()->create([
            'title' => 'Relaxation Techniques',
            'is_published' => true
        ]);

        $response = $this->getJson('/api/courses/search?q=massage');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'description'
                    ]
                ],
                'meta' => [
                    'query',
                    'total_results',
                    'search_time'
                ]
            ]);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertStringContainsStringIgnoringCase('massage', $data[0]['title']);
    }

    public function test_api_filtering_works()
    {
        \App\Models\Course::factory()->create([
            'difficulty_level' => 'beginner',
            'category' => 'swedish',
            'is_published' => true
        ]);
        \App\Models\Course::factory()->create([
            'difficulty_level' => 'advanced',
            'category' => 'deep-tissue',
            'is_published' => true
        ]);

        $response = $this->getJson('/api/courses?difficulty=beginner&category=swedish');

        $response->assertStatus(200);
        
        $courses = $response->json('data');
        foreach ($courses as $course) {
            $this->assertEquals('beginner', $course['difficulty_level']);
            $this->assertEquals('swedish', $course['category']);
        }
    }

    public function test_api_sorting_works()
    {
        \App\Models\Course::factory()->create([
            'title' => 'A Course',
            'price' => 100,
            'is_published' => true
        ]);
        \App\Models\Course::factory()->create([
            'title' => 'B Course',
            'price' => 50,
            'is_published' => true
        ]);

        // Test price sorting
        $response = $this->getJson('/api/courses?sort=price&order=asc');
        $response->assertStatus(200);
        
        $courses = $response->json('data');
        $this->assertLessThanOrEqual($courses[1]['price'], $courses[0]['price']);
    }

    public function test_api_error_responses_are_consistent()
    {
        // Test 404 error
        $response = $this->getJson('/api/courses/99999');
        $response->assertStatus(404)
            ->assertJsonStructure([
                'message'
            ]);

        // Test validation error
        $response = $this->postJson('/api/auth/register', []);
        $response->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors'
            ]);

        // Test unauthorized error
        $response = $this->getJson('/api/auth/user');
        $response->assertStatus(401)
            ->assertJsonStructure([
                'message'
            ]);
    }
}
