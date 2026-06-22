import {
  getRfpById,
  getRfpSuppliers,
  getRfpProposals,
  getRfpScores,
  getRfpVariables,
  getRfpRisks,
  getRfpGates,
} from '../actions';
import { RfpDetailHeader } from '../components/rfp-detail/RfpDetailHeader';
import { RfpPipelineStrip } from '../components/rfp-detail/RfpPipelineStrip';
import { RfpDetailTabs } from '../components/rfp-detail/RfpDetailTabs';

export async function RfpDetailPage({ rfpId }: { rfpId: string }) {
  const [rfp, suppliers, proposals, scores, variables, risks, gates] = await Promise.all([
    getRfpById(rfpId),
    getRfpSuppliers(rfpId),
    getRfpProposals(rfpId),
    getRfpScores(rfpId),
    getRfpVariables(rfpId),
    getRfpRisks(rfpId),
    getRfpGates(rfpId),
  ]);

  return (
    <div className="px-6 py-6">
      <RfpDetailHeader rfp={rfp} />
      <RfpPipelineStrip rfp={rfp} />
      <RfpDetailTabs
        rfp={rfp}
        suppliers={suppliers}
        proposals={proposals}
        scores={scores}
        variables={variables}
        risks={risks}
        gates={gates}
      />
    </div>
  );
}
