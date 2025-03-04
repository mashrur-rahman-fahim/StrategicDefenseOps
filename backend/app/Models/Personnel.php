<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personnel extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'personnel';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'authorized_by',
        'personnel_name',
        'personnel_description',
        'personnel_count',
        'personnel_category',
        'personnel_type',
        'personnel_rank',
        'skills',
        'personnel_serial_number',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'personnel_count' => 'integer', // Cast personnel_count to integer
    ];

    /**
     * Get the user who authorized the personnel.
     */
    public function authorizedBy()
    {
        return $this->belongsTo(User::class, 'authorized_by');
    }

    /**
     * Get the resource associated with the personnel.
     */
    public function resource()
    {
        return $this->hasOne(Resources::class, 'personnel_id');
    }
}
