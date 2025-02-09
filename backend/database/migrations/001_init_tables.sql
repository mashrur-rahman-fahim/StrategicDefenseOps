CREATE TABLE `roles` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `role_name` ENUM('admin', 'manager', 'operator', 'viewer') NOT NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL
);
CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `email_verified_at` TIMESTAMP NULL,
    `password` VARCHAR(255) NOT NULL,
    `google_id` VARCHAR(255) NULL,
    `role_id` INT UNSIGNED NOT NULL,
    `parent_id` INT UNSIGNED NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
    CONSTRAINT `users_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `users`(`id`) ON DELETE NULL
) ;
CREATE TABLE `password_resets` (
    `email` VARCHAR(255) NOT NULL PRIMARY KEY,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL
);
CREATE TABLE `failed_jobs` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid` VARCHAR(255) NOT NULL UNIQUE,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `personal_access_tokens` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) NOT NULL UNIQUE,
    `abilities` TEXT NULL,
    `last_used_at` TIMESTAMP NULL,
    `expires_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
    KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)
);
CREATE TABLE operations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('ongoing', 'upcoming', 'completed') NOT NULL,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    location VARCHAR(255) NULL,
    created_by INT UNSIGNED NOT NULL,
    updated_by INT UNSIGNED NOT NULL,
    budget DECIMAL(10, 2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE null,
);




create table weapon(
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    authorized_by INT unsigned not null ,
    weapon_name varchar(200) NOT NULL,
    weapon_description TEXT,
    weapon_count INT NOT NULL,
    weapon_category varchar(200),
    weapon_type varchar(200),
    weapon_model varchar(200),
    weapon_manufacturer varchar(200),
    weapon_serial_number varchar(200) NOT NULL UNIQUE,
    weapon_weight DECIMAL(10,2),
    weapon_range DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (authorized_by) REFERENCES users(id) ON DELETE CASCADE
   );
-- create table vehicle(
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     authorized_by INT not null,
--     vehicle_name varchar(200) NOT NULL,
--     vehicle_description TEXT,
--     vehicle_count INT NOT NULL,
--     vehicle_type varchar(200),  --car
--     vehicle_category varchar(200) ,--land,air
--     vehicle_model varchar(200),
--     vehicle_manufacturer varchar(200),
--     vehicle_serial_number varchar(200) NOT NULL,
--     vehicle_capacity int ,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (authorized_by) REFERENCES users(id) on DELETE CASCADE
-- )

create table resource_category(
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    resource_category ENUM ('vehicle','weapon','personnel','equipment'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table Resources(
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    resources_name VARCHAR(200) not null,
    resource_category int UNSIGNED not null ,
    weapon_id int unsigned NULL ,   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (weapon_id) REFERENCES weapon(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_category) references resource_category(id) on DELETE CASCADE
);

create table operation_resources (
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    operation_id INT not null ,
    resource_id INT unsigned not null ,
    resource_count INT unsigned not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) references resources(id) on DELETE CASCADE,
    FOREIGN KEY (operation_id) REFERENCES operations(id) on DELETE CASCADE
);
