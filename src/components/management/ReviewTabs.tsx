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
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger
          value={ApprovalStatusEnum.PENDING}
          className="flex justify-center items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          <span>Pending</span>
          <Badge
            variant="secondary"
            className="bg-orange-100 ml-1 text-orange-800"
          >
            {pendingCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value={ApprovalStatusEnum.APPROVED}
          className="flex justify-center items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Approved</span>
          <Badge
            variant="secondary"
            className="bg-green-100 ml-1 text-green-800"
          >
            {approvedCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value={ApprovalStatusEnum.REJECTED}
          className="flex justify-center items-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          <span>Rejected</span>
          <Badge variant="secondary" className="bg-red-100 ml-1 text-red-800">
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
