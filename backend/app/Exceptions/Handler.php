<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{

    /**
     * The render method is responsible for rendering the exception as an HTTP response. 
     * You can customize this method to return a custom response (such as JSON or a specific view)
     * when an exception occurs.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Throwable $exception
     * @return \Illuminate\Http\JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function render($request, Throwable $exception)
    {
        error_log($exception);
        $message = $exception->getMessage();

        return response()->json([
            'success' => false,
            'message' => $message,
            'exception' => (string) $exception
        ], 200);
    }

}
