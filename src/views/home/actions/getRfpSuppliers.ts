'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { GetRfpSuppliersUseCase } from '../application/use-cases/GetRfpSuppliersUseCase';
import { BEApiRfpRepository } from '../infrastructure/adapters/BEApiRfpRepository';
import type { Supplier } from '../domain/entities/Supplier';

export async function getRfpSuppliers(rfpId: string): Promise<Supplier[]> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return new GetRfpSuppliersUseCase(new BEApiRfpRepository(session?.access_token ?? '')).execute(rfpId);
}
