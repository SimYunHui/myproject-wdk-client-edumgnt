import { IResData, Title, useSyncHttpCient } from '@vntgcorp/vntg-wdk-client';
import React, { useRef, useState } from 'react'
import styled from 'styled-components';
import ApiCall from './action/api';
import DetailForm from './layout/DetailForm';
import MasterGrid from './layout/MasterGrid';
import SearchForm from './layout/SearchForm';

    /* 
    화면 스타일 선언 */
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

type Props = {}

const BZCM020E10 = (props: Props) => {

    const [, fetchRequest] = useSyncHttpCient<IResData>();
    const apiCall = new ApiCall(fetchRequest);
  // 저장 버튼 이벤트
  
    const SearchFormRef = useRef(null);
    const detailFormRef = useRef(null);
    const masterGridRef = useRef(null);

    /**state 선언 */
    const [mastergridData, setMastergridData] = useState([]);
    
    const onSave = () => {
        const saveData = masterGridRef.current.save();
        
        apiCall.saveData(saveData).then(()=>{
            onRetrive();
        })
        
        console.log("on Save button click");
    };

    const onRetrive = () => {
        console.log("onRetrive button click");
        console.log(SearchFormRef.current.submit());

        const searchValue = SearchFormRef.current.submit();
        apiCall.retrieve(searchValue).then(response=>{
            console.log(response);
            setMastergridData(response.data);
        });
    };

    const onCleanup= () => {
        masterGridRef.current.cleanup();
        SearchFormRef.current.cleanup();
        detailFormRef.current.cleanup();
        console.log("onCleanup button click");
    };

    const onMasterGridSelect = (value) => {
        console.log(value);
        detailFormRef.current.changeData(value);
    }

    const onDetailDataChange = (name, value)=> {
        masterGridRef.current.changeData(name, value);
    }

  return <>
            <Title onSave={onSave} onRetrive={onRetrive} onCleanup={onCleanup}></Title>
            <SearchForm ref={SearchFormRef}></SearchForm>
            <LeftContent>
                <MasterGrid originRows={mastergridData} onSelectData={onMasterGridSelect} ref={masterGridRef}></MasterGrid>
            </LeftContent>
            <RightContent>
                <DetailForm ref={detailFormRef} onChangeData={onDetailDataChange}></DetailForm>
            </RightContent>
         </>
}

export default BZCM020E10