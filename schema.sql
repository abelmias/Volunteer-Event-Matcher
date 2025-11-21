-- Volunteer Event Matcher - Database Schema
-- PostgreSQL DDL Script

-- ============================================
-- USERS TABLE (Base for Admin and Helper)
-- ============================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'HELPER')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster username lookups
CREATE INDEX idx_users_username ON users(username);

-- ============================================
-- ADMIN TABLE (Extends Users)
-- ============================================
CREATE TABLE admin (
    admin_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    role_description VARCHAR(100) DEFAULT 'Event Coordinator/Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- HELPER TABLE (Extends Users)
-- ============================================
CREATE TABLE helper (
    helper_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    email VARCHAR(100),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Index for faster email lookups
CREATE INDEX idx_helper_email ON helper(email);

-- ============================================
-- CATALOG TABLE
-- ============================================
CREATE TABLE catalog (
    catalog_id SERIAL PRIMARY KEY,
    name VARCHAR(100) DEFAULT 'Volunteer Opportunities Catalog',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EVENT TABLE (Main Event Entity)
-- ============================================
CREATE TABLE event (
    event_id SERIAL PRIMARY KEY,
    catalog_id INT NOT NULL,
    admin_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    organizer VARCHAR(100),
    tags TEXT,  -- JSON array or comma-separated values
    slots_available INT NOT NULL CHECK (slots_available >= 0),
    registered_volunteers INT DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (catalog_id) REFERENCES catalog(catalog_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE CASCADE
);

-- Indexes for faster queries
CREATE INDEX idx_event_catalog ON event(catalog_id);
CREATE INDEX idx_event_admin ON event(admin_id);
CREATE INDEX idx_event_city ON event(city);
CREATE INDEX idx_event_date ON event(event_date);
CREATE INDEX idx_event_status ON event(status);
CREATE INDEX idx_event_coordinates ON event(latitude, longitude);

-- ============================================
-- EVENT_SUGGESTION TABLE
-- ============================================
CREATE TABLE event_suggestion (
    suggestion_id SERIAL PRIMARY KEY,
    helper_id INT NOT NULL,
    admin_id INT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    suggested_date DATE,
    suggested_time TIME,
    location VARCHAR(255),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    organizer VARCHAR(100),
    tags TEXT,  -- JSON array or comma-separated values
    suggested_slots INT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (helper_id) REFERENCES helper(helper_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE SET NULL
);

-- Indexes for faster queries
CREATE INDEX idx_suggestion_helper ON event_suggestion(helper_id);
CREATE INDEX idx_suggestion_admin ON event_suggestion(admin_id);
CREATE INDEX idx_suggestion_status ON event_suggestion(status);

-- ============================================
-- COLLECTION TABLE (Helper's Basket)
-- ============================================
CREATE TABLE collection (
    collection_id SERIAL PRIMARY KEY,
    helper_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (helper_id) REFERENCES helper(helper_id) ON DELETE CASCADE
);

-- Index for faster lookups
CREATE INDEX idx_collection_helper ON collection(helper_id);

-- ============================================
-- VOLUNTEER_EVENT TABLE (Join Table)
-- Maps Events to Helper Collections
-- ============================================
CREATE TABLE volunteer_event (
    volunteer_event_id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    collection_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'INTERESTED' CHECK (status IN ('INTERESTED', 'COMMITTED', 'CANCELLED')),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    committed_at TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES collection(collection_id) ON DELETE CASCADE,
    UNIQUE(event_id, collection_id)  -- Prevent duplicate entries
);

-- Indexes for faster queries
CREATE INDEX idx_volunteer_event_event ON volunteer_event(event_id);
CREATE INDEX idx_volunteer_event_collection ON volunteer_event(collection_id);
CREATE INDEX idx_volunteer_event_status ON volunteer_event(status);

-- ============================================
-- ADMIN_DASHBOARD TABLE
-- ============================================
CREATE TABLE admin_dashboard (
    dashboard_id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL UNIQUE,
    pending_suggestions_count INT DEFAULT 0,
    total_events INT DEFAULT 0,
    total_volunteers INT DEFAULT 0,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE CASCADE
);

-- Index for faster lookups
CREATE INDEX idx_dashboard_admin ON admin_dashboard(admin_id);

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- Insert sample catalog
INSERT INTO catalog (name, description) VALUES 
('Volunteer Opportunities Catalog', 'Central catalog for all volunteer events');

-- Insert sample admin user
INSERT INTO users (username, password, role) VALUES 
('admin', '$2a$10$slYQmyNdGzin7olVN3p5be4DFH5yYQZR8Oy0p/K8mkIHVeYgJ7jFm', 'ADMIN');

-- Insert admin record
INSERT INTO admin (user_id, role_description) VALUES 
(1, 'Event Coordinator/Admin');

-- Insert sample helper user
INSERT INTO users (username, password, role) VALUES 
('volunteer1', '$2a$10$slYQmyNdGzin7olVN3p5be4DFH5yYQZR8Oy0p/K8mkIHVeYgJ7jFm', 'HELPER');

-- Insert helper record
INSERT INTO helper (user_id, email, phone_number) VALUES 
(2, 'volunteer1@example.com', '+1-555-0001');

-- Insert sample event
INSERT INTO event (catalog_id, admin_id, title, description, event_date, location, city, latitude, longitude, organizer, tags, slots_available, status) VALUES 
(1, 1, 'Beach Cleanup', 'Help clean up the local beach', '2025-12-15', 'Sunny Beach', 'Coastal City', 40.7128, -74.0060, 'Environmental Group', 'environment,outdoor', 20, 'OPEN');

-- Insert collection for helper
INSERT INTO collection (helper_id) VALUES (1);

-- Insert admin dashboard
INSERT INTO admin_dashboard (admin_id, pending_suggestions_count, total_events, total_volunteers) VALUES 
(1, 0, 1, 1);

-- ============================================
-- VIEWS (Optional - for easier querying)
-- ============================================

-- View: All events with admin details
CREATE VIEW event_with_admin AS
SELECT 
    e.event_id,
    e.title,
    e.description,
    e.event_date,
    e.location,
    e.city,
    e.latitude,
    e.longitude,
    e.slots_available,
    e.registered_volunteers,
    e.status,
    u.username as admin_username
FROM event e
JOIN admin a ON e.admin_id = a.admin_id
JOIN users u ON a.user_id = u.user_id;

-- View: Helper collections with event details
CREATE VIEW helper_collection_view AS
SELECT 
    h.helper_id,
    u.username as helper_username,
    c.collection_id,
    e.event_id,
    e.title as event_title,
    e.event_date,
    e.location,
    ve.status as volunteer_status,
    ve.added_at,
    ve.committed_at
FROM helper h
JOIN users u ON h.user_id = u.user_id
LEFT JOIN collection c ON h.helper_id = c.helper_id
LEFT JOIN volunteer_event ve ON c.collection_id = ve.collection_id
LEFT JOIN event e ON ve.event_id = e.event_id;

-- ============================================
-- END OF SCHEMA
-- ============================================
