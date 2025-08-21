import { Bell, Heart, MessageCircle, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Notification {
  id: string;
  type: "like" | "comment" | "trending" | "reminder";
  message: string;
  timeAgo: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    message: "Your post about finals week got 25 likes",
    timeAgo: "2h",
    isRead: false
  },
  {
    id: "2", 
    type: "comment",
    message: "Someone commented on your cafeteria food post",
    timeAgo: "4h",
    isRead: false
  },
  {
    id: "3",
    type: "trending",
    message: "Your campus is trending with posts about the new student center",
    timeAgo: "6h",
    isRead: true
  },
  {
    id: "4",
    type: "reminder",
    message: "Your post from last week will be automatically deleted in 24 hours",
    timeAgo: "1d",
    isRead: true
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-whispr-pink" />;
    case "comment":
      return <MessageCircle className="h-4 w-4 text-whispr-blue" />;
    case "trending":
      return <TrendingUp className="h-4 w-4 text-whispr-teal" />;
    case "reminder":
      return <Clock className="h-4 w-4 text-whispr-purple" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "like":
      return "whispr-pink";
    case "comment":
      return "whispr-blue";
    case "trending":
      return "whispr-teal";
    case "reminder":
      return "whispr-purple";
    default:
      return "muted";
  }
};

const Notifications = () => {
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-map p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <div className="w-6 h-6 rounded-full bg-whispr-pink flex items-center justify-center">
              <span className="text-xs font-bold text-white">{unreadCount}</span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground">Stay updated with your campus community</p>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {mockNotifications.map((notification, index) => (
          <Card 
            key={notification.id}
            className={`bg-white/80 backdrop-blur-sm border-none shadow-bubble animate-bubble-pop ${
              !notification.isRead ? 'ring-2 ring-whispr-teal/20' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
                  style={{
                    backgroundColor: `hsl(var(--whispr-${getNotificationColor(notification.type).split('-')[1] || 'teal'}) / 0.2)`
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${
                    !notification.isRead ? 'font-medium text-foreground' : 'text-muted-foreground'
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.timeAgo}
                  </p>
                </div>

                {/* Unread Indicator */}
                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-whispr-teal flex-shrink-0 mt-2"></div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {mockNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 rounded-full bg-gradient-bubble flex items-center justify-center mb-4 shadow-bubble">
              <Bell className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No notifications yet</h3>
            <p className="text-muted-foreground text-center">
              When you interact with posts or get responses, you'll see them here
            </p>
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-whispr-teal/10 border-whispr-teal/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-whispr-teal mt-0.5" />
              <div>
                <p className="text-sm font-medium text-whispr-teal mb-1">
                  Anonymous Notifications
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You'll get notified about interactions with your posts, but everything remains completely anonymous. 
                  No personal information is ever shared.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;