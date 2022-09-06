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
  float: left;
  width: 50%;
  height: 100%;
`;
const RightContent = styled.section`
  float: right;
  width: 50%;
  height: 100%;
`;

type TemplateProps = {
  title: React.ReactNode;
  searchForm: React.ReactNode;
  leftContent: React.ReactNode;
  rightContent?: React.ReactNode;
};
const Template: React.FC<TemplateProps> = ({ title, searchForm, leftContent, rightContent, ...props }) => {
  return (
    <Wrapper {...props}>
      <TitleWrapper>{title}</TitleWrapper>
      <SearchWrapper>{searchForm}</SearchWrapper>
      <ContentWrapper>
        <LeftContent>{leftContent}</LeftContent>
        <RightContent>{rightContent}</RightContent>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Template;
