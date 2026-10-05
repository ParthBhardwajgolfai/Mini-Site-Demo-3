import AdminLeaderboard from './AdminLeaderboard';
import BroadcastLeaderboard from './BroadcastLeaderboard';
import CardLeaderboard from './CardLeaderboard';
import ClassicLeaderboard from './ClassicLeaderboard';
import CompactLeaderboard from './CompactLeaderboard';
import EditorialLeaderboard from './EditorialLeaderboard';
import EngravingLeaderboard from './EngravingLeaderboard';
import PodiumLeaderboard from './PodiumLeaderboard';
import ScorecardLeaderboard from './ScorecardLeaderboard';
import VisualLeaderboard from './VisualLeaderboard';
import type { LeaderboardDesignId } from './LeaderboardDesignSelector';
import type { LeaderboardViewProps } from './shared';

interface RendererProps extends LeaderboardViewProps {
  design: LeaderboardDesignId;
}

/** Chooses the active visualization. All designs consume identical props/data. */
export default function LeaderboardRenderer({ design, ...view }: RendererProps) {
  switch (design) {
    case 'compact':
      return <CompactLeaderboard {...view} />;
    case 'cards':
      return <CardLeaderboard {...view} />;
    case 'scorecard':
      return <ScorecardLeaderboard {...view} />;
    case 'visual':
      return <VisualLeaderboard {...view} />;
    case 'podium':
      return <PodiumLeaderboard {...view} />;
    case 'broadcast':
      return <BroadcastLeaderboard {...view} />;
    case 'editorial':
      return <EditorialLeaderboard {...view} />;
    case 'engraving':
      return <EngravingLeaderboard {...view} />;
    case 'admin':
      return <AdminLeaderboard {...view} />;
    case 'classic':
    default:
      return <ClassicLeaderboard {...view} />;
  }
}
