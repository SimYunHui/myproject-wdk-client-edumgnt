// https://github.com/diegohaz/arc/wiki/Atomic-Design#templates
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  box-sizing: border-box;
  height: 100%;
`;

const TitleWrapper = styled.section``;
const SearchWrapper = styled.section``;
const ContentWrapper = styled.section`
  height: 100%;
`;

const LeftContent = styled.section`
  width: 100%;
  height: 50%;
`;
const RightContent = styled.section`
  width: 100%;
  height: 50%;
  padding: 10px 0 0;
`;

type TemplateProps = {
  title: React.ReactNode;
  searchForm: React.ReactNode;
  topContent: React.ReactNode;
  bottomContent?: React.ReactNode;
};
const Template: React.FC<TemplateProps> = ({ title, searchForm, topContent, bottomContent, ...props }) => {
  return (
    <Wrapper {...props}>
      <TitleWrapper>{title}</TitleWrapper>
      <SearchWrapper>{searchForm}</SearchWrapper>
      <ContentWrapper>
        <LeftContent>{topContent}</LeftContent>
        <RightContent>{bottomContent}</RightContent>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Template;
