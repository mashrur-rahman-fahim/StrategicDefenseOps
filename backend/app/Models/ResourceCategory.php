<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResourceCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'resource_category',
    ];

    public function resources()
    {
        return $this->hasMany(Resources::class, 'resource_category');
    }
}
