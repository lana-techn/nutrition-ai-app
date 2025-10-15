'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Database, User as UserIcon, Users } from 'lucide-react';

export default function DebugSyncPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [testing, setTesting] = useState(false);
  const [dbTest, setDbTest] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [bulkSyncResult, setBulkSyncResult] = useState<any>(null);

  const testDatabase = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/admin/test-db');
      const data = await response.json();
      setDbTest(data);
    } catch (error) {
      setDbTest({ success: false, error: 'Failed to test database' });
    } finally {
      setTesting(false);
    }
  };

  const checkSyncStatus = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/user/sync');
      const data = await response.json();
      setSyncStatus(data);
    } catch (error) {
      setSyncStatus({ error: 'Failed to check sync status' });
    } finally {
      setTesting(false);
    }
  };

  const forceSyncUser = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/user/sync', { method: 'POST' });
      const data = await response.json();
      setSyncResult(data);
      
      // Refresh sync status
      if (data.success) {
        await checkSyncStatus();
      }
    } catch (error) {
      setSyncResult({ success: false, error: 'Failed to sync user' });
    } finally {
      setTesting(false);
    }
  };

  const bulkSyncAllUsers = async () => {
    setTesting(true);
    setBulkSyncResult(null);
    try {
      const response = await fetch('/api/admin/sync-all-users', { method: 'POST' });
      const data = await response.json();
      setBulkSyncResult(data);
      
      // Refresh sync status after bulk sync
      if (data.success) {
        await checkSyncStatus();
      }
    } catch (error) {
      setBulkSyncResult({ success: false, error: 'Failed to bulk sync users' });
    } finally {
      setTesting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <span>Authentication Required</span>
            </CardTitle>
            <CardDescription>
              Please sign in to test user synchronization
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-6 h-6 text-orange-500" />
              <span>User Sync Debug Tool</span>
            </CardTitle>
            <CardDescription>
              Test and debug Clerk to Neon database synchronization
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Current User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5" />
              <span>Current Clerk User</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <div><strong>Clerk ID:</strong> {user.id}</div>
              <div><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</div>
              <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
              <div><strong>Created:</strong> {new Date(user.createdAt || '').toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        {/* Test Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bulk Sync Section */}
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg flex items-center space-x-2 mb-1">
                    <Users className="w-5 h-5 text-orange-600" />
                    <span>Bulk Sync All Users</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sync semua existing users dari Clerk ke database Neon
                  </p>
                </div>
                <Button
                  onClick={bulkSyncAllUsers}
                  disabled={testing}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
                  size="lg"
                >
                  {testing ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Users className="w-5 h-5 mr-2" />
                  )}
                  Sync All Users
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={testDatabase}
                disabled={testing}
                className="w-full"
                variant="outline"
              >
                {testing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Database className="w-4 h-4 mr-2" />
                )}
                Test Database
              </Button>

              <Button 
                onClick={checkSyncStatus}
                disabled={testing}
                className="w-full"
                variant="outline"
              >
                {testing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Check Sync Status
              </Button>

              <Button 
                onClick={forceSyncUser}
                disabled={testing}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {testing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Force Sync Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Test Result */}
        {dbTest && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {dbTest.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span>Database Test Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(dbTest, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Sync Status Result */}
        {syncStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {syncStatus.isSynced ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                <span>Sync Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${syncStatus.isSynced ? 'bg-green-100 dark:bg-green-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'}`}>
                  <div className="font-semibold mb-2">
                    {syncStatus.isSynced ? '✅ User is synced to database' : '⚠️ User is NOT synced to database'}
                  </div>
                  {!syncStatus.isSynced && (
                    <div className="text-sm">
                      Click "Force Sync Now" to sync this user to the database
                    </div>
                  )}
                </div>
                
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(syncStatus, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bulk Sync Result */}
        {bulkSyncResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {bulkSyncResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span>Bulk Sync Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bulkSyncResult.success && bulkSyncResult.results && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{bulkSyncResult.results.total}</div>
                        <div className="text-sm text-muted-foreground">Total Users</div>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{bulkSyncResult.results.synced}</div>
                        <div className="text-sm text-muted-foreground">New Synced</div>
                      </div>
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{bulkSyncResult.results.updated}</div>
                        <div className="text-sm text-muted-foreground">Updated</div>
                      </div>
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{bulkSyncResult.results.failed}</div>
                        <div className="text-sm text-muted-foreground">Failed</div>
                      </div>
                    </div>

                    {bulkSyncResult.results.errors && bulkSyncResult.results.errors.length > 0 && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="font-semibold text-red-800 dark:text-red-200 mb-2">Errors:</div>
                        <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
                          {bulkSyncResult.results.errors.map((error: string, idx: number) => (
                            <li key={idx}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(bulkSyncResult, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sync Result */}
        {syncResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {syncResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span>Sync Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncResult.success && (
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700">
                    <div className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      ✅ {syncResult.message}
                    </div>
                    {syncResult.alreadyExists && (
                      <div className="text-sm text-green-700 dark:text-green-300">
                        User was already in the database
                      </div>
                    )}
                    {!syncResult.alreadyExists && (
                      <div className="text-sm text-green-700 dark:text-green-300">
                        User has been successfully added to the database
                      </div>
                    )}
                  </div>
                )}
                
                {!syncResult.success && (
                  <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700">
                    <div className="font-semibold text-red-800 dark:text-red-200 mb-2">
                      ❌ Sync Failed
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300">
                      {syncResult.error || 'Unknown error occurred'}
                    </div>
                  </div>
                )}
                
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(syncResult, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use This Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Sync All Users:</strong> Bulk sync semua users dari Clerk ke Neon (ONE-TIME)</li>
              <li><strong>Test Database:</strong> Verify database connection and schema</li>
              <li><strong>Check Sync Status:</strong> See if your user is already in the database</li>
              <li><strong>Force Sync Now:</strong> Manually sync your user to the database</li>
            </ol>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="font-semibold mb-2">💡 Troubleshooting Tips:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>If database test fails, check DATABASE_URL in .env.local</li>
                <li>If sync fails, check CLERK_SECRET_KEY in .env.local</li>
                <li>After force sync, verify in database: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">psql $DATABASE_URL -c "SELECT * FROM users;"</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
