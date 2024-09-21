// components/Skeleton.tsx
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  margin?: string;
}

const SkeletonWrapper = styled.div<SkeletonProps>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "20px"};
  background-color: #e0e0e0;
  border-radius: ${(props) => props.borderRadius || "4px"};
  margin: ${(props) => props.margin || "0"};
  animation: ${pulse} 1.5s ease-in-out 0.5s infinite;
`;

const Skeleton: React.FC<SkeletonProps> = (props) => {
  return <SkeletonWrapper {...props} />;
};

export default Skeleton;
