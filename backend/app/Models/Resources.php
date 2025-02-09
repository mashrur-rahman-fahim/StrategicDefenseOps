<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resources extends Model
{
    use HasFactory;
    protected $fillable=[
        'name',
        'resource_category',
    ];
    public function category()
    {
        return $this->belongsTo(ResourceCategory::class, 'resource_category');
    }

    public function weapon()
    {
        return $this->belongsTo(Weapon::class, 'weapon_id');
    }

  
    public function operationResources(){
        return $this->hasMany(OperationResources::class,'resource_id');
    }
   
}
