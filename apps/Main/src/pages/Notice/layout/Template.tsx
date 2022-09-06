import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
`;
const TitleWrapper = styled.section``;
const ConditionForm = styled.section`
  margin: 0;
`;

const Content = styled.section`
  width: 100%;
  height: 100%;
`;

type TemplateProps = {
  title: React.ReactNode;
  conditionForm: React.ReactNode;
  content: React.ReactNode;
};

const Template: React.FC<TemplateProps> = ({ title, conditionForm, content, ...props }) => {
  return (
    <Wrapper {...props}>
      <TitleWrapper>{title}</TitleWrapper>
      <ConditionForm>{conditionForm}</ConditionForm>
      <Content>{content}</Content>
    </Wrapper>
  );
};

export default Template;
