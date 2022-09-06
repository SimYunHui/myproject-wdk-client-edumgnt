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
  width: 30%;
  height: 100%;
`;
const RightContent = styled.section`
  float: right;
  width: 70%;
  height: 100%;
`;

const RightTopContent = styled.section`
  height: 50%;
`;

const RightBottomContent = styled.section`
  padding: 10px 0 0;
  height: 50%;
`;

type TemplateProps = {
  title: React.ReactNode;
  searchForm: React.ReactNode;
  leftContent: React.ReactNode;
  rightTopContent?: React.ReactNode;
  rightBottomContent?: React.ReactNode;
};

const Template: React.FC<TemplateProps> = ({
  title,
  searchForm,
  leftContent,
  rightTopContent,
  rightBottomContent,
  ...props
}) => {
  return (
    <Wrapper {...props}>
      <TitleWrapper>{title}</TitleWrapper>
      <SearchWrapper>{searchForm}</SearchWrapper>
      <ContentWrapper>
        <LeftContent>{leftContent}</LeftContent>
        <RightContent>
          <RightTopContent>{rightTopContent}</RightTopContent>
          <RightBottomContent>{rightBottomContent}</RightBottomContent>
        </RightContent>
      </ContentWrapper>
    </Wrapper>
  );
};

Template.propTypes = {
  // ConditionForm: PropTypes.node.isRequired,
  // leftContent: PropTypes.node.isRequired,
  // detailRow1: PropTypes.any.isRequired,
};

export default Template;
