// src/components/admin/recent-activities.tsx
import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H4, Paragraph, Small } from "@component/Typography";
import Icon from "@component/icon/Icon";
import { Activity } from "hooks/useDashboardData";

const ActivityCard = styled(Box)`
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const ActivityItem = styled(FlexBox)`
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[300]};
  padding: 0.75rem 0;
  &:last-child {
    border-bottom: none;
  }
`;

const IconWrapper = styled(Box)`
  background: ${(props) => props.theme.colors.primary[100]};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

interface RecentActivitiesProps {
  activities?: Activity[];
}

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "new_user":
      return "user-plus";
    case "new_order":
      return "shopping-cart";
    case "new_product":
      return "package";
    default:
      return "activity";
  }
};

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <ActivityCard>
        <H4 mb="1.5rem">Recent Activities</H4>
        <Paragraph>No recent activities available.</Paragraph>
      </ActivityCard>
    );
  }

  return (
    <ActivityCard>
      <H4 mb="1.5rem">Recent Activities</H4>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} alignItems="center">
          <IconWrapper>
            <Icon size="20px" color="primary">
              {getActivityIcon(activity.type)}
            </Icon>
          </IconWrapper>
          <Box>
            <Paragraph mb="0.25rem">{activity.description}</Paragraph>
            <Small color="text.muted">{activity.time}</Small>
          </Box>
        </ActivityItem>
      ))}
    </ActivityCard>
  );
};

export default RecentActivities;
