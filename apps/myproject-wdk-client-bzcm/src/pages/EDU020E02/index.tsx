import { IResData, Title, useSyncHttpCient } from '@vntgcorp/vntg-wdk-client';
import React, { useRef, useState, useEffect } from 'react'
import { ResponsivePie } from '@nivo/pie';
import styled from 'styled-components';
import LeftContentGraph from './layout/LeftContentGraph';
import RightContentGrid from './layout/RightContentGrid';

    /* 
    화면 스타일 선언 */
    const LeftContent = styled.section`
    float: left;
    width: 40%;
    height: 100%;
  `;
    const RightContent = styled.section`
    float: right;
    width: 40%;
    height: 100%;
  `;

const EDU020E02 = () => {
    const [mastergridData, setMastergridData] = useState([]);
    const onMasterGridSelect = (value) => {
      console.log(value);
    }

    console.log("EDU020E02 start !!!!!!!");
  
    // const onRetrive = async () => {
    //   console.log("onRetrive button click");

    //   const searchValue = 'Y'

    //   apiCall.retrieve(searchValue).then(response=>{
    //       console.log(response);
    //       console.log("index==>"+JSON.stringify(response.data));
    //       setScore(response.data);
    //   });

    // };
    // const [, fetchRequest] = useSyncHttpCient<IResData>();
    // const apiCall = new ApiCall(fetchRequest);

    // const [score, setScore] = useState({});

    return <>
      <Title></Title>
      <LeftContent>
          <LeftContentGraph></LeftContentGraph>
      </LeftContent>
      <RightContent>
          <RightContentGrid originRows={mastergridData} onSelectData={onMasterGridSelect}></RightContentGrid>
      </RightContent>
    </>
};

export default EDU020E02;