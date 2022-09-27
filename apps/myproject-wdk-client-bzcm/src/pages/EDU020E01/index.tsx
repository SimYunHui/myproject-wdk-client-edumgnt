import { IResData, Title, useSyncHttpCient } from '@vntgcorp/vntg-wdk-client';
import * as React from 'react';
import { ResponsivePie } from '@nivo/pie';
import styled from 'styled-components';
import TotalCount from './layout/TotalCount';
import ByJobCount from './layout/ByJobCount';
import ByRespCount from './layout/ByRespCount';

    /* 
    화면 스타일 선언 */
    const TopContent = styled.section`
    float: center;
    width: 100%;
    height: 50%;
  `;
    const LeftContent = styled.section`
    float: left;
    width: 50%;
    height: 50%;
  `;
  const RightContent = styled.section`
    float: right;
    width: 50%;
    height: 50%;
  `;

const EDU020E01 = () => {
    const handle = {
        padClick: (data: any) => {
            console.log(data);
        },

        legendClick: (data: any) => {
            console.log(data);
        },
    };
    return <>
      <Title></Title>
      <TopContent>
        <TotalCount></TotalCount>
      </TopContent>
      <LeftContent>
        <ByJobCount></ByJobCount>
      </LeftContent>
      <RightContent>
        <ByRespCount></ByRespCount>
      </RightContent>
    </>
};

export default EDU020E01;