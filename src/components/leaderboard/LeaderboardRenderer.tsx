import AdminLeaderboard from './AdminLeaderboard';
import BroadcastLeaderboard from './BroadcastLeaderboard';
import CardLeaderboard from './CardLeaderboard';
import ClassicLeaderboard from './ClassicLeaderboard';
import ClubhouseLeaderboard from './ClubhouseLeaderboard';
import CompactLeaderboard from './CompactLeaderboard';
import EditorialLeaderboard from './EditorialLeaderboard';
import EngravingLeaderboard from './EngravingLeaderboard';
import PodiumLeaderboard from './PodiumLeaderboard';
import ScoringLadderLeaderboard from './ScoringLadderLeaderboard';
import ScorecardLeaderboard from './ScorecardLeaderboard';
import VisualLeaderboard from './VisualLeaderboard';
import WallLeaderboard from './WallLeaderboard';
import type { LeaderboardDesignId } from './LeaderboardDesignSelector';
import type { LeaderboardViewProps } from './shared';

interface RendererProps extends LeaderboardViewProps {
  design: LeaderboardDesignId;
}

/** All presentation modes receive the same filtered round data and callbacks. */
export default function LeaderboardRenderer({ design, ...view }: RendererProps) {
  switch (design) {
    case 'compact': return <CompactLeaderboard {...view} />;
    case 'cards': return <CardLeaderboard {...view} />;
    case 'scorecard': return <ScorecardLeaderboard {...view} />;
    case 'visual': return <VisualLeaderboard {...view} />;
    case 'podium': return <PodiumLeaderboard {...view} />;
    case 'editorial': return <EditorialLeaderboard {...view} />;
    case 'broadcast': return <BroadcastLeaderboard {...view} />;
    case 'engraved': return <EngravingLeaderboard {...view} />;
    case 'ladder': return <ScoringLadderLeaderboard {...view} />;
    case 'clubhouse': return <ClubhouseLeaderboard {...view} />;
    case 'broadcast-wall': return <WallLeaderboard {...view} />;
    case 'dashboard': return <AdminLeaderboard {...view} />;
    case 'classic':
    default: return <ClassicLeaderboard {...view} />;
  }
}
