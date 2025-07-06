<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Services\CourseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function __construct(
        private CourseService $courseService
    ) {}

    /**
     * Display a listing of published courses.
     */
    public function index(Request $request): JsonResponse
    {
        $courses = Course::published()
            ->ordered()
            ->with(['modules.lessons'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->difficulty, function ($query, $difficulty) {
                $query->where('difficulty_level', $difficulty);
            })
            ->paginate($request->per_page ?? 12);

        return response()->json([
            'courses' => CourseResource::collection($courses->items()),
            'meta' => [
                'current_page' => $courses->currentPage(),
                'last_page' => $courses->lastPage(),
                'per_page' => $courses->perPage(),
                'total' => $courses->total()
            ]
        ]);
    }

    /**
     * Display the specified course.
     */
    public function show(Course $course, Request $request): JsonResponse
    {
        $this->authorize('view', $course);

        $course->load([
            'modules.lessons' => function ($query) use ($request) {
                if (!$request->user() || !$request->user()->isEnrolledIn($course)) {
                    $query->where('is_preview', true);
                }
            }
        ]);

        $userProgress = null;
        if ($request->user() && $request->user()->isEnrolledIn($course)) {
            $userProgress = $request->user()->getProgressForCourse($course);
        }

        return response()->json([
            'course' => new CourseResource($course),
            'user_progress' => $userProgress,
            'is_enrolled' => $request->user() ? $request->user()->isEnrolledIn($course) : false
        ]);
    }

    /**
     * Enroll user in a course.
     */
    public function enroll(Course $course, Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isEnrolledIn($course)) {
            return response()->json([
                'message' => 'Already enrolled in this course'
            ], 409);
        }

        // Check if course is free or user has paid
        if (!$course->is_free) {
            $hasValidPayment = $user->payments()
                ->where('course_id', $course->id)
                ->where('status', 'succeeded')
                ->exists();

            if (!$hasValidPayment) {
                return response()->json([
                    'message' => 'Payment required to enroll in this course'
                ], 402);
            }
        }

        $enrollment = $this->courseService->enrollUser($user, $course);

        return response()->json([
            'message' => 'Successfully enrolled in course',
            'enrollment' => $enrollment
        ], 201);
    }

    /**
     * Get user's enrolled courses.
     */
    public function enrolled(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $enrollments = $user->courseEnrollments()
            ->with(['course.modules.lessons'])
            ->orderBy('enrolled_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'enrollments' => $enrollments->items(),
            'meta' => [
                'current_page' => $enrollments->currentPage(),
                'last_page' => $enrollments->lastPage(),
                'per_page' => $enrollments->perPage(),
                'total' => $enrollments->total()
            ]
        ]);
    }

    /**
     * Get course statistics for user.
     */
    public function statistics(Course $course, Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isEnrolledIn($course)) {
            return response()->json([
                'message' => 'Not enrolled in this course'
            ], 403);
        }

        $stats = $this->courseService->getCourseStatistics($user, $course);

        return response()->json(['statistics' => $stats]);
    }

    /**
     * Get featured courses.
     */
    public function featured(): JsonResponse
    {
        $courses = Course::published()
            ->where('is_featured', true)
            ->ordered()
            ->limit(6)
            ->get();

        return response()->json([
            'courses' => CourseResource::collection($courses)
        ]);
    }

    /**
     * Search courses.
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->validate([
            'q' => 'required|string|min:2|max:100',
            'per_page' => 'nullable|integer|min:1|max:50'
        ]);

        $courses = Course::published()
            ->where(function ($builder) use ($query) {
                $builder->where('title', 'like', "%{$query['q']}%")
                        ->orWhere('description', 'like', "%{$query['q']}%")
                        ->orWhere('instructor_name', 'like', "%{$query['q']}%");
            })
            ->ordered()
            ->paginate($query['per_page'] ?? 12);

        return response()->json([
            'courses' => CourseResource::collection($courses->items()),
            'meta' => [
                'query' => $query['q'],
                'current_page' => $courses->currentPage(),
                'last_page' => $courses->lastPage(),
                'per_page' => $courses->perPage(),
                'total' => $courses->total()
            ]
        ]);
    }
}
