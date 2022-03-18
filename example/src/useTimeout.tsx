import React from 'react';


const useTimeout = (text: string , time: number) => {

    const [ timer , setTimer ] = React.useState<NodeJS.Timeout>();
    const [ renderText , setRenderText ] = React.useState("");
    React.useEffect(() => {
        if(text){
            start(text , 0 , time , renderText)
        }
    }, [text])

    const start = (text: string, num: number , time:number, renderText: string) => {
        
        
        let timer = setTimeout(() => {
            renderText += text[num];
            setRenderText(renderText);
            start(text , num+ 1 , time , renderText)
        }, time)
        if(num === text.length - 1){
           clearTimeout(timer)
        }

        setTimer(timer);
    }


    const stop = () => {
        if(timer){
            clearTimeout(timer);
        }
    }

    const Text = () => {

        return <div >123123123123</div>
    }


    return [renderText , stop , Text ]
}

export default useTimeout;