-- Create travel_posts table for solo traveller posts
CREATE TABLE travel_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    origin_city VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_destination ON travel_posts(destination_city);
CREATE INDEX idx_user_id ON travel_posts(user_id);
CREATE INDEX idx_created_at ON travel_posts(created_at);

-- Show table structure
DESCRIBE travel_posts;