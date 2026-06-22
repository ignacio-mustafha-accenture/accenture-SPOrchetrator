import { RfpDetailPage } from '@/views/home/layout/RfpDetailPage';

type Props = {
  params: Promise<{ rfpId: string }>;
};

export default async function Page({ params }: Props) {
  const { rfpId } = await params;
  return <RfpDetailPage rfpId={rfpId} />;
}
