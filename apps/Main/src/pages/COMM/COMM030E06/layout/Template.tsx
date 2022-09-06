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

const LeftTopContent = styled.section`
  height: 40%;
`;

const LeftBottomContent = styled.section`
  padding: 10px 0 0;
  height: 60%;
`;

const RightContent = styled.section`
  float: right;
  width: 70%;
  height: 100%;
`;

type TemplateProps = {
  title: React.ReactNode;
  searchForm: React.ReactNode;
  leftTopContent: React.ReactNode;
  leftBottomContent?: React.ReactNode;
  rightContent?: React.ReactNode;
};

const Template: React.FC<TemplateProps> = ({
  title,
  searchForm,
  leftTopContent,
  leftBottomContent,
  rightContent,
  ...props
}) => {
  return (
    <Wrapper {...props}>
      <TitleWrapper>{title}</TitleWrapper>
      <SearchWrapper>{searchForm}</SearchWrapper>
      <ContentWrapper>
        <LeftContent>
          <LeftTopContent>{leftTopContent}</LeftTopContent>
          <LeftBottomContent>{leftBottomContent}</LeftBottomContent>
        </LeftContent>
        <RightContent>{rightContent}</RightContent>
      </ContentWrapper>
    </Wrapper>
  );
};

Template.propTypes = {
  // ConditionForm: PropTypes.node.isRequired,
  // menuList: PropTypes.node.isRequired,
  // detailRow1: PropTypes.any.isRequired,
};

export default Template;
