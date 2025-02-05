CREATE TABLE `roles` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
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
    `role_id` BIGINT UNSIGNED NOT NULL,
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
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid` VARCHAR(255) NOT NULL UNIQUE,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
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




create table weapon (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT not null,
    weapon_name varchar(200) NOT NULL,
    weapon description TEXT,
    weapon_count BIGINT NOT NULL,
    weapon_category varchar(200),
    weapon_type varchar(200),
    weapon_model varchar(200),
    weapon_manufacturer varchar(200),
    weapon_serial_number varchar(200) NOT NULL,
    weapon_weight varchar(200),
    weapon_caliber varchar(200),
    weapon_range varchar(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) on DELETE CASCADE
);
create table Resources(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) not null,
    resource_category int UNSIGNED not null REFERENCES resource_category(id) on DELETE CASCADE,
    weapon_id BIGINT REFERENCES weapon(id) on DELETE CASCADE,   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);

create table resource_category(
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_category_type ENUM ('vehicle','weapon','personnel','equipment'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
create table operation_resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    operation_id BIGINT not null REFERENCES  operations(id) ON DELETE CASCADE,
    resource_id BIGINT not null REFERENCES resources(id) ON DELETE CASCADE,
    resource_count BIGINT not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
