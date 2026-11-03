/* Set storageMode to 'supabase' during the GitHub pretest or 'php' on the university server.
   'local' creates browser downloads only. Never put secret/service-role or database passwords here. */
window.COMET_CONFIG = Object.freeze({
  version: '2.0.0',
  storageMode: 'local', // local | supabase | php
  supabaseUrl: 'https://YOUR-PROJECT.supabase.co',
  supabasePublishableKey: 'YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY',
  phpEndpoint: 'server/save.php',
  trialsPerLevel: 10,
  practiceTrials: 2, // device/response familiarization only; no graded practice
  showFeedbackDuringTask: false,
  requireDesktop: false, // switch to true for desktop-only Prolific study
  downloadBackupOnFinish: true
});
