import { IResData, Title, useSyncHttpCient } from '@vntgcorp/vntg-wdk-client';
import React, { useRef, useState, useEffect } from 'react'
import { ResponsivePie } from '@nivo/pie';
import styled from 'styled-components';
import ApiCall from './action/api';
import LeftContentGraph from './layout/LeftContentGraph';
import RightContentGraph from './layout/RightContentGraph';

    /* 
    화면 스타일 선언 */
    const LeftContent = styled.section`
    float: left;
    width: 47%;
    height: 100%;
    margin-top: 60px;
    margin-left: 60px;
  `;
    const RightContent = styled.section`
    float: right;
    width: 47%;
    height: 100%;
    margin-top: 60px;
  `;

const EDU020E02 = () => {
    console.log("EDU020E02 start !!!!!!!");

     const [, fetchRequest] = useSyncHttpCient<IResData>();
     const apiCall = new ApiCall(fetchRequest);
     const [byEmpEduRankTime, setbyEmpEduRankTime] = useState([]);
     const [byDeptEduRankTime, setbyDeptEduRankTime] = useState([]);
    

    React.useEffect(()=>{
      const searchValue = 'N'

      // 연도별 교육현황
      apiCall.retrieve(searchValue).then(response=>{
        setbyEmpEduRankTime(response.data);
      });

      apiCall.retrieve2(searchValue).then(response=>{
        setbyDeptEduRankTime(response.data);
      });
    },[])

    return <>
      {/* <Title useCleanup={false} useRetrive={false} useSave={true}></Title> */}
      <LeftContent>
          <LeftContentGraph data={byEmpEduRankTime}></LeftContentGraph>
      </LeftContent>
      <RightContent>
          <RightContentGraph data={byDeptEduRankTime}></RightContentGraph>
      </RightContent>
    </>
};

export default EDU020E02;