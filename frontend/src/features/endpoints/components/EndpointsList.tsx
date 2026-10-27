'use client'

import { useEndpoints } from "../hooks/use-endpoints.hook";

const EndpointsList = () => {
  const { data: endpoints } = useEndpoints();

  const showEndpoints = () => {
    console.log(endpoints);
  };

  return <div onClick={showEndpoints}>EndpointsList</div>;
};

export default EndpointsList;
