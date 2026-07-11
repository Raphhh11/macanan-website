// ============================================================
// KONFIGURASI SUPABASE
// Isi 2 nilai di bawah ini dari Supabase Dashboard:
// Settings (ikon gerigi) > API > Project URL & anon public key
// ============================================================

const SUPABASE_URL = "ISI_URL_SUPABASE_KAMU_DI_SINI";
const SUPABASE_ANON_KEY = "ISI_ANON_KEY_SUPABASE_KAMU_DI_SINI";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
