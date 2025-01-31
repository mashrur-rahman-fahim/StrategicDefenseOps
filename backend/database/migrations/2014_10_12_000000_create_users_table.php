<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id'); // Primary key
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('google_id')->nullable();
            
            // Foreign key for roles table
            $table->foreignId('role_id')->constrained('roles');

            // Parent ID column for self-referencing foreign key
            $table->unsignedInteger('parent_id')->nullable(); // Explicitly use unsignedInteger

            $table->rememberToken();
            $table->timestamps();

            // Specify InnoDB for foreign key support
            $table->engine = 'InnoDB';
        });

        // Add the self-referencing foreign key constraint
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop foreign key for parent_id
            $table->dropForeign(['parent_id']);
        });

        // Drop the users table
        Schema::dropIfExists('users');
    }
};
