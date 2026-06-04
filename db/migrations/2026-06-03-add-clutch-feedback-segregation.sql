ALTER TABLE public.clutch_feedback
  ADD COLUMN IF NOT EXISTS app_variant text,
  ADD COLUMN IF NOT EXISTS session_id text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS response_kind text,
  ADD COLUMN IF NOT EXISTS response_status text,
  ADD COLUMN IF NOT EXISTS payload_version integer,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_activity_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

UPDATE public.clutch_feedback
SET
  app_variant = COALESCE(app_variant, NULLIF(page, ''), 'clutch-newsletter'),
  response_kind = COALESCE(response_kind, NULLIF(answers->>'kind', ''), 'legacy'),
  response_status = COALESCE(response_status, 'submitted'),
  payload_version = COALESCE(payload_version, 1),
  submitted_at = COALESCE(submitted_at, created_at, NOW()),
  last_activity_at = COALESCE(last_activity_at, created_at, NOW()),
  updated_at = COALESCE(updated_at, created_at, NOW())
WHERE
  app_variant IS NULL
  OR response_kind IS NULL
  OR response_status IS NULL
  OR payload_version IS NULL
  OR submitted_at IS NULL
  OR last_activity_at IS NULL
  OR updated_at IS NULL;

ALTER TABLE public.clutch_feedback
  ALTER COLUMN app_variant SET DEFAULT 'clutch-newsletter',
  ALTER COLUMN response_kind SET DEFAULT 'legacy',
  ALTER COLUMN response_status SET DEFAULT 'submitted',
  ALTER COLUMN payload_version SET DEFAULT 1,
  ALTER COLUMN last_activity_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER TABLE public.clutch_feedback
  ALTER COLUMN app_variant SET NOT NULL,
  ALTER COLUMN response_kind SET NOT NULL,
  ALTER COLUMN response_status SET NOT NULL,
  ALTER COLUMN payload_version SET NOT NULL,
  ALTER COLUMN last_activity_at SET NOT NULL,
  ALTER COLUMN updated_at SET NOT NULL;

CREATE INDEX IF NOT EXISTS clutch_feedback_app_variant_status_created_idx
  ON public.clutch_feedback (app_variant, response_status, created_at DESC);

CREATE INDEX IF NOT EXISTS clutch_feedback_session_kind_idx
  ON public.clutch_feedback (session_id, response_kind, created_at DESC)
  WHERE session_id IS NOT NULL;
