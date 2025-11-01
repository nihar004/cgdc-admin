-- patch 2

ALTER TABLE companies
ADD COLUMN office_address TEXT;

ALTER TABLE companies
ADD COLUMN jd_shared_date DATE;

ALTER TABLE companies
ADD COLUMN eligibility_10th DECIMAL(5,2),
ADD COLUMN eligibility_12th DECIMAL(5,2);

ALTER TABLE company_positions RENAME COLUMN package_range TO package;

ALTER TABLE company_positions
ALTER COLUMN package TYPE DECIMAL(10,2)
USING (package / 100000.0);

ALTER TABLE company_positions
ADD COLUMN has_range BOOLEAN DEFAULT FALSE,
ADD COLUMN package_end DECIMAL(10,2);

ALTER TABLE companies
ALTER COLUMN max_backlogs TYPE BOOLEAN
USING (max_backlogs != 0);

UPDATE companies
SET max_backlogs = FALSE
WHERE max_backlogs IS NULL;

ALTER TABLE company_positions
ALTER COLUMN internship_stipend_monthly TYPE TEXT
USING internship_stipend_monthly::TEXT;

ALTER TABLE "events"
ALTER COLUMN "round_type"
DROP NOT NULL;

ALTER TABLE "events"
ALTER COLUMN "round_number"
DROP NOT NULL;

ALTER TABLE "public"."forms"
DROP COLUMN "type"

DROP TYPE "public"."form_type_enum"

ALTER TABLE "company_eligibility"
ADD COLUMN "total_placed_count" integer DEFAULT 0;

ALTER TABLE company_eligibility 
ADD COLUMN placed_student_ids JSONB NOT NULL DEFAULT '[]';