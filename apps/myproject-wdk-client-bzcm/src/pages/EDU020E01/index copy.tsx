import { IResData, Title, useSyncHttpCient } from '@vntgcorp/vntg-wdk-client';

// import React from 'react';
// import * as React, { useRef, useState } from 'react'

// import * as React from 'react';
// import { useRef, useState } from 'react';

import React, { useRef, useState, useEffect } from 'react'



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
  `;
  const RightContent = styled.section`
    float: right;
    width: 50%;
    height: 50%;
  `;

const EDU020E01 = () => {
    console.log("EDU020E01 start !!!!!!!");
    const onRetrive = () => {
      console.log("onRetrive button click");

      const searchValue = 'Y'
      apiCall.retrieve(searchValue).then(response=>{
          console.log(response);
          console.log("index==>"+JSON.stringify(response.data));
          setScore(response.data);
      });
    };
    const [, fetchRequest] = useSyncHttpCient<IResData>();
    const apiCall = new ApiCall(fetchRequest);

    const [score, setScore] = useState({});

    /**state 선언 */
    const testData = {};

    
    const handle = {
        padClick: (data: any) => {
            console.log(data);
        },

        legendClick: (data: any) => {
            console.log(data);
        },
    };

    useEffect(() => {
      onRetrive();
    }, []);
    
    return <>
      <Title onRetrive={onRetrive}></Title>
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