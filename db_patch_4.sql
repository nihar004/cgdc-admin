ALTER TABLE public.companies 
DROP COLUMN IF EXISTS scheduled_visit,
DROP COLUMN IF EXISTS actual_arrival;

-- Set default timezone for your database
ALTER DATABASE your_database_name SET timezone = 'Asia/Kolkata';

-- Verify timezone setting
SHOW timezone;

-- Restart / reconnect all connections to the database -- if the timeZone still not applied.


-- Backfill rounds_start_date and rounds_end_date for all company_positions
-- based on existing events with round_type 'middle' or 'last'

UPDATE company_positions cp
SET 
  rounds_start_date = subquery.earliest_round_date,
  rounds_end_date = subquery.latest_last_round_date,
  updated_at = CURRENT_TIMESTAMP
FROM (
  SELECT 
    unnest(e.position_ids) AS position_id,
    MIN(e.event_date) AS earliest_round_date,
    -- Only set end date if there's a 'last' round event
    MAX(CASE WHEN e.round_type = 'last' THEN e.event_date ELSE NULL END) AS latest_last_round_date
  FROM events e
  WHERE 
    e.is_placement_event = true
    AND e.round_type IN ('middle', 'last')
    AND e.position_ids IS NOT NULL
    AND array_length(e.position_ids, 1) > 0
  GROUP BY unnest(e.position_ids)
) AS subquery
WHERE cp.id = subquery.position_id;


-- explicitly set NULL for positions that have no middle/last round events:
UPDATE company_positions cp
SET 
  rounds_start_date = NULL,
  rounds_end_date = NULL,
  updated_at = CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 
  FROM events e
  WHERE e.is_placement_event = true
    AND e.round_type IN ('middle', 'last')
    AND cp.id = ANY(e.position_ids)
)
AND (cp.rounds_start_date IS NOT NULL OR cp.rounds_end_date IS NOT NULL);


-- Update student acceptance date
-- 1. Loop through all students
DO $$
DECLARE 
    s RECORD;    -- each student
    off JSONB;   -- each offer inside offers_received array
    v_company_id INT;
    v_position_id INT;
    v_offer_id TEXT;
    v_final_event_date DATE;
BEGIN
    -- Loop through each student who has offers_received
    FOR s IN 
        SELECT id, offers_received, current_offer
        FROM students
        WHERE offers_received IS NOT NULL
    LOOP

        -- Loop through each offer inside offers_received array
        FOR off IN 
            SELECT jsonb_array_elements(s.offers_received)
        LOOP
            v_company_id := (off->>'company_id')::INT;
            v_position_id := (off->>'position_id')::INT;
            v_offer_id := off->>'offer_id';

            -- Get the LAST ROUND event date
            SELECT e.event_date
            INTO v_final_event_date
            FROM events e
            WHERE e.company_id = v_company_id
              AND e.round_type = 'last'
              AND v_position_id = ANY (e.position_ids)
            ORDER BY e.event_date DESC
            LIMIT 1;

            -- If no final round event → skip this offer
            IF v_final_event_date IS NULL THEN
                CONTINUE;
            END IF;

            -- Update offers_received JSONB
            UPDATE students
            SET offers_received = (
                SELECT jsonb_agg(
                    CASE 
                        WHEN elem->>'offer_id' = v_offer_id THEN
                            elem || jsonb_build_object('acceptance_date', v_final_event_date::TEXT)
                        ELSE
                            elem
                    END
                )
                FROM jsonb_array_elements(offers_received) elem
            )
            WHERE id = s.id;

            -- Update current_offer JSONB (if matches)
            UPDATE students
            SET current_offer = 
                CASE 
                    WHEN current_offer->>'offer_id' = v_offer_id THEN
                        current_offer || jsonb_build_object('acceptance_date', v_final_event_date::TEXT)
                    ELSE 
                        current_offer
                END
            WHERE id = s.id;

        END LOOP;

    END LOOP;
END $$;
