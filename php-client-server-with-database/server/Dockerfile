FROM php:8.5-apache

# Install end anable required php extension (mysqli)
RUN docker-php-ext-install mysqli
RUN docker-php-ext-enable mysqli 

# define working dir
WORKDIR /var/www/html

# copy sourcode into the workingdir
COPY src/. /var/www/html

# expose port 80
EXPOSE 80

