import { IResData, Title, useSyncHttpCient } from '@vntgcorp/vntg-wdk-client';
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { ResponsivePie } from '@nivo/pie';
import styled from 'styled-components';
import ApiCall from './action/api';
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
    padding-left: 30px;
  `;
  const RightContent = styled.section`
    float: right;
    width: 50%;
    height: 50%;
  `;

const EDU020E01 = () => {
  const dataTmp = [
    { id: 'ERP운영팀', value: 324, row_stat: 'unchanged'},
    { id: '정보보호팀', value: 88, row_stat: 'unchanged'},
    { id: '사업1팀', value: 221, row_stat: 'unchanged'},
    { id: '사업2팀', value: 123, row_stat: 'unchanged'},
]; 
    console.log("======EDU020E01 전체인원현황 Start ======");

    const [, fetchRequest] = useSyncHttpCient<IResData>();
    const apiCall = new ApiCall(fetchRequest);

    const [totalCnt, setTotalCnt] = useState([]);
    const [byJobCnt, setbyJobCnt] = useState([]);
    const [byRespCnt, setbyRespCnt] = useState([]);
    
    React.useEffect(()=>{
      const searchValue = 'Y'

      // 전체인원현황
      apiCall.retrieve(searchValue).then(response=>{
          setTotalCnt(response.data);
      });

      // 직무별
      apiCall.retrieve2(searchValue).then(response=>{
        setbyJobCnt(response.data);
      });

      // 직급별
      apiCall.retrieve3(searchValue).then(response=>{
        setbyRespCnt(response.data);
      });
    },[])

    return <>
      <Title useCleanup={false} useRetrive={false} useSave={false}></Title>
      <TopContent>
        <TotalCount data={totalCnt}></TotalCount>
      </TopContent>
      <LeftContent>
        <ByJobCount data={byJobCnt}></ByJobCount>
      </LeftContent>
      <RightContent>
        <ByRespCount data={byRespCnt}></ByRespCount>
      </RightContent>
    </>
};

export default EDU020E01;