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
          formName="BZCM020E10-업무일지"
          useTable="Y"
        >
          <DetailTitle
            title="업무일지 내역"
          >
            <DetailRow>
              <Field
                label="작성 일자"
                name={"report_write_date"}
                type={SFType.Datepicker}
                labelStyles={{ width: "100px" }}
                onChange={onFieldChange}
                styles={{ width: "100px" }}
              />
              <Field
                label="담당자"
                name={"emp_name"}
                labelStyles={{ width: "200px" }}
                onChange={onElementChange}
                type={SFType.Text}
              />
            </DetailRow>
            <DetailRow>
              <Field
                label="금일 실시 내용"
                name={"exec_ctnt"}
                labelStyles={{ width: "200px" }}
                styles={{ width: "300px", height: "80px" }}
                onChange={onElementChange}
                type={SFType.TextArea}
                colspan={3}
              />
            </DetailRow>
            <DetailRow>
              <Field
                label="명일 계획 내용"
                name={"plan_ctnt"}
                labelStyles={{ width: "200px" }}
                styles={{ width: "300px", height: "80px" }}
                onChange={onElementChange}
                colspan={3}
                type={SFType.TextArea}
              />
            </DetailRow>
            <DetailRow>
              <Field
                label="비고"
                name={"remark"}
                labelStyles={{ width: "200px" }}
                type={SFType.TextArea}
                styles={{ width: "300px" }}
                onChange={onElementChange}
                colspan={3}
              />
            </DetailRow>
          </DetailTitle>
        </Form>

      </React.Fragment>
      );
    }
  );
  
  export default DetailForm;