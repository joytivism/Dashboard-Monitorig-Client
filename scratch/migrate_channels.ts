import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CH_DEF = {
  shopee_store:  { l: 'Shopee Store',  stage: 'mofu', type: 'revenue'   },
  shopee_ads:    { l: 'Shopee Ads',    stage: 'bofu', type: 'revenue'   },
  cpas:          { l: 'CPAS',          stage: 'mofu', type: 'assist'    },
  tiktok_store:  { l: 'TikTok Store',  stage: 'mofu', type: 'revenue'   },
  tiktok_gmvmax: { l: 'GMV Max',       stage: 'bofu', type: 'revenue'   },
  tiktok_ads:    { l: 'TikTok Ads',    stage: 'tofu', type: 'awareness' },
  meta_ads:      { l: 'Meta Ads',      stage: 'tofu', type: 'awareness' },
};

async function migrate() {
  console.log('Migrating Channel Definitions...');

  // Since we cannot run raw SQL easily without service_role key, 
  // we assume the table is created via SQL Editor in Supabase UI.
  // This script will just populate the data.
  
  const payload = Object.entries(CH_DEF).map(([key, val]) => ({
    channel_key: key,
    label: val.l,
    stage: val.stage,
    type: val.type
  }));

  const { error } = await supabase.from('channels').upsert(payload);

  if (error) {
    console.error('Error migrating channels:', error.message);
    console.log('Note: Ensure the "channels" table exists in your Supabase database first.');
  } else {
    console.log('Successfully migrated channel definitions!');
  }
}

migrate();
