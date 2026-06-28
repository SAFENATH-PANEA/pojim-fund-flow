import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CircleDollarSign, 
  HandCoins, 
  AlertTriangle, 
  Briefcase, 
  BarChart3, 
  Bell, 
  LogOut,
  User as UserIcon,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user, logout } = useAuth();

  const baseNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'My Shares', icon: CircleDollarSign, path: '/shares' },
    { name: 'Loans', icon: HandCoins, path: '/loans' },
    { name: 'Penalties', icon: AlertTriangle, path: '/penalties' },
    { name: 'Our Projects', icon: Briefcase, path: '/projects' },
    { name: 'Financial Summary', icon: BarChart3, path: '/summary' },
  ];

  const navItems = [...baseNavItems];
  if (user?.role === 'admin') {
    navItems.push({ name: 'Member Management', icon: Users, path: '/admin/members' });
  }
  navItems.push({ name: 'Notifications', icon: Bell, path: '/notifications' });

  return (
    <div className={cn("flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64", className)}>
      <div className="p-6 flex flex-col items-center border-b border-sidebar-border">
        <Avatar className="h-20 w-20 mb-4 border-2 border-primary/20">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback><UserIcon /></AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="font-semibold text-sidebar-foreground truncate max-w-[200px]">{user?.name}</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{user?.memberId}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
              isActive 
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
