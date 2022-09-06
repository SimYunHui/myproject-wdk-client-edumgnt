import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
`;

const TitleWrapper = styled.section``;
const ContentWrapper = styled.section`
  height: 100%;
  margin-top: 10px;
`;

const TopWrapper = styled.section`
  width: 100%;
  height: 420px;
`;

const BottomWrapper = styled.section`
  height: calc(100% - 420px);
  padding: 10px 0 0;
`;

const BottomLeftContent = styled.section`
  float: left;
  width: 50%;
  height: 100%;
  padding-bottom: 10px;
`;

const BottomRightContent = styled.section`
  float: right;
  width: 50%;
  height: 100%;
  padding-bottom: 10px;
`;

type TemplateProps = {
  title: React.ReactNode;
  topContent: React.ReactNode;
  bottomLeftContent?: React.ReactNode;
  bottomRightContent?: React.ReactNode;
};
const Template: React.FC<TemplateProps> = ({ title, topContent, bottomLeftContent, bottomRightContent, ...props }) => {
  return (
    <Wrapper {...props}>
      <TitleWrapper>{title}</TitleWrapper>
      <ContentWrapper>
        <TopWrapper>{topContent}</TopWrapper>
        <BottomWrapper>
          <BottomLeftContent>{bottomLeftContent}</BottomLeftContent>
          <BottomRightContent>{bottomRightContent}</BottomRightContent>
        </BottomWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Template;
