import { EditEventPage } from '../../../../../components/events/EditEventPage';
import { ProtectedPage } from '../../../../../components/common/ProtectedPage';

interface EditEventProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEvent({ params }: EditEventProps) {
  const { id } = await params;

  return (
    <ProtectedPage>
      <EditEventPage eventId={id} />
    </ProtectedPage>
  );
}
