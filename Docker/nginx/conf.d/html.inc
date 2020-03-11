etag off;
if_modified_since off;
add_header Last-Modified '';
add_header Strict-Transport-Security 'max-age=31536000; preload';
add_header X-Frame-Options sameorigin;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection '1; mode=block';
add_header Cache-Control 'max-age=0, private, must-revalidate';
