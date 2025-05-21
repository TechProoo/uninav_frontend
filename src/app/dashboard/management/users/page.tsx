'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fetchAllUsers } from '@/api/user.api';
import { UserProfile } from '@/lib/types/response.type';

const UsersPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [verifiedUsers, setVerifiedUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userSignupData, setUserSignupData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const limitPerPage = 100;

  const loadUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const result = await fetchAllUsers(page, limitPerPage);

      if (result && result.data) {
        setUsers(result.data);
        setTotalUsers(result.total);
        setTotalPages(Math.ceil(result.total / limitPerPage));

        const verifiedCount = result.data.filter(user => user.auth?.emailVerified).length;
        setVerifiedUsers(verifiedCount);

        const signupCounts: { [key: string]: number } = {};
        result.data.forEach(user => {
          const date = new Date(user.createdAt).toLocaleDateString();
          signupCounts[date] = (signupCounts[date] || 0) + 1;
        });
        setUserSignupData(Object.entries(signupCounts).map(([name, value]) => ({ name, users: value })));
      } else {
        toast.error('Failed to fetch users or data is not in expected format.');
        setUsers([]);
        setTotalUsers(0);
        setTotalPages(1);
        setVerifiedUsers(0);
        setUserSignupData([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users. Please try again.');
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(1);
      setVerifiedUsers(0);
      setUserSignupData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading && users.length === 0) {
    return <div className="container mx-auto p-4">Loading users...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* Summaries */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users (Current Page)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedUsers}</div>
            <p className="text-xs text-muted-foreground">
              Based on the current page of users.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Signup Streak Graph */}
      {userSignupData.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Signups Over Time (Current Page)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userSignupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
             <p className="text-xs text-muted-foreground mt-2">
              Shows user signups based on the created date for the current page of users.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading table data...</p>}
          {!isLoading && users.length === 0 && <p>No users found.</p>}
          {!isLoading && users.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.level}</TableCell>
                    <TableCell>{user.department?.name || 'N/A'}</TableCell>
                    <TableCell>{user.auth?.emailVerified ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {/* Pagination Controls */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}. Total users: {totalUsers}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage; 