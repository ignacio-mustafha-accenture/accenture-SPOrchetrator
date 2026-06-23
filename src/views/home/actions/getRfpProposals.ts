'use server';

import { createClient } from '@/shared/lib/supabase/server';

import { GetRfpProposalsUseCase } from '../application/use-cases/GetRfpProposalsUseCase';
import { BEApiRfpRepository } from '../infrastructure/adapters/BEApiRfpRepository';
import type { Proposal } from '../domain/entities/Proposal';

export async function getRfpProposals(rfpId: string): Promise<Proposal[]> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return new GetRfpProposalsUseCase(new BEApiRfpRepository(session?.access_token ?? '')).execute(rfpId);
}
