import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { HandCoins, Info, CircleDollarSign } from 'lucide-react';
import { useData } from '../context/DataContext';

const Notifications: React.FC = () => {
  const { notifications, markNotificationRead } = useData();
  const unreadCount = notifications.filter(n => n.unread).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'share': return <CircleDollarSign className="h-5 w-5 text-emerald-600" />;
      case 'loan': return <HandCoins className="h-5 w-5 text-blue-600" />;
      case 'penalty': return <Info className="h-5 w-5 text-destructive" />;
      default: return <Info className="h-5 w-5 text-indigo-600" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'share': return 'bg-emerald-50 border-emerald-100';
      case 'loan': return 'bg-blue-50 border-blue-100';
      case 'penalty': return 'bg-red-50 border-red-100';
      default: return 'bg-indigo-50 border-indigo-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your account activity and group announcements.
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {unreadCount} Unread
          </div>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <Card 
            key={notif.id} 
            className={`border shadow-none cursor-pointer transition-colors ${notif.unread ? 'border-primary/20 ring-1 ring-primary/10 hover:bg-muted/30' : 'border-border hover:bg-muted/20'}`}
            onClick={() => notif.unread && markNotificationRead(notif.id)}
          >
            <CardContent className="p-4 flex gap-4">
              <div className={`h-12 w-12 rounded-full shrink-0 flex items-center justify-center border ${getBg(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-semibold ${notif.unread ? 'text-foreground' : 'text-foreground/80'}`}>{notif.title}</h3>
                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {notif.message}
                </p>
                {notif.unread && (
                  <div className="pt-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {notifications.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No notifications to show.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
