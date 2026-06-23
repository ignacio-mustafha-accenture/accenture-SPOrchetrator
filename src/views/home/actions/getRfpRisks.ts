'use server';

import { createClient } from '@/shared/lib/supabase/server';

import { GetRfpRisksUseCase } from '../application/use-cases/GetRfpRisksUseCase';
import { BEApiRfpRepository } from '../infrastructure/adapters/BEApiRfpRepository';
import type { RiskSupplier } from '../domain/entities/Risk';

export async function getRfpRisks(rfpId: string): Promise<RiskSupplier[]> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return new GetRfpRisksUseCase(new BEApiRfpRepository(session?.access_token ?? '')).execute(rfpId);
}
