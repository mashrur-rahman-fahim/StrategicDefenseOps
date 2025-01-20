# Laravel Simplified Version

This is a simple boilerplate code for laravel without any fancy stuff. Most built-in middlewares and service provider have been removed from the app to make it as simple as possible.

## Getting started

1. Install PHP 8.0 and composer as illustrated in the [slide](https://docs.google.com/presentation/d/1ra9nCzrMlHrKyxoe_yezsgn8PJ6eG9Q3bztFZNrqhf0/edit?usp=sharing)
2. Clone the repository
3. Checkout to the branch `simple-api` using `git checkout simple-api`
4. Install dependencies by running `composer install`
5. Run `php artisan serve` to start the api server. 
6. [optional] Copy the .env.example file as .env later on

## Recommended extensions to use

- https://marketplace.visualstudio.com/items?itemName=DEVSENSE.phptools-vscode
- https://marketplace.visualstudio.com/items?itemName=DEVSENSE.composer-php-vscode 

## Project directory

```
api-backend/
├── app/
│   ├── Console/Kernel
│   ├── Exceptions/Handler
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Kernel
│   ├── Models/
│   ├── Providers/
│   └── Services/
├── bootstrap/
├── config/
├── database/
│   ├── migrations/
├── public/

```

## Creating a controller

```sh
php artisan make:controller TestController
```

This will create a controller file in `app/Http/Controllers`.

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function getTestHuman(Request $request)
    {
        return "This is a test human response from TestController";
    }
 
}
```

Now, we need to add this to our `routes/api.php` route. 

```php
Route::get('/test', [TestController::class, 'getTestHuman']);
```

Note that we only have 1 file in `routes` folder. The rest of the files were removed to make it easy to understand. 

Now, if we make a `GET` request to `http://localhost:8000/api/test`, the `getTestHuman()` function should be executed and we should see a response saying "This is a test human response from TestController"

Similarly, we can do POST/PUT/DELETE operations.

What if we want to make a GET request with a route parameter? like this: `http://localhost:8000/api/test/120`. How can we obtain the value `120`?

We do this with `$request->route('<route-param-key>')`

```php
class TestController extends Controller
{
    public function getTestHumanWithId(Request $request)
    {
        $id = $request->route('id');
        return "This is a test human response from TestController with id: $id";
    }
}
```

```php
Route::get('/test/{id}', [TestController::class, 'getTestHumanWithId']);
```

## Creating a service

Controllers shouldn't deal with business logic. That's the job of the Services. To create a new service, make a folder called `Services` in `app/Services` and create a new file named `TestService.php`

```php
<?php

namespace App\Services;

class TestService
{
    public function getTestHuman()
    {
        return "Test human returned from TestService";
    }
}

```

Now, we need to use this service in our `TestController`. To do this, we can use dependency injection to inject this directly in the constructor.

```php
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

```

## Creating a middleware

To create a middleware, we can run the command: 

```sh
php artisan make:middleware TestMiddleware
```
This will create a `TestMiddleware` in `app/Http/Middleware`. Add the following code to it: 

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TestMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->input('token')) {
            return response()->json([
                'error' => 'Unauthorized access',
                'message' => 'Invalid or missing token.',
            ], 401);
        }

        return $next($request);
    }
}
```
Now, we need to tell Laravel, when this middleware should work. We do this in the `app/Http/Kernel.php` file. We can either attach it to the global middleware (`$middleware`) or as route middlewares (`$routeMiddleware`). 

For this example, let's attach this as a route middleware:

```php
protected $routeMiddleware = [
    'test.middleware' =>\App\Http\Middleware\TestMiddleware::class,
];
 ```

Now that you have registered the middleware in the $routeMiddleware array, you can apply it to specific routes by using its alias (test.middleware):

```php
Route::get('/test', [TestController::class, 'getTestHuman'])->middleware('test.middleware');
```

## Troubleshoot

1. Sometimes, cached routes can cause issues if routes have changed but the cache hasn't been cleared. You can clear the route cache by running the following command: `php artisan route:clear`
2. Display all available routes in your application: `php artisan route:list`
3. `php artisan cache:clear`

