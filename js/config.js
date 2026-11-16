/* Set storageMode to 'supabase' during the GitHub pretest or 'php' on the university server.
   'local' creates browser downloads only. Never put secret/service-role or database passwords here. */
window.COMET_CONFIG = Object.freeze({
  version: '2.0.0',
  storageMode: 'supabase', // local | supabase | php
  supabaseUrl: 'https://tbzpczlfyayvmbtxfyol.supabase.co',
  supabasePublishableKey: 'sb_publishable_nrM9TTaqKtGZ982LO1Xhvg_8puFzylo',
  phpEndpoint: 'server/save.php',
  trialsPerLevel: 10,
  practiceTrials: 2, // device/response familiarization only; no graded practice
  showFeedbackDuringTask: false,
  requireDesktop: false, // switch to true for desktop-only Prolific study
  downloadBackupOnFinish: true
});
