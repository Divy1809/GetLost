-- Update users table to include OTP-related fields for email and phone verification

-- Add OTP fields to existing users table
ALTER TABLE users 
ADD COLUMN email_otp VARCHAR(6) DEFAULT NULL,
ADD COLUMN phone_otp VARCHAR(6) DEFAULT NULL,
ADD COLUMN email_otp_expires_at TIMESTAMP NULL DEFAULT NULL,
ADD COLUMN phone_otp_expires_at TIMESTAMP NULL DEFAULT NULL,
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;

-- Create index for faster OTP lookups
CREATE INDEX idx_email_otp ON users(email_otp);
CREATE INDEX idx_phone_otp ON users(phone_otp);

-- Optional: Create a separate OTP tracking table for better security and logging
CREATE TABLE IF NOT EXISTS otp_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    otp_type ENUM('email', 'phone') NOT NULL,
    otp_purpose ENUM('signup', 'signin') NOT NULL,
    otp_value VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for OTP logs
CREATE INDEX idx_otp_logs_user ON otp_logs(user_id);
CREATE INDEX idx_otp_logs_type ON otp_logs(otp_type);
CREATE INDEX idx_otp_logs_expires ON otp_logs(expires_at);