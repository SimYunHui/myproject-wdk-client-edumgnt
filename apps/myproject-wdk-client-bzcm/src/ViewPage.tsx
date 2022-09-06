import React from "react";

type ViewPageProps = {
  path?: string;
};

function ViewPage(props: ViewPageProps) {
  console.log(`App2 : viewpage props => : `, props);
  const Component = React.lazy(() => import(`./pages/${props.path}`));
  const Nonpage = React.lazy(() => import("./pages/Widget"));

  return <>{props.path ? <Component /> : <Nonpage></Nonpage>} </>;
}
export default ViewPage;
