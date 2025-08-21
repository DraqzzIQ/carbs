-- Date format changed from dd-mm-yyyy to yyyy-mm-dd --

UPDATE meals
SET date_id = substr(date_id,7,4) || '-' || substr(date_id,4,2) || '-' || substr(date_id,1,2)
WHERE length(date_id) = 10
  AND substr(date_id,3,1) = '-'
  AND substr(date_id,6,1) = '-'
  -- basic sanity checks to avoid corrupt values
  AND substr(date_id,1,2) BETWEEN '01' AND '31'
  AND substr(date_id,4,2) BETWEEN '01' AND '12'
  AND substr(date_id,7,4) GLOB '[0-9][0-9][0-9][0-9]';--> statement-breakpoint

UPDATE streaks
SET date_id = substr(date_id,7,4) || '-' || substr(date_id,4,2) || '-' || substr(date_id,1,2)
WHERE length(date_id) = 10
  AND substr(date_id,3,1) = '-'
  AND substr(date_id,6,1) = '-'
  AND substr(date_id,1,2) BETWEEN '01' AND '31'
  AND substr(date_id,4,2) BETWEEN '01' AND '12'
  AND substr(date_id,7,4) GLOB '[0-9][0-9][0-9][0-9]';--> statement-breakpoint

UPDATE fluid_intake
SET date_id = substr(date_id,7,4) || '-' || substr(date_id,4,2) || '-' || substr(date_id,1,2)
WHERE length(date_id) = 10
  AND substr(date_id,3,1) = '-'
  AND substr(date_id,6,1) = '-'
  AND substr(date_id,1,2) BETWEEN '01' AND '31'
  AND substr(date_id,4,2) BETWEEN '01' AND '12'
  AND substr(date_id,7,4) GLOB '[0-9][0-9][0-9][0-9]';