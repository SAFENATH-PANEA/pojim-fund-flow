import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ShieldCheck, User } from 'lucide-react';

const Login: React.FC = () => {
  const { user, login } = useAuth();
  const [memberId, setMemberId] = useState('MEM001');

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (role: 'admin' | 'member') => {
    login(role, role === 'member' ? memberId : 'ADMIN001');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Pojim Portal</CardTitle>
          <CardDescription>
            Pojim Self Help Group Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="member" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="member" className="gap-2">
                <User className="h-4 w-4" /> Member
              </TabsTrigger>
              <TabsTrigger value="admin" className="gap-2">
                <ShieldCheck className="h-4 w-4" /> Admin
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="member" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="member-id">Member ID</Label>
                <Input 
                  id="member-id" 
                  placeholder="e.g. MEM001" 
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-password">Password</Label>
                <Input id="member-password" type="password" placeholder="••••••••" defaultValue="password" />
              </div>
              <Button className="w-full mt-4" onClick={() => handleLogin('member')}>
                Login as Member
              </Button>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input id="admin-email" placeholder="admin@pojim.com" defaultValue="admin@pojim.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input id="admin-password" type="password" placeholder="••••••••" defaultValue="admin123" />
              </div>
              <Button className="w-full mt-4" onClick={() => handleLogin('admin')}>
                Login as Administrator
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col border-t pt-6 bg-muted/5 rounded-b-lg">
          <p className="text-xs text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} Pojim Self Help Group. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
