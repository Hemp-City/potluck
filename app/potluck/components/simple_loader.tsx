import { ThreeDots } from "react-loader-spinner";

function SimpleLoader(props:{visible?:boolean}) {
    return ( 
        <ThreeDots 
            height="20" 
            width="30" 
            radius="9"
            color="#6EB075" 
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={props.visible}
        />
     );
}

SimpleLoader.defaultProps ={
    visible:true
}
export default SimpleLoader;