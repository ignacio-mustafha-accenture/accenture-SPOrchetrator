'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { GetRfpScoresUseCase } from '../application/use-cases/GetRfpScoresUseCase';
import { BEApiRfpRepository } from '../infrastructure/adapters/BEApiRfpRepository';
import type { ScoreSupplier } from '../domain/entities/Score';

export async function getRfpScores(rfpId: string): Promise<ScoreSupplier[]> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return new GetRfpScoresUseCase(new BEApiRfpRepository(session?.access_token ?? '')).execute(rfpId);
}
