
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Upload, FileJson, Database, Info, Shield } from "lucide-react";
import { AppDataExportService } from '@/services/AppDataExportService';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const AppDataExport: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExportAppData = async () => {
    try {
      setIsExporting(true);
      
      // Export without requiring user email since we don't have auth
      const result = await AppDataExportService.exportAppDataAsJSON();
      
      if (result.success) {
        toast.success(`Complete app data exported successfully: ${result.fileName}`);
        setIsDialogOpen(false);
      } else {
        toast.error(`Export failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export app data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      
      const result = await AppDataExportService.importAppDataFromJSON(file);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import app data");
    } finally {
      setIsImporting(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white w-full"
        >
          <Download className="h-4 w-4" />
          Export JSON Data
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileJson className="h-5 w-5 text-blue-400" />
            Export & Import Complete App Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Info Section */}
          <Card className="bg-blue-900/20 border-blue-600/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
                <Info className="h-4 w-4" />
                What's Included in Export
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="secondary" className="bg-gray-700 text-gray-200">Teams</Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-200">Players</Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-200">Games</Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-200">Statistics</Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-200">Mock Data</Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-200">Settings</Badge>
                <Badge variant="secondary" className="bg-purple-700 text-purple-200 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Local Storage
                </Badge>
                <Badge variant="secondary" className="bg-green-700 text-green-200">App State</Badge>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                Export creates a complete backup of your Gametriq data from browser storage.
                No login required!
              </p>
            </CardContent>
          </Card>

          {/* Export Section */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Export Complete Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Download all your app data as a comprehensive JSON file. This includes teams, players, games, 
                statistics, user settings, and local app data.
              </p>
              
              <Button
                onClick={handleExportAppData}
                disabled={isExporting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export Complete App Data (JSON)"}
              </Button>
            </CardContent>
          </Card>

          {/* Import Section */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Import Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Import previously exported JSON data. This will validate the file format 
                and show what data would be imported.
              </p>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  disabled={isImporting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  disabled={isImporting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isImporting ? "Importing..." : "Import Complete App Data (JSON)"}
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Note: Import functionality is currently in preview mode for validation only.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppDataExport;
