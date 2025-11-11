-- patch-3

-- set one more .env variable NODE_ENV=production 

BEGIN;

CREATE TYPE public.event_type_enum_new AS ENUM (
    'pre_placement_talk',
    'company_presentation',
    'resume_screening',
    'online_assessment',
    'aptitude_test',
    'coding_test',
    'technical_mcq',
    'technical_round_1',
    'technical_round_2',
    'technical_round_3',
    'hr_round',
    'group_discussion',
    'case_study',
    'presentation_round',
    'final_round',
    'workshop',
    'seminar',
    'skill_development',
    'career_guidance',
    'mock_interview',
    'resume_building',
    'other',
    'student_registration'
);

ALTER TABLE events
ALTER COLUMN event_type TYPE event_type_enum_new
USING event_type::text::event_type_enum_new;

DROP TYPE public.event_type_enum;

ALTER TYPE public.event_type_enum_new RENAME TO event_type_enum;

COMMIT;
