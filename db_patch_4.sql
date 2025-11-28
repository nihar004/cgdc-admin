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