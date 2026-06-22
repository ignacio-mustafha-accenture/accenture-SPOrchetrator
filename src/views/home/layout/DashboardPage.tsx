import { Suspense } from 'react';
import { getRfps } from '../actions/getRfps';
import { DashboardKpiRow } from '../components/dashboard/DashboardKpiRow';
import { DashboardKpiRowSkeleton } from '../components/dashboard/DashboardKpiRowSkeleton';
import { DashboardTablesSkeleton } from '../components/dashboard/DashboardTablesSkeleton';
import { RfpPipelineTable } from '../components/dashboard/RfpPipelineTable';
import { RecentActivityLog } from '../components/dashboard/RecentActivityLog';

// Isolated async component so only the KPI row suspends independently.
async function KpiSection() {
  const rfps = await getRfps();
  return <DashboardKpiRow rfps={rfps} />;
}

async function ContentSection() {
  const rfps = await getRfps();
  return (
    <>
      <RfpPipelineTable rfps={rfps} />
      <RecentActivityLog />
    </>
  );
}

export function DashboardPage() {
  return (
    <div className="px-6 py-6 flex flex-col gap-5">
      <Suspense fallback={<DashboardKpiRowSkeleton />}>
        <KpiSection />
      </Suspense>
      <Suspense fallback={<DashboardTablesSkeleton />}>
        <ContentSection />
      </Suspense>
    </div>
  );
}
