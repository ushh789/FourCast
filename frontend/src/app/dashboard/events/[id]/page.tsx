import { EventDetailPage } from '../../../../components/events/EventDetailPage';
import { ProtectedPage } from '../../../../components/common/ProtectedPage';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  return (
    <ProtectedPage>
      <EventDetailPage eventId={id} />
    </ProtectedPage>
  );
}
