import { Proposal } from '../page';
import ConfirmButton from './ConfirmButton';

interface ProposalCardProps {
  proposal: Proposal;
  label: string;
  onConfirm: () => void;
}

export default function ProposalCard({ proposal, label, onConfirm }: ProposalCardProps) {
  return (
    <div className="proposal-card">
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {label}
        </span>
        <div className="text-right text-sm text-gray-500">
          <div>{proposal.slot}</div>
          <div>{proposal.duration_min}分</div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {proposal.title}
      </h3>
      
      <ConfirmButton onClick={onConfirm} />
    </div>
  );
}
