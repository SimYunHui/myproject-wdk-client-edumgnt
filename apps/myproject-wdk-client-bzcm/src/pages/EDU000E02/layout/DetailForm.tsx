import {
    DetailRow,
    DetailTitle,
    Field,
    Form,
    getDate,
    SFType,
    useForm,
  } from "@vntgcorp/vntg-wdk-client";
  import React from "react";
  import * as yup from "yup";
  
  type DetailFormProps = {
    onChangeData:(name :string, value: string)=>void;
  };

  type DetailFormForwardFunc ={
    cleanup:()=>void;
    submit:()=>any;
    changeData:(any)=>void;
  }   
  
  const DetailForm = React.forwardRef<DetailFormForwardFunc, DetailFormProps>(
    ({onChangeData}, ref) => {
      React.useImperativeHandle(ref, () => ({
        cleanup() { // 초기화 함수
            form.reset();
        },
        submit() {
        // 제출 함수 호출
        //   console.log(detailGridRef.current.getData());
        },
        changeData(value) {
            //const date = new Date(value.report_write_date);

            const date = new Date(value.report_write_date);
            value.report_write_date = getDate(date.toString());
            form.setValues(value);
        }
      }));
  
      const form = useForm({});
  /*
  * Rendering mount 시 초기화 
  */

      const onElementChange = (e) => {
        e.stopPropagation();
        onFieldChange(e.target.name, e.target.value);
      };

      const onFieldChange = (name, value) => {
        console.log(name,value);
        onChangeData(name,value);
    };
  
      return (<React.Fragment>
        <Form
          {...form}
          formType="detail"
          formName="EDU000E02-사원등록"
          useTable="Y"
        >
          <DetailTitle
            title="사원 정보"
          >
            <DetailRow>
              <Field
                label="ID"
                name={"user_id"}
                labelStyles={{ width: "200px" }}
                onChange={onElementChange}
                type={SFType.Text}
              />
              <Field
                label="사원번호"
                name={"emp_no"}
                labelStyles={{ width: "200px" }}
                onChange={onElementChange}
                type={SFType.Text}
              />
            </DetailRow>
            <DetailRow>
              <Field
                label="성명"
                name={"emp_name"}
                labelStyles={{ width: "200px" }}
                onChange={onElementChange}
                type={SFType.Text}
              />
              <Field
                label="전화번호"
                name={"phon_number"}
                labelStyles={{ width: "200px" }}
                onChange={onElementChange}
                type={SFType.Text}
              />
            </DetailRow>
              <DetailRow>
              <Field
                label="부서코드"
                name={"dept_code"}
                labelStyles={{ width: "200px" }}
                onChange={onElementChange}
                type={SFType.Text}
              />
              <Field
                label="부서명"
                name={"dept_name"}
                labelStyles={{ width: "200px" }}
                onChange={onElementChange}
                type={SFType.Text}
              />
            </DetailRow>
            <DetailRow>
              <Field
                label="직책"
                name={"responsi"}
                labelStyles={{ width: "200px" }}
                onChange={onElementChange}
                type={SFType.Text}
              />
            </DetailRow>
            <DetailRow>
              <Field
                label="직무"
                name={"job"}
                labelStyles={{ width: "200px" }}
                onChange={onElementChange}
                type={SFType.Text}
              />
            </DetailRow>
            <DetailRow>
              <Field
                label="이메일"
                name={"email"}
                labelStyles={{ width: "200px" }}
                onChange={onElementChange}
                type={SFType.Text}
              />
            </DetailRow>
            <DetailRow>
              <Field
                label="사용여부"
                name={"use_yn"}
                labelStyles={{ width: "200px" }}
                onChange={onElementChange}
                type={SFType.Text}
              />
            </DetailRow>
          </DetailTitle>
        </Form>

      </React.Fragment>
      );
    }
  );
  
  export default DetailForm;