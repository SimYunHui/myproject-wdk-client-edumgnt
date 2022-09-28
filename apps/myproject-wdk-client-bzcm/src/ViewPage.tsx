import React from "react";

type ViewPageProps = {
  path?: string;
};

function ViewPage(props: ViewPageProps) {
  console.log(`App2 : viewpage props => : `, props);
  console.log(`App2 : viewpage props.path => : `, props.path);
  const Component = React.lazy(() => import(`./pages/${props.path}`));
  const Nonpage = React.lazy(() => import("./pages/Widget"));
  if(props.path != undefined){
    console.log("ViewPage not undefined");
    return <>{props.path ? <Component /> : <Nonpage></Nonpage>} </>;
  }else{
    return <>{<Nonpage></Nonpage>} </>;
  }
}
export default ViewPage;
