'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { GetRfpsUseCase } from '../application/use-cases/GetRfpsUseCase';
import { BEApiRfpRepository } from '../infrastructure/adapters/BEApiRfpRepository';
import type { Rfp } from '../domain/entities/Rfp';

export async function getRfps(): Promise<Rfp[]> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return new GetRfpsUseCase(new BEApiRfpRepository(session?.access_token ?? '')).execute();
}
