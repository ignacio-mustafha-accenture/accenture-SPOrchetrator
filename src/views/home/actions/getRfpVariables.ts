'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { GetRfpVariablesUseCase } from '../application/use-cases/GetRfpVariablesUseCase';
import { BEApiRfpRepository } from '../infrastructure/adapters/BEApiRfpRepository';
import type { Variable } from '../domain/entities/Variable';

export async function getRfpVariables(rfpId: string, supplierId?: string): Promise<Variable[]> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return new GetRfpVariablesUseCase(new BEApiRfpRepository(session?.access_token ?? '')).execute(rfpId, supplierId);
}
