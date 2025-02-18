<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'vehicle';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'authorized_by',
        'vehicle_name',
        'vehicle_description',
        'vehicle_count',
        'vehicle_type',
        'vehicle_category',
        'vehicle_model',
        'vehicle_manufacturer',
        'vehicle_serial_number',
        'vehicle_capacity',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'vehicle_count' => 'integer',
        'vehicle_capacity' => 'integer',
    ];

    /**
     * Get the user who authorized the vehicle.
     */
    public function authorizedBy()
    {
        return $this->belongsTo(User::class, 'authorized_by');
    }

    /**
     * Get the resource associated with the vehicle.
     */
    public function resource()
    {
        return $this->hasOne(Resources::class, 'vehicle_id');
    }
}