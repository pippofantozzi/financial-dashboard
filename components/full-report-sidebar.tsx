
'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from './ui/sheet';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge'; // Optional: for tags or status
import ReactMarkdown from 'react-markdown'; // Needs npm install react-markdown

interface FullReportSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: any; // Expects data like { month, year, tldr, full_report (markdown string), ... }
}

export function FullReportSidebar({ isOpen, onClose, reportData }: FullReportSidebarProps) {
  if (!reportData) {
    return null; // Don't render if no data is provided
  }

  const reportTitle = `Monthly Report - ${new Date(reportData.year, reportData.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg w-[90vw] flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle>{reportTitle}</SheetTitle>
          <SheetDescription>
            Detailed financial summary and insights for the selected month.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <ScrollArea className="flex-grow mt-4 pr-6">
           {/* Render the markdown content */}
            <article className="prose prose-sm dark:prose-invert max-w-none">
                 {/* Basic stats if not included in markdown */}
                 {/* <p><strong>Total Income:</strong> R$ {reportData.total_income?.toFixed(2)}</p>
                 <p><strong>Total Expenses:</strong> R$ {reportData.total_expenses?.toFixed(2)}</p>
                 <p><strong>Net Result:</strong> R$ {reportData.net?.toFixed(2)}</p>
                 <Separator className="my-4"/> */}

                <ReactMarkdown
                   components={{ // Optional: Customize markdown rendering
                     h1: ({node, ...props}) => <h1 className="text-xl font-semibold mb-3" {...props} />,
                     h2: ({node, ...props}) => <h2 className="text-lg font-medium mt-4 mb-2" {...props} />,
                     p: ({node, ...props}) => <p className="text-sm leading-relaxed mb-2" {...props} />,
                     ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 mb-3" {...props} />,
                     li: ({node, ...props}) => <li className="text-sm" {...props} />,
                     strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                   }}
                 >
                  {reportData.full_report || "No detailed report content available."}
                </ReactMarkdown>
            </article>

        </ScrollArea>
        <Separator className="mt-4" />
        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </SheetClose>
          {/* Optional: Add Print or Export button */}
          {/* <Button type="button">Print / Export</Button> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

