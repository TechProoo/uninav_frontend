"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ApprovalStatusEnum } from "@/lib/types/response.type";
import { AlertCircle, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReviewTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  children: React.ReactNode;
}

const ReviewTabs: React.FC<ReviewTabsProps> = ({
  activeTab,
  onTabChange,
  pendingCount,
  approvedCount,
  rejectedCount,
  children,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4 sm:mb-6 w-full h-auto p-1">
        <TabsTrigger
          value={ApprovalStatusEnum.PENDING}
          className="flex justify-center items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
        >
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="hidden xs:inline sm:inline">Pending</span>
          <span className="xs:hidden sm:hidden">P</span>
          <Badge
            variant="secondary"
            className="bg-orange-100 ml-1 text-orange-800 text-xs px-1 py-0 min-w-[20px] h-5 flex items-center justify-center"
          >
            {pendingCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value={ApprovalStatusEnum.APPROVED}
          className="flex justify-center items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
        >
          <Check className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="hidden xs:inline sm:inline">Approved</span>
          <span className="xs:hidden sm:hidden">A</span>
          <Badge
            variant="secondary"
            className="bg-green-100 ml-1 text-green-800 text-xs px-1 py-0 min-w-[20px] h-5 flex items-center justify-center"
          >
            {approvedCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value={ApprovalStatusEnum.REJECTED}
          className="flex justify-center items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
        >
          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="hidden xs:inline sm:inline">Rejected</span>
          <span className="xs:hidden sm:hidden">R</span>
          <Badge 
            variant="secondary" 
            className="bg-red-100 ml-1 text-red-800 text-xs px-1 py-0 min-w-[20px] h-5 flex items-center justify-center"
          >
            {rejectedCount}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value={ApprovalStatusEnum.PENDING}>
        {activeTab === ApprovalStatusEnum.PENDING && children}
      </TabsContent>
      <TabsContent value={ApprovalStatusEnum.APPROVED}>
        {activeTab === ApprovalStatusEnum.APPROVED && children}
      </TabsContent>
      <TabsContent value={ApprovalStatusEnum.REJECTED}>
        {activeTab === ApprovalStatusEnum.REJECTED && children}
      </TabsContent>
    </Tabs>
  );
};

export default ReviewTabs;
