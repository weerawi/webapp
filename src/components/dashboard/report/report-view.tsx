"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, BarChart3, Camera } from "lucide-react"
import { useDisconnectionStore } from "@/lib/store/disconnection"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

export function ReportView() {
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const filteredRecords = useDisconnectionStore((state) => state.filteredRecords)
  const fetchRecords = useDisconnectionStore((state) => state.fetchRecords)

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const handleViewPhoto = (photoUrl: string) => {
    setSelectedPhoto(photoUrl)
    setPhotoDialogOpen(true)
  }

  const handleDownloadReport = () => {
    console.log("Downloading report")
    // Implement download functionality
  }

  // Function to render checkmark or empty cell
  const renderCheckmark = (value: boolean) => {
    return value ? (
      <div className="flex justify-center">
        <div className="h-4 w-4 rounded-full bg-green-500"></div>
      </div>
    ) : null
  }

  return (
    <>
      <Card className="gap-0 pt-1 ">
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
        <CardContent >
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
                        <TableHead className="w-16 text-center">DC</TableHead>
                        <TableHead className="w-16 text-center">RC</TableHead>
                        <TableHead className="w-16 text-center">100%</TableHead>
                        <TableHead className="w-16 text-center">80%</TableHead>
                        <TableHead className="w-16 text-center">50%</TableHead>
                        <TableHead className="w-24 text-center">Already Paid</TableHead>
                        <TableHead className="w-24 text-center">Un Solved Cus Comp.</TableHead>
                        <TableHead className="w-24 text-center">Gate Closed</TableHead>
                        <TableHead className="w-24 text-center">Meter Removed</TableHead>
                        <TableHead className="w-24 text-center">Already Disconnected</TableHead>
                        <TableHead className="w-24 text-center">Wrong Meter</TableHead>
                        <TableHead className="w-24 text-center">Billing Error</TableHead>
                        <TableHead className="w-20 text-center">Can&apos;t Find</TableHead>
                        <TableHead className="w-20 text-center">Objections</TableHead>
                        <TableHead className="w-24 text-center">Stopped By NWSDB</TableHead>
                        <TableHead className="w-16 text-center">Photo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono text-xs">{record.date}</TableCell>
                          <TableCell className="font-mono text-xs">{record.time}</TableCell>
                          <TableCell className="font-mono text-xs">{record.accountNo}</TableCell>
                          <TableCell>{record.area}</TableCell>
                          <TableCell className="text-center">{record.supervisor}</TableCell>
                          <TableCell className="text-center">{record.teamNo}</TableCell>
                          <TableCell className="text-center">{record.helper}</TableCell>
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
                              <Button variant="ghost" size="sm" onClick={() => handleViewPhoto(record.photo!)}>
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

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Disconnection Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>DC (Disconnected)</span>
                        <span className="font-bold text-red-600">{filteredRecords.filter((r) => r.dc).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>RC (Reconnected)</span>
                        <span className="font-bold text-green-600">{filteredRecords.filter((r) => r.rc).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Agent Payment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>100% Salary</span>
                        <span className="font-bold text-green-600">
                          {filteredRecords.filter((r) => r.payment100).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>80% Salary</span>
                        <span className="font-bold text-orange-600">
                          {filteredRecords.filter((r) => r.payment80).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>50% Salary</span>
                        <span className="font-bold text-red-600">
                          {filteredRecords.filter((r) => r.payment50).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Already Paid</span>
                        <span className="font-bold text-blue-600">
                          {filteredRecords.filter((r) => r.alreadyPaid).length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Field Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Gate Closed</span>
                        <span>{filteredRecords.filter((r) => r.gateClosed).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Meter Removed</span>
                        <span>{filteredRecords.filter((r) => r.meterRemoved).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Already Disconnected</span>
                        <span>{filteredRecords.filter((r) => r.alreadyDisconnected).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wrong Meter</span>
                        <span>{filteredRecords.filter((r) => r.wrongMeter).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Customer Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Unsolved Complaints</span>
                        <span>{filteredRecords.filter((r) => r.unSolvedCusComp).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Billing Error</span>
                        <span>{filteredRecords.filter((r) => r.billingError).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Can&apos;t Find</span>
                        <span>{filteredRecords.filter((r) => r.cantFind).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Objections</span>
                        <span>{filteredRecords.filter((r) => r.objections).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stopped By NWSDB</span>
                        <span>{filteredRecords.filter((r) => r.stoppedByNWSDB).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-sm">Daily Totals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Records</span>
                          <span className="font-bold">{filteredRecords.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DC Count</span>
                          <span className="font-bold text-red-600">{filteredRecords.filter((r) => r.dc).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>RC Count</span>
                          <span className="font-bold text-green-600">{filteredRecords.filter((r) => r.rc).length}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Payment Issues</span>
                          <span className="font-bold text-orange-600">
                            {filteredRecords.filter((r) => r.payment80 || r.payment50).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Field Issues</span>
                          <span className="font-bold text-red-600">
                            {
                              filteredRecords.filter(
                                (r) => r.gateClosed || r.meterRemoved || r.alreadyDisconnected || r.wrongMeter,
                              ).length
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Customer Issues</span>
                          <span className="font-bold text-purple-600">
                            {
                              filteredRecords.filter(
                                (r) =>
                                  r.unSolvedCusComp || r.billingError || r.cantFind || r.objections || r.stoppedByNWSDB,
                              ).length
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Photo Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disconnection Photo</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-6">
            {selectedPhoto && (
              <div className="relative h-64 w-64">
                <Image
                  src={selectedPhoto || "/placeholder.svg"}
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
  )
}
