<?php

namespace App\Http\Controllers;

use App\Services\TestService;
use Illuminate\Http\Request;

class TestController extends Controller
{
    private $testService;

    public function __construct(TestService $testService)
    {
        $this->testService = $testService;
    }

    public function getTestHuman(Request $request)
    {
        $data = $this->testService->getTestHuman();
        return $data;
    }
}
