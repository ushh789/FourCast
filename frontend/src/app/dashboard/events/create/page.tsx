import { CreateEventPage } from '../../../../components/events/CreateEventPage';
import { ProtectedPage } from '../../../../components/common/ProtectedPage';

export default function CreateEvent() {
  return (
    <ProtectedPage>
      <CreateEventPage />
    </ProtectedPage>
  );
}
