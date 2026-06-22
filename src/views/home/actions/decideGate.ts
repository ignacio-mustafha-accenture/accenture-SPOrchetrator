'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/shared/lib/supabase/server';
import { DecideGateUseCase } from '../application/use-cases/DecideGateUseCase';
import { BEApiRfpRepository } from '../infrastructure/adapters/BEApiRfpRepository';
import type { Gate, DecideGateInput } from '../domain/entities/Gate';

export async function decideGate(input: DecideGateInput): Promise<Gate> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const gate = await new DecideGateUseCase(new BEApiRfpRepository(session?.access_token ?? '')).execute(input);
  revalidatePath(`/home/rfps/${input.rfpId}`);
  return gate;
}
