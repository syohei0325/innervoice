import { Proposal } from '../page';
import ProposalCard from './ProposalCard';

interface ProposalListProps {
  proposals: Proposal[];
  onConfirm: (proposalId: string) => void;
}

export default function ProposalList({ proposals, onConfirm }: ProposalListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        2つの提案
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {proposals.map((proposal, index) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            label={`案${index + 1}`}
            onConfirm={() => onConfirm(proposal.id)}
          />
        ))}
      </div>
    </div>
  );
}
