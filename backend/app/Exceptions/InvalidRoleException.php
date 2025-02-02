<?php

namespace App\Exceptions;

use Exception;

class InvalidRoleException extends Exception
{
    public function __construct($message = "Invalid security clearance level specified")
    {
        parent::__construct($message);
    }
}