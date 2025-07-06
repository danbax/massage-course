<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class CourseAccessDeniedException extends Exception
{
    protected $message = 'Access to this course is denied.';
    protected $code = 403;

    public function __construct(string $message = null, int $code = 403, \Throwable $previous = null)
    {
        $this->message = $message ?? $this->message;
        $this->code = $code;
        parent::__construct($this->message, $this->code, $previous);
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render(): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
            'error' => 'course_access_denied',
            'code' => $this->getCode(),
            'suggestions' => [
                'Check if you are enrolled in this course',
                'Verify your payment has been processed',
                'Contact support if you believe this is an error'
            ]
        ], $this->getCode());
    }

    /**
     * Create exception for unenrolled user
     */
    public static function notEnrolled(string $courseTitle = null): self
    {
        $message = $courseTitle 
            ? "You are not enrolled in the course: {$courseTitle}"
            : "You are not enrolled in this course";
            
        return new self($message);
    }

    /**
     * Create exception for unpaid course
     */
    public static function paymentRequired(string $courseTitle = null): self
    {
        $message = $courseTitle 
            ? "Payment is required to access the course: {$courseTitle}"
            : "Payment is required to access this course";
            
        return new self($message);
    }

    /**
     * Create exception for course not published
     */
    public static function courseNotPublished(): self
    {
        return new self("This course is not currently available");
    }

    /**
     * Create exception for prerequisites not met
     */
    public static function prerequisitesNotMet(array $missingPrerequisites = []): self
    {
        $message = "You must complete the required prerequisites before accessing this course";
        
        if (!empty($missingPrerequisites)) {
            $message .= ": " . implode(', ', $missingPrerequisites);
        }
        
        return new self($message);
    }

    /**
     * Create exception for lesson access
     */
    public static function lessonAccess(string $lessonTitle = null): self
    {
        $message = $lessonTitle 
            ? "Access denied to lesson: {$lessonTitle}"
            : "Access denied to this lesson";
            
        return new self($message);
    }

    /**
     * Create exception for expired access
     */
    public static function accessExpired(): self
    {
        return new self("Your access to this course has expired");
    }
}
