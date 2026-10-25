import { EventsPageContainer } from '../../components/events/EventsPageContainer';
import { ProtectedPage } from '../../components/common/ProtectedPage';

export default function Dashboard() {
  return (
    <ProtectedPage>
      <EventsPageContainer />
    </ProtectedPage>
  );
}
