-- PostgreSQL Database Schema for Campus Placement Management System
-- Version: 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

CREATE TYPE public.application_status_enum AS ENUM ('applied', 'shortlisted', 'rejected');
CREATE TYPE public.attendance_status_enum AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE public."category_enum " AS ENUM ('general', 'placement', 'event', 'reminder');
CREATE TYPE public.company_sector_enum AS ENUM ('E-Commerce, Logistics and Business', 'EdTech', 'IT & Consulting', 'IT Service', 'IT Software (Product)', 'Others*');
CREATE TYPE public.company_type_enum AS ENUM ('tech', 'nontech');
CREATE TYPE public.document_type_enum AS ENUM ('job_description', 'salary_breakdown', 'company_presentation', 'bond_details', 'eligibility_criteria', 'other');
CREATE TYPE public.event_status_enum AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE public.event_type_enum AS ENUM ('workshop', 'seminar', 'company_visit', 'aptitude_test', 'technical_round', 'hr_round', 'group_discussion', 'other', 'final_interview', 'career_guidance', 'skill_development', 'pre_placement_talk', 'training');
CREATE TYPE public.form_type_enum AS ENUM ('application', 'feedback', 'survey', 'attendance', 'custom');
CREATE TYPE public.job_type_enum AS ENUM ('internship_plus_ppo', 'internship', 'full_time');
CREATE TYPE public.mode_enum AS ENUM ('online', 'offline', 'hybrid');
CREATE TYPE public.placement_status_enum AS ENUM ('placed', 'unplaced', 'higher_studies', 'entrepreneurship', 'debarred', 'family_business', 'others');
CREATE TYPE public.result_status_enum AS ENUM ('selected', 'rejected', 'waitlisted', 'pending');
CREATE TYPE public.round_type_enum AS ENUM ('first', 'middle', 'last');
CREATE TYPE public.severity_enum AS ENUM ('minor', 'moderate', 'major', 'severe');
CREATE TYPE public.specialization_enum AS ENUM ('CSE', 'ECE', 'ME');
CREATE TYPE public.user_role_enum AS ENUM ('admin', 'placement_officer', 'faculty', 'pending');

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

CREATE FUNCTION public.cleanup_expired_reset_codes() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM password_resets WHERE expires_at < NOW();
END;
$$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- Batches
CREATE TABLE public.batches (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL UNIQUE
);

-- Users
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role public.user_role_enum NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies
CREATE TABLE public.companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    company_description TEXT,
    is_marquee BOOLEAN DEFAULT FALSE,
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
    min_cgpa NUMERIC(4,2),
    max_backlogs INTEGER,
    bond_required BOOLEAN DEFAULT FALSE,
    sector public.company_sector_enum DEFAULT 'Others*',
    account_owner VARCHAR(200),
    allowed_specializations public.specialization_enum[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Batches (Many-to-Many)
CREATE TABLE public.company_batches (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    batch_id INTEGER NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    UNIQUE(company_id, batch_id)
);

-- Company Positions
CREATE TABLE public.company_positions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    position_title VARCHAR(200) NOT NULL,
    job_type public.job_type_enum DEFAULT 'internship',
    package_range NUMERIC(10,2) DEFAULT 0,
    internship_stipend_monthly NUMERIC(10,2) DEFAULT 0.00,
    rounds_start_date DATE,
    rounds_end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    company_type public.company_type_enum DEFAULT 'tech' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Eligibility
CREATE TABLE public.company_eligibility (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    batch_id INTEGER NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    eligible_student_ids JSONB DEFAULT '[]' NOT NULL,
    ineligible_student_ids JSONB DEFAULT '[]' NOT NULL,
    dream_company_student_ids JSONB DEFAULT '[]' NOT NULL,
    total_eligible_count INTEGER DEFAULT 0,
    total_ineligible_count INTEGER DEFAULT 0,
    eligibility_criteria JSONB,
    manual_override_reasons JSONB DEFAULT '{}',
    snapshot_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, batch_id)
);

-- Position Documents
CREATE TABLE public.position_documents (
    id SERIAL PRIMARY KEY,
    position_id INTEGER NOT NULL REFERENCES public.company_positions(id) ON DELETE CASCADE,
    document_type public.document_type_enum NOT NULL,
    document_title VARCHAR(255) NOT NULL,
    document_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    original_filename VARCHAR(255),
    display_order INTEGER DEFAULT 1,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students
CREATE TABLE public.students (
    id SERIAL PRIMARY KEY,
    enrollment_number VARCHAR(50) UNIQUE,
    registration_number VARCHAR(11),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(15),
    alternate_phone VARCHAR(15),
    college_email VARCHAR(255) NOT NULL,
    personal_email VARCHAR(255),
    department VARCHAR(100) NOT NULL,
    branch VARCHAR(100),
    batch_year INTEGER NOT NULL REFERENCES public.batches(year) ON DELETE RESTRICT,
    current_semester INTEGER,
    cgpa NUMERIC(4,3),
    backlogs INTEGER DEFAULT 0,
    class_10_percentage NUMERIC(5,2),
    class_12_percentage NUMERIC(5,2),
    resume_url VARCHAR(500),
    linkedin_url VARCHAR(300),
    github_url VARCHAR(300),
    date_of_birth DATE,
    gender VARCHAR(20),
    permanent_address TEXT,
    permanent_city VARCHAR(100),
    permanent_state VARCHAR(100),
    ps2_company_name VARCHAR(200),
    ps2_project_title VARCHAR(300),
    ps2_certificate_url VARCHAR(500),
    drives_skipped INTEGER DEFAULT 0,
    dream_opportunity_used BOOLEAN DEFAULT FALSE,
    dream_company_used BOOLEAN DEFAULT FALSE,
    dream_company_details JSON,
    upgrade_opportunities_used INTEGER DEFAULT 0,
    placement_status public.placement_status_enum DEFAULT 'unplaced',
    offers_received JSONB,
    current_offer JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE public.events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    event_type public.event_type_enum NOT NULL,
    event_date DATE,
    start_time TIME,
    end_time TIME,
    venue VARCHAR(200),
    mode public.mode_enum NOT NULL,
    speaker_details JSONB,
    is_mandatory BOOLEAN DEFAULT FALSE,
    status public.event_status_enum DEFAULT 'upcoming',
    is_placement_event BOOLEAN DEFAULT FALSE,
    company_id INTEGER REFERENCES public.companies(id),
    position_ids INTEGER[] DEFAULT '{}',
    round_type public.round_type_enum NOT NULL,
    round_number INTEGER NOT NULL,
    target_specializations public.specialization_enum[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event Batches (Many-to-Many)
CREATE TABLE public.event_batches (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES public.events(id) ON DELETE CASCADE,
    batch_id INTEGER REFERENCES public.batches(id) ON DELETE CASCADE,
    UNIQUE(event_id, batch_id)
);

-- Event Attendance
CREATE TABLE public.event_attendance (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    status public.attendance_status_enum DEFAULT 'absent',
    marked_at TIMESTAMP,
    reason_for_change TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, student_id)
);

-- Student Round Results
CREATE TABLE public.student_round_results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    result_status public.result_status_enum DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, event_id)
);

-- Forms
CREATE TABLE public.forms (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type public.form_type_enum DEFAULT 'application' NOT NULL,
    batch_year INTEGER NOT NULL,
    event_id INTEGER REFERENCES public.events(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Form Responses
CREATE TABLE public.form_responses (
    id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES public.forms(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES public.students(id) ON DELETE CASCADE,
    response_data JSONB,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(form_id, student_id)
);

-- Penalty Types
CREATE TABLE public.penalty_types (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    penalty_name VARCHAR(200) NOT NULL,
    severity public.severity_enum DEFAULT 'minor',
    first_offense_action VARCHAR(500) NOT NULL,
    first_offense_debarred_days INTEGER DEFAULT 0,
    first_offense_dac BOOLEAN DEFAULT FALSE,
    repeat_offense_action VARCHAR(500) NOT NULL,
    repeat_offense_debarred_count INTEGER DEFAULT 0,
    repeat_offense_dac BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Penalties
CREATE TABLE public.student_penalties (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    penalty_type_id INTEGER NOT NULL REFERENCES public.penalty_types(id),
    offense_number INTEGER DEFAULT 1 NOT NULL,
    custom_description TEXT,
    custom_action VARCHAR(500),
    custom_debarred_count INTEGER,
    custom_dac BOOLEAN,
    applied_action VARCHAR(500) NOT NULL,
    applied_debarred_count INTEGER DEFAULT 0,
    applied_dac BOOLEAN DEFAULT FALSE,
    debarred_count_left INTEGER DEFAULT 0,
    reason TEXT NOT NULL,
    evidence TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    imposed_by INTEGER NOT NULL,
    resolved_by INTEGER,
    resolution_date DATE,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Templates
CREATE TABLE public.email_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(200) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    category public."category_enum " NOT NULL,
    sender_email VARCHAR(255),
    cc_emails TEXT[],
    attachments JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Logs
CREATE TABLE public.email_logs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    sender_email VARCHAR(255),
    to_emails TEXT[],
    cc_emails TEXT[],
    recipient_filter JSONB,
    recipient_emails TEXT[],
    failed_emails TEXT[],
    event_id INTEGER REFERENCES public.events(id),
    message_id VARCHAR(255) UNIQUE,
    parent_message_id VARCHAR(255),
    email_status VARCHAR(50) DEFAULT 'sent',
    total_recipients INTEGER DEFAULT 0,
    total_successful INTEGER DEFAULT 0,
    total_failed INTEGER DEFAULT 0,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password Resets
CREATE TABLE public.password_resets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    reset_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================