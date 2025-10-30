import { useEffect } from "react";

const Example = () => {
  useEffect(() => {
    console.log("Example component mounted");
  }, []);

  return <div>Example Component</div>;
};
export default Example;