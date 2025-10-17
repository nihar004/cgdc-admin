-- ============================================================
-- PLACEMENT MANAGEMENT SYSTEM - DATABASE SCHEMA
-- ============================================================
-- PostgreSQL Database Schema for Student Placement Management
-- Includes: Students, Companies, Events, Forms, Penalties, etc.
-- ============================================================

-- Standard PostgreSQL settings
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- ============================================================
-- ENUMS (Custom Types)
-- ============================================================

-- Application status for student applications
CREATE TYPE application_status_enum AS ENUM (
    'applied',
    'shortlisted',
    'rejected'
);

-- Attendance tracking statuses
CREATE TYPE attendance_status_enum AS ENUM (
    'present',
    'absent',
    'late',
    'excused'
);

-- Email template categories
CREATE TYPE category_enum AS ENUM (
    'general',
    'placement',
    'event',
    'reminder'
);

-- Company industry sectors
CREATE TYPE company_sector_enum AS ENUM (
    'E-Commerce, Logistics and Business',
    'EdTech',
    'IT & Consulting',
    'IT Service',
    'IT Software (Product)',
    'Others*'
);

-- Company classification
CREATE TYPE company_type_enum AS ENUM (
    'tech',
    'nontech'
);

-- Document types for company positions
CREATE TYPE document_type_enum AS ENUM (
    'job_description',
    'salary_breakdown',
    'company_presentation',
    'bond_details',
    'eligibility_criteria',
    'other'
);

-- Event lifecycle statuses
CREATE TYPE event_status_enum AS ENUM (
    'upcoming',
    'ongoing',
    'completed',
    'cancelled'
);

-- Types of placement events
CREATE TYPE event_type_enum AS ENUM (
    'workshop',
    'seminar',
    'company_visit',
    'aptitude_test',
    'technical_round',
    'hr_round',
    'group_discussion',
    'other',
    'final_interview',
    'career_guidance',
    'skill_development',
    'pre_placement_talk',
    'training'
);

-- Form types for data collection
CREATE TYPE form_type_enum AS ENUM (
    'application',
    'feedback',
    'survey',
    'attendance',
    'custom'
);

-- Job offering types
CREATE TYPE job_type_enum AS ENUM (
    'internship_plus_ppo',
    'internship',
    'full_time'
);

-- Event delivery modes
CREATE TYPE mode_enum AS ENUM (
    'online',
    'offline',
    'hybrid'
);

-- Student placement statuses
CREATE TYPE placement_status_enum AS ENUM (
    'placed',
    'unplaced',
    'higher_studies',
    'entrepreneurship',
    'debarred',
    'family_business',
    'others'
);

-- Round result statuses
CREATE TYPE result_status_enum AS ENUM (
    'selected',
    'rejected',
    'waitlisted',
    'pending'
);

-- Interview round classifications
CREATE TYPE round_type_enum AS ENUM (
    'first',
    'middle',
    'last'
);

-- Penalty severity levels
CREATE TYPE severity_enum AS ENUM (
    'minor',
    'moderate',
    'major',
    'severe'
);

-- Academic specializations
CREATE TYPE specialization_enum AS ENUM (
    'CSE',
    'ECE',
    'ME'
);

-- User role in the system
CREATE TYPE user_role_enum AS ENUM (
    'admin',
    'placement_officer',
    'faculty'
);

-- ============================================================
-- TABLES
-- ============================================================

-- ------------------------------------------------------------
-- Batches: Academic year batches
-- ------------------------------------------------------------
CREATE TABLE batches (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL UNIQUE
);

-- ------------------------------------------------------------
-- Users: System administrators and staff
-- ------------------------------------------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role user_role_enum NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Students: Student master data
-- ------------------------------------------------------------
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    enrollment_number VARCHAR(50) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(15),
    college_email VARCHAR(255) NOT NULL,
    personal_email VARCHAR(255),
    department VARCHAR(100) NOT NULL,
    branch VARCHAR(100),
    batch_year INTEGER NOT NULL,
    current_semester INTEGER,
    cgpa NUMERIC(4,3),
    backlogs INTEGER DEFAULT 0,
    resume_url VARCHAR(500),
    linkedin_url VARCHAR(300),
    github_url VARCHAR(300),
    date_of_birth DATE,
    gender VARCHAR(20),
    registration_number VARCHAR(11),
    class_10_percentage NUMERIC(5,2),
    class_12_percentage NUMERIC(5,2),
    permanent_address TEXT,
    permanent_city VARCHAR(100),
    permanent_state VARCHAR(100),
    ps2_company_name VARCHAR(200),
    ps2_project_title VARCHAR(300),
    ps2_certificate_url VARCHAR(500),
    drives_skipped INTEGER DEFAULT 0,
    dream_opportunity_used BOOLEAN DEFAULT false,
    upgrade_opportunities_used INTEGER DEFAULT 0,
    placement_status placement_status_enum DEFAULT 'unplaced',
    offers_received JSONB,
    current_offer JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    alternate_phone VARCHAR(15),
    dream_company_details JSON,
    dream_company_used BOOLEAN DEFAULT false,
    
    CONSTRAINT fk_students_batch FOREIGN KEY (batch_year) 
        REFERENCES batches(year) ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- Companies: Recruiting companies master data
-- ------------------------------------------------------------
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    company_description TEXT,
    is_marquee BOOLEAN DEFAULT false,
    website_url VARCHAR(300),
    linkedin_url VARCHAR(300),
    primary_hr_name VARCHAR(100),
    primary_hr_designation VARCHAR(100),
    primary_hr_email VARCHAR(255),
    primary_hr_phone VARCHAR(15),
    scheduled_visit DATE,
    actual_arrival DATE,
    glassdoor_rating NUMERIC(3,2),
    work_locations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    min_cgpa NUMERIC(4,2),
    max_backlogs INTEGER,
    bond_required BOOLEAN DEFAULT false,
    sector company_sector_enum DEFAULT 'Others*',
    account_owner VARCHAR(200),
    allowed_specializations specialization_enum[] DEFAULT '{}'
);

-- ------------------------------------------------------------
-- Company Batches: Link companies to batches
-- ------------------------------------------------------------
CREATE TABLE company_batches (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    batch_id INTEGER NOT NULL,
    
    UNIQUE(company_id, batch_id),
    
    CONSTRAINT company_batches_company_id_fkey FOREIGN KEY (company_id) 
        REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT company_batches_batch_id_fkey FOREIGN KEY (batch_id) 
        REFERENCES batches(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Company Positions: Job positions offered by companies
-- ------------------------------------------------------------
CREATE TABLE company_positions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    position_title VARCHAR(200) NOT NULL,
    job_type job_type_enum DEFAULT 'internship',
    package_range NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    internship_stipend_monthly NUMERIC(10,2) DEFAULT 0.00,
    rounds_start_date DATE,
    rounds_end_date DATE,
    is_active BOOLEAN DEFAULT true,
    company_type company_type_enum DEFAULT 'tech' NOT NULL,
    
    CONSTRAINT company_positions_company_id_fkey FOREIGN KEY (company_id) 
        REFERENCES companies(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Position Documents: Documents related to positions
-- ------------------------------------------------------------
CREATE TABLE position_documents (
    id SERIAL PRIMARY KEY,
    position_id INTEGER NOT NULL,
    document_type document_type_enum NOT NULL,
    document_title VARCHAR(255) NOT NULL,
    document_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    display_order INTEGER DEFAULT 1,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    original_filename VARCHAR(255),
    
    CONSTRAINT position_documents_position_id_fkey FOREIGN KEY (position_id) 
        REFERENCES company_positions(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Company Eligibility: Track eligible students per company
-- ------------------------------------------------------------
CREATE TABLE company_eligibility (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    batch_id INTEGER NOT NULL,
    eligible_student_ids JSONB DEFAULT '[]' NOT NULL,
    ineligible_student_ids JSONB DEFAULT '[]' NOT NULL,
    dream_company_student_ids JSONB DEFAULT '[]' NOT NULL,
    total_eligible_count INTEGER DEFAULT 0,
    total_ineligible_count INTEGER DEFAULT 0,
    eligibility_criteria JSONB,
    snapshot_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    manual_override_reasons JSONB DEFAULT '{}',
    
    UNIQUE(company_id, batch_id),
    
    CONSTRAINT company_eligibility_company_id_fkey FOREIGN KEY (company_id) 
        REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT company_eligibility_batch_id_fkey FOREIGN KEY (batch_id) 
        REFERENCES batches(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Events: Placement events and interview rounds
-- ------------------------------------------------------------
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    event_type event_type_enum NOT NULL,
    venue VARCHAR(200),
    mode mode_enum NOT NULL,
    speaker_details JSONB,
    is_mandatory BOOLEAN DEFAULT false,
    status event_status_enum DEFAULT 'upcoming',
    is_placement_event BOOLEAN DEFAULT false,
    company_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    target_specializations specialization_enum[] DEFAULT '{}',
    event_date DATE,
    start_time TIME,
    end_time TIME,
    position_ids INTEGER[] DEFAULT '{}',
    round_type round_type_enum NOT NULL,
    round_number INTEGER NOT NULL,
    
    CONSTRAINT events_company_id_fkey FOREIGN KEY (company_id) 
        REFERENCES companies(id)
);

-- ------------------------------------------------------------
-- Event Batches: Link events to batches
-- ------------------------------------------------------------
CREATE TABLE event_batches (
    id SERIAL PRIMARY KEY,
    event_id INTEGER,
    batch_id INTEGER,
    
    UNIQUE(event_id, batch_id),
    
    CONSTRAINT event_batches_event_id_fkey FOREIGN KEY (event_id) 
        REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT event_batches_batch_id_fkey FOREIGN KEY (batch_id) 
        REFERENCES batches(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Event Attendance: Track student attendance at events
-- ------------------------------------------------------------
CREATE TABLE event_attendance (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    marked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason_for_change TEXT,
    status attendance_status_enum DEFAULT 'absent',
    
    UNIQUE(event_id, student_id),
    
    CONSTRAINT event_attendance_event_id_fkey FOREIGN KEY (event_id) 
        REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT event_attendance_student_id_fkey FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Student Round Results: Results for interview rounds
-- ------------------------------------------------------------
CREATE TABLE student_round_results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    result_status result_status_enum DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(student_id, event_id),
    
    CONSTRAINT student_round_results_student_id_fkey FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT student_round_results_round_id_fkey FOREIGN KEY (event_id) 
        REFERENCES events(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Forms: Dynamic forms for applications and surveys
-- ------------------------------------------------------------
CREATE TABLE forms (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type form_type_enum DEFAULT 'application' NOT NULL,
    event_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    batch_year INTEGER NOT NULL,
    
    CONSTRAINT forms_event_id_fkey FOREIGN KEY (event_id) 
        REFERENCES events(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Form Responses: Student responses to forms
-- ------------------------------------------------------------
CREATE TABLE form_responses (
    id SERIAL PRIMARY KEY,
    form_id INTEGER,
    student_id INTEGER,
    response_data JSONB,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(form_id, student_id),
    
    CONSTRAINT form_responses_form_id_fkey FOREIGN KEY (form_id) 
        REFERENCES forms(id) ON DELETE CASCADE,
    CONSTRAINT form_responses_student_id_fkey FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Email Templates: Reusable email templates
-- ------------------------------------------------------------
CREATE TABLE email_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(200) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    category category_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attachments JSONB,
    cc_emails TEXT[],
    sender_email VARCHAR(255)
);

-- ------------------------------------------------------------
-- Email Logs: Track sent emails
-- ------------------------------------------------------------
CREATE TABLE email_logs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    recipient_filter JSONB,
    recipient_emails TEXT[],
    event_id INTEGER,
    sender_email VARCHAR(255),
    sent_at TIMESTAMP,
    total_recipients INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cc_emails TEXT[],
    to_emails TEXT[],
    message_id VARCHAR(255) UNIQUE,
    parent_message_id VARCHAR(255),
    email_status VARCHAR(50) DEFAULT 'sent',
    total_failed INTEGER DEFAULT 0,
    total_successful INTEGER DEFAULT 0,
    failed_emails TEXT[],
    
    CONSTRAINT email_campaigns_event_id_fkey FOREIGN KEY (event_id) 
        REFERENCES events(id)
);

-- ------------------------------------------------------------
-- Penalty Types: Define types of penalties
-- ------------------------------------------------------------
CREATE TABLE penalty_types (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    penalty_name VARCHAR(200) NOT NULL,
    severity severity_enum DEFAULT 'minor',
    first_offense_action VARCHAR(500) NOT NULL,
    first_offense_debarred_days INTEGER DEFAULT 0,
    first_offense_dac BOOLEAN DEFAULT false,
    repeat_offense_action VARCHAR(500) NOT NULL,
    repeat_offense_debarred_count INTEGER DEFAULT 0,
    repeat_offense_dac BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Student Penalties: Track penalties imposed on students
-- ------------------------------------------------------------
CREATE TABLE student_penalties (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    penalty_type_id INTEGER NOT NULL,
    offense_number INTEGER DEFAULT 1 NOT NULL,
    custom_description TEXT,
    custom_action VARCHAR(500),
    custom_debarred_count INTEGER,
    custom_dac BOOLEAN,
    applied_action VARCHAR(500) NOT NULL,
    applied_debarred_count INTEGER DEFAULT 0,
    applied_dac BOOLEAN DEFAULT false,
    debarred_count_left INTEGER DEFAULT 0,
    reason TEXT NOT NULL,
    evidence TEXT,
    is_active BOOLEAN DEFAULT true,
    imposed_by INTEGER NOT NULL,
    resolved_by INTEGER,
    resolution_date DATE,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT student_penalties_student_id_fkey FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT student_penalties_penalty_type_id_fkey FOREIGN KEY (penalty_type_id) 
        REFERENCES penalty_types(id)
);

-- ============================================================
-- END OF SCHEMA
-- ============================================================