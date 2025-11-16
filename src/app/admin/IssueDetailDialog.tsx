import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hash, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import type { Report } from '@/lib/types/admin';

interface IssueDetailDialogProps {
  readonly report: Report | null;
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onToggleResolved: (reportId: number) => void;
}

export function IssueDetailDialog({
  report,
  isOpen,
  onOpenChange,
  onToggleResolved,
}: IssueDetailDialogProps) {
  if (!report) return null;

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-orange-500/30 text-white max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-orange-400 text-xl">Report Details</DialogTitle>
          <DialogDescription className="text-orange-200/70 text-sm">
            View detailed information about this report
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          {/* Report ID and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="h-3.5 w-3.5 text-orange-300" />
              <span className="text-orange-400 font-semibold text-sm">Report #{report.report_id}</span>
            </div>
            {report.is_resolved ? (
              <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-900/50 text-xs">
                Resolved
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-orange-950/30 text-orange-400 border-orange-900/50 text-xs">
                Unresolved
              </Badge>
            )}
          </div>

          <Separator className="bg-orange-500/20" />

          {/* Title */}
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-xs text-orange-300">Title</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <p className="text-white font-medium text-sm">{report.title}</p>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-xs text-orange-300">Description</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <p className="text-orange-100/90 leading-relaxed text-sm">{report.description}</p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-xs text-orange-300">Tags</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="flex flex-wrap gap-2">
                {report.reason.map((r) => (
                  <div key={r.id} className="flex flex-col gap-0.5">
                    <Badge
                      variant="outline"
                      className="bg-gray-900/60 text-orange-200 border-gray-600 text-xs"
                    >
                      <span className="mr-1">{r.report_tag.emoji}</span>
                      {r.report_tag.label}
                    </Badge>
                    <p className="text-[10px] text-orange-200/60 px-1">{r.report_tag.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gray-800/40 border-gray-700">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-xs text-orange-300 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  User ID
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <p className="text-white font-medium text-sm">{report.user_id}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/40 border-gray-700">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-xs text-orange-300 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Created At
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <p className="text-white text-xs font-medium">{formatFullDate(report.created_at)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {report.is_resolved ? (
              <Button
                onClick={() => onToggleResolved(report.report_id)}
                variant="outline"
                size="sm"
                className="border-orange-600/50 bg-orange-950/30 text-orange-100 hover:bg-orange-900/40 hover:text-orange-50 hover:border-orange-500 text-xs"
              >
                <XCircle className="mr-1.5 h-3.5 w-3.5" />
                Mark as Unresolved
              </Button>
            ) : (
              <Button
                onClick={() => onToggleResolved(report.report_id)}
                size="sm"
                className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600] text-white shadow-lg text-xs"
              >
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                Mark as Resolved
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 bg-gray-800/50 text-orange-200 hover:bg-gray-800 hover:text-orange-100 text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
