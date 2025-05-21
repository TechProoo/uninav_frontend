'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { fetchAllUsers } from '@/api/user.api';
import { UserProfile } from '@/lib/types/response.type';
import { Users, Verified, BarChart3, Search, ChevronLeft, ChevronRight } from 'lucide-react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const UsersPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [verifiedUsers, setVerifiedUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userSignupData, setUserSignupData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const limitPerPage = 100;

  const loadUsers = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const result = await fetchAllUsers(page, limitPerPage, search);

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
  }, [limitPerPage]);

  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
    loadUsers(1, debouncedSearchQuery);
  }, [debouncedSearchQuery, loadUsers]);

  useEffect(() => {
    loadUsers(currentPage, debouncedSearchQuery);
  }, [currentPage, loadUsers, debouncedSearchQuery]);

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
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (isLoading && users.length === 0 && searchQuery === '') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading users data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management Dashboard</h1>
        <div className="relative mt-4 md:mt-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users (name, email, username)..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-72 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Summaries */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-semibold text-gray-700">Total Users</CardTitle>
            <Users className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{totalUsers}</div>
            <p className="text-xs text-gray-500">Overall registered users</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-semibold text-gray-700">Verified Users (Page)</CardTitle>
            <Verified className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{verifiedUsers}</div>
            <p className="text-xs text-gray-500">
              Verified on this current page.
            </p>
          </CardContent>
        </Card>
         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-1 md:col-span-2">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-semibold text-gray-700">Active Users (Placeholder)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">N/A</div>
            <p className="text-xs text-gray-500">Data not yet available</p>
          </CardContent>
        </Card>
      </div>

      {/* User Signup Streak Graph - only show if data exists */}
      {userSignupData.length > 0 && !isLoading && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700 flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-purple-500" />
                User Signups (Current Page)
            </CardTitle>
            <CardDescription>New user registrations over time for the current set of users.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={userSignupData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#333' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="users" fill="#8884d8" name="New Users" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">User List</CardTitle>
          <CardDescription>Browse, search, and manage all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-500">Loading table data...</p>
            </div>
          )}
          {!isLoading && users.length === 0 && (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-500">{searchQuery ? `No users found for "${searchQuery}".` : "No users found."}</p>
            </div>
          )}
          {!isLoading && users.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Username</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">Level</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Department</TableHead>
                    <TableHead className="font-semibold">Verified</TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-gray-800">{user.firstName} {user.lastName}</TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell className="text-gray-600 hidden md:table-cell">{user.username}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'moderator' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 hidden lg:table-cell">{user.level}</TableCell>
                      <TableCell className="text-gray-600 hidden md:table-cell">{user.department?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.auth?.emailVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.auth?.emailVerified ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 hidden lg:table-cell">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <CardFooter className="flex items-center justify-between border-t pt-6 mt-6">
                <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages} ({totalUsers} users total{searchQuery && `, filtered by "${searchQuery}"`})
                </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || isLoading}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || isLoading}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardFooter>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage; 