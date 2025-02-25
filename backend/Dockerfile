# Use PHP 8.1 with FPM
FROM php:8.1-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    zip unzip curl git libpng-dev libjpeg-dev libfreetype6-dev nginx \
    && docker-php-ext-install pdo pdo_mysql gd

# Set working directory
WORKDIR /var/www

# Copy Laravel files to the container
COPY . .

# Install Composer dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chmod -R 777 storage bootstrap/cache

# Expose port 80 for Nginx
EXPOSE 80

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Start Nginx and PHP-FPM
CMD service nginx start && php-fpm
