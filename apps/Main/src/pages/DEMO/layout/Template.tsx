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
  width: 100%;
  height: 100%;
`;

type TemplateProps = {
  title: React.ReactNode;
  searchForm: React.ReactNode;
  content: React.ReactNode;
};
const Template = ({ title, searchForm, content, ...props }: TemplateProps) => {
  return (
    <Wrapper {...props}>
      <TitleWrapper>{title}</TitleWrapper>
      <SearchWrapper>{searchForm}</SearchWrapper>
      <ContentWrapper>{content}</ContentWrapper>
    </Wrapper>
  );
};

export default Template;
