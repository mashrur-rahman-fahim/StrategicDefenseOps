<?php

namespace App\Exceptions;

use Exception;

class UserNotAssignedException extends Exception
{
    public function __construct($message = "Personnel not assigned to this unit")
    {
        parent::__construct($message);
    }
}