import React from 'react'

export const QrImg = React.forwardRef((props,ref) => {
    // const {src} = props;
  return (
    <div ref={ref} className='flex print:flex-col print:w-1/2 print:px-2 print:py-40 print:flex print:justify-center print:items-center items-center justify-center border-4 border-cyan-900'>
      <img 
        src={props.src}
        width={100}
        height={100}
        className='flex print:w-40 print:pb-5 print:h-50 items-center justify-center rounded-2xl'
       />
       <p className='hidden print:flex'>{props.nom}</p>
    </div>
  )
});
