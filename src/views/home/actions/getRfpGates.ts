'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { GetRfpGatesUseCase } from '../application/use-cases/GetRfpGatesUseCase';
import { BEApiRfpRepository } from '../infrastructure/adapters/BEApiRfpRepository';
import type { Gate } from '../domain/entities/Gate';

export async function getRfpGates(rfpId: string): Promise<Gate[]> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return new GetRfpGatesUseCase(new BEApiRfpRepository(session?.access_token ?? '')).execute(rfpId);
}
