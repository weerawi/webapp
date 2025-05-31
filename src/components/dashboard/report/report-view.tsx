"use client";

import { useState } from "react";
import { useReports } from "@/lib/hooks/useReports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import {
  Download, FileText, BarChart3, Camera
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

export function ReportView() {
  const { filteredRecords = [] } = useReports(); // ✅ default to empty array to prevent crash
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleViewPhoto = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setPhotoDialogOpen(true);
  };

  const handleDownloadReport = () => {
    console.log("Downloading report");
    // TODO: implement CSV/Excel export
  };

  const renderCheckmark = (value: boolean) => (
    value ? (
      <div className="flex justify-center">
        <div className="h-4 w-4 rounded-full bg-green-500" />
      </div>
    ) : null
  );

  return (
    <>
      <Card className="gap-0 pt-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Disconnection Report ({filteredRecords.length} records)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="table" className="space-y-2">
            <TabsList>
              <TabsTrigger value="table">
                <FileText className="h-4 w-4 mr-1" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="summary">
                <BarChart3 className="h-4 w-4 mr-1" />
                Summary View
              </TabsTrigger>
            </TabsList>

            {/* Table View */}
            <TabsContent value="table" className="space-y-4">
              <Table>
                <ScrollArea className="h-[450px]">
                  <div className="rounded-md border">
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead className="w-24">Date</TableHead>
                        <TableHead className="w-20">Time</TableHead>
                        <TableHead className="w-28">Account No</TableHead>
                        <TableHead className="w-24">Area</TableHead>
                        <TableHead className="w-24">Supervisor</TableHead>
                        <TableHead className="w-20">Team</TableHead>
                        <TableHead className="w-20">Helper</TableHead>
                        <TableHead className="text-center">DC</TableHead>
                        <TableHead className="text-center">RC</TableHead>
                        <TableHead className="text-center">100%</TableHead>
                        <TableHead className="text-center">80%</TableHead>
                        <TableHead className="text-center">50%</TableHead>
                        <TableHead className="text-center">Already Paid</TableHead>
                        <TableHead className="text-center">Un Solved Cus Comp.</TableHead>
                        <TableHead className="text-center">Gate Closed</TableHead>
                        <TableHead className="text-center">Meter Removed</TableHead>
                        <TableHead className="text-center">Already Disconnected</TableHead>
                        <TableHead className="text-center">Wrong Meter</TableHead>
                        <TableHead className="text-center">Billing Error</TableHead>
                        <TableHead className="text-center">Can’t Find</TableHead>
                        <TableHead className="text-center">Objections</TableHead>
                        <TableHead className="text-center">Stopped By NWSDB</TableHead>
                        <TableHead className="text-center">Photo</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.time}</TableCell>
                          <TableCell>{record.accountNo}</TableCell>
                          <TableCell>{record.area}</TableCell>
                          <TableCell>{record.supervisor}</TableCell>
                          <TableCell>{record.teamNo}</TableCell>
                          <TableCell>{record.helper}</TableCell>
                          <TableCell>{renderCheckmark(record.dc)}</TableCell>
                          <TableCell>{renderCheckmark(record.rc)}</TableCell>
                          <TableCell>{renderCheckmark(record.payment100)}</TableCell>
                          <TableCell>{renderCheckmark(record.payment80)}</TableCell>
                          <TableCell>{renderCheckmark(record.payment50)}</TableCell>
                          <TableCell>{renderCheckmark(record.alreadyPaid)}</TableCell>
                          <TableCell>{renderCheckmark(record.unSolvedCusComp)}</TableCell>
                          <TableCell>{renderCheckmark(record.gateClosed)}</TableCell>
                          <TableCell>{renderCheckmark(record.meterRemoved)}</TableCell>
                          <TableCell>{renderCheckmark(record.alreadyDisconnected)}</TableCell>
                          <TableCell>{renderCheckmark(record.wrongMeter)}</TableCell>
                          <TableCell>{renderCheckmark(record.billingError)}</TableCell>
                          <TableCell>{renderCheckmark(record.cantFind)}</TableCell>
                          <TableCell>{renderCheckmark(record.objections)}</TableCell>
                          <TableCell>{renderCheckmark(record.stoppedByNWSDB)}</TableCell>
                          <TableCell>
                            {record.photo && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewPhoto(record.photo!)}
                              >
                                <Camera className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </div>
                </ScrollArea>
              </Table>
            </TabsContent>

            {/* Summary View */}
            <TabsContent value="summary">
              <div className="text-sm text-muted-foreground">
                {/* Summary content here or component like <ReportSummary records={filteredRecords} /> */}
                Summary coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Photo Modal */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disconnection Photo</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-6">
            {selectedPhoto && (
              <div className="relative h-64 w-64">
                <Image
                  src={selectedPhoto}
                  alt="Disconnection photo"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
