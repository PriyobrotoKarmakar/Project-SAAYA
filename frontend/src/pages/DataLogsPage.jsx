import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileDown,
  Search,
  Filter,
  Server,
  Shield,
  Database,
  User,
} from "lucide-react";

// Mock Data Generator
const generateLogs = (count) => {
  const levels = ["INFO", "WARNING", "ERROR", "SUCCESS"];
  const sources = ["System Core", "Auth Service", "Database", "Device_Manager"];
  const messages = [
    "User login successful",
    "Connection timeout retrying...",
    "Database backup completed",
    "Invalid API token detected",
    "New device registered: Saaya_005",
    "High latency on node us-east-1",
  ];

  return Array.from({ length: count })
    .map((_, i) => ({
      id: `LOG-${1000 + i}`,
      timestamp: new Date(
        Date.now() - Math.floor(Math.random() * 1000000000),
      ).toISOString(),
      level: levels[Math.floor(Math.random() * levels.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      user: Math.random() > 0.5 ? "admin" : "system",
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const allLogs = generateLogs(50); // Generate 50 mock logs

export default function DataLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Logic
  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;

    return matchesSearch && matchesLevel;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Export to CSV Function
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Timestamp,Level,Source,Message,User"]
        .concat(
          filteredLogs.map(
            (row) =>
              `${row.id},${row.timestamp},${row.level},${row.source},"${row.message}",${row.user}`,
          ),
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "system_logs.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="h-full flex flex-col p-8 space-y-8 bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Logs</h2>
          <p className="text-muted-foreground">
            Audit trail of all system activities and security events.
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              {/* Search Bar */}
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Filter Dropdown */}
              <Select defaultValue="all" onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {paginatedLogs.length} of {filteredLogs.length} entries
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-0">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0">
              <TableRow>
                <TableHead className="w-[100px]">Log ID</TableHead>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[120px]">Level</TableHead>
                <TableHead className="w-[150px]">Source</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[100px]">User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">
                      {log.id}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                          ${log.level === "ERROR" ? "border-red-500/50 text-red-500 bg-red-500/10" : ""}
                          ${log.level === "WARNING" ? "border-amber-500/50 text-amber-500 bg-amber-500/10" : ""}
                          ${log.level === "SUCCESS" ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/10" : ""}
                          ${log.level === "INFO" ? "border-blue-500/50 text-blue-500 bg-blue-500/10" : ""}
                        `}
                      >
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {log.source === "Database" && (
                        <Database className="h-3 w-3 text-muted-foreground" />
                      )}
                      {log.source === "Auth Service" && (
                        <Shield className="h-3 w-3 text-muted-foreground" />
                      )}
                      {log.source === "System Core" && (
                        <Server className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className="text-sm">{log.source}</span>
                    </TableCell>
                    <TableCell
                      className="max-w-[300px] truncate"
                      title={log.message}
                    >
                      {log.message}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md w-fit">
                        <User className="h-3 w-3" />
                        {log.user}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Footer with Pagination */}
        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Simple page indicator */}
              <PaginationItem>
                <span className="px-4 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}
