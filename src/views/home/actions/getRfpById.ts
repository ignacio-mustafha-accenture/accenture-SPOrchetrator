'use server';

import { createClient } from '@/shared/lib/supabase/server';

import { GetRfpByIdUseCase } from '../application/use-cases/GetRfpByIdUseCase';
import { BEApiRfpRepository } from '../infrastructure/adapters/BEApiRfpRepository';
import type { Rfp } from '../domain/entities/Rfp';

export async function getRfpById(rfpId: string): Promise<Rfp> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return new GetRfpByIdUseCase(new BEApiRfpRepository(session?.access_token ?? '')).execute(rfpId);
}
