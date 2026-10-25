import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Visibility,
  Edit,
  Delete,
} from '@mui/icons-material';
import { Event } from '../../types';
import { formatEventDate } from '../../lib/utils/dateFormatter';

interface EventCardProps {
  event: Event;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function EventCard({
  event,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}: EventCardProps) {
  const formattedDate = formatEventDate(event.startDate);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {event.category && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={event.category.name}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        )}

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {event.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {event.location}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {event.description}
        </Typography>
      </CardContent>

      {showActions && (
        <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
          {onView && (
            <Button
              size="small"
              startIcon={<Visibility />}
              onClick={() => onView(event.id)}
            >
              View
            </Button>
          )}
          {onEdit && (
            <Button
              size="small"
              startIcon={<Edit />}
              onClick={() => onEdit(event.id)}
              color="primary"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              size="small"
              startIcon={<Delete />}
              onClick={() => onDelete(event.id)}
              color="error"
            >
              Delete
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
}

