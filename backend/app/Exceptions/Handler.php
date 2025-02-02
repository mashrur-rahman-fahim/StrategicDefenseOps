<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Database\QueryException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use App\Exceptions\InvalidRoleException;
use App\Exceptions\UserNotAssignedException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
/* Added military-specific error classifications and headers:

X-Error-Code with codes like INVALID_CLEARANCE

X-Required-Clearance for authorization requirements

X-Lockdown-Reset for rate limiting */

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        InvalidRoleException::class => 'warning',
        UserNotAssignedException::class => 'notice',
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        AuthorizationException::class,
        AuthenticationException::class,
        TokenMismatchException::class,
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
        'secret',
        'api_token',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            // Custom reporting logic for critical errors
            if ($this->shouldReport($e) && app()->environment('production')) {
                $this->logCriticalError($e);
            }
        });

        // Custom exceptions for military inventory specific errors
        $this->renderable(function (InvalidRoleException $e) {
            return response()->json([
                'message' => 'Security Clearance Error',
                'errors' => [
                    'role' => [
                        'Invalid security clearance level for requested operation',
                        'Incident will be logged and reviewed'
                    ]
                ]
            ], 403)->header('X-Error-Code', 'INVALID_CLEARANCE');
        });

        $this->renderable(function (UserNotAssignedException $e) {
            return response()->json([
                'message' => 'Personnel Assignment Error',
                'errors' => [
                    'assignment' => [
                        'Specified personnel not assigned to this unit',
                        'Verify chain of command and try again'
                    ]
                ]
            ], 404)->header('X-Error-Code', 'PERSONNEL_NOT_ASSIGNED');
        });

        // Enhanced authentication handling for military-grade security
        $this->renderable(function (AuthenticationException $e) {
            return response()->json([
                'message' => 'Access Denied - Authentication Required',
                'errors' => [
                    'security' => [
                        'Valid military credentials required',
                        'Two-factor authentication might be needed'
                    ]
                ]
            ], 401)->header('WWW-Authenticate', 'Bearer');
        });

        // Strict authorization handling
        $this->renderable(function (AuthorizationException $e) {
            return response()->json([
                'message' => 'Operation Not Permitted',
                'errors' => [
                    'authorization' => [
                        'Your current security clearance does not permit this action',
                        'Request elevation through proper channels if needed'
                    ]
                ]
            ], 403)->header('X-Required-Clearance', 'LEVEL_4');
        });

        // Database integrity protection
        $this->renderable(function (QueryException $e) {
            $errorCode = $e->errorInfo[1] ?? null;
            $message = 'Military Database Integrity Error';

            switch ($errorCode) {
                case 1062: // Duplicate entry
                    return response()->json([
                        'message' => $message,
                        'errors' => [
                            'database' => [
                                'Duplicate entry detected',
                                'Asset serial numbers must be unique'
                            ]
                        ]
                    ], 409);

                case 1451: // Foreign key constraint
                    return response()->json([
                        'message' => $message,
                        'errors' => [
                            'database' => [
                                'Cannot delete referenced asset',
                                'Remove dependent inventory items first'
                            ]
                        ]
                    ], 423);

                default:
                    Log::channel('secure')->error("Database breach attempt detected: {$e->getMessage()}");
                    return response()->json([
                        'message' => $message,
                        'errors' => [
                            'database' => [
                                'Classified database operation failed',
                                'Incident has been logged'
                            ]
                        ]
                    ], 500);
            }
        });

        // Rate limiting with military-grade protection
        $this->renderable(function (ThrottleRequestsException $e) {
            $retryAfter = $e->getHeaders()['Retry-After'] ?? 60;
            
            return response()->json([
                'message' => 'Security System Engaged',
                'errors' => [
                    'threat' => [
                        'Excessive access attempts detected',
                        'Security lockdown engaged',
                        'System will reset in '.$retryAfter.' seconds'
                    ]
                ]
            ], 429)
            ->header('Retry-After', $retryAfter)
            ->header('X-Lockdown-Reset', now()->addSeconds($retryAfter)->toIso8601String());
        });

        // CSRF protection for sensitive military operations
        $this->renderable(function (TokenMismatchException $e) {
            return response()->json([
                'message' => 'Session Security Breach Detected',
                'errors' => [
                    'session' => [
                        'Operation session expired',
                        'Re-authenticate and confirm security challenge'
                    ]
                ]
            ], 419)->header('X-Session-Reset', 'true');
        });

        // Final fallback handler with security logging
        $this->renderable(function (Throwable $e) {
            $statusCode = $this->getStatusCode($e);
            $errorCode = $this->getErrorCode($e);

            $response = [
                'message' => 'Classified Operation Error',
                'errors' => [
                    'system' => [
                        'A secure operation failure occurred',
                        'Security team has been notified'
                    ]
                ],
                'incident_id' => uniqid('MIL-ERR-'),
            ];

            if (config('app.debug')) {
                $response['debug'] = $this->getDebugInfo($e);
            }

            Log::channel('secure')->critical("Security incident {$response['incident_id']}: {$e->getMessage()}");

            return response()->json($response, $statusCode)
                ->header('X-Error-Code', $errorCode)
                ->header('X-Incident-ID', $response['incident_id']);
        });
    }

    /**
     * Get appropriate HTTP status code
     */
    protected function getStatusCode(Throwable $e): int
    {
        if ($e instanceof HttpExceptionInterface) {
            return $e->getStatusCode();
        }

        return match (true) {
            $e instanceof AuthenticationException => 401,
            $e instanceof AuthorizationException => 403,
            $e instanceof ModelNotFoundException,
            $e instanceof NotFoundHttpException => 404,
            $e instanceof MethodNotAllowedHttpException => 405,
            $e instanceof ValidationException => 422,
            $e instanceof TokenMismatchException => 419,
            $e instanceof ThrottleRequestsException => 429,
            $e instanceof QueryException => 500,
            default => 500,
        };
    }

    /**
     * Get error code classification
     */
    protected function getErrorCode(Throwable $e): string
    {
        return match (true) {
            $e instanceof ModelNotFoundException => 'ASSET_NOT_FOUND',
            $e instanceof AuthorizationException => 'CLEARANCE_VIOLATION',
            $e instanceof QueryException => 'DB_SECURITY_BREACH',
            default => 'MIL_OP_FAILURE',
        };
    }

    /**
     * Get debug information
     */
    protected function getDebugInfo(Throwable $e): array
    {
        return [
            'exception' => get_class($e),
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => collect($e->getTrace())->take(5)->toArray(),
        ];
    }

    /**
     * Log critical security errors
     */
    protected function logCriticalError(Throwable $e): void
    {
        Log::channel('secure')->critical(
            'SECURITY INCIDENT: ' . $e->getMessage(),
            [
                'exception' => get_class($e),
                'url' => request()?->fullUrl(),
                'ip' => request()?->ip(),
                'user' => auth()?->id() ?? 'unauthenticated',
            ]
        );
    }
}